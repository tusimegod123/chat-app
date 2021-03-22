const formMessage = document.getElementById('chat-form');
const formMessages = document.querySelector('.chat-messages');
const rooomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from URL
const {username,room} = Qs.parse(location.search, {
    ignoreQueryPrefix:true
})

// console.log(username, room);

const socket = io();

// Join chat room
socket.emit('joinRoom',{username, room} )

//Get room and users
socket.on('roomUser', ({room,users})=>{
   outputRoomname(room) 
   outputUsers(users) 
})

//output message from DOM
socket.on('message',message =>{
    console.log(message);
    outputMessage(message);

    // Scroll down
    formMessages.scrollTop = formMessages.scrollHeight;
}) 

// Message submit

formMessage.addEventListener('submit', (e)=>{
    e.preventDefault();
     const msgs = document.getElementById('msg').value;
    //  console.log(msgs);

    // Send/ emit the message to the server
    socket.emit('formMessage',msgs)

    // Clear the message after typing
    e.target.elements.msg.value = '';
    e.target.elements.focus();
})
//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add rom name function
function outputRoomname(room) {
    rooomName.innerText = room;
}

// Add users  to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user =>`<li>${user.username}</li>`).join('')}
    `;
}

