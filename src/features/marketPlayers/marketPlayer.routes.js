import { Router } from "express";
import {
  createMarketName,
  deleteMarketPlayer,
  getMarketPlayer,
  getMarketPlayers,
  updateMarketPlayer,
} from "./marketPlayer.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);

//ADMIN, ANALYST, VIEWER
router.get("/", getMarketPlayers);
router.get("/:id", getMarketPlayer);

//ADMIN,ANALYST
router.post("/", authorize("ADMIN", "ANALYST"), createMarketName);
router.put("/:id", authorize("ADMIN", "ANALYST"), updateMarketPlayer);

//ADMIN
router.delete("/:id", authorize("ADMIN"), deleteMarketPlayer);

export default router;
