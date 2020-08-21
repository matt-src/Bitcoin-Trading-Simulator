import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { render } from '@testing-library/react';
import bitcoin from '../bitcoin.png'
import ethereum from '../ethereum.png'
import litecoin from '../litecoin.png'
import {selectCoin} from '../actions/index.js'
import { useSelector, useDispatch } from 'react-redux'

export const CoinSelector = () => {
    const selectedCoin = useSelector(state => state.selectedCoin);
    const dispatch = useDispatch();

    const handleCoinSelect = (event, newSelectedCoin) => {
        if(newSelectedCoin == null) return;
        console.log('newSelectedCoin ' + newSelectedCoin)
        dispatch(selectCoin(newSelectedCoin));
    };

    return (
            <ToggleButtonGroup
                value={selectedCoin}
                exclusive
                onChange={handleCoinSelect}
                aria-label="select coin"
            >
                <ToggleButton value="btc" aria-label="btc">
                    <img src={bitcoin} height="100px"></img>
                </ToggleButton>
                <ToggleButton value="eth" aria-label="eth">
                    <img src={ethereum} height="100px"></img>
                </ToggleButton>
                <ToggleButton value="ltc" aria-label="ltc">
                    <img src={litecoin} height="100px"></img>
                </ToggleButton>
            </ToggleButtonGroup>
    );
}