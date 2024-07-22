const { Listener } = require("@sapphire/framework");
const { ActivityType, ActivityPlatform } = require("discord.js");

class ReadyListener extends Listener {
  async run(client) {
    const ActivityText = [
      `in ${client.guilds.cache.size} Servers`,
      "at Voice Channel",
      `with ${client.users.cache.size} Users`,
      `with you`,
    ];

    setInterval(() => {
      const RandomActivityText = Math.floor(
        Math.random() * ActivityText.length,
      );

      client.user.setPresence({
        activities: [
          {
            name: ActivityText[RandomActivityText],
            type: ActivityType.Streaming,
            url: "https://www.twitch.tv/anime",
          },
        ],
      });
    }, 30000);
  }
}
module.exports = {
  ReadyListener,
};
