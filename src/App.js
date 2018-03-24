import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './components/Smart/RoomList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createMuiTheme } from 'material-ui/styles';

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
    secondary: {main: '#3f51b5'},
    background: {
      paper: '#212121',
      default: '#212121'
    }
  },
  typography: {
    title: {
      color: '#ffffff'
    }
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <header className="App-header">
            <h1> Bloc Chat </h1>
          </header>
          <RoomList firebase={ firebase }/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
