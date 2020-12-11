require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
let queue;

const initQueueFile = () => {
    fs.writeFile('queue.txt', "[]", { flag: 'wx' }, err => {
        if (err) console.log(err);
    });

    fs.readFile('queue.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            queue = []
            return
        }
        queue = JSON.parse(data);
    })
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const updateQueueFile = queueArr => {
    fs.writeFile('queue.txt', JSON.stringify(queueArr), err => {
        if (err) return console.log(`Error writing to file: ${err}`);
    });
}

const printQueue = msg => {
    if(queue.length === 0){
        msg.channel.send('The current queue is empty.');
    } else {
    msg.channel.send(`The current queue is:** ${queue.join(" ---> ")}**`);
    }
}

const addToQueue = (msg, username) => {
    if(queue.includes(username)){
        msg.reply(`You're already in the queue!`);
    } else {
        queue.push(username);
        updateQueueFile(queue);
        msg.reply(`You've been added to the queue!`);
    }
}

const removeFromQueue = (msg, username) => {
    if (!queue.includes(username)) {
        msg.reply(`You're not in the queue.`);
    } else {
        const index = queue.indexOf(username);
        queue.splice(index, 1);
        updateQueueFile(queue);
        msg.reply(`You've been removed from the queue!`);
    }
}

const clearQueue = msg => {
    if(msg.member.hasPermission('ADMINISTRATOR')){
        queue.length = 0;
        updateQueueFile(queue);
        msg.channel.send(`the queue has been cleared!`);
    }
}
client.on('message', msg => {
    const { channel, content, author: {username}, system} = msg;
    if (system === false && channel.name === 'stand-in-line') {
        switch(content){
            case '!viewqueue':
            case '!view':
                printQueue(msg);
                break;
            case '!addtoqueue':
            case '!add':
                addToQueue(msg, username);
                break;
            case '!removefromqueue':
            case '!remove':
                removeFromQueue(msg, username);
                break;
            case '!clearqueue':
            case '!clear':
                clearQueue(msg);
                break;
        }
    }
});

client.login(process.env.BOT_TOKEN);

initQueueFile()