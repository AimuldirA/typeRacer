import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../services/socket';
import Modal from '../components/modal';
import { CountdownModal } from '../components/countDownModal';

interface Player {
  userId: string | undefined;
  isHost: boolean;
  name: string;
  color?: string;
  progress?: number;
}

const MultiplayerGame = () => {
  const [storedData, setGameData] = useState<any>(null);
  const [sentence, setSentence] = useState('');
  const [user, setUser] = useState('');
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [word, setWord] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState<boolean | null>(null);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [initialTime, setInitialTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [startTime, setStartTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  const navigate = useNavigate();
  const location = useLocation();
  const roomCode = location.state?.code;
  const data = location.state?.data;
  let rightWords = 0;
  let wrongWords = 0;

  const colors: string[] = ['8B4513', '102526', 'FF4500', '708090', 'AF1234', '4682B4', 'D2691E', 'A9A9A9', 'FF69B4', '00CED1'];

  useEffect(() => {
    if (!data || data == undefined) return; // data байхгүй бол шууд зогсооно
  
    socket.emit('gameSettingsSelected', {
      roomCode,
      sentence: data.sentence,
      initialTime: data.time,
      startTime: data.start_time,
    });
  }, [data]);
  
  
  useEffect(() => {
    console.log("Socket connected:", socket.id);
    socket.on('newTextAvailable', ({ sentence, initialTime, startTime }) => {
      setSentence(sentence);
      setInitialTime(initialTime);
      setStartTime(startTime);
      console.log("Client received sentence:", sentence);
    });

    console.log("Sentence, time", sentence, initialTime);
  
    return () => {
      socket.off('newTextAvailable');
    };
  }, []);  
       
  const getColorForPlayers = (players: Player[]): Player[] => {
    let usedColors: string[] = [];
    return players.map((player, index) => {
      const color = colors[usedColors.length];
      usedColors.push(color);
      return { ...player, color };
    });
  };

  useEffect(() => {
    socket.emit("getPlayers", { roomCode }, (response: { success: boolean; players: Player[] }) => {
      if (response.success) {
        const playersWithColors = getColorForPlayers(response.players);
        setShowCountdown(true);
        setPlayers(playersWithColors);
        setPlayers(playersWithColors);
      }
    });
    socket.on("hostInfo", (hostId)=>{
      const localId =  sessionStorage.getItem("userId");
      if(hostId==localId){
        setIsHost(true);
      }else{
        setIsHost(false);
      }
      console.log("HostId  localId", hostId,  localId);
    });

    socket.on("updatePlayers", (updatedPlayers: Player[]) => {
      const updatedWithColors = getColorForPlayers(updatedPlayers);
      setPlayers(updatedWithColors);
    });

    socket.on("playerProgress", ({ userId, progress }: { userId: string, progress: number }) => {
      setPlayers(prev =>
        prev.map(p =>
          p.userId === userId ? { ...p, progress } : p
        )
      );
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("playerProgress");
    };
  }, [roomCode]);

  const leaveRoom = () => {
    const userId = sessionStorage.getItem("userId");
    socket.emit("leaveRoom", { roomCode, userId }, (response: { success: boolean }) => {
      if (response.success) navigate("/");
    });
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      if (word.trim() !== "") {
        setSavedWords([...savedWords, word.trim()]);
        setWord("");
      }
    }
  };

  useEffect(() => {
    const sentenceWords = sentence.trim().split(/\s+/);
    const calculatedProgress = Math.min((savedWords.length / sentenceWords.length) * 100, 100);
    const sessionId = sessionStorage.getItem("userId");
    console.log("SessionId", sessionId);
    const userId = sessionId;
    console.log("Host", isHost);
    console.log("Userid", userId);
    if (userId) {
      socket.emit("progressUpdate", {
        roomCode,
        userId,
        progress: calculatedProgress
      });
    }
  }, [savedWords]);

  useEffect(()=>{
    if(isGameOver){
      socket.emit("gameEnd", { roomCode});
    }
  }, [isGameOver])

  useEffect(() => {
    if (!showCountdown && initialTime > 0) {
      setRemainingTime(initialTime);
    }
  }, [showCountdown]);

  useEffect(() => {
    if (!initialTime) return;
  
    // localStorage-д утга байхгүй бол шинэ тоглоом эхлүүлнэ
    const storedStartTime = localStorage.getItem("startTime");
    const storedRemainingTime = localStorage.getItem("remainingTime");
  
    let effectiveStartTime;
    if (storedStartTime && storedRemainingTime) {
      effectiveStartTime = Number(storedStartTime);
      setStartTime(effectiveStartTime);
      setRemainingTime(Number(storedRemainingTime));
    } else {
      effectiveStartTime = Date.now();
      localStorage.setItem("startTime", effectiveStartTime.toString());
      localStorage.setItem("remainingTime", initialTime.toString());
  
      setStartTime(effectiveStartTime);
      setRemainingTime(initialTime);
    }
  
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - effectiveStartTime) / 1000);
      const timeLeft = initialTime - elapsedSeconds;
  
      if (timeLeft <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null; 
        }
        localStorage.removeItem("startTime");
        localStorage.removeItem("remainingTime");
        setRemainingTime(0);
        setIsGameOver(true);
      } else {
        setRemainingTime(timeLeft);
        localStorage.setItem("remainingTime", timeLeft.toString());
      }
    }, 1000);
  
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null; 
      }

    };
  }, [initialTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};
