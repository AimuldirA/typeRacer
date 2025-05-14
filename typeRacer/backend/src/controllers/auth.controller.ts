import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import  { User } from '../models/User';
import { createJWT } from '../utils/jwt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const router = express.Router();
dotenv.config();


export const signUp = async (req: Request, res: Response): Promise<void>=>{
    const {username, password}=req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
     try{
        const user = new User({username, password:hashedPassword});
        await user.save();

        const token = createJWT(user._id.toString(), user.username);

        res.cookie("token", token,{
            httpOnly:true,
            sameSite: "strict",
            secure: true,
            maxAge: 1000*60*60*24
        });
        res.status(201).json({message: "Бүртгэл амжилттай"});
     }catch(e:any){
        console.log('error: ',e)
        if(e.code===11000){
             res.status(400).json({errors:["Хэрэглэгчийн нэр давхцаж байна"]})
             return;
        }
         res.status(500).json({errors:["Дотоод алдаа"]})
         return;
     }
}

export const login = async (req: Request, res: Response): Promise<void> =>{
    const { username, password } = req.body;
  
    try {
      // Хэрэглэгчийг хайж олох
      const user = await User.findOne({ username });
  
      // Хэрэглэгч олдсонгүй
      if (!user) {
         res.status(400).json({ errors: ["Хэрэглэгч олдсонгүй"] });
         return;
      }
  
      // Нууц үгийг шалгах
      if(user){
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
         res.status(400).json({ errors: ["Нууц үг буруу"] });
         return;
      }
  
      // JWT token үүсгэх
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET as string, // орчны хувьсагчийг ашиглаж байгаа
        { expiresIn: '1h' } // 1 цагийн дараа хүлээн зөвшөөрөгдөхгүй
      );

      //  Token-г cookie хэлбэрээр илгээх
      res.cookie("token", token,{
        httpOnly:true,
        sameSite: "strict",
        secure: true,
        maxAge: 1000*60*60*24
    });
  
      // Хариу буцаах
      res.status(200).json({
        message: 'Амжилттай нэвтэрлээ',
        token, // token-ыг буцаах
      });}
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Системийн алдаа гарлаа' });
      return;
    }
}

export const logout = async (req:Request, res:Response): Promise<void> =>{
  res.clearCookie("token",{
    httpOnly:true,
    sameSite:"lax",
    secure:false
  });

   res.status(200).json({ message: "Амжилттай гарлаа" });
}


