const {Client, Collection} = require("discord.js")
const config = require("./app/BackEnd/config/client.json")
const fs = require("fs")
const util = require("util")
const readdir = util.promisify(fs.readdir)
const mongoose = require("mongoose")
const keepAlive = require('./server')
keepAlive()

const client = new Client()
client.events = new Collection()
client.commands = new Collection()
client.data = require('./app/BackEnd/db/db.controller')
client.logger = require("./app/BackEnd/modules/logger.js")
client.tools = require("./app/BackEnd/modules/tools")
client.queue = new Map()
const startServer = async () => {
const eventFiles = fs.readdirSync('./app/client/events/').filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
    const event = require(`./app/client/events/${file}`)
    const eventName = file.split(".")[0]
    client.logger.event(`Loading Event - ${eventName}`)
    client.on(eventName, event.bind(null, client))
}

let folders = await readdir("./app/client/commands/")
folders.forEach(direct =>{
  const commandFiles = fs.readdirSync('./app/client/commands/' + direct + "/").filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
      const command = require(`./app/client/commands/${direct}/${file}`)
      client.commands.set(command.name, command)
  }
})
    mongoose.connect(config.mongoDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then( async () => {
    await client.logger.log (
        `Connected to the Mongodb database.`,"log")
  }).catch( async (err) => {
      await client.logger.log (
        `Unable to connect to the Mongodb database. Error:${err}`,"error")
  })
  await client.login(config.token)
}
startServer().then(async() => {
    await client.logger.log(`Successfully loaded Commands and Events`,'ready')
}).catch(async (err) => {
    await client.logger.log (
        `Unable to Load Commands And Events:${err}`, 'error')
})
client.on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
    .on("error", (e ) => client.logger.log(e, "error"))
    .on("warn", (info) => client.logger.log(info, "warn"))

process.on("unhandledRejection",(err) => {
  console.error(err)
})
