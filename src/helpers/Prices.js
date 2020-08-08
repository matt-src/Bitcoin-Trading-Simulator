import Axios from "axios";

export const getPriceFromApi = async () => {
    return await Axios.get("https://api.coindesk.com/v1/bpi/currentprice.json")
    // return ({data:
    //         {bpi:
    //                 {USD:
    //                         { rate: ""+Math.random()*1000 }
    //                 }
    //         }})
};
