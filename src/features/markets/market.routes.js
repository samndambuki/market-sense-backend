import { Router } from "express";
import {
  getMarketById,
  getMarkets,
  createMarket,
  updateMarket,
  deleteMarket,
} from "./market.controller.js";

const router = Router();

router.get("/", getMarkets);
router.get("/:id", getMarketById);
router.post("/", createMarket);
router.put("/:id", updateMarket);
router.delete("/:id", deleteMarket);

export default router;
