import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import {executeTrade} from '../actions/index'
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { StylesProvider, makeStyles } from '@material-ui/core/styles';

export const TradeWidget = () => {
    const [amount, setAmount] = useState(1);
    const dispatch = useDispatch();

    const useStyles = makeStyles({
        amountLabel: {
          paddingLeft: '10px',
          paddingRight: '10px',
          fontFamily: 'Roboto',
          fontWeight: 'bold',
          fontSize: '1.3em'
        }
      });

    const classes = useStyles();

    const handleAmountChange = (e) => {
        let newAmount = e.target.value;
        if(newAmount > 9999) newAmount = 9999;
        setAmount(e.target.value);
    };

    const buyShares = () => {
        dispatch(executeTrade(amount));
    };

    const sellShares = () => {
        dispatch(executeTrade(amount * -1));
    };

    return (
        <p>
            <Button variant="contained" color="primary" onClick={buyShares}>Buy</Button>
            <Button variant="contained" color="secondary" onClick={sellShares}>Sell</Button>
            <label htmlFor="amount" className={classes.amountLabel}>Amount</label>
            <Input
                id="amount"
                name="amount"
                type="number"
                inputProps={{ min: 1, max: 9999, style: { textAlign: 'center', fontSize: '1.3em' } }}
                value={amount}
                onChange={handleAmountChange}
            />
        </p>
    );
}

