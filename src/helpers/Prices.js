import Axios from "axios";

export const getPrice = (callback) => {   
    Axios.get("https://api.coindesk.com/v1/bpi/currentprice.json")
    .then(response => {
        //console.log(response)
        //console.log('returning response');
        callback(response);
    });
}