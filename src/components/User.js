import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import PersonOutline from 'material-ui-icons/PersonOutline';
import VpnKey from 'material-ui-icons/VpnKey';

export default class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toggle: false,
            cursor: ' '
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ toggle: !this.state.toggle });

            if (this.state.toggle) {
                this.setState({ cursor: '|'} );
            } else {
                this.setState({ cursor: '' });
            }
        }, 500);
    }

    signIn() {
        const provider = new this.props.firebase.auth.GoogleAuthProvider();

        this.props.firebase.auth().signInWithPopup( provider ).then((result) => {
            this.props.signIn(result);
        }).catch((err) =>{
            console.log(err.message);
        });
    }

    render() {
        return(
            <div className="user-screen" style={this.props.thestyle}>
                <div className="user">
                    <div className="title-container">
                        <Typography className="title" variant="title">Welcome to Bloc Chat</Typography>
                        <Typography className="title-cursor" variant="title">{this.state.cursor}</Typography>
                    </div>
                    <Button className="sign-in-button" onClick={() =>  this.signIn() }><VpnKey className="icon" /> Sign In</Button>
                    <Button className="sign-in-button" onClick={() => this.props.signIn()}><PersonOutline className="icon" /> Guest</Button>
                </div>
            </div>
        );
    }
}