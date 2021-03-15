module.exports = async (client) => {
    try {
        await client.user.setPresence({
            activity: {
                name: `help and play`,
                type: "LISTENING"
            },
            status: "online"
        })
        await client.logger.ready(`${client.user.tag} is now up and running!`)
    } catch (error) {
        console.error(error)
    }
}
