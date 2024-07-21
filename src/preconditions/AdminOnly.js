const { Precondition } = require("@sapphire/framework");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const config = require("../config.json");

const color = config.chat.color;
const emote = config.default;

class AdminOnlyPrecondition extends Precondition {
  async messageRun(message) {
    return this.checkAdmin(message);
  }

  async chatInputRun(interaction) {
    return this.checkAdmin(interaction);
  }

  async contextMenuRun(interaction) {
    return this.checkAdmin(interaction);
  }

  async checkAdmin(Action) {
    const Guild = Action.guild;
    const Fetchuser = Guild.members.cache.get(Action.user.id);

    const Content = new EmbedBuilder()
      .setColor(color)
      .setAuthor({
        name: "เตือน !!",
        iconURL: "https://futami.siraphop.me/assets/icon/warning.png",
      })
      .setDescription(
        `<@${Action.user.id}> คิดจะทำอะไรหนะ ??\nถ้าจะใช้คำสั่งนี้ต้องมีสิทธ์ **Administrator** ก่อน !!`,
      )
      .setTimestamp();

    return Fetchuser.permissions.has(PermissionsBitField.Flags.Administrator)
      ? this.ok()
      : this.error(Action.reply({ embeds: [Content] }));
  }
}
module.exports = {
  AdminOnlyPrecondition,
};
