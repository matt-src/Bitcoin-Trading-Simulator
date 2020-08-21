import {
    PRICE_UPDATE,
    SNACKBAR_CLOSE,
    SNACKBAR_OPEN,
    TRADE_EXECUTE,
    AMOUNT_CHANGE,
    SELECT_COIN
} from "../constants/action-types";

export function updatePrice(payload) {
    return { type: PRICE_UPDATE, payload }
};

export function closeSnackbar() {
    return { type: SNACKBAR_CLOSE }
};

export function openSnackbar() {
    return { type: SNACKBAR_OPEN }
};

export function executeTrade(payload) {
    return { type: TRADE_EXECUTE, payload }
};

export function changeAmount(payload) {
    return { type: AMOUNT_CHANGE, payload }
};

export function selectCoin(payload) {
    return { type: SELECT_COIN, payload }
};