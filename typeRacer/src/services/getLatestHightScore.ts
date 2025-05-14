import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL as string;

export const getLatestHightScore  = async()=>{
    try{
       const response = await axios.get(`${API_URL}/gameHistory/latestHightScore`)
       return response.data;
    }catch(error){
        console.error("Алдаа гарлаа   Latest hight score:", error);
        throw error;
    }
}

export const getHallOfFame = async()=>{
    try{
        const response = await axios.get(`${API_URL}/gameHistory/hallOfFame`)
        return response.data;
    }catch(error){
        console.error("Алдаа гарлаа   Hall of fame:", error);
        throw error;
    }
}