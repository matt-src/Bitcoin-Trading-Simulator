import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars(props) {
  return (
      <div>
      <Snackbar open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
        <MuiAlert onClose={props.handleClose} severity="error" elevation={6} variant="filled">
        Can't have less than 0 shares!
        </MuiAlert>
      </Snackbar>
      </div>
  );
}