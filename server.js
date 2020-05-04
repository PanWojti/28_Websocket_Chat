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
  });
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
    console.log(message);
    console.log("users: ", users);
  });
  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left')
    const removeUser = (user, allUsers) => {
      if (user.id === socket.id) {
        users.splice(allUsers, 1);
      }
    };
    users.some(removeUser);
  });
  console.log('I\'ve added a listener on message and disconnect events \n');
});
