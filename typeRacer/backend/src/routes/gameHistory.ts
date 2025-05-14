import { Router } from "express";
import { getGameHistory } from "../controllers/gameHistory.controller";
import { hallOfFame, latestHighScore } from "../controllers/latestHightScore.controller";

const router=Router();

router.get('/', getGameHistory);
router.get('/latestHightScore', latestHighScore);
router.get('/hallOfFame', hallOfFame)

export default router;

