import './App.css';

import { updatePrice } from "./actions/index";
import { getPriceFromApi } from './helpers/Prices';
import { CoinSelector } from './components/CoinSelector';
import { TradeContainer } from "./components/TradeContainer";
import { LiquidatedView } from "./components/LiquidatedView";
import { GithubLink } from './components/GithubLink'
import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux'

import { useSelector } from 'react-redux';


function App() {
  const liquidated = useSelector(state => state.liquidated);
  const dispatch = useDispatch();

  useEffect(() => {
    //Do initial price update
    fetchAndUpdatePrice().then(r => r); //Need to use 'then' here instead of await, since we aren't in an async function

    const interval = setInterval(async () => {
      await fetchAndUpdatePrice();
    }, 10 * 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  const fetchAndUpdatePrice = async () => {
    let newPriceData = await getPriceFromApi();
    dispatch(updatePrice(newPriceData.data.USD.last));
  };

  return (
    <div className="App">
      <h1>Trading Simulator</h1>
      <CoinSelector />
      {liquidated ? <LiquidatedView /> : <TradeContainer />}
      <GithubLink />
    </div>
  );
}

export default App;
