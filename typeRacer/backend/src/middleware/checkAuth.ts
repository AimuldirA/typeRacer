import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

// Хэрэглэгчийн decoded JWT structure
interface DecodedUser {
  id: string;
  username?: string;
}

// Request-д шинээр "user" талбар нэмэх
export interface AuthenticatedRequest extends Request {
  user?: DecodedUser | null;
}

// Middleware
const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'JWT verification failed', error: err });
  }
};

export default authenticateUser;
