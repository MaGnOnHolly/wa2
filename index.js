require("events").EventEmitter.defaultMaxListeners = 200;
const express = require("express");
const app = express();
app.listen(() => console.log("Server started"));
app.use('/ping', (req, res) => {
  res.send(new Date());
}); // ./
const Discord = require('discord.js');
const client = new Discord.Client();
const Database = require('st.db');
const db_time = new Database('time')
const ms = require('ms');
const moment = require('moment');
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag} !`);
  	client.user.setActivity(``, { type: 'PLAYING' });
});
client.login(process.env.token)
const prefix = "$" //البرفكس 
client.on("message", message => {
  if(message.content.startsWith(prefix + "new")){
    if(!message.member.hasPermission("MANAGE_CHANNELS")) return;
    let args = message.content.split(' ')
    let time = args[2];
    let user = message.mentions.users.first() || client.users.cache.get(args[1]);
    if(!user) return message.channel.send("**I can't find this member !**");
    if(!time) return message.channel.send("**Please type the time !**")
    let everyone = message.guild.roles.cache.find(r => r.name === '@everyone'); 
    let category = message.guild.channels.cache.find(c => c.name === "#・Hollywood S〢Private Rooms" && c.type === 'category');
    if(!category) return message.channel.send("**Please create category by this name : `#・Hollywood S〢Private Rooms` !**")
    message.guild.channels.create(`${user.username}`, { type: 'text' }).then(ch => {
      
      if(category) {
        ch.setParent(category.id);
      }
      ch.createOverwrite(client.user, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true
      })
      ch.createOverwrite(everyone, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false
      })
      ch.createOverwrite(user, {
        SEND_MESSAGES: true,
        ATTACH_FILES: true,
        VIEW_CHANNEL: true,
        MENTION_EVERYONE: true
      })
      var currentTime = new Date(),
			year = currentTime.getFullYear(),
			month = currentTime.getMonth() + 1,
			day = currentTime.getDate();
      let proom = new Discord.MessageEmbed().setAuthor("✅لقد تم انشاء الروم الخاص بك").setColor("RANDOM").addField(`صاحب الروم:`, user).addField(`صنع من`, message.author).addField(`صنع في :`, `${moment(ch.createdAt).format("DD/MM/YYYY")}`).addField(`موعد الأنتهاء :`, `${moment((ms(time)) + ch.createdTimestamp).format(
        "DD/MM/YYYY")}`).setTimestamp()
      message.channel.send(`**✅ لقد تم انشاء الروم الخاص بك ${ch}!**`)
      message.guild.owner.send(`**موعد الأنتهاء :
 ${ch}\موعد الأنتهاء :
: \`${moment((ms(time)) + ch.createdTimestamp).format("DD/MM/YYYY")}\` !\nصنع في :
 : \`${moment(ch.createdAt).format("DD/MM/YYYY")}\`**`)
      user.send(`**✅ لقد تم انشاء الروم الخاص بك ${ch} !\nموعد الأنتهاء :
\`${moment((ms(time)) + ch.createdTimestamp).format("DD/MM/YYYY")}\` !\nصنع في :
 : \`${moment(ch.createdAt).format("DD/MM/YYYY")}\`**`)
      ch.send(user, proom)
      
      
      setTimeout(function() {
        ch.delete();
        user.send(`**لقد انتهت مدة الروم الخاص بك !\nللتجديد تواصل معا الدعم الفني <#1196185884593229885> \nموعد الانتهاء : \`${moment((ms(time)) + ch.createdTimestamp).format("DD/MM/YYYY")}\`**`)
      }, ms(time))
    })
  }
})