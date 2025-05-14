import { Request, Response } from 'express';
import { score } from '../models/score';

export const getGameHistory = async(req: Request, res:Response):Promise<void>=>{
    try {
        const userId = req.query.userId as string;
    
        const game = await score.find({ user_id: userId }).sort({ date: -1 });
        
        if (!game.length) {
           res.status(404).json({ message: "Тоглоомын түүх олдсонгүй." });
           return;
        }
    
         res.status(200).json(game);
      } catch (error) {
         console.error("Алдаа:", error);
         res.status(500).json({ message: "Дотоод серверийн алдаа." });
         return;
      }
}