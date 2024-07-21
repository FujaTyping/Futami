const { Command, container } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

const config = require("../../config.json");
const color = config.chat.color;
const emote = config.default;

class PauseCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "pause",
      aliases: ["ps"],
      description: "pause song is playing",
      preconditions: ["InVoiceChannel"],
    });
  }

  async messageRun(message, args) {
    const { client } = container;

    const queue = client.distube.getQueue(message);

    if (!queue) {
      const Content = new EmbedBuilder()
        .setColor(color)
        .setAuthor({
          name: "เตือน !!",
          iconURL: "https://futami.siraphop.me/assets/icon/warning.png",
        })
        .setDescription("ยังไม่มีเพลงที่เล่นอยู่ ลองเพิ่มมาสักเพลงดูสิ")
        .setTimestamp();

      return message.channel.send({ embeds: [Content] });
    } else {
      if (queue.paused) {
        queue.resume();

        const Content = new EmbedBuilder()
          .setColor(color)
          .setTitle("🛠️ ระบบควบคุม")
          .setDescription(`เล่นเพลง (ต่อ) : **${queue.songs[0].name}**`)
          .setFooter({
            text: `ใช้คำสั่งโดย : ${message.author.username}`,
            iconURL: message.author.avatarURL(),
          })
          .setTimestamp();

        return message.channel.send({ embeds: [Content] });
      } else {
        queue.pause();

        const Content = new EmbedBuilder()
          .setColor(color)
          .setTitle("🛠️ ระบบควบคุม")
          .setDescription(`หยุดเพลง (ชั่วคราว) : **${queue.songs[0].name}**`)
          .setFooter({
            text: `ใช้คำสั่งโดย : ${message.author.username}`,
            iconURL: message.author.avatarURL(),
          })
          .setTimestamp();

        return message.channel.send({ embeds: [Content] });
      }
    }
  }
}
module.exports = {
  PauseCommand,
};
