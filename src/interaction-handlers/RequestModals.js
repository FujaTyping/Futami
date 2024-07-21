const {
  InteractionHandler,
  InteractionHandlerTypes,
  container,
} = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

const color = config.chat.color;

class RequestModalHandler extends InteractionHandler {
  constructor(ctx, options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
    });
  }

  parse(interaction) {
    if (interaction.customId !== "RequestModal") return this.none();

    return this.some();
  }

  async run(interaction) {
    const { client } = container;
    const Channel = client.channels.cache.get("1247044218657046589");

    const Content = new EmbedBuilder()
      .setColor(color)
      .setAuthor({
        name: "ส่งแบบฟอร์มเรียบร้อยแล้ว !!",
        iconURL: "https://futami.siraphop.me/assets/icon/checked.png",
      })
      .setDescription(
        "ขอบคุณที่ให้คำแนะนำฟูตามิ , เราจะพัฒนาฟูตามิให้ดียิ่งขั้น 🩵",
      )
      .setTimestamp();

    await interaction.reply({ embeds: [Content] });

    const FormContent = new EmbedBuilder()
      .setColor(color)
      .setTitle("📥 แบบฟอร์มคำแนะนำฟูตามิ")
      .setDescription(
        `**กรอกข้อมูลโดย** : <@${interaction.user.id}> \`(${interaction.user.username})\``,
      )
      .addFields(
        {
          name: "1️⃣ **คิดเห็นยังไงกับฟูตามิ ตอนนี้ ??**",
          value: `${interaction.fields.getTextInputValue("FutamiscoreInput")}`,
        },
        {
          name: "2️⃣ **อยากให้ฟูตามิเพิ่มอะไรเข้ามา บอกได้เลยนะ !!**",
          value: `${interaction.fields.getTextInputValue("FutamirecomendInput")}`,
        },
      )
      .setFooter({ text: "ความคิดเห็นจากผู้ใช้" })
      .setTimestamp();

    Channel.send({ embeds: [FormContent] });
  }
}
module.exports = {
  RequestModalHandler,
};
