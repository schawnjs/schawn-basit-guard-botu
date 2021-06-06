const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {

      if(!message.member.hasPermission("ADMINISTRATOR")) return;

       if(args[0] === "aç") {

        if(db.has(`rolab_${message.guild.id}`))
        return message.channel.send(new Discord.MessageEmbed()
         .setDescription(`**Rol Koruma Zaten Açık.**`)  
         .setColor("0x348f36")
         .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
         .setTimestamp())
          .then(x => x.delete({ timeout: 5000 })); 

           db.set(`rolab_${message.guild.id}`, "acik")
           return message.channel.send(new Discord.MessageEmbed()
           .setDescription(`**Başarıyla Rol Koruma** \`Açıldı!\``)
           .setColor("0x348f36")
           .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
           .setTimestamp())
            .then(x => x.delete({ timeout: 5000 }));
       }

       else if(args[0] === "kapat") {

        if(!db.has(`rolab_${message.guild.id}`))
        return message.channel.send(new Discord.MessageEmbed()
         .setDescription(`**Rol Koruma Zaten Kapalı.**`)  
         .setColor("0x348f36")
         .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
         .setTimestamp())
          .then(x => x.delete({ timeout: 5000 }));   

           db.delete(`rolab_${message.guild.id}`, "kapali")
           return message.channel.send(new Discord.MessageEmbed()
           .setDescription(`**Başarıyla Rol Koruma** \`Kapatıldı!\``)
           .setColor("0x348f36")
           .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
           .setTimestamp())
            .then(x => x.delete({ timeout: 5000 }));
       }
    }

exports.conf = {
  enabled: true,
  aliases: ['rol', "rolkoruma", "rol-koruma"],
  guildOnly: false,
  permLevel: 0
};

exports.help = {
  name: 'rol-koruma',
  usage: 'rol-koruma'
};