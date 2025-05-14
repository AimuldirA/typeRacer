import axios from "axios"


export const getLatestHightScore  = async()=>{
    try{
       const response = await axios.get('http://localhost:5000/gameHistory/latestHightScore')
       return response.data;
    }catch(error){
        console.error("Алдаа гарлаа   Latest hight score:", error);
        throw error;
    }
}

export const getHallOfFame = async()=>{
    try{
        const response = await axios.get('http://localhost:5000/gameHistory/hallOfFame')
        return response.data;
    }catch(error){
        console.error("Алдаа гарлаа   Hall of fame:", error);
        throw error;
    }
}