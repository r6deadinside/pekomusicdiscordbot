const {canModifyQueue} = require('../../../BackEnd/config/config')
const {MessageEmbed} = require('discord.js')

module.exports = {
    name: 'loop',
    description: 'Loop queue',
    usage: 'Loop',
    enabled: true,
    aliases: ['l'],
    category: 'Music',
    memberPermissions: [],
    botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {

        const queue = message.client.queue.get(message.guild.id)

        if (!queue)
            return message.reply('There is nothing playing.')
                .catch(console.error)

        if (!canModifyQueue(message.member)) return;
        queue.loop = !queue.loop
        return queue.textChannel.send(`Loop is now ${queue.loop ? '**on**' : '**off**'}`)
            .catch(console.error)
    }
}
