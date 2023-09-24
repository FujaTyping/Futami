const { Listener } = require('@sapphire/framework');
const { ActivityType } = require('discord.js');

class ReadyListener extends Listener {
    run(client) {
        client.user.setPresence({
            activities: [{
                name: `at Voice Channel`,
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/anime"
            }]
        });
    }
}
module.exports = {
    ReadyListener
};