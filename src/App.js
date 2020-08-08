import './App.css';
import { getPriceFromApi } from './helpers/Prices';
import React, { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState({
    shares: 0,
    average: 0,
    amount: 1,
    pnl: 0,
    data: null
  });

  useEffect(() => {
    console.log("initial update-price");
    updatePrice().then(r => r);
    const interval = setInterval(async () => {
      await updatePrice();
      console.log("Updated the price");
    }, 5 * 1000);
    return () => {
      console.log("unmounting");
      clearInterval(interval);
    }
  }, []);

  const updatePrice = async () => {
    console.log("current data (from updatePrice): ", data);
    let price = await getPriceFromApi();
    setData((data)=>{
      return {...data, ...price}
    });
  };

  const buyShares = () => {
    console.log("buying " + data.amount);
    tradeShares(data.amount);
  };

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const sellShares = () => {
    let newAmount = data.shares - data.amount;
    if (newAmount < 0) {
      console.log("can't have less than 0 shares");
      return;
    }
    tradeShares(data.amount * -1);
  };

  const tradeShares = (amount) => {
    let newShares = data.shares + parseInt(amount);
    let newAverage = data.average;
    if(amount > 0){ //Update average price
      //console.log("updating average price");
      let rate = parseFloat(getPrice().replace(',', ''));
      /**console.log("shares: " + data.shares);
      console.log("average: " + data.average);
      console.log("amount: " + amount);
      console.log("rate: " + rate);*/
      let valueOfCurrentHoldings = (data.shares * data.average);
      //console.log("value of current holdings: " + valueOfCurrentHoldings);
      let valueOfNewHoldings = amount * rate;
      //console.log("value of new holdings: " + valueOfNewHoldings);
      let totalAmount = data.shares + amount;
      //console.log("total Amount: " + totalAmount)
      newAverage = (valueOfCurrentHoldings +valueOfNewHoldings) / totalAmount;
      //console.log("new average");
      //console.log(newAverage);
    }
    let newData = Object.assign({}, data, {shares: newShares, average: newAverage });
    console.log("new Data:");
    console.log(newData);
    
    setData(newData);
    console.log("new shares:");
    console.log(data.shares)
  };

  const handleAmountChange = (e) => {
    let newData = Object.assign({}, data, { amount: parseInt(e.target.value) });
    setData(newData)
  };

  const getPrice = () => {
    try {
      return data.data.bpi.USD.rate;
    } catch (e) {
      return "0";
    }
  };

  return (
    <div className="App">
      <h1>Rekt Simulator</h1>
      <h2>$BTC {data.data ? getPrice() : <p>data not loaded</p>}</h2>
      <h2>Shares: {data.shares}</h2>
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
        value={data.amount}
        onChange={handleAmountChange}
      />
      <div>
        <h1>Balance {data.data ? (formatter.format(parseInt(getPrice().replace(',', '')) * data.shares)) : <p>-</p>}</h1>
        <h1>Average Price {formatter.format(data.average)}</h1>
      </div>
    </div>
  );
}

export default App;
