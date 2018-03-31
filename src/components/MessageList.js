import React, { Component } from 'react';
import SendMessage from './SendMessage';
import Typography from 'material-ui/Typography';
import List from 'material-ui/List';
import Card, { CardContent } from 'material-ui/Card';

export default class MessageList extends Component {
    constructor(props) {
        super(props);

        this.messagesRef = this.props.firebase.database().ref(`messages/${this.props.activeRoom.key}`);

        this.state = {
            messageList: []
        };
    }

    beautifyTime(time){
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const givenDate = new Date(time);
        const currentDate = new Date();

        const formatMinutes = (minutes) => minutes < 10 ? `0${minutes}` : minutes;

        if ((currentDate.getTime() - givenDate.getTime()) < 60000) {
            return 'Less than a minute ago';
        }else if (currentDate.getDay() === givenDate.getDay()) {
            if (givenDate.getHours() > 12) {
                return `Today at ${givenDate.getHours() - 12}:${formatMinutes(givenDate.getMinutes())} PM`;
            }else {
                return `Today at ${givenDate.getHours()}:${formatMinutes(givenDate.getMinutes())} AM`;
            }
        }else {
            if (givenDate.getHours() > 12) {
                return `${givenDate.getMonth} ${givenDate.getDate()} ${givenDate.getHours() - 12}:${formatMinutes(givenDate.getMinutes())} PM`;
            }else {
                return `${months[givenDate.getMonth()]} ${givenDate.getDate()} ${givenDate.getHours()}:${formatMinutes(givenDate.getMinutes())} AM`;
            }
        }
    }

    updateMessageList(newProps) {
        this.setState({ messageList: [] });

        let newMessageList = [];

        this.messagesRef = this.props.firebase.database().ref(`messages/${newProps.activeRoom.key}`);

        this.messagesRef.on('child_added', snapshot => {
            const message = snapshot.val();

            if (message.roomId === newProps.activeRoom.key){
                newMessageList.push(message);
                this.setState({ messageList: newMessageList });
            }
        });
    }

    componentDidMount() {
        this.updateMessageList(this.props);
    }

    componentDidUpdate() {
        const messageElements = document.getElementsByClassName('card');

        if (messageElements.length > 0) {
            messageElements[this.state.messageList.length - 1].scrollIntoView();
        }
    }
    
    componentWillReceiveProps(nextProps){
        this.updateMessageList(nextProps);
    }
    
    render() {
        return (
            <section className="message-container">
                <div>
                    <Typography className="room-title" variant="title">{this.props.activeRoom.name}</Typography>
                </div>
                <List id="message-list">
                    {this.state.messageList.length > 0 ?
                        <div></div>
                        :
                        <Typography id="no-messages-text">There are no messages in this room</Typography>
                    }
                    {
                        this.state.messageList.map((message, index) => 
                            <Card key={index} className="card">
                                <CardContent className="message">
                                    <div className="message-left">
                                        <Typography className="message-username">{message.username}</Typography>
                                        <Typography className="message-content" component="p">{message.content}</Typography>
                                    </div>
                                    <div className="message-right">
                                        <Typography className="message-timestamp">{this.beautifyTime(message.sentAt)}</Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </List>
                <SendMessage firebase={this.props.firebase} activeRoom={this.props.activeRoom} user={this.props.user}/>
            </section>
        );
    }
}