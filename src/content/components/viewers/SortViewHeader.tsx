import React from "react";
import Grid from "@mui/material/Grid";
import SortButton from "./SortButton";

const SortViewHeader = () => {
  return (
    <React.Fragment>
      <Grid item={true} xs={1}></Grid>
      <Grid item={true} xs={3}>
        <span>Card</span>
        <SortButton category="card" />
      </Grid>
      <Grid item={true} xs={2}>
        <span>Deck </span>
        <SortButton category="deck" />
      </Grid>
      <Grid item={true} xs={1}>
        <span>/</span>
      </Grid>
      <Grid item={true} xs={2}>
        <span>Owned</span>
        <SortButton category="owned" />
      </Grid>
      <Grid item={true} xs={2}>
        prob <SortButton category="probability" />
      </Grid>
      <Grid item={true} xs={1}></Grid>
    </React.Fragment>
  );
};

export default SortViewHeader;
