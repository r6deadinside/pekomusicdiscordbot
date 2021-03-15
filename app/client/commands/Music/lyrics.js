const {MessageEmbed} = require('discord.js')
const lyricsFinder = require('lyrics-finder')

module.exports = {
    name: "lyrics",
    description: "Show lyrics for the song",
    usage: "lyrics",
    enabled: true,
    aliases: ["ly"],
    category: "Music",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,
    async execute(client, message, args, data) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.channel.send("There is nothing playing.")
            .catch(console.error)
        let lyrics = null
        try {
            lyrics = await lyricsFinder(queue.songs[0].title, "");
            if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
        } catch (error) {
            lyrics = `No lyrics found for ${queue.songs[0].title}.`;
        }
        let lyricsEmbed = new MessageEmbed()
            .setTitle(`${queue.songs[0].title} — Lyrics`)
            .setDescription(lyrics)
            .setColor("#ff0000")
      .setTimestamp();
    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
