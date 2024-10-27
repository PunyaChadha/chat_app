import { createContext, useContext } from "react";
import { ChatContext} from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    const {user} = useContext(AuthContext);
    const {potentialChats, createChat, onlineUsers} = useContext(ChatContext);
    
    return (
        <div className="mb-3">
        {potentialChats && potentialChats.map((u,index) => {            
            
            return(
                <span className="single-user" key={index} onClick={() => createChat(user._id, u._id)}>
                    {u.name}
                    <span className={
                        onlineUsers?.some((user)=>user?.userId === u?._id) ? "user-online" : ""}></span>
                </span>
            )
        })}
        </div>
    );
}
 
export default PotentialChats;