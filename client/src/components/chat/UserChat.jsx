import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utilities/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment"

const UserChat = ({chat, user}) => {
    const {recipientUser} = useFetchRecipientUser(chat, user);
    const {onlineUsers, notifications, markThisUserNotificationsAsRead} = useContext(ChatContext);

    const {latestMessage} = useFetchLatestMessage(chat);

    const unreadNotifications = unreadNotificationsFunc(notifications);
    const thisUserNotifications = unreadNotifications?.filter(
        n => n.senderId == recipientUser?._id
    )

    const isOnline = onlineUsers?.some((u)=>u?.userId === recipientUser?._id)

    const truncateText = (text) => {
        let shortText = text.substring(0,21);
        if(text.length > 20) shortText += "...";
        return shortText;
    }
    
    return <Stack 
                direction="horizontal" 
                role="button" 
                gap={3} 
                className="user-card align-items-center p-2 justify-content-between"
                onClick={() => {
                    if(thisUserNotifications?.length !== 0){
                        markThisUserNotificationsAsRead(thisUserNotifications, notifications)
                    }
                }} 
            >

        <div className="d-flex">
            <div className="me-2">
                <img src={avatar} height="38px"/>
            </div>
            <div className="text-content">
                <div className="name">{recipientUser?.name}</div>
                <div className="text">
                    {latestMessage?.text && (
                        <span>{truncateText(latestMessage?.text)}</span>
                    )}
                </div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
            <div className={thisUserNotifications?.length > 0 ? "this-user-notifications" : ""}>
                {thisUserNotifications?.length > 0 ? thisUserNotifications?.length : ""}
            </div>
            <span className={isOnline ? "user-online" : ""}></span>
        </div>
    </Stack>
};

export default UserChat;