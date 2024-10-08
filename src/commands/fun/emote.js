const { isMessageInstance } = require("@sapphire/discord.js-utilities");
const { Command, err } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

const config = require("../../config.json");
const color = config.chat.color;
const emote = config.default;

const Choices = [
  { name: "กอด", value: "hug" },
  { name: "จูบ", value: "kiss" },
  { name: "บองก์", value: "bonk" },
  { name: "ยีท", value: "yeet" },
  { name: "โบกมือ ให้", value: "wave" },
  { name: "ไฮไฟว์ กับ", value: "highfive" },
  { name: "จับมือ", value: "handhold" },
  { name: "ตบ", value: "slap" },
  { name: "ฆ่า", value: "kill" },
  { name: "เตะ", value: "kick" },
  { name: "กัด", value: "bite" },
  { name: "เต้น กับ", value: "dance" },
  { name: "ยิ้ม ให้", value: "smile" },
  { name: "ร้องให้ กับ", value: "cry" },
  { name: "มีความสุข กับ", value: "happy" },
  { name: "ลูบหัว", value: "pat" },
];

class EmoteCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("emote")
        .setDescription("อยากแสดงอารมณ์แบบไหนกัน ??")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("เลือกท่าทางมาเลย !!")
            .addChoices(Choices)
            .setRequired(true),
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("อยากแสดงอารมณ์ใส่ใครละ ??")
            .setRequired(true),
        ),
    );
  }

  async chatInputRun(interaction) {
    const Action = interaction.options.getString("action");
    const User = interaction.options.getUser("user");

    const Emote = Choices.find((choice) => choice.value === Action)?.name;

    const Content = new EmbedBuilder()
      .setColor(color)
      .setTitle("😀 ท่าทาง")
      .setDescription("กำลังเลือกท่าทางที่ดีที่สุด ..")
      .setTimestamp();

    const msg = await interaction.reply({
      embeds: [Content],
      fetchReply: true,
    });

    axios
      .get(`https://api.waifu.pics/sfw/${Action}`)
      .then((response) => {
        const Response = response.data;

        const Content = new EmbedBuilder()
          .setColor(color)
          .setTitle(`😀 ท่าทาง`)
          .setDescription(`<@${interaction.user.id}> ${Emote} ${User}`)
          .setImage(`${Response.url}`)
          .setTimestamp();

        return interaction.editReply({ embeds: [Content] });
      })
      .catch((error) => {
        const Content = new EmbedBuilder()
          .setColor(color)
          .setAuthor({
            name: "เกิดอะไรขึ้น ??",
            iconURL: "https://futami.siraphop.me/assets/icon/error.png",
          })
          .setDescription("```\n" + error + "\n```")
          .setTimestamp();

        return interaction.editReply({ embeds: [Content] });
      });
  }
}
module.exports = {
  EmoteCommand,
};
