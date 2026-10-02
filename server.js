import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./src/config/prisma";
import marketRoutes from "./src/features/markets/market.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/markets", marketRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Market Sense api is running",
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      message: "PostgreSQL connection is working",
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Market Sense API is running on http://localhost:${PORT}`);
});
