const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { FastType } = require('discord-gamecord');

const { colorHex } = require('../../config.json');
const { Words } = require('./data/word.json');

class FastTypeCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('fasttype').setDescription('เกม แข่งพิมพ์เร็ว (ทดสอบการพิมพ์)')
        );
    }

    async chatInputRun(interaction) {
        const ShuffledWords = Words.slice().sort(() => Math.random() - 0.5);
        const RandomWords = ShuffledWords.slice(0, 15);

        const Game = new FastType({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'แข่งพิมพ์เร็ว (ทดสอบการพิมพ์)',
                color: colorHex,
                description: '⏰ คุณมีเวลา **{time} วินาที** ที่จะพิมพ์ประโยคด้านล่างและส่งให้ทันเวลา'
            },
            timeoutTime: Math.round(Math.floor(Math.random() * (60001 - 30000 + 1)) + 30000),
            sentence: RandomWords.join(' '),
            winMessage: '🎉 คุณชนะ ! , คุณพิมพ์เป็นเวลา **{time} วินาที** และคุณพิมพ์ **{wpm} คำต่อนาที** (WPM)',
            loseMessage: '💢 คุณแพ้ ! , คุณไม่ได้พิมพ์ประโยคที่ถูกต้องในเวลาที่กำหนด\n**ทิปการเล่น** : หากมี วรรณวรรค ให้ วรรณวรรคด้วย เช่นเดี่ยวกับตัวเลข',
        });

        Game.startGame();
        Game.on('gameOver', result => {
            /*console.log(result);*/
        });
    }
}
module.exports = {
    FastTypeCommand
};
