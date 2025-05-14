import socket from "../services/socket";

// Create Room
export const createRoom = (username: string, callback: (data: { roomCode: string }) => void) => {
  socket.emit("createRoom", { username }, callback);
};

// Join Room
export const joinRoom = (roomCode: string) => {
  socket.emit("joinRoom", roomCode);
};
