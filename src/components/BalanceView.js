import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export const BalanceView = () => {
    const balance = useSelector(state => state.balance);
    const price = useSelector(state => state.price);
    const entry = useSelector(state => state.entry);
    const shares = useSelector(state => state.shares);
    //const { balance, price, entry, shares } = useSelector(state => state, shallowEqual);

    // Create our number formatter. TODO: move this to its own file to be DRY
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <h2>Balance: {formatter.format(balance)} USD ({formatter.format(balance + (parseFloat(price) - entry) * shares)})</h2>
    );
}
