const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder, Emoji } = require('discord.js');
const { MatchPairs } = require('discord-gamecord');

const config = require('../../config.json');
const colorHex = config.chat.colorHex
const { Emojis } = require('./data/emoji.json');

class MatchPairsCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('matchpairs').setDescription('มาเล่นเกมจับคู่อิโมจิกับเราไหม ??')
        );
    }

    async chatInputRun(interaction) {
        const Game = new MatchPairs({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'เกม จับคู่อิโมจิ',
                color: colorHex,
                description: '⏰ มีเวลา **∞ วินาที** ที่จะจับคู่อิโมจิทั้งหมด\nกดปุ่มด้านล่างเพื่อจับคู่อิโมจิ เริ่มเลย !!'
            },
            timeoutTime: 60000,
            emojis: GetRandomEmojisArray(Emojis, 12),
            winMessage: '🎉 ชนะแล้ว !! เปิดแผ่นไปทั้งหมด **{tilesTurned} แผ่น**',
            loseMessage: '🚨 แพ้แล้ว หมดเวลา :( เปิดแผ่นไปทั้งหมด **{tilesTurned} แผ่น**',
            playerOnlyMessage: 'มีแค่ {player} ที่เล่นได้'
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
