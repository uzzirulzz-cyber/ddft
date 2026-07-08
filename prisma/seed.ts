// Seed script for BlockExchange.buzz
// Run with: bun run db:seed
//
// Credentials are read from environment variables. Copy .env.example to .env
// and fill in real values before seeding. Never commit real credentials.

import { db } from "../src/lib/db";
import { hashPassword, generateUid } from "../src/lib/auth";

async function seed() {
  console.log("🌱 Seeding BlockExchange.buzz database...\n");

  // ─── Super Admin (from env) ────────────────────────────────
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@blockexchange.buzz";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "ChangeMeInProduction!";
  const existingSuper = await db.user.findUnique({ where: { email: superAdminEmail } });

  if (!existingSuper) {
    const passwordHash = await hashPassword(superAdminPassword);
    const admin = await db.user.create({
      data: {
        uid: "BX-SUPERADMIN",
        email: superAdminEmail,
        passwordHash,
        name: "Super Admin",
        mobile: "+10000000000",
        country: "Global",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        kycStatus: "VERIFIED",
        referralCode: "SUPERADMIN",
        mustChangePassword: false,
      },
    });

    await db.wallet.create({
      data: {
        userId: admin.id,
        available: 1000000,
      },
    });

    console.log("✅ Super Admin created (from environment variables)");
  } else {
    console.log("ℹ️  Super Admin already exists");
  }

  // ─── Sub-Agent Accounts (from env) ────────────────────────
  // Format: AGENT_1_EMAIL, AGENT_1_PASSWORD, AGENT_1_CODE, etc.
  const defaultAgentPassword = process.env.AGENT_DEFAULT_PASSWORD || "default";

  for (let i = 1; i <= 5; i++) {
    const email = process.env[`AGENT_${i}_EMAIL`] || `subagent${i}@trade.com`;
    const code = process.env[`AGENT_${i}_CODE`] || `PB-AG00${i}`;
    const name = `SubAgent ${i}`;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`ℹ️  ${name} already exists`);
      continue;
    }

    // Ensure invitation code is unique
    const codeOwner = await db.user.findUnique({ where: { referralCode: code } });
    if (codeOwner) {
      console.log(`⚠️  Code ${code} already in use — skipping ${name}`);
      continue;
    }

    let uid = generateUid();
    while (await db.user.findUnique({ where: { uid } })) uid = generateUid();

    const agent = await db.user.create({
      data: {
        uid,
        email,
        passwordHash: await hashPassword(defaultAgentPassword),
        name,
        role: "AGENT",
        status: "ACTIVE",
        kycStatus: "VERIFIED",
        referralCode: code,
        mustChangePassword: true,
      },
    });

    await db.agent.create({
      data: { userId: agent.id, commissionRate: 10 },
    });
    await db.wallet.create({
      data: { userId: agent.id, available: 0 },
    });

    console.log(`✅ ${name} created · Code: ${code}`);
  }

  // ─── System notifications ──────────────────────────────────
  const existingNotifs = await db.systemNotification.count();
  if (existingNotifs === 0) {
    await db.systemNotification.createMany({
      data: [
        {
          title: "Welcome to BlockExchange.buzz",
          message: "Trade Smarter. Grow Faster. Your premium crypto trading platform is now live.",
          type: "info",
          audience: "all",
        },
        {
          title: "Trading Hours: 24/7",
          message: "BlockExchange.buzz operates 24 hours a day, 7 days a week. Trade anytime, anywhere.",
          type: "info",
          audience: "users",
        },
        {
          title: "Security Reminder",
          message: "Enable Two-Factor Authentication to secure your account and protect your funds.",
          type: "security",
          audience: "all",
        },
      ],
    });
    console.log("✅ System notifications created");
  }

  console.log("\n🎉 Seed complete! Configure credentials in your .env file.\n");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
