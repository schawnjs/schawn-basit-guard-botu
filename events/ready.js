const chalk = require("chalk");
const moment = require("moment");
const Discord = require('discord.js');
const ayarlar = require("../ayarlar.json");

var prefix = ayarlar.prefix;

module.exports = client => {
  console.log("krdsm anlarsn ya") 
  setInterval(() => {

    client.user.setActivity("schâwn Was Here!", { type : "PLAYING"}); 
    client.user.setActivity("schâwn ❤️ Lawertz"); }, 1500);
    client.user.setStatus("dnd");
};  