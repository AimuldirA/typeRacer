import jwt from 'jsonwebtoken';

export const createJWT = (userId: string, username: string): string => {
    const secret = process.env.JWT_SECRET;  // .env файлд байгаа нууц түлхүүр
    if (!secret) {
        throw new Error("JWT_SECRET орж ирэхгүй байна!");
    }

    const token = jwt.sign(
        { userId, username },
        secret,  // JWT_SECRET ашиглаж байна
        { expiresIn: '1d' } // Токены хүчинтэй хугацаа (1 өдөр)
    );
    return token;
};
