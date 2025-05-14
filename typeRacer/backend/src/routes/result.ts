import { Router } from 'express';
import { gameResult } from '../controllers/saveGameResult.controller';

const router = Router();

router.post("/", gameResult);

export default router;




