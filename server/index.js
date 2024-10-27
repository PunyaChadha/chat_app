const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const {Server} = require("socket.io")


const app = express();
require("dotenv").config();

app.use(express.json())
app.use(cors())
app.use("/api/users", userRoute)
app.use("/api/chats", chatRoute)
app.use("/api/messages", messageRoute)

app.get("/", (req,res) => {
    res.send("Welcome to chat app");
})

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

// store it in expressServer to make the backend server and socket io server the same...
const expressServer = app.listen(port, (req,res) => {
    console.log(`Running server on ${port}`);
})

//connect mongodb
mongoose.connect(uri, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => console.log("MongoDB Connection Established !"))
.catch((e) => console.log("MongoDB Connection Failed -", e.message))

//connect backend and socket io server
const io = new Server(expressServer, {
    cors:{
      origin: process.env.CLIENT_URL,
    },
});


//socket io index.js
let onlineUsers = [];

io.on("connection", (socket) => {
  //listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) && 
        onlineUsers.push({
            userId,
            socketId : socket.id,
        }); 
        
        io.emit("getOnlineUsers", onlineUsers);
  })

  //add message
  socket.on("sendMessage", (message) => {
    //check if the recipient user is online
    const user = onlineUsers.find(user => user.userId === message.recipientId)

    if(user){
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId : message.senderId,
        isRead : false,
        date : new Date(),
      });
    }
  })

  socket.on("disconnect", ()=>{
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)

    io.emit("getOnlineUSers", onlineUsers);
  })
});