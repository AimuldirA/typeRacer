import { AuthenticatedRequest } from "../middleware/checkAuth";
import { Response } from "express";
import jwt from 'jsonwebtoken';


export const getUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const token = req.cookies.token;

    if(!token){
         res.status(401).json({ message: "Not authenticated" });
         return;
    }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        res.json({ username: decoded.username,  id:decoded.id });
        return;
      } catch (err) {
        res.status(403).json({ message: "Invalid token" });
      }
    }