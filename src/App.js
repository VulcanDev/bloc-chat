import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './components/RoomList';
import CreateRoom from './components/CreateRoom';
import MessageList from './components/MessageList';
import User from './components/User';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import { AppBar, Toolbar, Typography, 
         Drawer, Button, Popover, 
         Modal, Divider
} from 'material-ui';
import { Fade } from 'material-ui/transitions';

// Firebase
var config = {
  apiKey: "AIzaSyCUmGapTuVLBjfH6JTafwXLs4zzbXOhunA",
  authDomain: "bloc-chat-db.firebaseapp.com",
  databaseURL: "https://bloc-chat-db.firebaseio.com",
  projectId: "bloc-chat-db",
  storageBucket: "bloc-chat-db.appspot.com",
  messagingSenderId: "747645395109"
};

firebase.initializeApp(config);

// Theme
const muiTheme = createMuiTheme({
  palette: {
    primary: {main: '#3949ab'},
    secondary: {main: '#3f51b5'}
  },
  typography: {
    title: {
      color: '#ffffff'
    }
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeRoom: {key: null},
      signedIn: false,
      user: {},
      userOptOpen: false,
      signOutPopupOpen: false,
      sureToSignOut: false,
      usernameWidth: 96
    };
  }

  componentDidMount() {
    firebase.database().ref('rooms').once('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ activeRoom: room });
    }); // Default room is the first room in the database
  }

  /**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
  getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }


  signIn(authResults) {
    authResults = authResults || {user: {displayName: 'Guest'}};

    this.setState({ signedIn: true, user: authResults.user});
    this.setState({ usernameWidth: Math.floor(this.getTextWidth(authResults.user.displayName, '16pt roboto')) + 1 });
  }

  handlePopupClose() {
    this.setState({ signOutPopupOpen: false });
  }

  render() {
    return (
      <MuiThemeProvider theme={muiTheme}>
      {this.state.signedIn ? 
          <Fade in={true} timeout={
            {
              enter: 1000,
              exit: 1000
            }
          }>
          <div className="App">
            <Modal
              open={this.state.signOutPopupOpen}
              onClose={() => this.handlePopupClose()}
            >
              <div className="sign-out-popup">
                <Typography className="sop-title" variant="title">Sign Out</Typography>
                <Typography className="sop-prompt" variant="subheading">Are you sure you want to sign out?</Typography>
                <div className="sop-buttons">
                <Divider className="divider"/>
                  <Button className="cancel-sign-out" onClick={() => this.handlePopupClose()}>Cancel</Button>
                    <Button
                      className="sign-out"
                      onClick={() => {
                        firebase.auth().signOut();
                        this.setState({ signedIn: false, signOutPopupOpen: false });
                      }}
                    >Sign Out</Button>
                </div>
              </div>
            </Modal>
            <AppBar position="absolute" className='main-app-bar'>
              <Toolbar className='toolbar'>
                <Typography className="app-title" variant="title" color="inherit" noWrap>
                  Bloc Chat
                </Typography>
                <div className="sign-out-container">
                  <Button 
                    id="user-options-button"
                    style={{ minWidth: 96, width: this.state.usernameWidth}}
                    onClick={() => this.setState({ userOptOpen: !this.state.userOptOpen})}
                  >{this.state.user.displayName}</Button>
                </div>
              </Toolbar>
            </AppBar>
            <Popover
              className="user-options"
              open={this.state.userOptOpen}
              marginThreshold={0}
              onClose={() => this.setState({ userOptOpen: false })}
              anchorReference='anchorEl'
              anchorEl={document.getElementById('user-options-button')}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <Button 
                id="sign-out-button"
                style={{ 'minWidth': 96, width: this.state.usernameWidth}}
                onClick={() => this.setState({ signOutPopupOpen: true, userOptOpen: false  })}
              >Sign Out</Button>
            </Popover>
            <main className="Main-container">
              <MessageList firebase={firebase} activeRoom={this.state.activeRoom} />
            </main>
            <Drawer variant="permanent" className="drawer">
              <RoomList firebase={firebase} updateRoom={(room) => this.setState({ activeRoom: room })}/>
              <CreateRoom firebase={ firebase }/>
            </Drawer>
          </div>
          </Fade>
        :
        <span style={{display: 'none'}}></span>
      }
        <User 
          firebase={firebase} 
          thestyle={{display: this.state.signedIn ? 'none' : 'block'}} 
          signIn={(authResults) => this.signIn(authResults)}
        />
      </MuiThemeProvider>
    );
  }
}

export default App;