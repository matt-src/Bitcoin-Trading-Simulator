import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { StylesProvider, makeStyles } from '@material-ui/core/styles';

export const PositionView = () => {
  const { shares, price, entry, realized } = useSelector(state => state, shallowEqual);

  const useStyles = makeStyles({
    table: {
      maxWidth: '800px',
      margin: "auto"
    }
  });

  const classes = useStyles();

  // Create our number formatter. TODO: move this to its own file to be DRY
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <TableContainer component={Paper}>
      <StylesProvider injectFirst>
        <Table className={classes.table} aria-label="caption table">
          <caption>Position information</caption>
          <TableHead>
            <TableRow >
              <TableCell >Position size</TableCell>
              <TableCell align="right">Position value</TableCell>
              <TableCell align="right">Entry Price</TableCell>
              <TableCell align="right">P/L unrealized</TableCell>
              <TableCell align="right">P/L realized</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th">{shares} BTC</TableCell>
              <TableCell align="right">{price ? (formatter.format(parseFloat(price) * shares)) : <p>-</p>}</TableCell>
              <TableCell align="right">{formatter.format(entry)}</TableCell>
              <TableCell align="right">{formatter.format((parseFloat(price) - entry) * shares)}</TableCell>
              <TableCell align="right">{formatter.format(realized)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </StylesProvider>
    </TableContainer>
  );
}