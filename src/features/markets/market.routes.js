import { Router } from "express";
import {
  getMarketById,
  getMarkets,
  createMarket,
  updateMarket,
  deleteMarket,
} from "./market.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", getMarkets);
router.get("/:id", getMarketById);
router.post("/", authenticate, createMarket);
router.put("/:id", authenticate, updateMarket);
router.delete("/:id", authenticate, deleteMarket);

export default router;
