import Grid from "@mui/material/Grid";
import Item from "@mui/material/Item";
import React, { FunctionComponent } from "react";
import ExpandMoreSharpIcon from "@mui/icons-material/ExpandMoreSharp";
import ExpandLessSharpIcon from "@mui/icons-material/ExpandLessSharp";

type ViewHeaderProps = {
  sortState: {
    ascending: boolean;
  };
};
const SortViewHeader: FunctionComponent<ViewHeaderProps> = () => {
  return (
    <React.Fragment>
      <Grid xs={1}></Grid>
      <Grid xs={4}>
        <Item>Card</Item>
      </Grid>
      <Grid xs={2}>
        <Item># in Deck </Item> <Item>/</Item>
      </Grid>
      <Grid xs={2}>
        <Item> # owned </Item>
      </Grid>
      <Grid xs={2}>
        <Item> {ExpandMoreSharpIcon} </Item>
      </Grid>
      <Grid xs={1}></Grid>
    </React.Fragment>
  );
};

export default SortViewHeader;
