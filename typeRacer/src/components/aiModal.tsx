import { useEffect, useRef, useState } from 'react';
import { saveGameResult } from '../services/resultGame';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/checkAuts';

type ResultType = {
  correct: number;
  incorrect: number;
  time: number;
  words: number;
};

const AIModal = ({
  isOpen,
  onClose,
  userResult,
  aiResult,
}: {
  isOpen: boolean;
  onClose: () => void;
  userResult: ResultType;
  aiResult: ResultType;
}) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStatus();
  const isFirstRun = useRef(true);
  const [players, setPlayers] = useState<{  name: string | null; speed: number }[]>([]);
  const [username, setUsername] = useState('');

  const calcSpeed = (c: number, t: number) =>
    t > 0 ? parseFloat(((c / t) * 60).toFixed(2)) : 0.0;

  const calcAccuracy = (c: number, w: number) =>
    w > 0 ? parseFloat(((c / w) * 100).toFixed(2)) : 0.0;

  const userSpeed = calcSpeed(userResult.correct, userResult.time);
  const userAccuracy = calcAccuracy(userResult.correct, userResult.words);

  const aiSpeed = calcSpeed(aiResult.correct, aiResult.time);
  const aiAccuracy = calcAccuracy(aiResult.correct, aiResult.words);

  useEffect(()=>{
    if(isLoggedIn){
        const name = sessionStorage.getItem("username");
        if(name){
            setUsername(name);
        }
    }else{
        const name = localStorage.getItem("guess");
        if(name){
            setUsername(name);
        }
    }
  })

  let place = aiSpeed > aiAccuracy ? 1 : 2;

  useEffect(() => {
  if (aiSpeed > aiAccuracy) {
    setPlayers([
      { name: username, speed: userSpeed },
      { name: "AI", speed: aiSpeed },
    ]);
  } else {
    setPlayers([
      { name: "AI", speed: aiSpeed },
      { name: username, speed: userSpeed },
    ]);
  }
}, [aiSpeed, userSpeed, aiAccuracy, username]);


useEffect(() => {
    const saveResult = async () => {
        if (isLoggedIn && userSpeed && userAccuracy) {
            const userId = sessionStorage.getItem('userId');
            const language = sessionStorage.getItem('language');
            if (userId && language) {
                await saveGameResult(userId, userSpeed, userAccuracy, `${place}-2`, language);
            }
        }
    };

    if (isFirstRun.current) {
        saveResult();
        isFirstRun.current = false; // Анхны хадгалалтыг хийснээс хойш хадгалалтыг хийгээгүй
    }
}, [isLoggedIn, userSpeed, userAccuracy]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
      <div className="bg-amber-50 p-8 rounded-md shadow-lg w-96 text-center space-y-4">
        <h2 className="text-2xl font-bold text-secondary">Game</h2>
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
        <div className='flex justify-between space-x-4'>
            <div className="text-left space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">🧍 {username}</h3>
                <p>✅ Correct: <strong>{userResult.correct}</strong></p>
                <p>❌ Incorrect: <strong>{userResult.incorrect}</strong></p>
                <p>⚡ Speed (WPM): <strong>{userSpeed}</strong></p>
                <p>🎯 Accuracy: <strong>{userAccuracy}%</strong></p>
            </div>
            <div className="text-left space-y-2 ">
                <h3 className="text-xl font-semibold text-red-800">🤖 AI</h3>
                <p>✅ Correct: <strong>{aiResult.correct}</strong></p>
                <p>❌ Incorrect: <strong>{aiResult.incorrect}</strong></p>
                <p>⚡ Speed (WPM): <strong>{aiSpeed}</strong></p>
                <p>🎯 Accuracy: <strong>{aiAccuracy}%</strong></p>
            </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-secondary text-primary px-4 py-2 rounded-sm"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AIModal;
