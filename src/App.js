import './App.css';
import ErrorSnackbar from './ErrorSnackbar.js';
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
import { StylesProvider } from "@material-ui/core/styles";

const useStyles = makeStyles({
  table: {
    maxWidth: '800px',
    margin: "auto"
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
  const SNACKBAR_CLOSE = 'SNACKBAR_CLOSE';
  const SNACKBAR_OPEN = 'SNACKBAR_OPEN';

  const initialState = {
    shares: 0, //Position size in BTC
    entry: 0, //Average entry price of position
    amount: 1, //Amount to buy/sell upon trade
    price: 0, //Current BTC price in USD
    prevPrice: 0, //Previous BTC price in USD
    change: 0, //Change from previous price to current
    realized: 0, //Realized profit on position
    showSnackbar: false //Display "can't have less than 0 shares" error snackbar
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
        if (action.value > 9999) {
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch({ type: SNACKBAR_CLOSE });
  };

  const sellShares = () => {
    let newAmount = state.shares - state.amount;
    if (newAmount < 0) {
      console.log("can't have less than 0 shares"); //TODO: display this message on the page instead of just in the console
      dispatch({type: SNACKBAR_OPEN});
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
      <h2>BTC {state.price ? formatter.format(state.price) : <p>-</p>} USD {state.change >= 0 ? <span style={{ color: 'limegreen' }}>▲</span> : <span style={{ color: 'red' }}>▼</span>}{formatter.format(state.change)}</h2>
      <Button variant="contained" color="primary" onClick={buyShares}>Buy</Button>
      <Button variant="contained" color="secondary" onClick={sellShares}>Sell</Button>

      <label htmlFor="amount" className={classes.amountLabel}>Amount</label>
      <Input
        id="amount"
        name="amount"
        type="number"
        inputProps={{ min: 1, max: 9999, style: { textAlign: 'center', fontSize: '1.3em' } }}
        value={state.amount}
        onChange={handleAmountChange}
      />
      <ErrorSnackbar handleClose={handleSnackbarClose} open={state.showSnackbar}/>
      <TableContainer component={Paper}>
        <StylesProvider injectFirst>
          <Table className={classes.table} aria-label="caption table">
            <caption>Position information</caption>
            <TableHead>
              <TableRow >
                <TableCell >Position size</TableCell>
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
        </StylesProvider>
      </TableContainer>

    </div>
  );
}

export default App;
