import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { Alert, Form, Stack } from "react-bootstrap";

const AddFriends = () => {

    const [isOpen, setIsOpen] = useState(false);
    const {user} = useContext(AuthContext)
    const {userChats, createChat, addFriendEmail, updateAddFriendEmail, addFriendError, addFriendMessage} = useContext(ChatContext);    

    return (
        <div className="addFriend">
            <div onClick={() => setIsOpen(!isOpen)} className="addFriend-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-add" viewBox="0 0 16 16">
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                    <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                </svg>
            </div>
            {isOpen && <div className="addFriend-box">
            <div className="addFriend-field">
                <h4>Add friend, </h4>

                <Form action="submit" onSubmit={(e) => {
                        e.preventDefault(),
                        createChat(user._id, addFriendEmail, userChats, addFriendError)
                    }}>
                    <Stack direction="horizontal" gap={2}>
                        <Form.Control type="email" placeholder="Enter e-mail id" onChange={(e) => {
                            updateAddFriendEmail(e.target.value)
                        }}/>
                        <button type="submit" className="addFriend-button">
                            Add +
                        </button>
                    </Stack>
                </Form>
                
                {addFriendError && (
                        <Alert variant="danger" className="addFriend-alert">
                            <p>{addFriendMessage}</p>
                        </Alert>
                    )}
            </div>
        </div>}
        </div>
    );
}
 
export default AddFriends;