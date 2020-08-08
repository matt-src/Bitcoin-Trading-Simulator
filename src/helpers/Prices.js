import Axios from "axios";

export const getPriceFromApi = async () => {
    return await Axios.get("https://blockchain.info/ticker");
};
