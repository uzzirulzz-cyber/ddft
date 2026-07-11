import { NextRequest, NextResponse } from "next/server";
import { requireRole, logAction, generateTxId, getClientIp } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { getCoin } from "@/lib/market-data";

// POST /api/admin/trades/set-winlose
// Super Admin can force-settle a trade as WIN or LOSE.
// Body: { tradeId: string, result: "WIN" | "LOSE" }
export async function POST(req: NextRequest) {
  try {
    const admin = await requireRole(req, "SUPER_ADMIN");
    if (!admin) return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });

    const { tradeId, result } = await req.json();
    if (!tradeId) return NextResponse.json({ error: "tradeId required" }, { status: 400 });
    if (result !== "WIN" && result !== "LOSE") {
      return NextResponse.json({ error: "result must be 'WIN' or 'LOSE'" }, { status: 400 });
    }

    const trade = await db.trade.findUnique({ where: { tradeId } });
    if (!trade) return NextResponse.json({ error: "Trade not found" }, { status: 404 });

    // If trade is already settled, we can still override it
    // But we need to reverse the previous settlement first
    if (trade.status === "SETTLED") {
      // Reverse previous settlement
      if (trade.result === "WIN") {
        // Previously won: deduct the amount + profit that was credited
        await db.user.update({
          where: { id: trade.userId },
          data: { balance: { decrement: trade.amount + trade.profit } },
        });
      }
      // If previously lost, the amount was already deducted, nothing to reverse
    }

    const coin = getCoin(trade.symbol);
    const entryPrice = trade.entryPrice;
    // Set exit price to reflect the forced result
    const exitPrice = result === "WIN"
      ? entryPrice * (trade.direction === "UP" ? 1.005 : 0.995)   // price moved in user's favor
      : entryPrice * (trade.direction === "UP" ? 0.995 : 1.005);  // price moved against user

    const profit = result === "WIN" ? trade.amount * trade.payoutRate : -trade.amount;

    // Settle the trade with forced result
    await db.$transaction([
      db.trade.update({
        where: { id: trade.id },
        data: {
          status: "SETTLED",
          result,
          exitPrice,
          profit,
          settledAt: new Date(),
        },
      }),
      // If WIN: credit amount + profit back to user
      ...(result === "WIN" ? [
        db.user.update({
          where: { id: trade.userId },
          data: { balance: { increment: trade.amount + profit } },
        }),
      ] : []),
      // Create transaction record (always create new — reference is not unique)
      db.transaction.create({
        data: {
          txId: generateTxId("TXN"),
          userId: trade.userId,
          type: result === "WIN" ? "TRADE_PROFIT" : "TRADE_LOSE",
          amount: result === "WIN" ? trade.amount + profit : trade.amount,
          status: "APPROVED",
          reference: trade.tradeId,
        },
      }),
    ]);

    // Notify the user
    await db.notification.create({
      data: {
        userId: trade.userId,
        title: result === "WIN" ? "Trade Won! 🎉" : "Trade Settled",
        body: result === "WIN"
          ? `Your ${trade.symbol} ${trade.direction} trade has been settled as WIN. Profit: $${profit.toFixed(2)}`
          : `Your ${trade.symbol} ${trade.direction} trade has been settled as LOSE. Loss: $${trade.amount.toFixed(2)}`,
        type: result === "WIN" ? "success" : "info",
      },
    });

    // Audit log
    await logAction(admin.id, `SET_TRADE_${result}`, req, { type: "trade", id: trade.id }, JSON.stringify({ tradeId, result }));

    const updatedTrade = await db.trade.findUnique({ where: { id: trade.id } });
    const updatedUser = await db.user.findUnique({ where: { id: trade.userId } });

    return NextResponse.json({
      success: true,
      message: `Trade ${tradeId} settled as ${result}`,
      trade: updatedTrade,
      userBalance: updatedUser?.balance,
    });
  } catch (e: any) {
    console.error("Set win/lose error:", e);
    return NextResponse.json({ error: e.message || "Failed to set trade result" }, { status: 500 });
  }
}
