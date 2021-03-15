module.exports = {
    //Command Information
    name: "ping",
    description: "Displays the current API latency",
    usage: "ping",
    enabled: true,
    aliases: [],
    category: "General",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,
    async execute (client, message, args, data) {

      try {
        message.channel.send(`Pinging...`)
            .then(async (msg) => {
          let latencyPing = Math.floor(msg.createdTimestamp - message.createdTimestamp)
            msg.delete()
            let sentence = `My Latency: \`${latencyPing}ms\`\nAPI Latency: \`${client.ws.ping}ms\``;
            message.channel.send(sentence);

        })
    } catch(err) {
          console.log(data.cmd.name + " Error:\n" + err)
          return message.channel.send("An error occurred while trying to run this command")
      }
    },
}
