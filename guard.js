const Discord = require("discord.js"); // scháwn 
const client = new Discord.Client(); 
const ayarlar = require("./ayarlar.json"); 
const chalk = require("chalk"); 
const moment = require("moment"); 
var Jimp = require("jimp"); 
const { Client, Util } = require("discord.js"); 
const fs = require("fs"); 
const db = require("quick.db");
const express = require("express");   
require("./util/eventLoader.js")(client); // scháwn 
const path = require("path"); 
const snekfetch = require("snekfetch");  
const ms = require("ms"); 
const tags = require("common-tags");

var prefix = ayarlar.prefix;  // scháwn 

const log = message => {
  
  console.log(`${message}`); 
};

client.commands = new Discord.Collection(); 
client.aliases = new Discord.Collection(); 
fs.readdir("./komutlar/", (err, files) => { // scháwn 
  
  if (err) console.error(err); 
  
  log(` ${files.length} Botun komutları yüklenecek...`); 
  files.forEach(f => {
    
    let props = require(`./komutlar/${f}`);  // scháwn 
    log(`[KOMUT] | ${props.help.name} Eklendi.`); 
    client.commands.set(props.help.name, props); 
    props.conf.aliases.forEach(alias => {
      
      client.aliases.set(alias, props.help.name); 
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => { // scháwn 
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name); // scháwn 
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => { // scháwn 
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`); // scháwn 
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)]; // scháwn 
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias); // scháwn 
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }

  let permlvl = 0; // scháwn 
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted"))); // scháwn 
});
client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});


//--------------------ROL-SİLME--------------------\\

client.on("roleDelete", async role => {
  let sawn = db.fetch(`rolab_${role.guild.id}`);
  if(sawn) {
  let schawn = await role.guild.fetchAuditLogs({ type: "ROLE_DELETE"}).then(sch => sch.entries.first())
  if(schawn.executor.id === client.user.id) return;

  let silen = await role.guild.members.cache.get(schawn.executor.id)
  if(silen.id == ayarlar.guvenlikisi) return;

   if(ayarlar.korumalog) {
     const pıro = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor(schawn.executor.displayName, schawn.executor.avatarURL({ dynamic: true }))
      .setTitle(`Sunucudaki Bir Rol Silindi!`)
      .setDescription(`

      Silen Yetkili: ${schawn.executor} | (\`${schawn.executor.id}\`)
       
      Yapılan İşlem: **\`Silinen Rol Yeniden Oluşturuldu.\`**

      `)
      .setThumbnail(schawn.executor.avatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter(`schawn ❤️ Valeria`)
      client.channels.cache.get(ayarlar.korumalog).send(pıro)
   }
   role.guild.roles.create({ data: {
       name: role.name,
       color: role.color,
       mentionable: role.mentionable,
       hoist: role.hoist,
       permissions: role.permissions,
       position: role.position,
   }, reason: "Bir Rol Silindi!"})
  }
});

//--------------------ROL-SİLME--------------------\\

//--------------------ROL-OLUŞTURMA--------------------\\

client.on("roleCreate", async role => {
  let sawn1 = db.fetch(`rolab_${role.guild.id}`);
  if(sawn1) {
  let schawn1 = await role.guild.fetchAuditLogs({ type: "ROLE_CREATE"}).then(sch => sch.entries.first())
  if(schawn1.executor.id === client.user.id) return;

  let silen = await role.guild.members.cache.get(schawn1.executor.id)
  if(silen.id == ayarlar.guvenlikisi) return;

   if(ayarlar.korumalog) {
     const pıro31 = new Discord.MessageEmbed()
      .setColor("RED")
      .setAuthor(schawn1.executor.displayName, schawn1.executor.avatarURL({ dynamic: true }))
      .setTitle(`Sunucuda Bir Rol Oluşturuldu!`)
      .setDescription(`

      Oluşturan Yetkili: ${schawn1.executor} | (\`${schawn1.executor.id}\`)
       
      Yapılan İşlem: **\`Oluşturulan Rol Silindi.\`**

      `)
      .setThumbnail(schawn1.executor.avatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter(`schawn ❤️ Valeria`)
    client.channels.cache.get(ayarlar.korumalog).send(pıro31)
   }
  role.delete()
  }
});

//--------------------ROL-OLUŞTURMA--------------------\\

//--------------------KANAL-SİLME--------------------\\

client.on("channelDelete", async channel => {
  let rol = await db.fetch(`kanalab_${channel.guild.id}`);

if (rol) {
const guild = channel.guild.cache;
let çenıl = channel.parentID;

channel.clone().then(z => {
  let kanalab = z.guild.channels.find(c => c.name === z.name);
  kanalab.setParent(kanalab.guild.channels.find(channel => channel.id === çenıl));
});
}
});

//--------------------KANAL-SİLME--------------------\\

//--------------------BOT-SES--------------------\\

client.on("ready", async function () {
  const sesgiraq = ayarlar.botses;
  client.channels.cache
  .get(sesgiraq)
  .join()
  .catch(err => {
    throw err;
  });
});

//--------------------BOT-SES--------------------\\

client.login(process.env.token);
