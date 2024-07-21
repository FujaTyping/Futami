const { isMessageInstance } = require("@sapphire/discord.js-utilities");
const { Command, err } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

const config = require("../../config.json");
const color = config.chat.color;
const emote = config.default;

class LyricsCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("lyrics")
        .setDescription("อยากรู้จักเนื้อเพลงจัง ??")
        .addStringOption((option) =>
          option
            .setName("song")
            .setDescription("เลือกเพลงมาเลย !!")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option.setName("artist").setDescription("เพลงนี้ของใคร ??"),
        ),
    );
  }

  async chatInputRun(interaction) {
    const Song = interaction.options.getString("song");
    const AuthorSong = interaction.options.getString("artist") ?? false;
    let Url;

    const Content = new EmbedBuilder()
      .setColor(color)
      .setTitle("🔍 ค้นหาเนื้อเพลง")
      .setDescription("กำลังค้นหาเนื้อเพลง ..")
      .setTimestamp();

    const msg = await interaction.reply({
      embeds: [Content],
      fetchReply: true,
    });

    if (AuthorSong) {
      Url = `/${Song}/${AuthorSong}`;
    } else {
      Url = `/${Song}`;
    }

    axios
      .get(`https://lyrist.vercel.app/api${Url}`)
      .then((response) => {
        const Response = response.data;

        if (!Response.lyrics) {
          const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle(`🔍 ค้นหาเนื้อเพลง`)
            .setDescription(
              `ไม่พบเนื้อเพลง : **${Song}**\nลองใส่ผู้แต่ง หรือ หาเพลงอื่นมาดูสิ !!`,
            )
            .setThumbnail(Response.image)
            .setTimestamp();

          return interaction.editReply({ embeds: [Content] });
        } else {
          const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle(`🔍 ค้นหาเนื้อเพลง`)
            .setDescription(
              `เพลง : **${Response.title}**\nผู้แต่ง : \`${Response.artist}\`\n\n**เนื้อเพลง**\n${Response.lyrics.replaceAll("[", "**[").replaceAll("]", "]**")}`,
            )
            .setThumbnail(Response.image)
            .setTimestamp();

          return interaction.editReply({ embeds: [Content] });
        }
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
  LyricsCommand,
};
