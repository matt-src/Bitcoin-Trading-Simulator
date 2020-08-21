import Axios from "axios";

export const getPriceFromApi = async (coin) => {
    switch (coin) {
        case 'btc':
            return await Axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        case 'eth':
            return await Axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        case 'ltc':
            return await Axios.get("https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd");

    }
};
