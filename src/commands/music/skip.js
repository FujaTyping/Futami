const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class SkipCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'skip',
            aliases: ['sk'],
            description: 'skip this song',
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
            const song = await queue.skip()

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('⏭️ ข้ามเพลงแล้ว')
                .setDescription('ข้ามเพลง : **' + queue.songs[0].name + '**')
                .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                .setTimestamp()

            return message.channel.send({ embeds: [Content] })
        }
    }
}
module.exports = {
    SkipCommand
};