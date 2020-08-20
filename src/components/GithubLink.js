import React from 'react'
import octologo from '../Octocat.png'
import { makeStyles } from '@material-ui/core/styles';

export const GithubLink = () => {
    const useStyles = makeStyles({
        githubRow: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    });

    const classes = useStyles();

    return (
        <a href="https://github.com/tofurocks/Bitcoin-Trading-Simulator">
            <div className={classes.githubRow}>
                <img src={octologo} alt="Logo" height="50px" />
                <h2> View Source On Github </h2>
                <img src={octologo} alt="Logo" height="50px" />
            </div>
        </a>
    );
}