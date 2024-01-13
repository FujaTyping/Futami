const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');

const { color, colorHex } = require('../../config.json');

class TicTacToeCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('tictactoe').setDescription('เกม เอกซ์-โอ (XO)')
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('แข่งกับใครดี ??')
                        .setRequired(true)
                )
        );
    }

    async chatInputRun(interaction) {
        if (interaction.user == interaction.options.getUser('user')) {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('🔶 ไม่สามารถเริ่มเกมได้')
                .setDescription('คุณไม่สามารถเล่นเกมกับตัวเองได้ , ลองหาเพื่อนสักคนมาเล่นด้วยกันสิ !')

            const msg = await interaction.reply({ embeds: [Content] });
        } else {
            const Game = new TicTacToe({
                message: interaction,
                isSlashGame: true,
                opponent: interaction.options.getUser('user'),
                embed: {
                    title: 'เกม เอกซ์-โอ (ทิก-แทก-โท)',
                    color: colorHex,
                    statusTitle: 'สถานะเกม',
                    overTitle: 'เกมจบลงแล้ว',
                    requestTitle: '🔷 คำขอเชิญให้ร่วมเล่นเกม',
                    requestColor: colorHex,
                    rejectTitle: '🔶 ยกเลิกคำขอแล้ว',
                    rejectColor: colorHex
                },
                emojis: {
                    xButton: '✖',
                    oButton: '⭕',
                    blankButton: '❔'
                },
                buttons: {
                    accept: 'เล่นด้วย',
                    reject: 'ไม่ดีกว่า'
                },
                mentionUser: true,
                timeoutTime: 60000,
                xButtonStyle: 'DANGER',
                oButtonStyle: 'SECONDARY',
                turnMessage: 'เป็นตาของผู้เล่น **{player}** ({emoji})',
                winMessage: '🎉 ผู้เล่น **{player}** ({emoji}) ชนะเกม เอกซ์-โอ ในรอบนี้',
                tieMessage: 'เสอมกัน ไม่มีใครชนะในรอบนี !',
                timeoutMessage: '⏰ ดูเหมือนว่าเวลาหมดแล้ว เกมยังไม่จบ แต่ก็ ไม่มีใครชนะในเกมนี้ !',
                playerOnlyMessage: 'มีแค่ ผู้เล่น {player} และ {opponent} สามารถเล่นได้',
                reqTimeoutTime: 30000,
                requestMessage: 'ผู้เล่น {player} เชิญคุณให้เล่นเกม เอกซ์-โอ (XO) ในรอบนี้',
                rejectMessage: 'ผู้เล่นยกเลิกคำขอ ในการเล่นเกมรอบนี้',
                reqTimeoutMessage: 'ผู้เล่นไม่ได้ตอบรับคำขอ และเกมจะไม่เริ่ม'
            });

            Game.startGame();
            Game.on('gameOver', result => {
                /*console.log(result);*/
            });
        }
    }
}
module.exports = {
    TicTacToeCommand
};
