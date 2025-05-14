import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css'
import Home from "./pages/home";
import SignUP from "./pages/signUP";
import Header from "./components/header";
import Login from "./pages/logIn";
import Profile from "./pages/profile";
import ChoseGame from "./pages/ChoseGame";
import CreateRoom from "./pages/createRoom";
import JoinGame from "./pages/joinGame";
import GamePage from "./pages/gamePage";
import MultiplayerGame from "./pages/multiplayGame";
import AiGame from "./pages/aiGame";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const noHeaderPages = ["/startGame", "/selectLevel"];

  return (
    <div className=" min-h-screen">
      {!noHeaderPages.includes(location.pathname) && <Header/>}
      {children}
    </div>
  );
};

function App() {
  return (
      <div className="bg-primary h-full">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/signUP" element={<SignUP/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/choseGame" element={<ChoseGame/>}/>
              {/* <Route path="/createRoom" element={<CreateRoom/>}/> */}
              <Route path="/room/:roomCode" element={<CreateRoom/>}/>
              <Route path="/joinGame" element={<JoinGame/>}/>
              <Route path="/gamePage" element={<GamePage/>}/>
              <Route path="/aigame" element={<AiGame/>}/>
              <Route path="multiplayer" element={<MultiplayerGame/>}/>
            </Routes>
          </Layout>
        </Router>
      </div>
  )
}

export default App
