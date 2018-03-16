import React, { Component } from 'react';
import * as firebase from 'firebase';
import './App.css';
import RoomList from './components/RoomList';

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

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1> Bloc Chat </h1>
        </header>
        <RoomList firebase={ firebase }/>
      </div>
    );
  }
}

export default App;
