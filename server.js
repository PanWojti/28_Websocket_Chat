const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');

const messages = [];
const users = [];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client')));

// add endpoint with app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  // Receive userName data from client
  socket.on('join', (user) => {
    users.push({name: user, id: socket.id});
    const newUserMessage = {
      author: 'Chat-Bot',
      content: `<i><b>${user}</b> has joined the conversation!</i>`
    }
    messages.push(newUserMessage);
    // Event listener for message already exists in app.js, no point to add another one
    socket.broadcast.emit('message', newUserMessage);
  });
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
    console.log(message);
    console.log("users: ", users);
  });
  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left')
    let userLeft = '';

    for (let deletedUser of users) {
      if (deletedUser.id === socket.id) {
        const index = users.indexOf(deletedUser);
        users.splice(index, 1);
        userLeft = deletedUser.name;
      }
    };

    const userLeftMessage = {
      author: 'Chat-Bot',
      content: `<i><b>${userLeft}</b> has left the conversation!</i>`
    }
    messages.push(userLeftMessage);
    socket.broadcast.emit('message', userLeftMessage);
    console.log('users: ', users);
  });
  console.log('I\'ve added a listener on message and disconnect events \n');
});
