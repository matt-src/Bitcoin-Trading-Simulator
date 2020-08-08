import './App.css';
import { getPriceFromApi } from './helpers/Prices';
import React, { useState, useEffect } from 'react';

function App() {

  const [shares, setShares] = useState(0);
  const [average, setAverage] = useState(0);
  const [amount, setAmount] = useState(1);
  const [data, setData] = useState({}); //Bitcoin price information
  const [realized, setRealized] = useState(0); //Realized profit/loss

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
    console.log("price:");
    console.log(price);
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
    if(tradeAmount > 0){ //Update average price if this is a BUY order
      let rate = parseFloat(getPrice());
      let valueOfCurrentHoldings = (shares * average);
      let valueOfNewHoldings = tradeAmount * rate;
      let totalAmount = shares + tradeAmount;
      let newAverage = (valueOfCurrentHoldings +valueOfNewHoldings) / totalAmount;
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
      <h2>$BTC {data ? getPrice() : <p>data not loaded</p>}</h2>
      
      <button onClick={buyShares}>Buy</button>
      <button onClick={sellShares}>Sell</button>
      <button onClick={updatePrice}>Update</button>
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
      <div>
        <h1>Position:</h1>
        <h1>Long: {shares} BTC</h1>
        <h1>Position value {data ? (formatter.format(parseFloat(getPrice()) * shares)) : <p>-</p>}</h1>
        <h1>Average Price {formatter.format(average)}</h1>
        <h1>P/L unrealized {formatter.format( (parseFloat(getPrice()) - average) * shares) }</h1>
        <h1>P/L realized { formatter.format(realized)}</h1>
      </div>
    </div>
  );
}

export default App;
