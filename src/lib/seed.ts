// NexTradePro — Seed script
// Embeds default accounts directly (no env dependency).
// Run with: bun run src/lib/seed.ts

import { db } from "./db";
import bcrypt from "bcryptjs";

const SUPER_ADMIN = {
  name: "Super Admin",
  email: "admin@brockexchange.com",
  password: "Brock@Admin2026!",
  uid: "BX-SUPERADMIN",
  referralCode: "SUPERADMIN",
};

const SUB_AGENTS = [
  { name: "SubAgent 1", email: "subagent1BR@trade.com", password: "BRSub#1001", code: "BR-AG001" },
  { name: "SubAgent 2", email: "subagent2BR@trade2.com", password: "BRSub#1002", code: "BR-AG002" },
  { name: "SubAgent 3", email: "subagent3BR@trade3.com", password: "BRSub#1003", code: "BR-AG003" },
  { name: "SubAgent 4", email: "subagent4BR@trade4.com", password: "BRSub#1004", code: "BR-AG004" },
  { name: "SubAgent 5", email: "subagent5BR@trade5.com", password: "BRSub#1005", code: "BR-AG005" },
];

function generateUid(): string {
  return "BX-" + Math.random().toString(36).slice(2, 10).toUpperCase();
}

async function seed() {
  console.log("🌱 Seeding NexTradePro...\n");

  // Super Admin
  const existingSuper = await db.user.findUnique({ where: { email: SUPER_ADMIN.email } });
  if (!existingSuper) {
    const hash = await bcrypt.hash(SUPER_ADMIN.password, 10);
    await db.user.create({
      data: {
        uid: SUPER_ADMIN.uid,
        email: SUPER_ADMIN.email,
        passwordHash: hash,
        name: SUPER_ADMIN.name,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        kycStatus: "VERIFIED",
        referralCode: SUPER_ADMIN.referralCode,
        balance: 999999,
        vipLevel: 99,
        mustChangePassword: false,
      },
    });
    console.log(`✅ Super Admin: ${SUPER_ADMIN.email}`);
  } else {
    console.log(`ℹ️  Super Admin exists`);
  }

  // Sub-Agents
  for (const sa of SUB_AGENTS) {
    const existing = await db.user.findUnique({ where: { email: sa.email } });
    if (existing) {
      console.log(`ℹ️  ${sa.name} exists`);
      continue;
    }
    const hash = await bcrypt.hash(sa.password, 10);
    let uid = generateUid();
    while (await db.user.findUnique({ where: { uid } })) uid = generateUid();

    const agent = await db.user.create({
      data: {
        uid,
        email: sa.email,
        passwordHash: hash,
        name: sa.name,
        role: "SUB_AGENT",
        status: "ACTIVE",
        kycStatus: "VERIFIED",
        referralCode: sa.code,
        balance: 0,
        vipLevel: 10,
        mustChangePassword: false, // passwords are already strong (not "default")
      },
    });
    await db.agent.create({ data: { userId: agent.id } });
    console.log(`✅ ${sa.name}: ${sa.email} · Code: ${sa.code}`);
  }

  console.log("\n🎉 Seed complete!");
  console.log("═══════════════════════════════════════════");
  console.log("  Super Admin: admin@brockexchange.com / Brock@Admin2026!");
  console.log("  Sub-Agents:");
  SUB_AGENTS.forEach((sa) => {
    console.log(`    ${sa.email.padEnd(28)} / ${sa.password} · Code: ${sa.code}`);
  });
  console.log("═══════════════════════════════════════════");
}

seed().catch(e => { console.error("❌", e); process.exit(1); }).finally(() => db.$disconnect());
