import './App.css';

import React, { useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { updatePrice } from "./actions/index";
import { getPriceFromApi } from './helpers/Prices';
import { TradeContainer } from "./components/TradeContainer";
import { LiquidatedView } from "./components/LiquidatedView";
import { GithubLink } from './components/GithubLink'
import { PrivateRoute } from './components/PrivateRoute'
import { LoginView } from './components/LoginView'


import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux';


function App() {
  const liquidated = useSelector(state => state.liquidated);

  const dispatch = useDispatch();

  //const classes = useStyles();

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
      <h1>Trading Simulator With Login</h1>
      <Switch>
        <PrivateRoute exact path="/" component={TradeContainer} />
        <Route path="/liquidated" component={LiquidatedView} />
        <Route path="/login" component={LoginView} />
        <Redirect from="*" to="/" />
      </Switch>
      <GithubLink />
    </div>
  );
}

export default App;
