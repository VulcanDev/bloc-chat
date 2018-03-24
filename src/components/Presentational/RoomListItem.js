import React, { Component } from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';

export default class RoomListItem extends Component {
    render() {
        return (
            <ListItem button>
                <ListItemText primary={this.props.name}/>
            </ListItem>
        );
    }
}