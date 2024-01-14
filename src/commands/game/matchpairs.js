const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder, Emoji } = require('discord.js');
const { MatchPairs } = require('discord-gamecord');

const { colorHex } = require('../../config.json');
const { Emojis } = require('./data/emoji.json');

class MatchPairsCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('matchpairs').setDescription('เกม จับคู่อิโมจิ')
        );
    }

    async chatInputRun(interaction) {
        const Game = new MatchPairs({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'เกม จับคู่อิโมจิ',
                color: colorHex,
                description: '⏰ คุณมีเวลา **∞ วินาที** ที่จะจับคู่อิโมจิทั้งหมด\nกดปุ่มด้านล่างเพื่อจับคู่อิโมจิ'
            },
            emojis: GetRandomEmojisArray(Emojis, 12),
            winMessage: '🎉 คุณชนะ ! คุณเปิดแผ่นไปทั้งหมด **{tilesTurned} แผ่น**',
            loseMessage: '🚨 คุณแพ้ ! คุณเปิดแผ่นไปทั้งหมด **{tilesTurned} แผ่น**',
            playerOnlyMessage: 'มีแค่ ผู้เล่น {player} ที่สามารถเล่นได้'
        });

        Game.startGame();
        Game.on('gameOver', result => {
            /*console.log(result);*/
        });
    }
}

const GetRandomEmojisArray = (array, count) => {
    const Shuffled = array.slice().sort(() => Math.random() - 0.5);
    return Shuffled.slice(0, count);
};

module.exports = {
    MatchPairsCommand
};
