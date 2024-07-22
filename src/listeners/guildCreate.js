const { Listener, container } = require("@sapphire/framework");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const config = require("../config.json");
const color = config.chat.color;

class GuildCreateListener extends Listener {
  run(guild) {
    const { client } = container;
    const Channel = client.channels.cache.get("1247044218657046589");

    const Img = new EmbedBuilder()
      .setColor(color)
      .setImage("https://futami.siraphop.me/assets/banner/Card-Futami.png");

    const Content = new EmbedBuilder()
      .setColor(color)
      .setTitle(
        `😘 สวัสดี ! ฟูตามิขอขอบคุณที่เชิญฟูตามิเข้าเซิร์ฟเวอร์ ${guild.name}`,
      )
      .setDescription(
        "สามารถใช้คำสั่งได้ทั้ง 2 แบบ คือ : `/` Slash command และ `f.` Prefix\n\n**นี้คือคำสั่งบางส่วนของฟูตามิ**\n- `/about` : ดูข้อมูลเกี่ยวกับบอท\n- `/info` : ดูข้อมูลเกี่ยวกับระบบ\n\nส่วนคำสั่งที่ใช้ `f.` สามารถดูวิธีการใช้ได้ที่เว็ปไซต์\nอยากลองคุยกับฟูตามิดูไหมหละ ลองพิพม์ **ฟูตามิ** หรือ <@1155156868554043484> ดูสิ!",
      )
      .setFooter({ text: `ข้อความอัตโนมัติ` })
      .setTimestamp();

    const LogContent = new EmbedBuilder()
      .setColor(color)
      .setTitle(`📈 ฟูตามิถูกเชิญเข้าสู่เชิฟเวอร์ใหม่`)
      .setDescription(
        `เชิฟเวอร์ **${guild.name}** | ฟูตามิอยู่ใน \`${client.guilds.cache.size}\` เชิฟเวอร์\n**✒️ เชิฟเวอร์ไอดี** : ${guild.id} \n**🧒🏻 จำนวนคนในเชิฟเวอร์** : \`${guild.memberCount}\`\n**🧔🏻‍♂️ เจ้าของเชิฟเวอร์** : <@${guild.ownerId}>\n**🌐 เชิฟเวอร์อยู่ในประเทศ** : ${guild.preferredLocale}`,
      )
      .setFooter({ text: `ข้อความอัตโนมัติ` })
      .setTimestamp();

    const Button = new ButtonBuilder()
      .setLabel("เว็ปไซต์ของฟูตามิ")
      .setURL("https://futami.siraphop.me/")
      .setStyle(ButtonStyle.Link);

    const Help = new ButtonBuilder()
      .setLabel("วิธีการใช้ฟูตามิ")
      .setURL("https://futami.siraphop.me/instruction")
      .setStyle(ButtonStyle.Link);

    const Row = new ActionRowBuilder().addComponents(Button, Help);

    guild.systemChannel.send({ embeds: [Img, Content], components: [Row] });
    Channel.send({ embeds: [LogContent] });
  }
}
module.exports = {
  GuildCreateListener,
};
