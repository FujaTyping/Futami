const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class ShuffleCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'shuffle',
            aliases: ['sf'],
            description: 'shuffle song in guild',
            preconditions: ['InVoiceChannel']
        });
    }

    async messageRun(message, args) {
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
            queue.shuffle()

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('🔀 สลับเพลงแล้ว')
                .setDescription('สลับเพลงทั้งหมดที่อยู่ในคิว')
                .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                .setTimestamp()

            return message.channel.send({ embeds: [Content] })
        }
    }
}
module.exports = {
    ShuffleCommand
};