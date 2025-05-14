import { AuthenticatedRequest } from "../middleware/checkAuth";
import { TextFile } from "../models/text";
import { Response } from "express";
import { User } from "../models/User";

export const startSoloGame = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    console.log("Received cookies:", req.cookies); 
    const { level, languageOption } = req.body;

    try {
        const userId = req.user?.id || 'guest'; 
        let username: string;

        if (userId !== 'guest') {
            const user = await User.findById(userId);
            username = user?.username || "Guest";
        } else {
            username = "Guest";
        }

        console.log("Энэ тоглоомын тохиргоо:", level, languageOption);

       // const sentenceDoc = await TextFile.findOne({ level, language: languageOption });
       const result = await TextFile.aggregate([
        {
            $match: {
            level: level,                
            language: languageOption     
            }
        },
        {
            $sample: { size: 1 }            // random 1 document
        }
        ]);
        const sentenceDoc = result[0]; 

        if (!sentenceDoc) {
            res.status(404).json({ message: "Тохирох текст олдсонгүй." });
            return;
        }

        res.status(200).json({
            sentence: sentenceDoc.text,
            time: sentenceDoc.time,
            userName: username,
            start_time: Date.now()
        });

    } catch (err) {
        console.error("Solo game start error:", err);
        res.status(500).json({ message: "Тоглоом эхлүүлэх үед алдаа гарлаа" });
        return;
    }
};
