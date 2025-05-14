import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/customButton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { saveGame } from "../services/saveGame";
import socket from "../services/socket";

const API_URL = import.meta.env.VITE_API_URL as string;

const ChooseGameMode = () => {
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [username, setUserName] = useState<string>("");
    const [levelDialogOpen, setLevelDialogOpen] = useState(false);
    const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [joinGameDialogOpen, setJoinGameDialogOpen] = useState(false);
    const [nameDialogOpen, setNameDialogOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [joinRoomCode, setJoinRoomCode] = useState("");
    const [message, setMessage] = useState<string>("");

    type GameResponse = {
        sentence: string;
        time: number;
        start_time: number;
      };

    // Хэрэглэгч login хийсэн эсэхийг шалгах
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const statusRes = await fetch(`${API_URL}/auth/auth-status`, {
                    method: "GET",
                    credentials: "include",
                });
                const statusData = await statusRes.json();
                setIsLoggedIn(statusData.loggedIn);
                if (statusData.loggedIn && statusData.name) {
                    setName(statusData.name);
                    console.log("SetName", name);
                }
                const userRes = await fetch(`${API_URL}/auth/getUser`, {
                    method: "GET",
                    credentials: "include",
                });
                const userData = await userRes.json();
                console.log("DATA", userData);
                setUserId(userData.id);
                setUserName(userData.username);
                console.log("Setusername", username);
            } catch (err) {
                console.error("Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа:", err);
            }
        };
        fetchUserData();
    }, []);
    
    const currentUsername = isLoggedIn ? username : name;
    const currentUserId = isLoggedIn ? userId : undefined;
    const payload = {
        username: currentUsername,
        user_id: currentUserId
      };
      const pay = {
        username: currentUsername,
        user_id: currentUserId,
        roomCode: joinRoomCode 
      };
    const handleCreateRoom = (res: GameResponse) => {
        socket.emit("createRoom", payload, (data: { roomCode: string }) => {
          const { roomCode } = data;
          setRoomCode(roomCode);
          if (isLoggedIn) {
            sessionStorage.setItem("userId", userId);
        } else {
            if (socket.id) {
                sessionStorage.setItem("userId", socket.id);
            } else {
                console.error("Socket ID is undefined");
            }
        }
        socket.emit('selectedLanguage', {roomCode, language:selectedLanguage});
        console.log("hel", selectedLanguage);
          //  socket.emit('gameSettingsSelected', { roomCode, sentence: res.sentence, initialTime: res.time, startTime: res.start_time });
            console.log("OKOKKOKOKO", roomCode, res.sentence,  res.time, res.start_time)
           navigate(`/room/${roomCode}`, { state: { code: roomCode, data:res  } });
        });
      };

    const handleJoinRoom = () => {
        socket.emit('joinRoom', pay, (response: { success: boolean; message?: string }) => {
            if (response.success) {
                setRoomCode(joinRoomCode);
                if(isLoggedIn){
                    sessionStorage.setItem("userId", userId)
                }else{
                    if(socket.id){
                        console.log("Id irlee", socket.id);
                        sessionStorage.setItem("userId", socket.id)
                        console.log("ZAAA", socket.id);
                    }else{
                        console.error("Socket ID is undefined");
                    }
                }
                setMessage(`Өрөөнд амжилттай нэгдлээ: ${joinRoomCode}`);
                    navigate(`/room/${roomCode}`, { state: { code: joinRoomCode } });
            } else {
                setMessage(response.message || "Өрөөний код буруу байна.");
            }
        });
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        if (option === "friends") {
            setJoinDialogOpen(true);
        } else {
            setLevelDialogOpen(true);
        }
    };

    const handleChoiseSelected = (choise: string) => {
        if (choise === "create") {
                setLevelDialogOpen(true);
            }
            else {
            setJoinGameDialogOpen(true);
        }
    };

    const handleLevelSelect = (level: string) => {
        setSelectedLevel(level);
        setLevelDialogOpen(false);
        setLanguageDialogOpen(true);
    };

    const handleLanguage = (language: string) => {
        setSelectedLanguage(language);
        sessionStorage.setItem("language", language);
        setLanguageDialogOpen(false);
    };

    useEffect(() => {
        if (selectedLanguage) {
            if (!isLoggedIn) {
                setNameDialogOpen(true);
            } else {
                handleNameSubmit();
            }
        }
    }, [selectedLanguage]);

    const handleNameSubmit = async () => {
        try {
            const data = {
                level: selectedLevel || '',
                languageOption: selectedLanguage || '',
            };
            const res = await saveGame(data);

            if (selectedOption === "friends" && !selectedLevel && !selectedLanguage) {
                localStorage.removeItem('startTime');
                localStorage.removeItem('remainingTime',);
                navigate("/joinGame", { state: { name } });
            } else if (selectedOption === "friends") {
                localStorage.removeItem('startTime');
                localStorage.removeItem('remainingTime',);
                // const selectGameSettings = () => {
                //     socket.emit('gameSettingsSelected', { roomCode, sentence: res.sentence, initialTime: res.time, startTime: res.start_time });
                //   };
                //   selectGameSettings();
                //   console.log("OKOKKOKOKO", roomCode, res.sentence,  res.time, res.start_time)
                //sessionStorage.setItem("gameData", JSON.stringify(res));
                handleCreateRoom(res);
            } else if(selectedOption === "alone") {
                if (isLoggedIn) {
                    sessionStorage.setItem("userId", userId);
                    sessionStorage.setItem("username", username)
                }else{
                    sessionStorage.setItem("userId", '');
                    sessionStorage.setItem("username", '');
                }
                navigate("/gamePage", { state: { gameDatas: res } });
                setNameDialogOpen(false);
                setSelectedLanguage('');
            }else{
                if (isLoggedIn) {
                    sessionStorage.setItem("userId", userId);
                    sessionStorage.setItem("username", username)
                }else{
                    localStorage.setItem("guess", name);
                    console.log("Guess", name)
                    console.log("localStorage:", localStorage.getItem("guess"));
                    sessionStorage.setItem("userId", '');
                    sessionStorage.setItem("username", '');
                }
                navigate("/aigame", { state: { gameDatas: res, level:selectedLevel } });
                setNameDialogOpen(false);
                setSelectedLanguage('');
            }
        } catch (error) {
            console.error("Game хадгалах үед алдаа гарлаа:", error);
        }
    };

    return (
        <div className="flex justify-center items-center  space-x-12 mt-16">
            <CustomButton text="FRIENDS" imageSrc="images/friends.png" onClick={() => handleOptionSelect("friends")} />
            <CustomButton text="COMPUTER" imageSrc="images/com.png" onClick={() => handleOptionSelect("computer")} />
            <CustomButton text="ALONE" imageSrc="images/alone.png" onClick={() => handleOptionSelect("alone")} />

            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                <DialogContent className="bg-primary">
                    <DialogHeader>
                        <DialogTitle>Choose an option</DialogTitle>
                    </DialogHeader>
                    <div className="flex space-x-6 justify-center">
                        <CustomButton text="JOIN" imageSrc="" onClick={() => handleChoiseSelected("join")} />
                        <CustomButton text="CREATE" imageSrc="" onClick={() => handleChoiseSelected("create")} />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={joinGameDialogOpen} onOpenChange={setJoinGameDialogOpen}>
                <DialogContent className="bg-primary p-4">
                    <DialogHeader>
                        <DialogTitle>Enter game URL or Room Code</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Room Code"
                            value={joinRoomCode}
                            onChange={(e) => setJoinRoomCode(e.target.value)}
                            className="border-2 border-gray-500 p-2 placeholder-gray-500 text-black w-full"
                        />
                       {!isLoggedIn &&  <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-2 border-gray-500 p-2 placeholder-gray-500 text-black w-full"
                        />}
                        <button
                            className="border-2 border-secondary px-4 py-2 rounded-sm w-full"
                            onClick={() => handleJoinRoom() }
                        >
                            Join Game
                        </button>

                        <p className="text-white">{message}</p>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={levelDialogOpen} onOpenChange={setLevelDialogOpen}>
                <DialogContent className="bg-primary">
                    <DialogHeader>
                        <DialogTitle>Select Difficulty</DialogTitle>
                    </DialogHeader>
                    <div className="flex space-x-6 justify-center">
                        <CustomButton text="EASY" imageSrc="" onClick={() => handleLevelSelect("easy")} />
                        <CustomButton text="MEDIUM" imageSrc="" onClick={() => handleLevelSelect("medium")} />
                        <CustomButton text="HARD" imageSrc="" onClick={() => handleLevelSelect("hard")} />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
                <DialogContent className="bg-primary">
                    <DialogHeader>
                        <DialogTitle>Select Language</DialogTitle>
                    </DialogHeader>
                    <div className="flex space-x-6 justify-center">
                        <CustomButton text="Mongolian" imageSrc="" onClick={() => handleLanguage("mongolian")} />
                        <CustomButton text="English" imageSrc="" onClick={() => handleLanguage("english")} />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
                <DialogContent className="bg-primary">
                    <DialogHeader>
                        <DialogTitle>Enter Your Name</DialogTitle>
                    </DialogHeader>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        className="border-2 border-gray-500 p-2 placeholder-gray-500 text-black w-full mb-4"
                    />
                    <button
                        className="border-2 border-secondary px-4 py-2 rounded-sm w-full"
                        onClick={() => {
                                handleNameSubmit();  
                        }}
                    >
                        Next
                    </button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ChooseGameMode;
