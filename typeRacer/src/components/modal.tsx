import  { useEffect, useState } from 'react';
import socket from '../services/socket';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose, correct, incorrect, time, words, roomCode }: {
    isOpen: boolean;
    onClose: () => void;
    correct: number;
    incorrect: number;
    time: number;
    words: number;
    roomCode: string;
}) => {

    const navigate = useNavigate(); 
    const [players, setPlayers] = useState<{ userId: string | null; name: string | null; speed: number }[]>([]);
    if (!isOpen) return null;

    const sessionId = sessionStorage.getItem("userId");
    const userId =  sessionId;
    const speed = time > 0 ? parseFloat(((correct / time) * 60).toFixed(2)) : 0.00;
    const accuracy = parseFloat(((correct / (correct+incorrect)) * 100).toFixed(2));


    useEffect(() => {
        if (isOpen && userId) {
          socket.emit("playerFinished", {  roomCode, userId, speed,  accuracy  });
        }
      }, [isOpen, roomCode, userId, speed]);
    
      useEffect(() => {
        const handleGameResult = (players: { userId: string, name: string, speed: number }[]) => {
          setPlayers(prevPlayers => {
            const newPlayers = [...prevPlayers];
            players.forEach(player => {
              const exists = newPlayers.some(p => p.userId === player.userId);
              if (!exists) {
                newPlayers.push(player);
              }
            });
            return newPlayers;
          });
        };
      
        socket.on('gameResult', handleGameResult);
      
        return () => {
          socket.off('gameResult', handleGameResult);
        };
      }, []);
      

      return (
        <div className="fixed inset-0 flex justify-center items-center bg-[#272835cc] z-[1000] px-4">
          <div className="bg-amber-50 text-secondary p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-5 animate-fade-in">
            <h2 className="text-3xl font-extrabold text-secondary">🎉 Game Over!</h2>
      
            <div className="text-lg space-y-2">
              <p>✅ <span className="font-semibold">Correct words:</span> {correct}</p>
              <p>❌ <span className="font-semibold">Incorrect words:</span> {incorrect}</p>
              <p>⚡ <span className="font-semibold">Speed (WPM):</span> {speed}</p>
              <p>🎯 <span className="font-semibold">Accuracy:</span> {accuracy}%</p>
            </div>
      
            <div className="mt-4 text-left">
              <h3 className="text-lg font-bold text-secondary mb-2">📊 Player Speeds:</h3>
              <div className=" rounded-md p-3 space-y-1 max-h-40 overflow-y-auto border border-[#E5CEA5]">
                {players.map((player, index) => (
                  <p key={index} className="text-sm">
                    {index + 1}. <span className="font-medium">{player.name}</span> - {player.speed} WPM
                  </p>
                ))}
              </div>
            </div>
      
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-[#E5CEA5] text-[#272835] font-semibold px-6 py-2 rounded-lg hover:brightness-110 transition-all duration-300"
            >
              🚀 OK
            </button>
          </div>
        </div>
      );
      
      
};

export default Modal;
