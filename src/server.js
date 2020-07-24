const express = require('express');
const path = require('path');
const formatMessage = require('./util/messages');
const {
    userJoinedChat,
    userLeftChat,
    getCurrentUserById,
    getUsersByRoomName
} = require('./users');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', socket => {

    socket.on('join-room', ({ username, room: roomName }) => {
        userJoinedChat(socket.id, username, roomName);

        socket.join(roomName);

        socket.emit('join-room', roomName);
        socket.emit('message', formatMessage('', 'Welcome to chat!'));
        socket.broadcast.to(roomName).emit('message', formatMessage('', `${username} has joined the chat`));

        io.to(roomName).emit('room-users', getUsersByRoomName(roomName));
    });

    socket.on('chat-message', message => {
        const user = getCurrentUserById(socket.id);

        io.to(user.roomName).emit('message', formatMessage(user.username, message));
    });

    socket.on('disconnect', () => {
        const user = userLeftChat(socket.id);

        if (user) {
            io.to(user.roomName).emit('message', formatMessage('', `${user.username} has left the chat`));

            io.to(user.roomName).emit('room-users', getUsersByRoomName(user.roomName));
        }
    });

});

server.listen(3000);