import React, { Component } from 'react';
import List from 'material-ui/List';
import { ListItem, ListItemText  } from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';

class RoomList extends Component {
    constructor(props) {
        super(props);

        this.roomsRef = this.props.firebase.database().ref('rooms');

        this.state = {
            rooms: [],
            activeRoom: ''
        };
    }

    componentDidMount() {
        let firstRun = false;

        this.roomsRef.on('child_added', snapshot => {
            const room = snapshot.val();
            room.key = snapshot.key;
            firstRun = true;

            this.setState({ rooms: this.state.rooms.concat(room) });
            
            if (firstRun) {
                this.setState({ activeRoom: this.state.rooms[0].key });
            }
        });
    }

    render() {
        return (
            <section className="roomList">
                <List 
                    className="roomList"
                    component="nav"
                    subheader={<ListSubheader component="div">Rooms</ListSubheader>}
                >
                    {
                        this.state.rooms.map((room, index) =>
                            <ListItem button key={index} onClick={() => this.props.updateRoom(room)}>
                                <ListItemText  primary={room.name} />
                            </ListItem>
                        )
                    }
                </List>
            </section>
        );
    }
}

export default RoomList;