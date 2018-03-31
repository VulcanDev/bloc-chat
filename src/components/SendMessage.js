import React, { Component } from 'react';
import Button from 'material-ui/Button';

export default class SendMessage extends Component {
    constructor(props) {
        super(props);

        this.messagesRef = this.props.firebase.database().ref(`messages/${this.props.activeRoom.key}`);

        this.state = {
            message: '',
            placeholder: `Message ${this.props.activeRoom.name}`
        };
    }

    sendMessage(e) {
        e.preventDefault();

        if (this.state.message === '') {
            this.setState({ placeholder: `${this.props.activeRoom.name} | Blank messages are not allowed` });
        }else {
            this.setState({ placeholder: `Message ${this.props.activeRoom.name}` });

            this.messagesRef.push({
                username: this.props.user.displayName,
                user_uid: this.props.user.uid,
                content: this.state.message,
                sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
                roomId: this.props.activeRoom.key
            });
        }

        this.setState({ message: '' });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ placeholder: `Message ${nextProps.activeRoom.name}` });
        this.messagesRef = nextProps.firebase.database().ref(`messages/${nextProps.activeRoom.key}`);
    }

    render() {
        return(
            <div className="chat-bar-container">
                <form id="message-form" onSubmit={(e) => this.sendMessage(e)}>
                    <input 
                        type="text" 
                        value={this.state.message} 
                        placeholder={this.state.placeholder} 
                        onChange={(e) => this.setState({ message: e.target.value})} 
                    />
                    <Button type="submit" variant="raised" color="secondary">
                        Send
                    </Button>
                </form>
            </div>
        );
    }
}