import React from "react";

import {
  AppBarStyle,
  ToolbarTitleStyle,
  ToolbarStyle,
  LinkStyle,
} from "./styles";

export const AppBar = () => {
  return (
    <AppBarStyle position="static" color="default" elevation={0}>
      <ToolbarStyle>
        <ToolbarTitleStyle variant="h6" color="inherit" noWrap>
          From the Ashes Map
        </ToolbarTitleStyle>

        <nav>
          <LinkStyle variant="button" color="textPrimary" href="#">
            TBD.
          </LinkStyle>

          <LinkStyle variant="button" color="textPrimary" href="#">
            TBD.
          </LinkStyle>

          <LinkStyle variant="button" color="textPrimary" href="#">
            TBD.
          </LinkStyle>
        </nav>
      </ToolbarStyle>
    </AppBarStyle>
  );
};

export default AppBar;
