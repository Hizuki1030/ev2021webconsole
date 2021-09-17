import React, { useEffect, useState } from 'react';
import Rowma from 'rowma_js';
import { Button,CircularProgress } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import './DataCard.css';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import graph from './circuitGraph';
import { makeStyles, withStyles } from '@material-ui/core/styles';

let MaterColor ="#0000ff"
// Inspired by the former Facebook spinners.
const useStylesFacebook = makeStyles((theme) => ({

  root: {
    position: 'relative',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    margin:"1%"
  },
  top: {
    color: MaterColor,
    animationDuration: '550ms',
    position: 'absolute',
    top:"13%",
    left:"4%",
    margin:"1%"
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

function FacebookCircularProgress(props) {

  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={39}
        thickness={4}
        {...props}
      />
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});
const App = (props) =>{
  const value = (100/(props.max_value - props.min_value))*(props.value-props.min_value)
  MaterColor = props.MaterColor
  console.log(MaterColor)
  return(
    <Card className="card">
      <a className="title">{props.name}</a>
      <FacebookCircularProgress size ="70%" variant="determinate" value={value}/>
      <a className="circuitIndeterminate">{props.value}{props.unit}</a>
    </Card>
  );
}

export default App;