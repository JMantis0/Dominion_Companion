import React, { FunctionComponent } from "react";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Item";

type CardRowProps = {
  cardAmount: number;
  libraryAmount: number;
  drawProbability: string;
  cardName: string;
};

const FullListCardRow: FunctionComponent<CardRowProps> = ({
  cardAmount,
  libraryAmount,
  drawProbability,
  cardName,
}) => {
  return (
    <React.Fragment>
      <Grid xs={1}></Grid>
      <Grid xs={4}>
        <Item> {cardName} </Item>
      </Grid>
      <Grid xs={2}>
        <Item> {libraryAmount} </Item> <Item>/</Item>
      </Grid>
      <Grid xs={2}>
        <Item> {cardAmount} </Item>
      </Grid>
      <Grid xs={2}>
        <Item> {drawProbability} </Item>
      </Grid>
      <Grid xs={1}></Grid>
    </React.Fragment>
  );
};

export default FullListCardRow;
