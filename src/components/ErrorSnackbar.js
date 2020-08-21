import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { closeSnackbar } from '../actions/index'
import { useSelector, useDispatch } from 'react-redux'

export const ErrorSnackbar = () => {
    const open = useSelector(state => state.showSnackbar);
    const dispatch = useDispatch();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(closeSnackbar());
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity="error" elevation={6} variant="filled">
                    Can't have less than 0 BTC!
                </MuiAlert>
            </Snackbar>
        </div>
    );
}