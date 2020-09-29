const axios = require('axios')
const hash = require('md5');
const readline = require('readline-sync');
let username = readline.question('Type in your Username : ');
const password = readline.question('Type in your Password : ', {hideEchoBack: true});
let chatRunning = false;
let initialMessageLoad = 0;
let resLength = 0;

async function getChallenge(url) {
    let res = await axios.post(url, {
        username: username
    })
    await postAuth(res.data, `${url}/auth`)
}

async function postAuth(challenge, url) {

    let hashmd5 = hash(password + challenge);
    let res = await axios.post(url, {
        hash: hashmd5
    })
    if (res.data === 'success') {
        if (initialMessageLoad < 1) {
            let initialChat = await axios.get('http://localhost:3000/messages')
            if (Array.isArray(initialChat.data))
                for (let i = 0; i < initialChat.data.length; i++) {
                    console.log(`${initialChat.data[i].user}: ${initialChat.data[i].message}`)
                }
            resLength = initialChat.data.length
            initialMessageLoad++;
        }


        console.log('Chatroom beigetreten')
        setInterval(function () {
            getMessages()
        }, 200);
        await postChatMessage()
    } else {
        console.log('Nutzer existiert nicht!')
    }
}


async function getMessages() {
    let res = await axios.get('http://localhost:3000/messages')
    let chatArr = [];
    if (res.data.length > resLength) {
        for (let i = resLength; i < res.data.length; i++) {
            chatArr.push(res.data[i]);
        }
        console.log(chatArr)
    } else {
        chatArr = [...res.data];
    }

    chatArr.forEach(mess => {
        if (mess.user !== username) {
            console.log(`${mess.user}: ${mess.message}`)
        }
    })
    resLength = res.data.length;
}

async function postChatMessage() {
    let message = readline.question(`${username}: `);
    let chatRes = await axios.post('http://localhost:3000/chat', {
        message: message,
        username: username
    })
    if (chatRunning === false) {
        await postChatMessage(username);
    }
}

getChallenge('http://localhost:3000')



