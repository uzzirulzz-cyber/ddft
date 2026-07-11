import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/api-auth";

export const runtime = "nodejs";

const SUPER_ADMIN = {
  email: "admin@brockexchange.com",
  password: "Brock@Admin2026!",
  name: "Super Admin",
  uid: "BX-SUPERADMIN",
};

const SUB_AGENTS = [
  { email: "subagent1BR@trade.com", password: "BRSub#1001", code: "BR-AG001", name: "SubAgent 1" },
  { email: "subagent2BR@trade2.com", password: "BRSub#1002", code: "BR-AG002", name: "SubAgent 2" },
  { email: "subagent3BR@trade3.com", password: "BRSub#1003", code: "BR-AG003", name: "SubAgent 3" },
  { email: "subagent4BR@trade4.com", password: "BRSub#1004", code: "BR-AG004", name: "SubAgent 4" },
  { email: "subagent5BR@trade5.com", password: "BRSub#1005", code: "BR-AG005", name: "SubAgent 5" },
];

export async function POST() {
  try {
    const created: string[] = [];

    const adminExists = await db.user.findUnique({ where: { email: SUPER_ADMIN.email } });
    if (!adminExists) {
      const hash = await hashPassword(SUPER_ADMIN.password);
      await db.user.create({
        data: {
          uid: SUPER_ADMIN.uid,
          email: SUPER_ADMIN.email,
          passwordHash: hash,
          name: SUPER_ADMIN.name,
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          kycStatus: "VERIFIED",
          balance: 999999,
          vipLevel: 99,
          referralCode: "SUPERADMIN",
          mustChangePassword: false,
        },
      });
      created.push(`super_admin:${SUPER_ADMIN.email}`);
    }

    for (const sa of SUB_AGENTS) {
      const exists = await db.user.findUnique({ where: { email: sa.email } });
      if (!exists) {
        const hash = await hashPassword(sa.password);
        const user = await db.user.create({
          data: {
            uid: `BX-SA-${sa.code.slice(-3)}`,
            email: sa.email,
            passwordHash: hash,
            name: sa.name,
            role: "SUB_AGENT",
            status: "ACTIVE",
            kycStatus: "VERIFIED",
            balance: 0,
            vipLevel: 10,
            referralCode: sa.code,
            mustChangePassword: false,
          },
        });
        await db.agent.create({
          data: { userId: user.id, commissionRate: 10, totalCommission: 0, totalReferrals: 0 },
        });
        created.push(`sub_agent:${sa.email}`);
      }
    }

    return NextResponse.json({ ok: true, created, message: "Seed complete" });
  } catch (e) {
    console.error("seed error", e);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
