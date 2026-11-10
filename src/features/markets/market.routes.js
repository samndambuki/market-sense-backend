import { Router } from "express";
import {
  getMarketById,
  getMarkets,
  createMarket,
  updateMarket,
  deleteMarket,
} from "./market.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);

//VIEWER, ANALYST, ADMIN
router.get("/", getMarkets);
router.get("/:id", getMarketById);

//ANALYST,ADMIN
router.post("/", authorize("ADMIN", "ANALYST"), createMarket);
router.put("/:id", authorize("ADMIN", "ANALYST"), updateMarket);

//ADMIN
router.delete("/:id", authorize("ADMIN"), deleteMarket);

export default router;
