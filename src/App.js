import './App.css';
import { getPriceFromApi } from './helpers/Prices';
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function App() {

  const [shares, setShares] = useState(0);
  const [average, setAverage] = useState(0);
  const [amount, setAmount] = useState(1);
  const [data, setData] = useState({}); //Bitcoin price information
  const [lastPrice, setLastPrice] = useState(0); //Bitcoin price information
  const [realized, setRealized] = useState(0); //Realized profit/loss

  const classes = useStyles();

  useEffect(() => {
    updatePrice().then(r => r); //Need to use 'then' here instead of await, since we aren't in an async function
    const interval = setInterval(async () => {
      await updatePrice();
    }, 10 * 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  const updatePrice = async () => {
    let price = await getPriceFromApi();
    if(data){
      console.log("updating price, current data:")
      console.log(data);
      console.log("new data:");
      console.log(price);
    }
    setData(price);
  };

  const buyShares = () => {
    console.log("buying " + amount);
    tradeShares(amount);
  };

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const sellShares = () => {
    let newAmount = shares - amount;
    if (newAmount < 0) {
      console.log("can't have less than 0 shares");
      return;
    }
    tradeShares(amount * -1);
    //Update realized PNL
    console.log("average: " + average);
    console.log("price: " + getPrice());
    setRealized(realized + (amount * (getPrice() - average)));
  };

  const tradeShares = (tradeAmount) => {
    let newShares = shares + parseInt(tradeAmount);
    if (tradeAmount > 0) { //Update average price if this is a BUY order
      let rate = parseFloat(getPrice());
      let valueOfCurrentHoldings = (shares * average);
      let valueOfNewHoldings = tradeAmount * rate;
      let totalAmount = shares + tradeAmount;
      let newAverage = (valueOfCurrentHoldings + valueOfNewHoldings) / totalAmount;
      setAverage(newAverage);
    }
    setShares(newShares);
  };

  const handleAmountChange = (e) => {
    setAmount(parseInt(e.target.value));
  };

  const getPrice = () => {
    try {
      return data.data.USD.last;
    } catch (e) {
      return "0";
    }
  };

  return (
    <div className="App">
      <h1>Rekt Simulator</h1>
      <h2>Change {lastPrice ? lastPrice : <p>not loaded</p>}</h2>
  <h2>BTC {data ? getPrice() : <p>-</p>} USD <Button onClick={updatePrice} variant="contained" color="primary">Update</Button></h2>
      <Button variant="contained" color="primary" onClick={buyShares}>Buy</Button>
      <Button variant="contained" color="secondary" onClick={sellShares}>Sell</Button>
      
      <label htmlFor="amount">Amount</label>
      <input
        id="amount"
        name="amount"
        type="number"
        min="1"
        max="1000"
        placeholder="1"
        value={amount}
        onChange={handleAmountChange}
      />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="caption table">
        <caption>Position information</caption>
        <TableHead>
          <TableRow>
            <TableCell>Position size</TableCell>
            <TableCell align="right">Position value</TableCell>
            <TableCell align="right">Average Price</TableCell>
            <TableCell align="right">P/L unrealized</TableCell>
            <TableCell align="right">P/L realized</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow>
          <TableCell component="th">{shares} BTC</TableCell>
          <TableCell align="right">{data ? (formatter.format(parseFloat(getPrice()) * shares)) : <p>-</p>}</TableCell>
          <TableCell align="right">{formatter.format(average)}</TableCell>
          <TableCell align="right">{formatter.format((parseFloat(getPrice()) - average) * shares)}</TableCell>
          <TableCell align="right">{formatter.format(realized)}</TableCell>
        </TableRow>
        </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
