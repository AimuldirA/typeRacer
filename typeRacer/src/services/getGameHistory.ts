import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL as string;

export const getGameHistory = async (userId:string)=>{
    try{
        const response = await axios.get(`${API_URL}/gameHistory`, {
            params: { userId } 
        });
        return response.data;
    }catch(error){
        console.error("Алдаа гарлаа:", error);
        throw error;
    }
}