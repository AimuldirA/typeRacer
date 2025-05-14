import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db'; // connectDB-г импортолж байна
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import cors from 'cors'
import http from 'http';
import socketIoSetup from './sockets';
import result from './routes/result';
import gameHistory from './routes/gameHistory';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: 'https://type-racer-uggc.vercel.app/',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
  res.send('Сервер ажиллаж байна!');
});

// Auth route холбож байна
app.use('/auth', authRoutes);
app.use('/game', gameRoutes);
app.use('/result', result);
app.use('/gameHistory', gameHistory);

// MongoDB холболт
connectDB().then(() => {

  server.listen(PORT, () => {
    console.log(`Сервер ажиллаж байна: http://localhost:${PORT}`);
    socketIoSetup(server);
  });
});



