const { isMessageInstance } = require("@sapphire/discord.js-utilities");
const { Command } = require("@sapphire/framework");
const { EmbedBuilder, Message, PermissionsBitField } = require("discord.js");

const config = require("../../config.json");
const color = config.chat.color;
const emote = config.default;

class TimeoutCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      preconditions: ["AdminOnly"],
    });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("timeout")
        .setDescription("มีคนทำผิดกฏหรอ ??")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("ใครเป็นคนทำ !!")
            .setRequired(true),
        )
        .addNumberOption((option) =>
          option
            .setName("duration")
            .setDescription("นานไหม ??")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("มีเหตุผลป่าว ??"),
        ),
    );
  }

  async chatInputRun(interaction) {
    const User = interaction.options.getUser("user");
    const Rawtime = interaction.options.getNumber("duration");
    const Reason = interaction.options.getString("reason") ?? "ไม่มีเหตุผล";
    const Guild = interaction.guild;

    const Guilduser = await Guild.members.fetch(User);
    const Time = Rawtime * 60 * 1000;

    await Guilduser.timeout(Time, Reason);

    const Content = new EmbedBuilder()
      .setColor(color)
      .setTitle(`🪄 ระบบจัดการเชิฟเวอร์`)
      .setThumbnail(User.avatarURL())
      .setDescription(
        `${User} โดน Timeout\nระยะเวลา : **${Rawtime}** นาที\nเหตุผล : \`${Reason}\``,
      )
      .setFooter({
        text: `ใช้คำสั่งโดย : ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL(),
      })
      .setTimestamp();

    return interaction.reply({ embeds: [Content] });
  }
}
module.exports = {
  TimeoutCommand,
};
