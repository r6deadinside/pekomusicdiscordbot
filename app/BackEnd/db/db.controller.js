const usersDB = require("./schema/user.js")
const guildsDB = require("./schema/guild.js")
const membersDB = require('./schema/member')
module.exports.getUserDB = async (userID) => {

  let userDB = await usersDB.findOne({
          id: userID
  })
  if(userDB) return userDB
  else {
    userDB = new usersDB({
      id: userID
    })
    await userDB.save().catch(err => console.log(err))
    return userDB
  }
}

module.exports.getGuildDB = async (guildID) => {

    let guildDB = await guildsDB.findOne({
        id: guildID
    })

    if (guildDB) return guildDB
    else {
        guildDB = new guildsDB({
            id: guildID
        })
        await guildDB.save().catch(err => console.log(err))
        return guildDB
    }
}

module.exports.getMemberDB = async (userID, guildID) => {

  let memberDB = await membersDB.findOne({
      id: userID,
      guildID: guildID
  })
  if(memberDB) return memberDB;
  else {
      memberDB = new membersDB({
          id: userID,
          guildID: guildID
      })
      await memberDB.save().catch(err => console.error(err))
    return memberDB
  }
}
