const { Command } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

const config = require("../config.json");
const color = config.chat.color;

class PingCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "ping",
      aliases: ["pong"],
      description: "check a bot response",
    });
  }

  async messageRun(message) {
    const msg = await message.reply("กำลังทดสอบ ...");

    const Latency = Math.round(this.container.client.ws.ping);
    const API = msg.createdTimestamp - message.createdTimestamp;

    const Content = new EmbedBuilder()
      .setColor(color)
      .setTitle("ผลการทดสอบ 🏓")
      .setDescription(
        "🤖 ความล่าช้าของ **บอท** : " +
          Latency +
          " มิลลิวินาที\n🪐 ความล่าช้าของ **API** : " +
          API +
          " มิลลิวินาที",
      )
      .setTimestamp();

    return msg.edit({ content: "ทดสอบเสร็จล่ะ !!", embeds: [Content] });
  }
}
module.exports = {
  PingCommand,
};
