const { MessageEmbed } = require('discord.js')
const {color,footer} = require('../config/client.json')
const ErrorEmbed = new MessageEmbed()
    .setTitle(`**Error while executing command try again later**`)
    .setColor(color)
    .setFooter(footer)
module.exports = ErrorEmbed

