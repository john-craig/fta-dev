import React, { StrictMode } from "react";
import { render } from "react-dom";
import styled, { ThemeProvider } from "styled-components";
import { setGlobal } from "reactn";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Router, Redirect, Route, Switch } from "wouter";

import AppBar from "./components/AppBar";
import { defaultGlobalState } from "./services/constants";
import Map from "./screens/Map";

/**
 *  Base theme - material UI
 */
const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#fff",
      main: "#fff",
      dark: "#121212",
      contrastText: "#fff",
    },
  },
});

// Setting default global state
setGlobal(defaultGlobalState);

/**
 * App base - Routing and css theme
 */
const Main = () => {
  return (
    <StrictMode>
      <CssBaseline />

      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <AppBar />

          <Router>
            <Switch>
              <Route path="/" component={Map} />
              <Route path="/:rest*" component={() => <Redirect to={`/`} />} />
            </Switch>
          </Router>
        </ThemeProvider>
      </MuiThemeProvider>
    </StrictMode>
  );
};

render(<Main />, document.getElementById("root"));
