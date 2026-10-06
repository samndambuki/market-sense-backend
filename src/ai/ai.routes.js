import { Router } from "express";
import { getCompetitorAnalysis, getMarketSummary } from "./ai.controller";

const router = Router();

router.get("/market-summary/:id", getMarketSummary);
router.get("/competitorAnalysis/:id", getCompetitorAnalysis);

export default router;
