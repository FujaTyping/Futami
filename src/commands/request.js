const { isMessageInstance } = require("@sapphire/discord.js-utilities");
const { Command } = require("@sapphire/framework");
const {
  EmbedBuilder,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const config = require("../config.json");
const color = config.chat.color;

class RequestCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName("request").setDescription("อยากขออะไรฟูตามิหละ ??"),
    );
  }

  async chatInputRun(interaction) {
    const Modal = new ModalBuilder()
      .setCustomId("RequestModal")
      .setTitle("ฟูตามิ | ความคิดเห็น");

    const FutamiScoreInput = new TextInputBuilder()
      .setCustomId("FutamiscoreInput")
      .setMaxLength(50)
      .setLabel("คิดเห็นยังไงกับฟูตามิ ตอนนี้ ??")
      .setStyle(TextInputStyle.Short);

    const FutamiRecomendInput = new TextInputBuilder()
      .setCustomId("FutamirecomendInput")
      .setMaxLength(200)
      .setLabel("อยากให้ฟูตามิเพิ่มอะไรเข้ามา บอกได้เลยนะ !!")
      .setStyle(TextInputStyle.Paragraph);

    const FirstActionRow = new ActionRowBuilder().addComponents(
      FutamiScoreInput,
    );
    const SecondActionRow = new ActionRowBuilder().addComponents(
      FutamiRecomendInput,
    );

    Modal.addComponents(FirstActionRow, SecondActionRow);

    await interaction.showModal(Modal);
  }
}
module.exports = {
  RequestCommand,
};
