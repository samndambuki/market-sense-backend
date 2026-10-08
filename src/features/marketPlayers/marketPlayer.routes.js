import { Router } from "express";
import {
  createMarketName,
  deleteMarketPlayer,
  getMarketPlayer,
  getMarketPlayers,
  updateMarketPlayer,
} from "./marketPlayer.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", getMarketPlayers);
router.post("/", authenticate, createMarketName);
router.get("/:id", getMarketPlayer);
router.put("/:id", authenticate, updateMarketPlayer);
router.delete("/:id", authenticate, deleteMarketPlayer);

export default router;
