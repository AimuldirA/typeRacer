import { useNavigate } from "react-router-dom";

const Content = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className="relative">
               {/* <img src="images/bg.png" alt="Background" className="w-full h-108"/> */}
               <video autoPlay muted loop playsInline className="background-video  w-full h-[418px] object-cover">
                    <source src="/videos/vid2.mp4" type="video/mp4" />
                    Таны browser video дэмжихгүй байна.
                </video>
               <button onClick={() => navigate("/choseGame")} className="absolute bottom-48 left-1/2 transform -translate-x-1/2 bg-primary border-2 border-black px-8 py-4 text-2xl font-bold font-orelega rounded-lg hover:brightness-90">
                   START A GAME
                </button>
            </div>
        </div>
    );
  }

  
  export default Content;


