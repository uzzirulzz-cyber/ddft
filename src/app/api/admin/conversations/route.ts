import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { db } from "@/lib/db";

// GET /api/admin/conversations — all customer support conversations
export async function GET(req: NextRequest) {
  try {
    const admin = await requireRole(req, "SUPER_ADMIN");
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const conversations = await db.conversation.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        customer: { select: { name: true, email: true, uid: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json({ conversations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
