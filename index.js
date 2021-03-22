const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoom } = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3006 || process.env.PORT;


// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const bootName = 'Cavendish';

// Run when client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room);
        // Welcome the current user
        socket.emit('message', formatMessage(bootName, 'Welcome to chat room'));

        //runs when the user connects. this message is visible to everyone apart from the sender
        socket.broadcast
        .to(user.room)
        .emit('message', 
        formatMessage(bootName, `${user.username} has joined the chat`))

        io.to(user.room).emit('roomUser',{
            room:user.room,
            users: getRoom(user.room)
        })
    })

    

    /// Listen for form message
    socket.on('formMessage', msgs => {
        // console.log(msgs);
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msgs));
    });

    // Runs when the user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(bootName, `${user.username} has left the chat`));
        }

    })

});


server.listen(PORT, () => {
    console.log(`Server running on PORT ` + PORT);
})

