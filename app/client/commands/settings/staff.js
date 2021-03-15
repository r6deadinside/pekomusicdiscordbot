const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "staff",
    description: "Get a list of the current staff members",
    usage: "staff",
    enabled: true,
    aliases: [],
    category: "General",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {
        let admins = await message.guild.members.cache.filter((m) =>
            m.hasPermission("ADMINISTRATOR") && !m.user.bot)
            .map(x => "<@!" + x.user.id + ">")

        let mods = await message.guild.members.cache.filter((m) =>
            m.hasPermission("MANAGE_MESSAGES") && !m.user.bot && !admins.includes(`<@!${m.user.id}>`))
            .map(x => "<@!" + x.user.id + ">");

        let embed = new MessageEmbed()
            .setAuthor(message.guild.name + " Staff team", message.guild.iconURL())
            .setColor(data.config.color)
            .setFooter(data.config.footer)

        let adminText = (admins.length < 1) ? "None" : admins.join('\n')

        let modText = (mods.length < 1) ? "None" : mods.join('\n')

        embed.setDescription(`**Admins:**\n` + adminText + "\n**Mods:**\n" + modText)

        return message.channel.send(embed)
    },
}
