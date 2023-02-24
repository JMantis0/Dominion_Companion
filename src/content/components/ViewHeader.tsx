import React from "react";
import Grid from "@mui/material/Grid";



const SortViewHeader = () => {
  return (
    <React.Fragment>
      <Grid item={true} xs={1}></Grid>
      <Grid item={true} xs={3}>
        <span>Card</span>
      </Grid>
      <Grid item={true} xs={2}>
        <span>Deck </span>
      </Grid>
      <Grid item={true} xs={1}>
        <span>/</span>
      </Grid>
      <Grid item={true} xs={2}>
        <span>Owned</span>
      </Grid>
      <Grid item={true} xs={2}>
        prob
      </Grid>
      <Grid item={true} xs={1}></Grid>
    </React.Fragment>
  );
};

export default SortViewHeader;
