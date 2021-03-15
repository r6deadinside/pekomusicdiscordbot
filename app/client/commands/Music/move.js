const move = require('array-move');
const { canModifyQueue } = require('../../../BackEnd/config/config');

module.exports = {
  name: "move",
  description: "Move position in queue",
  usage: "move",
  enabled: true,
  aliases: ["mv"],
  category: "Music",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute(client,message,args,data) {
      const queue = message.client.queue.get(message.guild.id)

      if (!queue) return message.channel.send("There is no queue.")
          .catch(console.error)
      if (!canModifyQueue(message.member)) return

      if (!args.length) return message.reply(`Usage: ${data.guild.prefix}move <Queue Number>`)
      if (isNaN(args[0]) || args[0] <= 1) return message.reply(`Usage: ${message.client.prefix}move <Queue Number>`)

      let song = queue.songs[args[0] - 1]

      queue.songs = move(queue.songs, args[0] - 1, args[1] === 1 ? 1 : args[1] - 1)
      queue.textChannel.send(
          `${message.author} 🚚 moved **${song.title}** to ${args[1] === 1 ? 1 : args[1] - 1} in the queue.`
      )
  }
}
