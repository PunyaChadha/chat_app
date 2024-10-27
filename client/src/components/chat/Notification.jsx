import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utilities/unreadNotifications";
import moment from "moment";

const Notification = () => {

    const [isOpen, setIsOpen] = useState(false)
    const {user} = useContext(AuthContext);
    const {notifications, userChats, allUsers, markAllNotificationsAsRead, markNotificationsAsRead} = useContext(ChatContext);

    const unreadNotifications = unreadNotificationsFunc(notifications)
    const modifiedNotications = notifications.map((n) => {
        const sender = allUsers.find(user => user._id === n.senderId)

        return {
            ...n,
            senderName : sender?.name,
        }
    })

    // console.log("un - ",unreadNotifications);
    // console.log("m - ",modifiedNotications);

    return ( <div className="notifications">
        <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
            </svg>
            {unreadNotifications?.length === 0 ? null : (
                <span className="notification-count">
                    <span>{unreadNotifications?.length}</span>
                </span>
            )}
        </div>

        {isOpen && <div className="notifications-box">
            <div className="notifications-header">
                <h3>Notifications</h3>
                <div className="mark-as-read" onClick={() => markAllNotificationsAsRead(notifications)}>Mark all as read</div>
            </div>
            {modifiedNotications?.length === 0 ? <span className="notification">No Notifications</span> : null}
            {modifiedNotications && modifiedNotications.map((n,index) => {
                return <div key={index} className={n.isRead ? 'notification' : 'notification not-read'} onClick={() => {markNotificationsAsRead(n, userChats, user, notifications), setIsOpen(false)}}>
                    <span>{`${n.senderName} sent you a new message`}</span>
                    <span className="notification-time">{moment(n.date).calendar()}</span>
                </div>
            })}
        </div>}

    </div> );
}
 
export default Notification;