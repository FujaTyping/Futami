const { isMessageInstance } = require("@sapphire/discord.js-utilities");
const { Command } = require("@sapphire/framework");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");

const config = require("../../config.json");
const color = config.chat.color;
const emote = config.default;

class UrlCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("url")
        .setDescription("มีปัญหากับลิ้งค์หรอ ??")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("อยากทำอะไรหละ !!")
            .addChoices(
              { name: "Shorten", value: "shorten" },
              { name: "Un Shorten", value: "unshorten" },
            )
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("ใส่ลิ้งค์มาเลย !!")
            .setRequired(true),
        ),
    );
  }

  async chatInputRun(interaction) {
    const Action = interaction.options.getString("action");
    const Url = interaction.options.getString("url");

    const Content = new EmbedBuilder()
      .setColor(color)
      .setTitle("🔗 เครื่องมือลิ้งค์")
      .setDescription("กำลังดำเนินการ ..")
      .setTimestamp();

    const msg = await interaction.reply({
      embeds: [Content],
      fetchReply: true,
    });

    if (Action == "shorten") {
      axios
        .get(`https://is.gd/create.php?format=simple&url=${Url}`)
        .then((response) => {
          const Response = response.data;

          const Content = new EmbedBuilder()
            .setColor(color)
            .setAuthor({
              name: "ย่อลิ้งค์สำเร็จแล้ว !",
              iconURL: "https://futami.siraphop.me/assets/icon/checked.png",
            })
            .addFields(
              {
                name: "**⛓️ ลิ้งค์ที่ย่อแล้ว**",
                value: `${Response}`,
                inline: true,
              },
              { name: "**🖇️ ลิ้งค์ต้อนฉบับ**", value: `${Url}`, inline: true },
            )
            .setTimestamp();

          const Button = new ButtonBuilder()
            .setLabel("ดูลิ้งค์ที่ย่อแล้ว")
            .setURL(Response)
            .setStyle(ButtonStyle.Link);

          const Row = new ActionRowBuilder().addComponents(Button);

          return interaction.editReply({
            embeds: [Content],
            components: [Row],
          });
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
    } else if (Action == "unshorten") {
      axios
        .get(`https://unshorten.me/json/${Url}`)
        .then((response) => {
          const Response = response.data;

          const Content = new EmbedBuilder()
            .setColor(color)
            .setAuthor({
              name: "ยกเลิกการย่อลิ้งค์สำเร็จแล้ว !",
              iconURL: "https://futami.siraphop.me/assets/icon/checked.png",
            })
            .addFields(
              {
                name: "**⛓️‍💥 ลิ้งค์ต้อนฉบับ**",
                value: `${Response.resolved_url}`,
                inline: true,
              },
              {
                name: "**⛓️ ลิ้งค์ที่ย่อแล้ว**",
                value: `${Url}`,
                inline: true,
              },
            )
            .setTimestamp();

          const Button = new ButtonBuilder()
            .setLabel("ดูลิ้งค์ต้นฉบับ")
            .setURL(Response.resolved_url)
            .setStyle(ButtonStyle.Link);

          const Row = new ActionRowBuilder().addComponents(Button);

          return interaction.editReply({
            embeds: [Content],
            components: [Row],
          });
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
}
module.exports = {
  UrlCommand,
};
