import prisma from "../../config/prisma.js";
import { marketSchema } from "./market.validation.js";

export const getMarkets = async (req, res) => {
  try {
    const markets = await prisma.market.findMany();

    res.json(markets);
  } catch (error) {
    console.error("Error fetching markets:", error);

    res.status(500).json({
      message: "Failed to fetch markets",
    });
  }
};

export const getMarketById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid Market ID",
      });
    }

    const market = await prisma.market.findUnique({
      where: { id },
    });

    if (!market) {
      return res.status(404).json({
        message: "Market Not Found",
      });
    }

    res.json(market);
  } catch (error) {
    console.error("Error fetching market:", error);

    res.status(500).json({
      message: "Failed to fetch market",
    });
  }
};

export const createMarket = async (req, res) => {
  try {
    // const {
    //   name,
    //   category,
    //   region,
    //   growthRate,
    //   description,
    //   marketSize,
    //   riskLevel,
    // } = req.body;

    // const market = await prisma.market.create({
    //   data: {
    //     name,
    //     category,
    //     region,
    //     growthRate: Number(growthRate),
    //     description,
    //     marketSize,
    //     riskLevel,
    //   },
    // });

    // res.status(201).json(market);

    const result = marketSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const market = await prisma.market.create({
      data: result.data,
    });

    return res.status(201).json(market);
  } catch (error) {
    console.error("Error creating market:", error);

    res.status(500).json({
      message: "Failed to create market",
    });
  }
};

export const updateMarket = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid Market ID",
      });
    }

    const {
      name,
      category,
      region,
      growthRate,
      description,
      marketSize,
      riskLevel,
    } = req.body;

    const market = await prisma.market.update({
      where: { id },
      data: {
        name,
        category,
        region,
        growthRate: Number(growthRate),
        description,
        marketSize,
        riskLevel,
      },
    });

    res.status(200).json({
      message: "Market Updated Successfully",
      market,
    });
  } catch (error) {
    console.error("Error updating market", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Market Not Found",
      });
    }

    res.status(500).json({
      message: "Failed to update market",
    });
  }
};

export const deleteMarket = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Market ID is invalid",
      });
    }

    await prisma.market.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting market", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Market Not Found",
      });
    }
    res.status(500).json({
      message: "Error deleting market",
    });
  }
};
