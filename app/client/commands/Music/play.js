const { play } = require('../../include/play')
const ytdl = require('ytdl-core')
const YouTubeAPI = require('simple-youtube-api')
const scdl = require('soundcloud-downloader').default
const https = require('https')
const {
    YOUTUBE_API_KEY,
    SOUNDCLOUD_CLIENT_ID,
    DEFAULT_VOLUME
} = require('../../../BackEnd/config/config')
const youtube = new YouTubeAPI(YOUTUBE_API_KEY)
const {MessageEmbed} = require('discord.js')

module.exports = {
  name: "play",
  description: "Command for playing music from YouTube and SoundCloud",
  usage: "play <Song Name> || <YouTube Link> || <SoundCloud Link>",
  enabled: true,
  aliases: ['p'],
  category: "Music",
  memberPermissions: [],
  botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
  nsfw: false,
  cooldown: 3000,
  ownerOnly: false,

  async execute (client,message, args,data) {

    const { channel } = message.member.voice

      const serverQueue = message.client.queue.get(data.guild.id)

      let userNotInVoiceChannel = new MessageEmbed()
        .setTitle(`You need to join a voice channel first!`)
        .setColor(data.config.color)
        .setFooter(data.config.footer)

      let usageEmbed = new MessageEmbed()
          .setTitle(`**${data.guild.prefix}play <YouTube URL> | Song Name | SoundCloud URL**`)
          .setColor(data.config.color)
          .setFooter(data.config.footer)

      let mustBeInSameChannel = new MessageEmbed()
          .setTitle(`You must be in the same channel as bot`)
          .setColor(data.config.color)
          .setFooter(data.config.footer)

      if (!channel) return message.channel.send(userNotInVoiceChannel)
          .catch(console.error)

      if (serverQueue && channel !== message.guild.me.voice.channel)
          return message.channel.send(mustBeInSameChannel)
              .catch(console.error);

      if (!args.length)
          return message
              .channel.send(usageEmbed)
              .catch(console.error);

      const permissions = channel.permissionsFor(message.client.user)
      if (!permissions.has("CONNECT"))
          return message.reply("Cannot connect to voice channel, missing permissions");
      if (!permissions.has("SPEAK"))
          return message.reply("I cannot speak in this voice channel, make sure I have the proper permissions!")

      let video = {
          search: args.join(" "),
          videoPattern: /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi,
          playlistPatter: /^.*(list=)([^#&?]*).*/gi,
          scRegex: /^https?:\/\/(soundcloud\.com)\/(.*)$/,
          mobileScRegex: /^https?:\/\/(soundcloud\.server\.goo\.gl)\/(.*)$/,
          url: args[0],
          urlValid: null
      }
      video.urlValid = video.videoPattern.test(args[0])


      // Start the playlist if playlist url was provided
      if (!video.videoPattern.test(args[0]) && video.playlistPatter.test(args[0])) {
          return message.client.commands.get("playlist").execute(message, args);
      } else if (scdl.isValidUrl(video.url) && video.url.includes("/sets/")) {
          return message.client.commands.get("playlist").execute(message, args);
      }

      if (video.mobileScRegex.test(video.url)) {
          try {
              https.get(video.url, (res) => {
                  if (res.statusCode === 302) {
                      return message.client.commands.get("play")
                          .execute(message, [res.headers.location])
                  } else {
                      return message.reply("No content could be found at that url.")
                          .catch(console.error)
                  }
              })
      } catch (error) {
        console.error(error)
        return message.reply(error.message)
            .catch(console.error)
      }
      return message.reply("Following url redirection...")
          .catch(console.error);
    }
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME || 100,
      playing: true
    }
    let songInfo = null, song = null
      if (video.urlValid) {
          try {
              songInfo = await ytdl.getInfo(video.url);
              song = {
                  title: songInfo.videoDetails.title,
                  url: songInfo.videoDetails.video_url,
                  duration: songInfo.videoDetails.lengthSeconds
              };
          } catch (error) {
              console.error(error)
              return message.reply(error.message)
                  .catch(console.error)
          }
      } else if (video.scRegex.test(video.url)) {
          try {
              const trackInfo = await scdl.getInfo(video.url, SOUNDCLOUD_CLIENT_ID)
              song = {
                  title: trackInfo.title,
                  url: trackInfo.permalink_url,
                  duration: Math.ceil(trackInfo.duration / 1000)
              }
          } catch (error) {
              console.error(error)
              return message.reply(error.message)
                  .catch(console.error)
          }
    } else {
      try {
          const results = await youtube.searchVideos(video.search, 1)
        songInfo = await ytdl.getInfo(results[0].url)
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        }
      } catch (error) {
        console.error(error)
        return message.reply(error.message)
            .catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(`✅ **${song.title}** has been added to the queue by ${message.author}`)
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join()
      await queueConstruct.connection.voice.setSelfDeaf(true)
      await play(queueConstruct.songs[0], message)
    } catch (error) {
      console.error(error)
      message.client.queue.delete(message.guild.id);
      await channel.leave()
      return message.channel.send(`Could not join the channel: ${error}`)
          .catch(console.error)
    }
  }
}
