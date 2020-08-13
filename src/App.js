import './App.css';
import { getPriceFromApi } from './helpers/Prices';
import React, { useReducer, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650 //TODO: make this bigger so the table can't get cut off
  },
  amountLabel: {
    paddingLeft: '10px',
    paddingRight: '10px',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: '1.3em'
  }
});

function App() {

  const TRADE_EXECUTE = 'TRADE_EXECUTE';
  const AMOUNT_CHANGE = 'AMOUNT_CHANGE';
  const PRICE_UPDATE = 'PRICE_UPDATE';

  const initialState = {
    shares: 0, //Position size in BTC
    entry: 0, //Average entry price of position
    amount: 1, //Amount to buy/sell upon trade
    price: 0, //Current BTC price in USD
    prevPrice: 0, //Previous BTC price in USD
    change: 0, //Change from previous price to current
    realized: 0 //Realized profit on position
  }

  const [state, dispatch] = useReducer(reducer, initialState); //Difference from last price

  const classes = useStyles();

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  useEffect(() => {
    //Do initial price update
    updatePrice().then(r => r); //Need to use 'then' here instead of await, since we aren't in an async function

    const interval = setInterval(async () => {
      await updatePrice();
    }, 10 * 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  function reducer(state, action) {
    switch (action.type) {
      case TRADE_EXECUTE:
        let tradeAmount = action.tradeAmount;
        let newShares = state.shares + parseInt(tradeAmount);
        let newEntry = state.entry;
        if (tradeAmount > 0) { //Update average price if this is a BUY order
          let rate = parseFloat(state.price);
          let valueOfCurrentHoldings = (state.shares * state.entry);
          let valueOfNewHoldings = tradeAmount * rate;
          let totalAmount = state.shares + tradeAmount;
          newEntry = (valueOfCurrentHoldings + valueOfNewHoldings) / totalAmount;
        }
        return {
          ...state,
          shares: newShares,
          entry: newEntry
        };
      case AMOUNT_CHANGE:
        console.log("amount change");
        if(action.value > 9999){
          return {
            ...state,
            amount: 9999
          }
        } 
        return {
          ...state,
          amount: action.value
        }
      case PRICE_UPDATE:
        let prevPrice = state.price; //Current price becomes previous price
        if (state.price == 0) { //This is our first price update, so set previous price to current price
          prevPrice = action.price;
        }
        return {
          ...state,
          prevPrice: prevPrice,
          price: action.price,
          change: action.price - prevPrice
        }
      default:
        throw new Error();
    }
  }

  const updatePrice = async () => {
    let newPriceData = await getPriceFromApi();
    dispatch({ type: PRICE_UPDATE, price: newPriceData.data.USD.last })
  };

  const buyShares = () => {
    tradeShares(state.amount);
  };

  const sellShares = () => {
    let newAmount = state.shares - state.amount;
    if (newAmount < 0) {
      console.log("can't have less than 0 shares"); //TODO: display this message on the page instead of just in the console
      return;
    }
    tradeShares(state.amount * -1);
    //Update realized PNL
    state.realized = (state.realized + (state.amount * (state.price - state.entry)));
  };

  const tradeShares = (tradeAmount) => {
    dispatch({ type: TRADE_EXECUTE, tradeAmount: parseInt(tradeAmount) })
  };

  const handleAmountChange = (e) => {
    dispatch({ type: AMOUNT_CHANGE, value: e.target.value });
  };

  return (
    <div className="App">
      <h1>Rekt Simulator</h1>
      <h2>BTC {state.price ? formatter.format(state.price) : <p>-</p>} USD {state.change >= 0 ? <span>⮝</span> : <span>⮟</span>}{formatter.format(state.change)}</h2>
      <Button variant="contained" color="primary" onClick={buyShares}>Buy</Button>
      <Button variant="contained" color="secondary" onClick={sellShares}>Sell</Button>

      <label htmlFor="amount" className={classes.amountLabel}>Amount</label>
      <Input
        id="amount"
        name="amount"
        type="number"
        inputProps={{ min: 1, max: 9999, style: { textAlign: 'center', fontSize: '1.3em' }}}
        value={state.amount}
        onChange={handleAmountChange}
      />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="caption table">
          <caption>Position information</caption>
          <TableHead>
            <TableRow>
              <TableCell>Position size</TableCell>
              <TableCell align="right">Position value</TableCell>
              <TableCell align="right">Entry Price</TableCell>
              <TableCell align="right">P/L unrealized</TableCell>
              <TableCell align="right">P/L realized</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th">{state.shares} BTC</TableCell>
              <TableCell align="right">{state.price ? (formatter.format(parseFloat(state.price) * state.shares)) : <p>-</p>}</TableCell>
              <TableCell align="right">{formatter.format(state.entry)}</TableCell>
              <TableCell align="right">{formatter.format((parseFloat(state.price) - state.entry) * state.shares)}</TableCell>
              <TableCell align="right">{formatter.format(state.realized)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
