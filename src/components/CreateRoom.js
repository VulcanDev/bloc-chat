import React, { Component } from "react";
import { findDOMNode } from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Popover from "material-ui/Popover";

export default class CreateRoom extends Component {
    constructor(props) {
        super(props);

        this.roomsRef = this.props.firebase.database().ref('rooms');

        this.state = {
            newRoomName: '',
            snackbarOpen: false,
            textError: false,
            helperText: '',
            open: false,
            anchorEl: null,
            anchorRef: 'anchorEl'
        };
    }

    selectElement() {
        if (!document.getElementById('newRoomTextField')) {
            window.requestAnimationFrame(this.selectElement);
        } else {
            document.getElementById('newRoomTextField').focus();
            document.getElementById('newRoomTextField').select();
        }
    }

    handleToggle(toToggle) {
        switch (toToggle) {
            case 'snackbar':
                this.setState({ snackbarOpen: !this.state.snackbarOpen });
                break;
            case 'this':
                this.setState({ 
                    open: !this.state.open,
                    anchorEl: findDOMNode(this.button)
                });
                this.selectElement();
                break;
            default:
                break;
        }
    }

    handleClose(toClose) {
        switch (toClose) {
            case 'snackbar':
                this.setState({ snackbarOpen: false });
                break;
            case 'this':
                this.setState({ open : false});
                break;
            default:
                break;
        }
    }

    handleChange(e) {
        this.setState({ newRoomName: e.target.value });
    }

    validateRoomName(roomName) {
        if (roomName !== '') {
            let isValid = true;

            this.roomsRef.on('child_added', snapshot => {
                if (snapshot.val().name === roomName) {
                    isValid = false;
                }
            });

            if (isValid) {
                return 1; // Valid name entered
            }else {
                return -2; // Error: Name already exists
            }
        }else {
            return -1; // Error: No name entered
        }
    }

    createRoom(e) {
        e.preventDefault();
        let validStatus = this.validateRoomName(this.state.newRoomName);

        if (validStatus === 1) {
            this.roomsRef.push({
                name: this.state.newRoomName
            });

            this.handleToggle('snackbar');

            this.setState({ newRoomName: '', textError: false, helperText: '' });
        } else if (validStatus === -1) {
            this.setState({ textError: true, helperText: 'Please enter a room name' });
        } else if (validStatus === -2) {
            this.setState({ textError: true, helperText: 'This room already exists!'});
        }
    }

    render() {
        return (
            <div className="add-room">
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    anchorReference={this.state.anchorRef}
                    onClose={() => this.handleClose('this')}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left'
                    }}
                >
                    <div className="form-wrap">
                        <form id="room-form" onSubmit={(e) => this.createRoom(e)}>
                            <TextField
                                id="newRoomTextField"
                                type="text"
                                label="Room Name"
                                value={this.state.newRoomName}
                                helperText={this.state.helperText}
                                error={this.state.textError}
                                onChange={(e) => this.handleChange(e)}
                            />
                            <Button type="submit" color="primary" variant="raised">
                                Create
                            </Button>
                        </form>
                    </div>
                </Popover>
                <Button color="primary" onClick={() => this.handleToggle('this')} ref={node => {this.button = node;}}>
                    Create Room
                </Button>
            </div>
        );
    }
}