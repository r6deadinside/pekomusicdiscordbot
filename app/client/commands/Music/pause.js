const {canModifyQueue} = require('../../../BackEnd/config/config')

module.exports = {
    name: "pause",
    description: "Pauses that plays right now",
    usage: "pause",
    enabled: true,
    aliases: [''],
    category: "Music",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute (client,message,args,data) {

      const queue = message.client.queue.get(message.guild.id)

      if (!queue) return message.reply("There is nothing playing.").catch(console.error)

      if (!canModifyQueue(message.member)) return

      if (queue.playing) {

          queue.playing = false
          queue.connection.dispatcher.pause(true)
          return queue.textChannel.send(`${message.author} ⏸ paused the music.`).catch(console.error)

      }
  }
}
