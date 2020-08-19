import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export const BalanceView = () => {
    const { balance, price, entry, shares } = useSelector(state => state, shallowEqual);

    return (
        <h2>Balance: {formatter.format(balance)} USD ({formatter.format(balance + (parseFloat(price) - entry) * shares)})</h2>
    );
}
