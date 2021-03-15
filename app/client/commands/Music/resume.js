const { canModifyQueue } = require("../../../BackEnd/config/config");
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "resume",
    description: "Resume song",
    usage: '',
    enabled: true,
    aliases: [''],
    category: "Music",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: true,
    async execute(client, message, args, data) {
        const queue = message.client.queue.get(data.guild.id)
        let nothingPlaying = new MessageEmbed()
            .setTitle(`Nothing playing`)
            .setColor(data.config.color)
            .setFooter(data.config.footer)
        let resumePlaying = new MessageEmbed()
            .setTitle(`[${message.author.tag}] ▶ resumed the music!`)
            .setColor(data.config.color)
            .setFooter(data.config.footer)
    let queueNotPaused = new MessageEmbed()
        .setTitle(`Music is not paused`)
        .setColor(data.config.color)
        .setFooter(data.config.footer)
    if (!queue)
      return message.channel.send(nothingPlaying)
          .catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (!queue.playing) {
      queue.connection.dispatcher.resume()
      return queue.textChannel.send(resumePlaying)
          .catch(console.error)
    }
    return message.channel.send(queueNotPaused)
        .catch(console.error);
  }
}
