import { Router } from "express";
import { getCompetitorAnalysis, getMarketSummary } from "./ai.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/market-summary/:id", authenticate, getMarketSummary);
router.get("/competitorAnalysis/:id", authenticate, getCompetitorAnalysis);

export default router;
