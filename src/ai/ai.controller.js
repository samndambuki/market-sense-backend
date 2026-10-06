import prisma from "../config/prisma.js";
import {
  generateCompetitorAnalysis,
  generateMarketSummary,
} from "./ai.service.js";

export const getMarketSummary = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid market id",
      });
    }
    const market = await prisma.market.findUnique({
      where: { id },
      include: {
        players: true,
      },
    });

    if (!market) {
      return res.status(404).json({
        message: "Market not found",
      });
    }

    const analysis = await generateMarketSummary(market);
    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(
      "AI market summary error",
      error?.response?.data || error.message,
    );
    return res.status(500).json({
      message: "Failed to generate market summary",
    });
  }
};

export const getCompetitorAnalysis = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid market id",
      });
    }

    const market = await prisma.market.findUnique({
      where: { id },
      include: {
        players: true,
      },
    });

    if (!market) {
      return res.status(404).json({
        message: "Market Not found",
      });
    }

    const analysis = await generateCompetitorAnalysis(market);

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(
      "AI Competitor Analysis Error",
      error?.response?.data || error.message,
    );

    return res.status(500).json({
      message: "Failed to generate competitor analysis",
    });
  }
};
