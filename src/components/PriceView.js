import React from 'react';
import { shallowEqual, useSelector } from 'react-redux'

export const PriceView = () => {
    const { price, change } = useSelector(state => state, shallowEqual);

    return (
        <h2>BTC {price ? formatter.format(price) : <p>-</p>} USD {change >= 0 ? <span style={{ color: 'limegreen' }}>▲</span> : <span style={{ color: 'red' }}>▼</span>}{formatter.format(change)}</h2>
    );
}
