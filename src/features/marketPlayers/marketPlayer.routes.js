import { Router } from "express";
import {
  createMarketName,
  deleteMarketPlayer,
  getMarketPlayer,
  getMarketPlayers,
  updateMarketPlayer,
} from "./marketPlayer.controller.js";

const router = Router();

router.get("/", getMarketPlayers);
router.post("/", createMarketName);
router.get("/:id", getMarketPlayer);
router.put("/:id", updateMarketPlayer);
router.delete("/:id", deleteMarketPlayer);

export default router;
