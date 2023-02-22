import React, { FunctionComponent } from "react";
import Grid from "@mui/material/Grid";

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
      <Grid xs={6}>
        <span> {cardName} </span>
      </Grid>
      <Grid xs={2}>
        <span> {libraryAmount} </span> <span>/</span>
      </Grid>
      <Grid xs={2}>
        <span> {cardAmount} </span>
      </Grid>
      <Grid xs={2}>
        <span> {drawProbability} </span>
      </Grid>
    </React.Fragment>
  );
};

export default FullListCardRow;
