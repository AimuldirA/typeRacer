import axios from "axios";

export const saveGameResult = async(userId:string, speed:number, accuracy:number, place:string, language:string):Promise<void> =>{
    try{
        const response = await axios.post('http://localhost:5000/result', {
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