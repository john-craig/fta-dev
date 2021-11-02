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
          Vouchers
        </ToolbarTitleStyle>

        <nav>
          <LinkStyle variant="button" color="textPrimary" href="#">
            Features
          </LinkStyle>

          <LinkStyle variant="button" color="textPrimary" href="#">
            Enterprise
          </LinkStyle>

          <LinkStyle variant="button" color="textPrimary" href="#">
            Support
          </LinkStyle>
        </nav>
      </ToolbarStyle>
    </AppBarStyle>
  );
};

export default AppBar;
