const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const chatRoomName = document.getElementById('room-name');
const chatUsers = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// SOCKET

socket.emit('join-room', { username, room });

socket.on('join-room', roomName => {
    chatRoomName.innerHTML = roomName;
});

socket.on('message', message => {
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('room-users', users => {
    console.log(users);
    chatUsers.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
});

// FRONT END

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const message = e.target.elements.msg.value;

    socket.emit('chat-message', message);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.message}</p>`;

    document.querySelector('.chat-messages').appendChild(div);
}