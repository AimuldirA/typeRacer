import { Request, Response } from "express";
import {score} from "../models/score";

export const latestHighScore = async (req: Request, res: Response) => {
  try {
    const data = await score.aggregate([
      // 1. user_id-г ObjectId болгон хөрвүүлнэ
      {
        $addFields: {
          userObjectId: { $toObjectId: "$user_id" }
        }
      },
      // 2. score болон date-р эрэмбэлнэ
      {
        $sort: { speed: -1, date: -1 }
      },
      // 3. Хэрэглэгчийн хэл тус бүрийн хамгийн өндөр score-г авна
      {
        $group: {
          _id: {
            user_id: "$user_id",
            language: "$language"
          },
          bestScore: { $first: "$$ROOT" }
        }
      },
      // 4. root-ийг bestScore болгож солино
      {
        $replaceRoot: { newRoot: "$bestScore" }
      },
      // 5. хэрэглэгчийн мэдээллийг татна
      {
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      // 6. эцсийн сорт
      {
        $sort: { speed: -1, date: -1 }
      },
      // 7. зөвхөн шаардлагатай талбаруудыг буцаана
      {
        $project: {
          _id: 1,
          speed: 1,
          date: 1,
          accuracy: 1,
          language: 1,
          place: 1,
          username: "$userInfo.username"
        }
      },
      {
        $limit: 50
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error("latestHighScore error:", error);
    res.status(500).json({ error: "Something went wrong in Latest High Score" });
  }
};




export const hallOfFame = async (req: Request, res: Response) => {
  try {
    const data = await score.aggregate([
      {
        $group: {
          _id: {
            user_id: "$user_id",
            language: "$language"
          },
          avgSpeed: { $avg: { $toDouble: "$speed" } },
          totalGames: { $sum: 1 }
        }
      },
      {
        $addFields: {
          userObjectId: {
            $convert: {
              input: "$_id.user_id",
              to: "objectId",
              onError: null,
              onNull: null
            }
          },
          language: "$_id.language"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          avgSpeed:1,
          userInfo:1,
          language:"$_id.language",
          username: "$userInfo.username",
          speed:"$avgSpeed",
          totalGames: 1
        }
      },
      {
        $sort: { avgSpeed: -1 },
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error("Error in hallOfFame:", error);
    res.status(500).json({ error: "Something went wrong Hall of Fame" });
  }
};


