import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SingleModal from '../components/singleModal';
import { useAuthStatus } from '../hooks/checkAuts';
import { CountdownModal } from '../components/countDownModal';
import AIModal from '../components/aiModal';

const AiGame = () => {
    const location = useLocation();
    const { gameDatas, level } = location.state || {};

    const [sentence, setSentence] = useState("");
    const [time, setTime] = useState(0); // Time as seconds
    const [initialTime, setInitialTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [savedWords, setSavedWords] = useState<string[]>([]);
    const [word, setWord] = useState<string>("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [showCountdown, setShowCountdown] = useState(true);
    const [aiWords, setAiWords] = useState<string[]>([]);
    const navigate = useNavigate();
    const [rightAi, setRightAi] = useState(0);
    const [wrongAi, setWrongAi] = useState(0);
      let rightWords = 0;
      let wrongWords = 0;

    useEffect(() => {
        if (!gameDatas) return;
        setSentence(gameDatas.sentence);
        setTime(gameDatas.time);
        setInitialTime(gameDatas.time);
        setStartTime(gameDatas.start_time);
        setLoading(false);
        console.log("Gamedata", gameDatas);
    }, [gameDatas]);

    const { isLoggedIn } = useAuthStatus();
    useEffect(() => {
        if (isLoggedIn) {
            const username = sessionStorage.getItem('username');
            setUser(username ?? "Guest");
        } else {
            const name = localStorage.getItem("guess")
            if(name){
                setUser(name);
            }
        }
    }, [isLoggedIn]);
    const delay = level === "hard" ? 500 : level === "medium" ? 800 : 1000;

    useEffect(() => {
    if (loading || showCountdown || isGameOver) return;

    const sentenceWords = sentence.trim().split(/\s+/);
    const aiInterval = setInterval(() => {
        setAiWords(prevWords => {
            const nextWordIndex = prevWords.length;
            const nextWord = sentenceWords[nextWordIndex];
            if (!nextWord) {
                clearInterval(aiInterval);
                return prevWords;
            }

            const shouldMisspell = Math.random() < 0.1;
            const typedWord = shouldMisspell ? nextWord.slice(0, -1) + 'x' : nextWord;

            return [...prevWords, typedWord];
        });
    }, delay);

    return () => clearInterval(aiInterval);
}, [loading, showCountdown, isGameOver, sentence]);

useEffect(() => {
  if (isGameOver) {
    let correct = 0;
    let incorrect = 0;
    const sentenceWords = sentence.trim().split(/\s+/);

    aiWords.forEach((word, index) => {
      if (word === sentenceWords[index]) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setRightAi(correct);
    setWrongAi(incorrect);
  }
}, [isGameOver, aiWords, sentence]);

    const sentenceWords = sentence.trim().split(/\s+/);
    const aiProgress = Math.min((aiWords.length / sentenceWords.length) * 100, 100);

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
    const userProgress = Math.min((savedWords.length / sentenceWords.length) * 100, 100);

     const renderColoredWords = () => {
        const sentenceWords = sentence.trim().split(/\s+/); 
        return sentenceWords.map((word, index) => {
            let className = "text-gray-400"; // default: бичээгүй үгэнд
            if (savedWords[index] !== undefined) {
                if (savedWords[index] === word) {
                    className = "text-green-700 font-semibold"; // зөв бичсэн
                    rightWords++;
                } else {
                    className = "text-red-500"; // буруу бичсэн
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

    const players = [
        { name: user, color: "ff0000", progress: userProgress },
        { name: "AI", color: "0000ff", progress: aiProgress }
    ];

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    };

    useEffect(() => {
        if (loading || showCountdown) return;
        const countdown = setInterval(() => {
            setTime(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setIsGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [loading, showCountdown]);

    useEffect(() => {
        if (!loading && savedWords.length === sentenceWords.length) {
            setIsGameOver(true);
            const finishTime = Date.now();
            const tsag = Math.floor((finishTime - startTime) / 1000);
            console.log("Tsaaag", tsag);
            setInitialTime(tsag);
        }
    }, [savedWords, sentence, loading]);

    const aiCorrect = aiWords.filter((w, i) => w === sentenceWords[i]).length;
    const aiWrong = aiWords.length - aiCorrect;

    const ModalComponent = () => {
        console.log("AI shuu", rightAi, wrongAi, sentence.length)
        return (
            <AIModal
                isOpen={isGameOver}
                onClose={() => setIsGameOver(false)}
                userResult={{
                    correct: rightWords,
                    incorrect: wrongWords,
                    time: initialTime,
                    words: wrongWords+rightWords
                }}
                aiResult={{
                    correct: rightAi,
                    incorrect: wrongAi,
                    time: initialTime,
                    words: rightAi+wrongAi
                }}
            />
        );
    };

    const handleCountdownComplete = () => {
        setShowCountdown(false);
    };

    return (
        <div className="flex flex-col items-center space-y-6 px-40 ">
            {showCountdown && <CountdownModal onComplete={handleCountdownComplete} />}
            {isGameOver && <ModalComponent />}
            <div className='flex justify-between w-full items-center'>
                <h1 className="text-5xl text-secondary">TypeRacer</h1>
                <p className='bg-secondary text-primary text-3xl px-6 rounded-sm ml-auto'>{formatTime(time)}</p>
            </div>
            <div className="bg-secondary p-3 w-11/12 rounded-sm px-6">
                <div className="bg-primary flex flex-wrap rounded-sm space-x-6 p-3 text-xl">
                    {renderColoredWords()}
                </div>
            </div>
            <div className="bg-accent h-auto w-full p-10 space-y-4">
                {players.map((player, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <p>{player.name}</p>
                        <div className="relative w-full flex items-center">
                            <div className="absolute bottom-0 w-full border-t-2 border-black"></div>
                            <img
                                className="mr-auto relative z-10"
                                style={{ left: `${player.progress}%`, transform: "translateX(-50%)" }}
                                width="30"
                                height="30"
                                src={`https://img.icons8.com/ios-glyphs/30/${player.color}/horseback-riding.png`}
                                alt="horseback-riding"
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
                <button onClick={() => navigate("/")} className='bg-secondary text-lg text-primary p-2 rounded-sm'>LEAVE RACE</button>
            </div>
        </div>
    );
};

export default AiGame;
