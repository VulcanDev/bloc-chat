import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './components/RoomList';
import CreateRoom from './components/CreateRoom';
import MessageList from './components/MessageList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Drawer from 'material-ui/Drawer';

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
      activeRoom: {key: null}
    };
  }

  componentDidMount() {
    firebase.database().ref('rooms').once('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ activeRoom: room });
    }); // Default room is the first room in the database
    
  }

  render() {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <div className="App">
          <AppBar position="absolute" className='main-app-bar'>
            <Toolbar>
              <Typography variant="title" color="inherit" noWrap>
                Bloc Chat
              </Typography>
            </Toolbar>
          </AppBar>
          <main className="Main-container">
            <MessageList firebase={firebase} activeRoom={this.state.activeRoom} />
          </main>
          <Drawer variant="permanent" className="drawer">
            <RoomList firebase={firebase} updateRoom={(room) => this.setState({ activeRoom: room })}/>
            <CreateRoom firebase={ firebase }/>
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;