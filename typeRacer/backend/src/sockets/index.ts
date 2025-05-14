import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { CreateRoom } from '../models/createRoom';
import { User } from '../models/User';
import { score } from '../models/score';
import mongoose, { ObjectId } from 'mongoose';

interface CreateRoomPayload {
  username: string;
  user_id: string;
}

interface CreateRoomResponse {
  roomCode: string;
}

const socketIoSetup = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: [
      "https://type-racer-uggc.vercel.app"
    ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Хэрэглэгч холбогдлоо: " + socket.id);

    // Өрөө үүсгэх
    socket.on("createRoom", async ({ username, user_id }: CreateRoomPayload, callback: (response: CreateRoomResponse) => void) => {
        const roomCode = generateRoomCode();
        const host = user_id || socket.id;

        try {
          const newRoom = new CreateRoom({
            room_code: roomCode,
            room_url: `http://localhost:5173/room/${roomCode}`,
            host: host,
            status: 'waiting',
            language: '',
            players: [{ userId: host, name: username }],
          });

          const savedRoom = await newRoom.save();
          console.log("Өрөө хадгалагдсан:", savedRoom);

          socket.join(roomCode);
          callback({ roomCode });
          socket.emit("hostInfo", { hostId: host });
          // Real-time мэдээлэл илгээх
          io.to(roomCode).emit("updatePlayers", savedRoom.players);
        } catch (error) {
          console.error("Өрөө хадгалах үед алдаа:", error);
        }
      }
    );

    socket.on("selectedLanguage", async({roomCode, language})=>{
      try{
        await CreateRoom.updateOne(
        {room_code:roomCode},
        {$set:{language:language}}
      )
      console.log("Hel", language);
      }catch (error) {
        console.error("selectedLanguage эвэнт дээр алдаа:", error);
      }
    })
    // Өрөөнд нэгдэх
    socket.on('joinRoom', async ({ username, user_id, roomCode }, callback) => {
      console.log("➡️ joinRoom event ирлээ:", { username, user_id, roomCode }); 
      try {
        const room = await CreateRoom.findOne({
           room_code: roomCode 
       });
        const host = user_id || socket.id;

        if (!room|| room.status=="finished") {
          return callback({ success: false, message: "Room not found" });
        }else if(room.status=="started"){
          return callback({ success: false, message: "Room started" });
        }

        if (!username || !host) {
          console.log("Хэрэглэгчийн мэдээлэл дутуу байна");
        }

        room.players.push({ userId: host, name: username });
        const updatedRoom = await room.save();

        socket.join(roomCode);
        console.log(`Хэрэглэгч ${username} (${host.id}) өрөөнд нэгдлээ: ${roomCode}`);

        // Бүх хэрэглэгчдэд шинэчилсэн жагсаалт илгээх
        io.to(roomCode).emit("updatePlayers", updatedRoom.players);

        callback({ success: true });
      } catch (error) {
        console.error("Өрөөнд нэгдэх үед алдаа гарлаа:", error);
        callback({ success: false, message: "Server error" });
      }
    });

    // Тоглогчдыг авах
    socket.on("getPlayers", async ({ roomCode }, callback) => {
      try {
        const room = await CreateRoom.findOne({ room_code: roomCode });
        if (!room) {
          return callback({ success: false, message: "!Room not found" });
        }

        const players = room.players.map((player) => ({
        userId: player.userId,
        name: player.name,
        isHost: player.userId === room.host,
      }));
        callback({ success: true, players: players });
      } catch (error) {
        console.error("Тоглогчдыг авах үед алдаа:", error);
        callback({ success: false, message: "Серверийн алдаа" });
      }
    });

    socket.on("leaveRoom", async ({ roomCode, userId }, callback) => {
      try {
        const room = await CreateRoom.findOne({ room_code: roomCode });
    
        if (room) {
          // if(userId == room.host){

          // }else{
          const updatedPlayers = room.players.filter((player) => player.userId !== userId);
          await room.updateOne({ players: updatedPlayers });
    
          socket.leave(roomCode);
          io.to(roomCode).emit("updatePlayers", updatedPlayers);
    
          console.log(`User ${userId} has left the room: ${roomCode}`);
          callback({ success: true }); // 🔥 Callback ийг энд нэмнэ
         // }
        } else {
          callback({ success: false }); // Room олдоогүй бол
        }
      } catch (error) {
        console.error("Error leaving room: ", error);
        callback({ success: false });
      }
    });

    socket.on("startRace", async ({ roomCode }) => {
      try {
        const room = await CreateRoom.findOne({ room_code: roomCode });
        if (!room) return;

        await CreateRoom.updateOne(
          {room_code:roomCode},
          {$set:{status:"started"}}
        )
    
        // Өрөөн доторх бүх тоглогчдод multiplayer руу чиглүүлэх эвэнт
        io.to(roomCode).emit("redirectToMultiplayer", { roomCode });
    
        console.log(`Race started in room: ${roomCode}`);
      } catch (error) {
        console.error("startRace эвэнт дээр алдаа:", error);
      }
    });

    socket.on("gameSettingsSelected", ({roomCode, sentence, initialTime, startTime})=>{
      console.log("Zaa endee irj baina", sentence);
      socket.to(roomCode).emit('newTextAvailable', { sentence, initialTime, startTime }) && socket.emit('newTextAvailable', { sentence, initialTime, startTime })
      console.log("Server: Sending newTextAvailable with data:", { sentence, initialTime, startTime, roomCode });
    })

    socket.on("gameEnd", async ({roomCode})=>{
      try{
        const room = await CreateRoom.findOne({room_code:roomCode});
        if(room){
          await CreateRoom.updateOne(
            {room_code:roomCode},
            {$set:{status:"finished"}}
          )
        } 
      }catch (error) {
        console.error("gameEnd эвэнт дээр алдаа:", error);
      }
    })  

    // Socket-с серверт
    socket.on("progressUpdate", ({ roomCode, userId, progress, isOwnMove }) => {
      console.log("🎯 Progress update received:", userId, progress);
      socket.to(roomCode).emit("playerProgress", { userId, progress })  && socket.emit("playerProgress", { userId, progress });

      console.log("📤 Emitting progress update to other players in room:", roomCode);
    });

    socket.on('startGame', ({ roomCode }) => {
      // Тоглоом эхлэх цаг сервер дээр хадгалагдана
      let gameStartTime = Date.now(); 
      console.log(`Тоглоом ${roomCode} эхэлсэн`);
      // Тоглоом эхлэхийг бүх хэрэглэгчдэд мэдэгдэж байна
      socket.to(roomCode).emit('gameStarted', { gameStartTime }) && socket.emit('gameStarted', { gameStartTime }); 
    });

    socket.on('playerFinished', async ({ roomCode, userId, speed, accuracy }) => {
      try {
        const room = await CreateRoom.findOne({
           room_code: roomCode 
      });
        if (!room) { 
          console.error("Room олдсонгүй");
          return;
        }
    
        const player = room.players.find(p => p.userId === userId);
        if (!player) {
          console.error("Тоглогч олдсонгүй");
          return;
        }
    
        player.finished = true;
        player.speed = speed;
        player.accuracy = accuracy;
    
        await room.save();
    
        const allFinished = room.players.every(p => p.finished);
        if (allFinished) {
          const sortedPlayers = [...room.players].sort((a, b) => b.speed - a.speed);
          for (let i = 0; i < sortedPlayers.length; i++) {
            const p = sortedPlayers[i];
            const place = `${i + 1}-${sortedPlayers.length}`;
    
            try {
              const userId = new mongoose.Types.ObjectId(p.userId);
              const authUser = await User.findOne({ _id: userId });
              
              if(authUser){
                await score.updateOne(
                  { user_id: p.userId, language: room.language, room_code: roomCode },
                  {
                    $set: {
                      speed: p.speed,
                      accuracy: p.accuracy,
                      place: place,
                      date: new Date()
                    }
                  },
                  { upsert: true }
                );
                console.log("Hereglegcjiin togloom hadgalagdsan", p.userId);
              }else{
                console.log("Hereglegch burtgelgyu", p.userId);
              }
            } catch (error) {
              console.error(error);
            }
          }
          io.to(roomCode).emit("gameResult", sortedPlayers.map(p => ({
            userId: p.userId,
            name: p.name,
            speed: p.speed,
          })));
        }
    
      } catch (err) {
        console.error("Алдаа гарлаа:", err);
      }
    });
    
    // Салсан үед
    socket.on("disconnect", () => {
      console.log("Хэрэглэгч салсан: " + socket.id);
    });
  });

  function generateRoomCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
};

export default socketIoSetup;
