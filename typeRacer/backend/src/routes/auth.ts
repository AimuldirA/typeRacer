import { Router } from 'express';
import { signUp, login, logout } from '../controllers/auth.controller';
import checkAuth from '../middleware/checkAuth';
import { getUser } from '../controllers/getUser.controllr';

const router = Router();

router.post('/signUp', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/check-auth', checkAuth);
router.get('/getUser', getUser);

router.get('/auth-status', checkAuth, (req, res) => {
    console.log(req.user); 
    res.json({ loggedIn: !!req.user});
  });


export default router;
