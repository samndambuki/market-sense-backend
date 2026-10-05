import { Router } from "express";
import { getMarketSummary } from "./ai.controller";

const router = Router();

router.get("/market-summary/:id", getMarketSummary);

export default router;
