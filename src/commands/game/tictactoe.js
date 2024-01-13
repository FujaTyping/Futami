const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { TicTacToe } = require('discord-gamecord');

const { colorHex } = require('../../config.json');

class TicTacToeCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('tictactoe').setDescription('เกม X/O (ทิก-แทก-โท)')
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('แข่งกับใครดี ??')
                        .setRequired(true)
                )
        );
    }

    async chatInputRun(interaction) {
        const Game = new TicTacToe({
            message: interaction,
            isSlashGame: true,
            opponent: interaction.options.getUser('user'),
            embed: {
                title: 'เกม ❌/⭕ (ทิก-แทก-โท)',
                color: colorHex,
                statusTitle: 'สถานะ',
                overTitle: 'เกมจบแล้ว',
                requestTitle: 'คำขอเชิญให้ร่วมเล่นเกม',
                requestColor: colorHex,
                rejectTitle: 'ยกเลิกคำของแล้ว',
                rejectColor: colorHex
            },
            emojis: {
                xButton: '✖',
                oButton: '⭕',
                blankButton: '➖'
            },
            buttons: {
                accept: 'เล่นด้วย',
                reject: 'ไม่ดีกว่า'
            },
            mentionUser: true,
            timeoutTime: 60000,
            xButtonStyle: 'DANGER',
            oButtonStyle: 'PRIMARY',
            turnMessage: '{emoji} | เป็นเทร์นของผู้เล่น **{player}**.',
            winMessage: '{emoji} | ผู้เล่น **{player}** ชนะเกม X/O ในเกมนี้',
            tieMessage: 'เกมเสอมกัน ! ไม่มีใครชนะในเกมนี้',
            timeoutMessage: 'ดูเหมือนว่าเวลาหมดแล้ว เกมยังไม่จบ แต่ก็ ไม่มีใครชนะในเกมนี้ !',
            playerOnlyMessage: 'มีแค่ ผู้เล่น {player} และ {opponent} สามารถเล่นได้',
            reqTimeoutTime: 30000,
            requestMessage: 'ผู้เล่น {player} เชิญคุณให้เล่นเกม X/O ในตานี้',
            rejectMessage: 'ผู้เล่นยกเลิกคำขอของคุณ ในการเล่นเกมรอบนี้',
            reqTimeoutMessage: 'ผู้เล่นไม่ได้ตอบรับคำขอ และเกมจะไม่เริ่ม'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            /*console.log(result);*/
        });
    }
}
module.exports = {
    TicTacToeCommand
};