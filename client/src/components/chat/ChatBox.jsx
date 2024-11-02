import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import {Form, Stack} from "react-bootstrap"
import InputEmoji from "react-input-emoji";
import moment from "moment"

const ChatBox = () => {
    const {user} = useContext(AuthContext);
    const {currentChat, messages, isMessagesLoading, sendTextMessage} = useContext(ChatContext);
    const {recipientUser} = useFetchRecipientUser(currentChat, user)
    const [textMessage, setTextMessage] = useState("");    
    const scroll = useRef();

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"})
    },[messages]);

    if(isMessagesLoading) return(
        <p style={{textAlign:"center", width:"100%"}}>Loading messages...</p>
    )

    if(!recipientUser) return(
        <p style={{textAlign:"center", width:"100%"}}>No conversation selected yet!!</p>
    ) 
    
    return (
    <Stack gap={4} className="chat-box">
        <div className="chat-header">
            <strong>{recipientUser?.name}</strong>
        </div>
        
        <Stack gap={3} className="messages">
            
            {messages && messages.map((message, index) => (
                <Stack key={index} ref={scroll} className={`${message?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
                    <span>{message.text}</span>
                    <span className="message-footer">{moment(message.createdAt).calendar()}</span>
                </Stack>
            ))}
        </Stack>
        <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
            <InputEmoji value={textMessage} onChange={setTextMessage} fontFamily="nunito" borderColor="rgba(72,112,223,0.2)"/>
            <button className="send-btn" onClick={() => sendTextMessage(textMessage, user, currentChat._id, setTextMessage)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
            </button>
        </Stack>
    </Stack>
    );
}
 
export default ChatBox;