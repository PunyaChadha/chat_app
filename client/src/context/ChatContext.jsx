import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utilities/services";
import {io} from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setcurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [IsMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);    
    const [sendTextMessageError, setSendTextMessageError] = useState(null);    
    const [newMessages, setNewMessage] = useState(null);   
    const [socket, setSocket] = useState(null);   
    const [onlineUsers, setOnlineUsers] = useState([]);  
    const [notifications, setNotifications] = useState([]);  
    const [allUsers, setAllUsers] = useState([]); 
    

    console.log(messages);
    

    //initial socket
    useEffect(()=>{
        const newSocket = io(import.meta.env.VITE_SOCKET_URL)
        setSocket(newSocket);
        return () => {
            newSocket.disconnect(); 
        }
    },[user])
    
    //add online users..
    useEffect(() => {
        if(!socket) return;
        socket.emit("addNewUser", user?._id)
        socket.on("getOnlineUsers", (res)=>{
            setOnlineUsers(res);
        });

        //cleanup function
        return () => {
            socket.off("getOnlineUsers");
        }
    },[socket])

    //send message..
    useEffect(() => {
        if(!socket) return;

        const recipientId = currentChat?.members?.find((id) => id !== user?._id);   

        socket.emit("sendMessage", {...newMessages, recipientId})
        
    },[newMessages])

    //receive message..and notification..
    useEffect(() => {
        if(!socket) return;

        socket.on("getMessage", (res) => {
            if(currentChat?._id !== res.chatId) return;

            setMessages((prev) => [...prev, res]);
        })

        socket.on("getNotification", (res)=>{
            const isChatOpen = currentChat?.members.some(id => id === res.senderId)
            
            if(isChatOpen){
                setNotifications(prev => [{...res, isRead : true}, ...prev])
            }else{
                setNotifications(prev => [res, ...prev])
            }
        })

        //cleanup function
        return () => {
            socket.off("getMessage")
            socket.off("getNotification")
        };

    },[socket, currentChat])

    useEffect(() => {
        const getUsers = async() => {
            const response = await getRequest(`${baseUrl}/users`)
            if(response.error){
                return console.log("Error users", response);
            }
            //filtering the users to display..
            const pChats = response.filter((u) => {
                let isChatCreated = false;
                if(user?._id === u._id) return false;
                if(userChats){
                    isChatCreated = userChats?.some((chat) => {
                        return (chat.members[0]===u._id || chat.members[1]===u._id)
                    })
                }
                return !isChatCreated;
            });
            setPotentialChats(pChats);
            setAllUsers(response);
        }
        getUsers();
    },[userChats])

    useEffect(() => {
        const getUserChats = async() => {
            if(user?._id){
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)

                setIsUserChatsLoading(false);

                if(response.error){
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        };
        getUserChats();
    },[user, notifications]);

    //for chatBox
    useEffect(() => {
        const getMessages = async() => {
            setIsMessagesLoading(true);
            setMessagesError(null);

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)
            setIsMessagesLoading(false);
            
            if(response.error){  //check for response being null, i.e, never texted before..
                return setMessagesError(response);
            }            

            setMessages(response);            
        };
        getMessages();
    },[currentChat]);

    //send message
    const sendTextMessage = useCallback(async(textMessage, sender, currentChatId, setTextMessage) => {
        if(!textMessage) return console.log("You must type something..");
        
        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId : currentChatId,
            senderId : sender,
            text : textMessage
        }));

        if(response.error) return setSendTextMessageError(response);

        setNewMessage(response);
        setMessages((prev) => [...prev, response])
        setTextMessage("");
    },[])


    const updateCurrentChat = useCallback((chat) => {
        setcurrentChat(chat);
    },[])
    
    //for potentialChats..
    // const createChat = useCallback(async(firstId, secondId) => {
    //     const response = await postRequest(`${baseUrl}/chats`,
    //         JSON.stringify({
    //             firstId,
    //             secondId,
    //         })
    //     );
    //     if(response.error){
    //         return console.log("Error creating chats, ",response);
    //     }
    //     setUserChats((prev) => [...prev, response])
    // },[])

    //for addFriend..
    const [addFriendEmail, setAddFriendEmail] = useState(null)
    const [addFriendError, setAddFriendError] = useState(false)
    const [addFriendMessage, setAddFriendMessage] = useState(null)

    const updateAddFriendEmail = useCallback((info) => {
        setAddFriendEmail(info);
    },[]);
    
    const createChat = useCallback(async(firstId, secondEmail, userChats) => {
        const secondId = await getRequest(`${baseUrl}/users/getId/${secondEmail}`)
        
        if(secondId.error){
            setAddFriendError(true);
            return setAddFriendMessage("Enter a valid email id");
        }       
        
        const response = await postRequest(`${baseUrl}/chats`,
            JSON.stringify({
                firstId,
                secondId,
            })
        );

        if(response.error){
            return console.log("Error creating chats, ",response);
        }        

        //check if a chat already exists or not
        const chatExists = userChats.some((e) => e._id === response._id);
        if (chatExists) {
            setAddFriendError(true);
            return setAddFriendMessage("User already exists in your chat list");
        }

        setUserChats((prev) => [...prev, response]);
        setAddFriendError(false);
    },[])

    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map(n => {
            return {...n, isRead:true};
        });
        setNotifications(mNotifications);
    },[]);

    const markNotificationsAsRead = useCallback((n, userChats, user, notifications) => {
        //find chat to open
        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId]
            const isDesiredChat = chat?.members.every((member) => {
                return chatMembers.includes(member);
            });
            return isDesiredChat
        });

        //mark that notification as read
        const mNotifications = notifications.map(el => {
            if(n.senderId === el.senderId){
                return {...n, isRead : true}
            }else return el;
        })
        updateCurrentChat(desiredChat)
        setNotifications(mNotifications)
    },[])

    //convert isRead:true, when you open a chat
    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) =>{
        //mark notifications as read
        let mNotifications = notifications.map(el => {
            let notification;
            thisUserNotifications.forEach(n => {
                if(n.senderId === el.senderId) notification = {...n, isRead:true}
                else notification = el;
            })
            return notification;
        })
        setNotifications(mNotifications);
    })

    return (
    <ChatContext.Provider value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        IsMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationsAsRead,
        markThisUserNotificationsAsRead,
        addFriendEmail,
        updateAddFriendEmail,
        addFriendError,
        addFriendMessage,
    }}>
        {children}
    </ChatContext.Provider>
    );
}