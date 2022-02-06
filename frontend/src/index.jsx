import React, { StrictMode } from "react";
import { render } from "react-dom";
import styled, { ThemeProvider } from "styled-components";
import { setGlobal } from "reactn";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Router, Redirect, Route, Switch } from "wouter";
import 'regenerator-runtime/runtime'
import { defaultGlobalState } from "./services/constants";


import AppBar from "./components/AppBar";
import LoginDialog from "./components/LoginDialog";
import SignupDialog from "./components/SignupDialog";
import Map from "./screens/Map";

import { generate } from 'password-hash'

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
class Main extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      userId: undefined,
      showLogin: false,
      showSignup: false
    }

    this.loginUser = this.loginUser.bind(this)
    this.logoutUser = this.logoutUser.bind(this)
    this.signupUser = this.signupUser.bind(this)

    this.openLoginDialog = this.openLoginDialog.bind(this)
    this.openSignupDialog = this.openSignupDialog.bind(this)
    this.closeLoginDialog = this.closeLoginDialog.bind(this)
    this.closeSignupDialog = this.closeSignupDialog.bind(this)
  }

  async componentDidMount(){
    const userId = localStorage.getItem('userId')

    if(userId != null){
      this.setState({
        userId: userId
      })
    }
  }

  async signupUser(userName, userPass){
    const passwordHash = generate(userPass)

    console.log(userName)
    console.log(passwordHash)

    const userId = "test"

    localStorage.setItem('userId', userId)

    this.setState({
      userId: userId,
      showSignup: false
    })
    
  }

  async loginUser(userName, userPass){
    const passwordHash = generate(userPass)

    console.log(userName)
    console.log(passwordHash)

    const userId = "test"

    localStorage.setItem('userId', userId)

    this.setState({
      userId: userId,
      showLogin: false
    })
  }

  async logoutUser(){
    localStorage.setItem('userId', null)

    this.setState({
      userId: undefined
    })
  }

  /* UI */
  async openSignupDialog(){
    this.setState({
      showLogin: true
    })
  }

  async openLoginDialog(){
    this.setState({
      showLogin: true
    })
  }

  async closeSignupDialog(){
    this.setState({
      showLogin: false
    })
  }

  async closeLoginDialog(){
    this.setState({
      showLogin: false
    })
  }


  render(){
    const userId = this.state.userId
    const showLogin = this.state.showLogin
    const showSignup = this.state.showSignup 

    return (
      <StrictMode>
        <CssBaseline />
  
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <AppBar 
              userId={userId}
              openLogin={this.openLoginDialog}
              openSignup={this.openSignupDialog}
              logout={this.logoutUser}
            />

            <LoginDialog
              isOpen={showLogin}
              login={this.loginUser}
              close={this.closeLoginDialog}
            />

            <SignupDialog
              isOpen={showSignup}
              login={this.signupUser}
              close={this.closeSignupDialog}
            />
  
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
  }
  
};

render(<Main />, document.getElementById("root"));
