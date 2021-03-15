module.exports = {
  name: "invite",
  description: "Invite link",
  usage: "invite",
  enabled: true,
  aliases: [],
  category: "General",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,
  execute(client,message,args,data) {
    return message.member
      .send(
        `https://PekoMusicBot.ashleyzxc.repl.co`
      )
      .catch(console.error);
  }
};
