const { canModifyQueue } = require("../../../BackEnd/config/config");

module.exports = {
  name: "stop",
  description: "stop all musics and clears queue",
  usage: '',
  enabled: true,
  aliases: [''],
  category: "Music",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,
  async execute(client,message,args,data) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ stopped the music!`).catch(console.error);
  }
};
