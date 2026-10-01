import {Router} from "express";
import {getMarketById, getMarkets,createMarket} from "./market.controller.js";

const router = Router();

router.get("/",getMarkets);
router.get("/:id",getMarketById);
router.post("/",createMarket);

export default router;