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
            'from', 'open', 'other', 'fact', 'where', 'real', 'most', 'program', 'call', 'while', 'early',
            'home', 'same', 'point', 'begin', 'over', 'feel', 'year', 'plan', 'hold', 'person', 'eye', 'night', 'group',
            'more', 'this', 'and', 'write', 'school', 'new', 'message', 'both', 'you', 'much', 'need',
            'those', 'well', 'seem', 'can', 'develop', 'if', 'long', 'want', 'day', 'old', 'end', 'say',
            'thing', 'own', 'time', 'of', 'public', 'not', 'like', 'such', 'between', 'govern', 'system',
            'present', 'what', 'then', 'man', 'mean', 'get', 'life', 'find', 'who', 'run', 'move', 'number',
            '2014', '9406', '72', '8699', '412', 'nation', '761', '2021', 'during', 'follow', '377', '979', '50', '6915',
            '967', '480', '33', 'general', '36', '4236', '27', '110', '58', 'all', 'help', 'they', 'part', 'but'
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
