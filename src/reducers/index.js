import { TRADE_EXECUTE, SNACKBAR_OPEN, SNACKBAR_CLOSE, PRICE_UPDATE, SELECT_COIN } from "../constants/action-types";

const initialState = {
    shares: 0, //Position size in BTC
    entry: 0, //Average entry price of position
    amount: 1, //Amount to buy/sell upon trade
    price: 0, //Current BTC price in USD
    prevPrice: 0, //Previous BTC price in USD
    change: 0, //Change from previous price to current
    realized: 0, //Realized profit on position
    showSnackbar: false, //Display "can't have less than 0 shares" error snackbar
    balance: 1000, //Current USD balance
    liquidated: false, //Has our account been liquidated
    selectedCoin: 'btc'
}

function rootReducer(state = initialState, action) {
    switch (action.type) {

        case TRADE_EXECUTE:
            let tradeAmount = parseInt(action.payload);
            let newShares = state.shares + parseInt(tradeAmount);
            let newEntry = state.entry;
            let newRealized = state.realized; //Will only change if this is a sell
            let newBalance = state.balance; //Will only change if this is a sell

            if (tradeAmount > 0) { //Update average price if this is a BUY order
                let rate = parseFloat(state.price);
                let valueOfCurrentHoldings = (state.shares * state.entry);
                let valueOfNewHoldings = tradeAmount * rate;
                let totalAmount = state.shares + tradeAmount;
                console.log("totalAmount is " + totalAmount);
                newEntry = (valueOfCurrentHoldings + valueOfNewHoldings) / totalAmount;
            }

            if (tradeAmount < 0) { //If this is a SELL order
                //Check if this sell will bring us below 0 BTC
                //TODO: Dispatching from reducer is an antipattern, move this check to a middleware, or
                //modify snackbar state here
                let newAmount = state.shares + tradeAmount;
                if (newAmount < 0) {
                    console.log("can't have less than 0 BTC");
                    return {
                        ...state,
                        showSnackbar: true
                    }
                }
                //Update realized PNL and balance
                let realizedChange = (tradeAmount * -1) * (state.price - state.entry);
                newRealized = state.realized + realizedChange;
                newBalance = state.balance + realizedChange;
            }

            return {
                ...state,
                shares: newShares,
                entry: newEntry,
                realized: newRealized, //This will only be changed if this is a sell order
                balance: newBalance //This will only be changed if this is a sell order
            };
        case PRICE_UPDATE:
            if (action.payload == state.price) {
                return state; //No price change, don't update anything
            }
            let prevPrice = state.price; //Current price becomes previous price
            if (state.price == 0) { //This is our first price update, so set previous price to current price
                prevPrice = action.payload;
            }
            //Calculate adjusted balance and check if we are liquidated
            let unrealized = (parseFloat(action.payload) - state.entry) * state.shares;
            if (state.balance + unrealized <= 0) {
                console.log("rekt");
                return {
                    ...state,
                    liquidated: true
                }
            }

            return {
                ...state,
                prevPrice: prevPrice,
                price: action.payload,
                change: action.payload - prevPrice
            }
        case SNACKBAR_CLOSE:
            return {
                ...state,
                showSnackbar: false
            }
        case SNACKBAR_OPEN:
            return {
                ...state,
                showSnackbar: true
            }
        case SELECT_COIN:
            return {
                ...state,
                selectedCoin: action.payload
            }
        default:
            console.log("No handler for action:");
            console.log(action);
            return state;
        //throw new Error();
    }
}

export default rootReducer;