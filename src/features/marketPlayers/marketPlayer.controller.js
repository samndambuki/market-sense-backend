import prisma from "../../config/prisma";

export const getMarketPlayers = async (req, res) => {
  try {
    const players = await prisma.marketPlayer.findMany();
    return res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching market players", error);
    return res.status(500).json({
      message: "Failed to fetch market players",
    });
  }
};

export const createMarketName = async (req, res) => {
  try {
    const { companyName, marketId } = req.body;

    const player = await prisma.marketPlayer.create({
      data: {
        companyName,
        marketId: Number(marketId),
      },
    });

    return res.status(201).json(player);
  } catch (error) {
    console.error("Error creating market player", error);
    return res.status(500).json({
      message: "Failed to create market player",
    });
  }
};

export const getMarketPlayer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const player = await prisma.marketPlayer.findUnique({
      where: { id },
    });
    if (!player) {
      return res.status(404).json({
        message: "Market Player not found",
      });
    }
    return res.status(200).json(player);
  } catch (error) {
    console.error("Error fetching market player", error);
    return res.status(500).json({
      message: "Failed to fetch market player",
    });
  }
};

export const updateMarketPlayer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { companyName, marketId } = req.body;
    const player = await prisma.marketPlayer.update({
      where: { id },
      data: {
        companyName,
        marketId: Number(marketId),
      },
    });
    return res.status(200).json(player);
  } catch (error) {
    console.error("Error updating market player", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Market Player Not Found",
      });
    }
    return res.status(500).json({
      message: "Failed to update market player",
    });
  }
};

export const deleteMarketPlayer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.marketPlayer.delete({
      where: { id },
    });
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting market player", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Market Player Not found",
      });
    }
    return res.status(500).json({
      message: "Failed to delee market player",
    });
  }
};
