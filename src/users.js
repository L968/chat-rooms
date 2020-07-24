let users = [];

function userJoinedChat(id, username, roomName) {
    const user = { id, username, roomName };

    users.push(user);
}

function userLeftChat(id) {
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex !== -1) {
        return users.splice(userIndex, 1)[0];
    }
}

function getCurrentUserById(id) {
    return users.find(user => user.id === id);
}

function getUsersByRoomName(roomName) {
    return users.filter(user => user.roomName === roomName);
}

module.exports = {
    userJoinedChat,
    userLeftChat,
    getCurrentUserById,
    getUsersByRoomName
}