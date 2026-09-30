import prisma from "./src/config/prisma.js";
prisma.$connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL through Prisma");
  })
  .catch((error) => {
    console.error("❌ Prisma connection failed:", error);
  });