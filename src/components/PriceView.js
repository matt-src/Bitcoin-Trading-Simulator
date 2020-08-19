import React from 'react';
import { shallowEqual, useSelector } from 'react-redux'

export const PriceView = () => {
    const price = useSelector(state => state.price);
    const change = useSelector(state => state.change);

    //const { price, change } = useSelector(state => state, shallowEqual);

    // Create our number formatter. TODO: move this to its own file to be DRY
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <h2>BTC {price ? formatter.format(price) : <p>-</p>} USD {change >= 0 ? <span style={{ color: 'limegreen' }}>▲</span> : <span style={{ color: 'red' }}>▼</span>}{formatter.format(change)}</h2>
    );
}
