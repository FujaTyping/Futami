const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class QueueCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'queue',
            aliases: ['q'],
            description: 'see queue in the server',
            preconditions: ['InVoiceChannel']
        });
    }

    async messageRun(message) {
        const { client } = container;

        const queue = client.distube.getQueue(message)

        if (!queue) {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${emote.warning} เตือน !!`)
                .setDescription('ยังไม่มีเพลงที่เล่นอยู่ ลองเพิ่มมาสักเพลงดูสิ')
                .setTimestamp()

            return message.channel.send({ embeds: [Content] })
        } else {
            const q = queue.songs
                .map((song, i) => `${i === 0 ? '🎤 กำลังเล่นเพลง ' : `${i} .`} **${song.name}** - \`${song.formattedDuration}\` นาที`)
                .join('\n')

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('🎼 คิวเพลง')
                .setDescription(q)
                .setTimestamp()

            return message.channel.send({ embeds: [Content] })
        }
    }
}
module.exports = {
    QueueCommand
};