
const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

const socket = io();
let userName = '';

const login = event => {
  event.preventDefault();

  if (userNameInput.value === '') {
    alert('Username cannot be empty');
  } else {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    // Send userName data to server
    socket.emit('join', userName)
  }
};

loginForm.addEventListener("submit", event => {
  login(event);
});

const addMessage = (author, content) => {
  const message = document.createElement('li');

  message.classList.add('message');
  message.classList.add('message--received');

  if (author === userName) {
    message.classList.add('message--self');
  };
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};

const sendMessage = event => {
  event.preventDefault();

  let messageContent = messageContentInput.value;

  if (!messageContent.length) {
    alert('Please type your message');
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    addMessageForm.reset();
  }
};

addMessageForm.addEventListener("submit", event => {
  sendMessage(event);
});

//socket.on('message', addMessage);
socket.on('message', ({ author, content}) => addMessage(author, content));
