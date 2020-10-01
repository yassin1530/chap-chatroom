const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs');
const hash = require('md5');
const dk = require('./dk/kit.js')
const readline = require('readline-sync');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const users = dk.getUserDb;
const auths = [];
const chatroomUser = [];
const chatRoomMessages = [];

app.get('/', function (req, res) {
    res.send('hello there')
})


app.post('/', function (req, res) {
    let user = users.filter(val => val.username === req.body.username);
    let isUser = user.length > 0;
    if (req.body.username !== undefined && isUser) {
        user = user[0];
        let challenge = Math.floor(Math.random() * Math.floor(999999)).toString();
        auths.push({user: user.username, hash: hash(user.password + challenge)})
        res.send(challenge);
    } else {
        res.send('username not found');
    }
})

app.post('/auth', function (req, res) {
    let auth = auths.filter(val => val.hash === req.body.hash);
    let isAuth = auth.length > 0;
    if (isAuth) {
        res.send('success')
        chatroomUser.push(auth[0].user);
    } else {
        res.send('invalid')
    }
})

app.post('/chat', function (req, res) {
    chatRoom(req.body.username, chatroomUser, req.body.message)
    res.send('validMessage');
})

app.get('/messages', function (req, res) {
    return res.json(chatRoomMessages);    //return response as JSON
});

function chatRoom(user, chatroomList, message) {
    const isUserAuthed = chatroomList.filter(chatroomMember => user === chatroomMember).length > 0;
    if (isUserAuthed) {
        chatRoomMessages.push({user: user, message: message})
    }
}
const port  = readline.question('which port to host? : ')
app.listen(port)
console.log('Server Started')