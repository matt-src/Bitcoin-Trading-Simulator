import React from 'react';
import { PositionView } from './PositionView';
import { TradeWidget } from './TradeWidget';
import { ErrorSnackbar } from './ErrorSnackbar.js';
import { BalanceView } from './BalanceView.js';
import { PriceView } from './PriceView.js';

export const TradeContainer = () => {
    return (
        <div>
            <BalanceView />
            <PriceView />
            <TradeWidget />
            <ErrorSnackbar />
            <PositionView />
        </div>
    )
}