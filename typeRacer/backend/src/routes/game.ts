import { Router } from 'express';
import { choseGame } from '../controllers/choseGame.controller';
import authenticateUser from '../middleware/checkAuth';
import { startSoloGame } from '../controllers/startSoloGame';

const router = Router();

router.post("/getTekst", startSoloGame);

export default router;




