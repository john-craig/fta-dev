import React from "react";

import {
  AppBarStyle,
  ToolbarTitleStyle,
  ToolbarStyle,
  LinkStyle,
} from "./styles";

export const AppBar = (props) => {
  const userId = props.userId

  return (
    <AppBarStyle position="static" color="default" elevation={0}>
      <ToolbarStyle>
        <ToolbarTitleStyle variant="h6" color="inherit" noWrap>
          From the Ashes Map
        </ToolbarTitleStyle>

        <nav>
          { userId ? 
            (
              <LinkStyle variant="button" color="textPrimary" onClick={props.logout}>
                Log Out
              </LinkStyle>
            ) : (
              <div>
              <LinkStyle variant="button" color="textPrimary" onClick={props.openLogin}>
                Log In
              </LinkStyle>

              <LinkStyle variant="button" color="textPrimary" onClick={props.openSignup}>
                Sign Up
              </LinkStyle>
              </div>
            )
          }
        </nav>
      </ToolbarStyle>
    </AppBarStyle>
  );
};

export default AppBar;
