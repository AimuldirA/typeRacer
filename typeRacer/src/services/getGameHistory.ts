import axios from "axios"

export const getGameHistory = async (userId:string)=>{
    try{
        const response = await axios.get('http://localhost:5000/gameHistory', {
            params: { userId } 
        });
        return response.data;
    }catch(error){
        console.error("Алдаа гарлаа:", error);
        throw error;
    }
}