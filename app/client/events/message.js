const config = require('../../BackEnd/config/client.json')
const ErrorEmbed = require('../../BackEnd/Error/ErrorEmbed')
const cmdCooldown = {}

module.exports = async (client, message) => {
    try {
        //If author is a bot then return
        if (message.author.bot) return

        //If the message isn't in a guild return following message
        if (!message.guild) return message.channel.send("Sorry i can't execute messages in DM")

        let guildDB = await client.data.getGuildDB(message.guild.id)

  let prefix = !guildDB.prefix ? config.prefix : guildDB.prefix

  //Check if message starts with the prefix
  if(!message.content.toLowerCase().startsWith(prefix)) {
      if (message.content === `<@!${message.client.user.id}>` || message.content === `<@${message.client.user.id}>`) {
          return message.reply("Uh-Oh! You forgot the prefix? It's `" + prefix + "`")
      }
      return
  }

  //Checking if the message is a command
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        //If it isn't a command then return
        if (!cmd)
            return

        //Get the user db
        let userDB = await client.data.getUserDB(message.author.id);
        let data = {}
        data.config = config
        data.user = userDB
        data.guild = guildDB
        data.cmd = cmd


        if (!message.channel.nsfw && cmd.nsfw) return

        //If command is owner only and author isn't owner return
        if (cmd.ownerOnly && message.author.id !== config.ownerID) return

        if (message.guild) {
            let userPerms = [];
            cmd.memberPermissions.forEach((perm) => {
                if (!message.channel.permissionsFor(message.member).has(perm)) {
                    userPerms.push(perm)
                }
            })
            if (userPerms.length > 0 && !message.member.roles.cache.find((role) =>
                role.name.toLowerCase() === config.adminRole.toLowerCase())) {
                client.logger.cmd(`${message.author.tag} used ${data.cmd.name} - Missing permissions`)
                return message.channel.send("Looks like you're missing the following permissions:\n" + userPerms.map((p) => `\`${p}\``).join(", "))
            }
            let clientPerms = []
            cmd.botPermissions.forEach((perm) => {
                if (!message.channel.permissionsFor(message.guild.me).has(perm))
                    clientPerms.push(perm)
            })

            if (clientPerms.length > 0) {
                client.logger.cmd(`${message.author.tag} used ${cmd.name} - Missing permissions`);
                return message.channel.send("Looks like I'm missing the following permissions:\n" + clientPerms.map((p) => `\`${p}\``).join(", "));
            }

  }

  let userCooldown = cmdCooldown[message.author.id];

  if(!userCooldown) {
      cmdCooldown[message.author.id] = {};
      userCooldown = cmdCooldown[message.author.id];
  }
  let time = userCooldown[cmd.name] || 0;
  if (time && time > Date.now()) {
    let timeLeft = Math.ceil((time - Date.now()) / 1000);
    return message.channel.send(`\`${timeLeft}s\` before you can use command again`)
  }
  cmdCooldown[message.author.id][cmd.name] = Date.now() + cmd.cooldown
  cmd.execute (client, message, args, data)
} catch(err) {
        message.channel.send(ErrorEmbed)
        console.error(err)
}
}
