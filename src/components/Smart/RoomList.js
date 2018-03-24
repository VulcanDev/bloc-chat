import React, { Component } from 'react';
import RoomListItem from '../Presentational/RoomListItem';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';

class RoomList extends Component {
    constructor(props) {
        super(props);

        this.roomsRef = this.props.firebase.database().ref('rooms');

        this.state = {
            rooms: [],
            newRoomName: '',
            roomListOpen: false,
            snackbarOpen: false,
            textError: false,
            helperText: ''
        };
    }

    componentDidMount() {
        this.roomsRef.on('child_added', snapshot => {
            const room = snapshot.val();
            room.key = snapshot.key;

            this.setState({ rooms: this.state.rooms.concat(room) });
        });
    }

    handleToggle(toToggle) {
        switch (toToggle) {
            case 'roomList':
                this.setState({ roomListOpen: !this.state.roomListOpen });
                break;
            case 'snackbar':
                this.setState({ snackbarOpen: !this.state.snackbarOpen });
                break;
        
            default:
                break;
        }
    }

    handleClose(toClose) {
        switch (toClose) {
            case 'roomList':
                this.setState({ roomListOpen: false });
                break;
            case 'snackbar':
                this.setState({ snackbarOpen: false });
                break;
        
            default:
                break;
        }
    }

    handleChange(e){
        this.setState( {newRoomName: e.target.value});
    }

    createRoom(e) {
        e.preventDefault();

        if (this.state.newRoomName !== '') {
            this.roomsRef.push({
                name: this.state.newRoomName
            });

            this.handleToggle('snackbar');

            /*document.getElementById("addRoomForm").reset();*/
            this.setState({newRoomName: '',textError: false, helperText: ''});
        } else {
            this.setState({ textError: true, helperText: 'Please enter a room name' });
        }
    }

    render() {
        return (
            <section className="roomList">
                <Button color="primary" variant="raised" onClick={() => this.handleToggle('roomList')}>
                    Room List
                </Button>
                <Drawer open={this.state.roomListOpen} onClose={() => this.handleClose('roomList')}>
                    <List 
                        className="roomList"
                        component="nav"
                        subheader={<ListSubheader component="div">Rooms</ListSubheader>}
                    >
                        {
                            this.state.rooms.map((room, index) =>
                                <RoomListItem key={index} name={room.name} />
                            )
                        }
                    </List>
                </Drawer>
                <form id="addRoomForm" onSubmit={ (e) => this.createRoom(e)}>
                    <h3>New Room</h3>
                    <TextField
                        id="newRoomTextField"
                        type="text"
                        label="Room Name"
                        value={this.state.newRoomName}
                        helperText={this.state.helperText}
                        error={this.state.textError}
                        onChange={ (e) => this.handleChange(e)}
                    />
                    <div className="button">
                        <Button type="submit" color="primary" variant="raised">
                            Add Room
                        </Button>
                       <Snackbar
                            open={this.state.snackbarOpen}
                            action={<Button color="secondary" onClick={() => this.handleClose('snackbar')}>Dismiss</Button>}
                            message="Room created"
                            autoHideDuration={4000}
                            onClose={() => this.handleClose('snackbar')}
                       />
                    </div>
                </form>
            </section>
        );
    }
}

export default RoomList;