import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;


export const saveGameResult = async(userId:string, speed:number, accuracy:number, place:string, language:string):Promise<void> =>{
    try{
        const response = await axios.post(`${API_URL}/result`, {
                "userId": userId,
                "speed": speed,
                "language": language,
                "accuracy": accuracy,
                "place": place
        })
    }catch (error){
        console.error('Failed to save result:');
    }
}