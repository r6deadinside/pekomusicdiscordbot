const { canModifyQueue } = require('../../../BackEnd/config/config');

module.exports = {
  name: "skip",
  description: "Command for playing music from YouTube and SoundCloud",
  usage: '',
  enabled: true,
  aliases: ['fs','s'],
  category: "Music",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,
  async execute (client,message,args,data) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("There is nothing playing that I could skip for you.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ skipped the song`).catch(console.error);
  }
};
