import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class LoginDialog extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            'userNameText': "",
            'passwordText': ""
        }

        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.submitLogin = this.submitLogin.bind(this)
    }

    onChangeUsername(event){
        this.setState({'userNameText': event.target.value})
    }

    onChangePassword(event){
        this.setState({'passwordText': event.target.value})
    }

    submitLogin(){
        this.props.login(
            this.state['userNameText'],
            this.state['passwordText']
        )
    }

    render(){
        const isOpen = this.props.isOpen

        return (
            <div>
            <Dialog open={isOpen} onClose={this.props.close}>
            <DialogTitle>Log In</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter your username and password.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="User Name"
                    fullWidth
                    variant="standard"
                    onChange={this.onChangeUsername}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Password"
                    fullWidth
                    variant="standard"
                    onChange={this.onChangePassword}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={this.submitLogin}>Submit</Button>
                <Button onClick={this.props.close}>Cancel</Button>
            </DialogActions>
            </Dialog>
            </div>
        )
    }
    
}