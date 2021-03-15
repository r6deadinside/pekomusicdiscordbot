exports.canModifyQueue = async (member) => {
    const {channelID} = member.voice
    const botChannel = member.guild.voice.channelID
    if (channelID !== botChannel) {
        member.send(`You need to join the voice channel first!`)
            .catch(err => console.error(err))
        return false
    }
    return true
}
let config = require('./client.json')
if (config.length() === null)
    console.log(`Your Json file is empty , pls add something in there`)
        .catch(error => console.error(error))
else {
    /**
     * Will export JSON objects if JSON is not empty
     * but if you using .env it will export from env
     * Main priority on JSON , so please use JSON
     * @type {string|string}
     */
    exports.YOUTUBE_API_KEY = config ? config.YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY
    exports.SOUNDCLOUD_CLIENT_ID = config ? config.SOUNDCLOUD_CLIENT_ID : process.env.SOUNDCLOUD_CLIENT_ID
    exports.SPOTIFY_API_KEY = config ? config.SPOTIFY_API_KEY : process.env.SPOTIFY_API_KEY
    exports.MAX_PLAYLIST_SIZE = config ? config.MAX_PLAYLIST_SIZE : process.env.MAX_PLAYLIST_SIZE
    exports.PRUNING = config ? config.PRUNING : process.env.PRUNING
    exports.STAY_TIME = config ? config.STAY_TIME : process.env.STAY_TIME
    exports.DEFAULT_VOLUME = config ? config.DEFAULT_VOLUME : process.env.DEFAULT_VOLUME
}