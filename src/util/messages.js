const moment = require('moment');

module.exports = function formatMessage(username, message) {
    return {
        username,
        message,
        time: moment().format('h:mm a')
    }
}