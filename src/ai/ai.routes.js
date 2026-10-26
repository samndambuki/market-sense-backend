import { Router } from "express";
import { getCompetitorAnalysis, getMarketSummary } from "./ai.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/market-summary/:id", authenticate, getMarketSummary);
router.get("/competitor-analysis", authenticate, getCompetitorAnalysis);

export default router;
