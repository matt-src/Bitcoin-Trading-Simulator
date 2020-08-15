import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export default function CustomizedSnackbars(props) {
    return (
        <div>
            <Snackbar open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
                <MuiAlert onClose={props.handleClose} severity="error" elevation={6} variant="filled">
                    Can't have less than 0 BTC!
                </MuiAlert>
            </Snackbar>
        </div>
    );
}