const {MessageEmbed} = require("discord.js")
module.exports = {
    name: "join",
    description: "Join voice channel",
    usage: "join",
    enabled: true,
    aliases: [],
    category: "Music",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {

        let alreadyInVoiceEmbed = new MessageEmbed()
            .setTitle(`I'm already in the voice channel`)
            .setColor(data.config.color)
            .setFooter(data.config.footer)
        let notInVoiceEmbed = new MessageEmbed()
            .setTitle(`First connect to voice channel to use this command`)
            .setColor(data.config.color)
            .setFooter(data.config.footer)

        if (message.guild.me.voice.connection)
            return message.channel.send(alreadyInVoiceEmbed)

        else if (!message.member.voice)
            return message.channel.send(notInVoiceEmbed)
                .catch(err => console.error(err))

        else if (!message.guild.me.voice.connection)
            message.member.voice.channel.join()
                .then(connection => {
                    connection.voice.setSelfDeaf(true)
                        .then()
                        .catch(e => console.error(e))
                })
    }
}
