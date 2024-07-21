const { Listener, container } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

const config = require("../config.json");
const color = config.chat.color;

class GuildDeleteListener extends Listener {
  run(guild) {
    const { client } = container;
    const Channel = client.channels.cache.get("1247044218657046589");

    const LogContent = new EmbedBuilder()
      .setColor(color)
      .setTitle(`📉 ฟูตามิออกจากเชิฟเวอร์แล้ว`)
      .setDescription(
        `เชิฟเวอร์ **${guild.name}** | ฟูตามิอยู่ใน \`${client.guilds.cache.size}\` เชิฟเวอร์\n**✒️ เชิฟเวอร์ไอดี** : ${guild.id}\n**🧔🏻‍♂️ เจ้าของเชิฟเวอร์** : <@${guild.ownerId}>`,
      )
      .setFooter({ text: `ข้อความอัตโนมัติ` })
      .setTimestamp();

    Channel.send({ embeds: [LogContent] });
  }
}
module.exports = {
  GuildDeleteListener,
};
