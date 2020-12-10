require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const queue = [];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

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
        msg.reply(`You've been added to the queue!`);
    }
}

const removeFromQueue = (msg, username) => {
    if (!queue.includes(username)) {
        msg.reply(`You're not in the queue.`);
    } else {
        const index = queue.indexOf(username);
        queue.splice(index, 1);
        msg.reply(`You've been removed from the queue!`);
    }
}

const clearQueue = msg => {
    if(msg.member.hasPermission('ADMINISTRATOR')){
        queue.length = 0;
        msg.channel.send(`the queue has been cleared!`);
    }
}
client.on('message', msg => {
    const { channel, content, author: {username}, system} = msg;
    if (system === false && channel.name === 'stand-in-line') {
        switch(content){
            case '!viewqueue': 
                printQueue(msg);
                break;
            case '!addtoqueue':
                addToQueue(msg, username);
                break;
            case '!removefromqueue': 
                removeFromQueue(msg, username);
                break;
            case '!clearqueue':
                clearQueue(msg);
                break;
        }
    }
});

client.login(process.env.BOT_TOKEN);