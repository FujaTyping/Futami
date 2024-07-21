const { isMessageInstance } = require("@sapphire/discord.js-utilities");
const { Command } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");
const { TicTacToe } = require("discord-gamecord");

const config = require("../../config.json");
const color = config.chat.color;
const colorHex = config.chat.colorHex;

class TicTacToeCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("tictactoe")
        .setDescription("เล่นเกมเอกซ์-โอไหม ??")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("แข่งกับใครดี ??")
            .setRequired(true),
        ),
    );
  }

  async chatInputRun(interaction) {
    if (interaction.user == interaction.options.getUser("user")) {
      const Content = new EmbedBuilder()
        .setColor(color)
        .setTitle("🔶 เริ่มเกมไม่ได้ !!")
        .setDescription(
          "เล่นเกมกับตัวเองไม่ได้นะ !! , ให้เพื่อนสักคนมาเล่นด้วยกันสิ 😀 หรือว่าจะมาคุยกับ ฟูตามิ แทนดี ?",
        );

      const msg = await interaction.reply({ embeds: [Content] });
    } else {
      const Game = new TicTacToe({
        message: interaction,
        isSlashGame: true,
        opponent: interaction.options.getUser("user"),
        embed: {
          title: "เกม เอกซ์-โอ (XO)",
          color: colorHex,
          statusTitle: "สถานะเกม",
          overTitle: "เกมจบแล้ว !!",
          requestTitle: "🔷 มึคนส่งคำขอเล่นเกมให้คุณด้วย !!",
          requestColor: colorHex,
          rejectTitle: "🔶 ยกเลิกคำขอแล้ว :(",
          rejectColor: colorHex,
        },
        emojis: {
          xButton: "✖",
          oButton: "⭕",
          blankButton: "❔",
        },
        buttons: {
          accept: "เล่นด้วย",
          reject: "ไม่ดีกว่า",
        },
        mentionUser: true,
        timeoutTime: 60000,
        xButtonStyle: "DANGER",
        oButtonStyle: "SECONDARY",
        turnMessage: "ตาของ **{player}** ({emoji})",
        winMessage:
          "🎉 ดีใจด้วย !! **{player}** ({emoji}) ชนะเกม เอกซ์-โอ ในรอบนี้",
        tieMessage: "☁ เสอมกัน ไม่มีใครชนะในรอบนี !! อีกรอบไหมหละ ??",
        timeoutMessage:
          "⏰ ดูเหมือนว่าเวลาหมดแล้ว เกมยังไม่จบ แต่ก็ ไม่มีใครชนะในเกมนี้ !!",
        playerOnlyMessage: "มีแค่ {player} และ {opponent} ที่เล่นได้",
        reqTimeoutTime: 30000,
        requestMessage: "{player} เชิญให้เล่นเกม เอกซ์-โอ (XO) ในรอบนี้",
        rejectMessage: "ยกเลิกคำขอ ในการเล่นเกมรอบนี้แล้ว",
        reqTimeoutMessage: "ไม่ได้ตอบรับคำขอในเวลาที่กำหนด",
      });

      Game.startGame();
      Game.on("gameOver", (result) => {
        /*console.log(result);*/
      });
    }
  }
}
module.exports = {
  TicTacToeCommand,
};
