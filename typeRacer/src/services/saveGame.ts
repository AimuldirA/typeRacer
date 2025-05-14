import axios from "axios";

interface choseGame{
    level:string;
    languageOption:string;
}
export const saveGame = async (data: choseGame) => {

    try {
        const response = await axios.post(
            "http://localhost:5000/game/getTekst",
            data,
            {
                withCredentials: true
            }
        );
        console.log("Togloomiin tohitgoo", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed game", error);
        throw error;
    }
};
