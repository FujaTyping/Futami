const { Listener } = require('@sapphire/framework');
const { ActivityType } = require('discord.js');

class ReadyListener extends Listener {
    run(client) {
        const ActivityText = [`in ${client.guilds.cache.size} Servers`, 'at Voice Channel', 'with You']

        setInterval(() => {
            const RandomActivityText = Math.floor(Math.random() * ActivityText.length);

            client.user.setPresence({
                activities: [{
                    name: ActivityText[RandomActivityText],
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/anime"
                }]
            });
        }, 15000)
    }
}
module.exports = {
    ReadyListener
};