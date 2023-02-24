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
      <Grid item={true} xs={1}></Grid>
      <Grid item={true} xs={3}>
        {cardName}
      </Grid>
      <Grid item={true} xs={2}>
        {libraryAmount}
      </Grid>
      <Grid item={true} xs={1}>
        /
      </Grid>
      <Grid item={true} xs={2}>
        {cardAmount}
      </Grid>
      <Grid item={true} xs={2}>
        {drawProbability}
      </Grid>
      <Grid item={true} xs={1}></Grid>
    </React.Fragment>
  );
};

export default FullListCardRow;
