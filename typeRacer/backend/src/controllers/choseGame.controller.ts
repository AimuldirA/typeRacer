import { TypeRacer } from "../models/typeRacer";
import {  Response } from 'express';
import  { AuthenticatedRequest } from "../middleware/checkAuth";

export const choseGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   try {
//     const { game_type, level_option, language } = req.body;
    
//     const userId = req.user?.id || 'guest'; // Хэрэглэгч байвал user.id, үгүй бол 'guest'
//     console.log("Hereglegch", userId);

//     const newPref = new TypeRacer({
//       user_id: userId,
//       game_type,
//       level_option,
//       language
//     });

//     await newPref.save();

//     res.status(200).json({ message: "Тоглоомын тохиргоо хадгалагдлаа." });
//   } catch (error) {
//     console.error("Game preferences save error: ", error);
//     res.status(500).json({ message: "Алдаа гарлаа..........." });
//   }
};


