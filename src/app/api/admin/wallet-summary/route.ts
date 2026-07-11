import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { db } from "@/lib/db";

// GET /api/admin/wallet-summary — platform-wide wallet stats
export async function GET(req: NextRequest) {
  try {
    const admin = await requireRole(req, "SUPER_ADMIN");
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [totalBalance, totalFrozen, totalUsers, activeUsers] = await Promise.all([
      db.user.aggregate({ where: { role: "CUSTOMER" }, _sum: { balance: true } }),
      db.user.aggregate({ where: { role: "CUSTOMER", status: "FROZEN" }, _sum: { balance: true } }),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.user.count({ where: { role: "CUSTOMER", status: "ACTIVE" } }),
    ]);

    const deposits = await db.transaction.aggregate({
      where: { type: "DEPOSIT", status: "APPROVED" },
      _sum: { amount: true },
    });
    const withdrawals = await db.transaction.aggregate({
      where: { type: "WITHDRAWAL", status: "APPROVED" },
      _sum: { amount: true },
    });
    const pendingDeposits = await db.transaction.count({
      where: { type: "DEPOSIT", status: "PENDING" },
    });
    const pendingWithdrawals = await db.transaction.count({
      where: { type: "WITHDRAWAL", status: "PENDING" },
    });

    // Top 5 users by balance
    const topUsers = await db.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { balance: "desc" },
      take: 5,
      select: { id: true, uid: true, name: true, email: true, balance: true, vipLevel: true, status: true },
    });

    return NextResponse.json({
      summary: {
        totalBalance: totalBalance._sum.balance || 0,
        frozenBalance: totalFrozen._sum.balance || 0,
        totalUsers,
        activeUsers,
        totalDeposits: deposits._sum.amount || 0,
        totalWithdrawals: withdrawals._sum.amount || 0,
        pendingDeposits,
        pendingWithdrawals,
      },
      topUsers,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
