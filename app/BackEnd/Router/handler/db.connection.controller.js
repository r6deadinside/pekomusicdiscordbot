const config = require("../../config/client.json")
const mongoose = require ('mongoose')

mongoose.connect(config.mongoDB).then(async () => {
    console.log(``)
})