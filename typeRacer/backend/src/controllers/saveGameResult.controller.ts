import { Request, Response } from 'express';
import { score } from '../models/score';

interface GameResultBody {
  userId: string;
  speed: number;
  accuracy: number;
  place: string;
  language: string;
}

export const gameResult = async (
  req: Request<{}, {}, GameResultBody>, 
  res: Response
): Promise<void> => {
  try {
    const { userId, speed, accuracy, place, language } = req.body;

    const newResult = new score({
      user_id: userId,
      speed: speed,
      accuracy: accuracy,
      place: place,
      language:language,
      date: Date.now(), 
    });

    await newResult.save();
    res.status(200).json({ message: 'Result saved' });
    console.log("Game result saved");
    return;
  } catch (error) {
    console.error('Result save error', error);
    res.status(500).json({ message: 'Result not saved, error' });
    return;
  }
};
