import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import List from 'material-ui/List';
import Card, { CardContent } from 'material-ui/Card';
export default class MessageList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageList: []
        };
    }

    updateMessagesList(props) {
        this.setState({ messageList: [] });
        let newMessageList = [];

        this.props.firebase.database().ref('rooms/' + props.activeRoom.key + '/messages').on('child_added', snapshot => {
            newMessageList.push(snapshot.val());
        });

        this.setState({ messageList: newMessageList });
    }

    beautifyTime(time){
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const givenDate = new Date(time);
        const currentDate = new Date();

        if ((currentDate.getTime() - givenDate.getTime()) < 60000) {
            return 'Less than a minute ago';
        }else if (currentDate.getDay() === givenDate.getDay()) {
            if (givenDate.getHours() > 12) {
                return `Today at ${givenDate.getHours()-12}:${givenDate.getMinutes()} PM`;
            }else {
                return `Today at ${givenDate.getHours()}:${givenDate.getMinutes()} AM`;
            }
        }else {
            if (givenDate.getHours() > 12) {
                return `${givenDate.getMonth} ${givenDate.getDate()} ${givenDate.getHours() - 12}:${givenDate.getMinutes()} PM`;
            }else {
                return `${months[givenDate.getMonth()]} ${givenDate.getDate()} ${givenDate.getHours()}:${givenDate.getMinutes()} AM`;
            }
        }
    }

    componentDidMount() {
        this.updateMessagesList(this.props);
    }

    componentDidUpdate() {
        const messageElements = document.getElementsByClassName('card');
        if (messageElements.length > 0) {
            messageElements[this.state.messageList.length - 1].scrollIntoView();
        }
    }
    
    componentWillReceiveProps(newProps){
        this.updateMessagesList(newProps);
    }

    render() {
        return (
            <section className="message-container">
                <div>
                    <Typography className="room-title" variant="title">{this.props.activeRoom.name}</Typography>
                </div>
                <List id="message-list">
                    {
                        this.state.messageList.length > 0 ? 
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
                        )
                        :
                        <Typography id="no-messages-text">There are no messages in this room</Typography>
                    }
                </List>
            </section>
        );
    }
}