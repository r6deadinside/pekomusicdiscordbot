const {MessageEmbed} = require('discord.js')

module.exports = {
  name: "leave",
    description: "Leave voice channel",
    usage: "leave",
    enabled: true,
    aliases: [],
    category: "Music",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {

        const {channel} = message.member.voice

        let leavingEmbed = new MessageEmbed()
            .setColor(data.config.color)
            .setTitle(`**bye-bye...**`)
            .setFooter(data.config.footer)

        let notInVoice = new MessageEmbed()
            .setColor(data.config.color)
        .setTitle(`**I'm not in a voice channel**`)
        .setFooter(data.config.footer)

        let userNotInVoice = new MessageEmbed()
        .setColor(data.config.color)
        .setTitle(`Your not in a voice channel`)
        .setFooter(data.config.footer)

        let notInSameVoice = new MessageEmbed()
        .setColor(data.config.color)
        .setTitle(`Your not in same voice channel as bot`)
        .setFooter(data.config.footer)

        if (!message.guild.me.voice.connection)
            return message.channel.send(notInVoice)
                .catch(err => console.error(err))

        else if (!message.member.voice.channel)
            return message.channel.send(userNotInVoice)
                .catch(err => console.error(err))

        else if (channel !== message.guild.me.voice.channel)
            return message.channel.send(notInSameVoice)
                .catch(err => console.error(err))

        else if (message.guild.me.voice.connection) {

            message.guild.me.voice.connection.disconnect()

            return message.channel.send(leavingEmbed)
                .catch(err => console.error(err))
        }
  }
}
