import './App.css';
import {ErrorSnackbar} from './components/ErrorSnackbar.js';
import {BalanceView} from './components/BalanceView.js';
import {PriceView} from './components/PriceView.js';
import store from "./store/index";
import { updatePrice } from "./actions/index";
import { getPriceFromApi } from './helpers/Prices';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PositionView } from './components/PositionView';
import { TradeWidget } from './components/TradeWidget';
import { useDispatch } from 'react-redux'

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
      <h1>Rekt Simulator</h1>
      <BalanceView />
      <PriceView />
      <TradeWidget />
      <ErrorSnackbar handleClose={handleSnackbarClose} open={state.showSnackbar} />
      <PositionView />
    </div>
  );
}

export default App;
