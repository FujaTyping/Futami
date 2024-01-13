const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const { FastType } = require('discord-gamecord');

const { colorHex } = require('../../config.json');

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
        const Words = [
            'from', 'open', 'other', 'fact', 'where', 'real', 'most',
            'home', 'same', 'point', 'begin', 'over', 'feel',
            'more', 'this', 'and', 'write', 'school', 'new', 'message',
            'those', 'well', 'seem', 'can', 'develop', 'if',
            'thing', 'own', 'time', 'of', 'public', 'not', 'like', 'such',
            'present', 'what', 'then', 'man', 'mean', 'get', 'life'
        ];
        const ShuffledWords = Words.slice().sort(() => Math.random() - 0.5);
        const RandomWords = ShuffledWords.slice(0, 12);

        const Game = new FastType({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'แข่งพิมพ์เร็ว (ทดสอบการพิมพ์)',
                color: colorHex,
                description: '⏰ คุณมีเวลา {time} วินาที ที่จะพิมพ์ประโยคด้านล่างและส่งให้ทันเวลา'
            },
            timeoutTime: Math.round(Math.floor(Math.random() * (60001 - 30000 + 1)) + 30000),
            sentence: RandomWords.join(' '),
            winMessage: '🎉 คุณชนะ ! , คุณพิมพ์เป็นเวลา {time} วินาที และคุณพิมพ์ {wpm} คำต่อนาที (WPM)',
            loseMessage: '💢 คุณแพ้ ! , คุณไม่ได้พิมพ์ประโยคที่ถูกต้องในเวลาที่กำหนด',
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