const sentenceWords = sentence.trim().split(/\s+/);

  const renderColoredWords = () => {
    console.log("ZA", sentence);
    const sentenceWords = sentence.trim().split(/\s+/);
    return sentenceWords.map((word, index) => {
      let className = "text-gray-400";
      if (savedWords[index] !== undefined) {
        if (savedWords[index] === word) {
          className = "text-green-700 font-semibold";
          rightWords++;
        } else {
          className = "text-red-500";
          wrongWords++;
        }
      }
      return (
        <span key={index} className={`${className} mx-1`}>
          {word}
        </span>
      );
    });
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    socket.emit("startGame", { roomCode });
  };

   useEffect(() => {
          if (  savedWords.length === sentenceWords.length) {
              setIsGameOver(true);
              const finishTime =  Date.now();
              const tsag = Math.floor((finishTime - startTime) / 1000);
              console.log("Tsaaag", tsag);
              setInitialTime(tsag);
          }
      }, [savedWords, sentence]);

  const ModalComponent = () => {
    return (
        <Modal
            isOpen={isGameOver }
            onClose={() => setIsGameOver(false)}
            correct={rightWords}
            incorrect={wrongWords}
            time = {initialTime}
            words = {sentence.length}
            roomCode = {roomCode}
        />
    );
};

  return (
    <div className="flex flex-col items-center space-y-6 px-40">
      {showCountdown && <CountdownModal onComplete={handleCountdownComplete} />}
      {isGameOver && <ModalComponent />}
      <div className='flex justify-between w-full items-center'>
        <h1 className="text-5xl text-secondary">TypeRacer</h1>
        <p className='bg-secondary text-primary text-3xl px-6 rounded-sm ml-auto'>{  formatTime(remainingTime)}</p>
      </div>

      <div className="bg-secondary p-3 w-11/12 rounded-sm px-6">
        <div className="bg-primary flex flex-wrap rounded-sm space-x-6 p-3 text-xl">
          {renderColoredWords()}
        </div>
      </div>

      <div className="bg-accent h-auto w-full p-10 space-y-4">
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-1/12"><p>{player.name}</p></div>
            <div className="relative w-full flex items-center h-8">
              <div className="absolute bottom-0 w-full border-t-2 border-black"></div>
              <img
                className="mr-auto relative z-10"
                width="30"
                height="30"
                src={`https://img.icons8.com/ios-glyphs/40/${player.color}/horseback-riding.png`}
                alt="horseback-riding"
                style={{ left: `${player.progress || 0}%`, transform: "translateX(-50%)", transition: "left 0.5s ease" }}
              />
            </div>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={word}
        onChange={handleText}
        onKeyDown={handleKeyDown}
        placeholder="Type a word and press space..."
        className="p-2 rounded-md w-full border border-black"
        disabled={isGameOver}
      />

      <div className='space-x-3 ml-auto'>
        <button className='bg-secondary text-lg text-primary p-2 rounded-sm' onClick={leaveRoom}>LEAVE RACE</button>
      </div>
    </div>
  );
};

export default MultiplayerGame;

