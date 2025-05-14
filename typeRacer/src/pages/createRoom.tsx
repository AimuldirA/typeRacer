import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../services/socket';

// Player интерфэйсийг тодорхойлох
interface Player {
  userId: string | undefined;
  isHost: boolean;
  name: string;
  color?: string;
}

const CreateRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomCode = location.state?.code;
  const data = location.state?.data;

  console.log("Endee", data)

  const [isHost, setIsHost] = useState<boolean | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const colors: string[] = ['8B4513', '102526', 'FF4500', '708090', 'AF1234', '4682B4', 'D2691E', 'A9A9A9', 'FF69B4', '00CED1'];

  const getColorForPlayers = (players: Player[]): Player[] => {
    let usedColors: string[] = [];
    return players.map((player, index) => {
      const color = index === 0 ? colors[0] : colors[usedColors.length];
      usedColors.push(color);
      return { ...player, color };
    });
  };

  useEffect(() => {
    socket.emit("getPlayers", { roomCode }, (response: { success: boolean; players: Player[] }) => {
      if (response.success) {
        const localId =  sessionStorage.getItem("userId");
        const playersWithColors = getColorForPlayers(response.players);
        
        const currentUser = response.players.find(player=>player?.userId === localId);
        console.log("CurrentId", currentUser);
        if(currentUser?.isHost){
          setIsHost(true);
        } else {
          setIsHost(false);
        }

        setPlayers(playersWithColors);
      }
    });
    socket.on("updatePlayers", (updatedPlayers: Player[]) => {
      const updatedPlayersWithColors = getColorForPlayers(updatedPlayers);
      console.log("isHost утга,,,,: ", isHost);
      setPlayers(updatedPlayersWithColors);
    });

    return () => {
      socket.off("updatePlayers");
    };
  }, [roomCode]);

  useEffect(() => {
    socket.on("redirectToMultiplayer", ({ roomCode }) => {
      console.log("➡️ Multiplayer руу шилжиж байна...");
      if(!data || data == undefined){
        navigate("/multiplayer", { state: { code: roomCode } });
      }else{
        navigate("/multiplayer", { state: { code: roomCode,  data:data} });
      }
    });

    return () => {
      socket.off("redirectToMultiplayer");
    };
  }, [roomCode]);

  // START товч дарах функц
  const handleStartRace = () => {
    console.log("Clicked")
    socket.emit("startRace", { roomCode });
  };

  const leaveRoom = () => {
    const userId = sessionStorage.getItem("userId");
    console.log("Endee irsen", userId); // ажиллаж байгаа бол дараагийнх руу орсон гэж үзнэ
  
    socket.emit("leaveRoom", { roomCode, userId }, (response: { success: boolean }) => {
      if (response.success) {
        console.log("Hariu", response); // 🔥 энэ хэсэг зөв ажиллах ёстой
        navigate("/"); 
      } else {
        console.log("Room-оос гарахад алдаа гарлаа.");
      }
    });
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-40">
      <h1 className="text-5xl text-secondary">TypeRacer</h1>
      <div className="bg-secondary p-3 w-auto rounded-sm px-6">
        <div className="bg-primary rounded-sm flex space-x-6 p-3  text-xl sm:text-base md:text-lg lg-text-xl">
          <div>
            <p>Room Code</p>
            <p>URL</p>
          </div>
          <div>
            <p>{roomCode}</p>
            <p>http://localhost:5173/room/{roomCode}</p>
            {/* http://localhost:5173/room/8LTYZV */}
          </div>
        </div>
      </div>
      <div className="bg-accent h-auto w-full p-10 space-y-4">
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-4 ">
           {/* // <div className="flex items-center space-x-4 w-1/12"><p>{player.userId }</p></div> */}
            <div className="flex items-center space-x-4 w-1/12"><p>{player.name }</p></div>
            <div className="relative w-full flex items-center">
              <div className="absolute bottom-0 w-full border-t-2 border-black"></div>
              <img
                className="mr-auto relative z-10"
                width="30"
                height="30"
                src={`https://img.icons8.com/ios-glyphs/40/${player.color}/horseback-riding.png`}
                alt="horseback-riding"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="space-x-3 ml-auto">
              {isHost !== null && isHost && (
          <button
            className="bg-secondary text-lg text-primary p-2 rounded-sm"
            onClick={handleStartRace}
          >
            START RACE
          </button>
        )}
        <button className="bg-secondary text-lg text-primary p-2 rounded-sm" onClick={() => leaveRoom()}>LEAVE RACE</button>
      </div>
    </div>
  );
};

export default CreateRoom;
