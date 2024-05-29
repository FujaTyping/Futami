const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class FilterCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'filter',
            aliases: ['ft'],
            description: 'make song more funny',
            preconditions: ['InVoiceChannel']
        });
    }

    async messageRun(message, args) {
        const { client } = container;

        const queue = client.distube.getQueue(message)

        if (!queue) {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: 'เตือน !!', iconURL: 'https://futami.siraphop.me/assets/icon/warning.png' })
                .setDescription('ยังไม่มีเพลงที่เล่นอยู่ ลองเพิ่มมาสักเพลงดูสิ')
                .setTimestamp()

            return message.channel.send({ embeds: [Content] })
        } else {
            const filter = await args.rest('string');

            if (filter === 'off' && queue.filters.size) {
                queue.filters.clear()
            } else if (Object.keys(client.distube.filters).includes(filter)) {
                if (queue.filters.has(filter)) {
                    queue.filters.remove(filter)
                } else {
                    queue.filters.add(filter)
                }
            } else if (filter) {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: 'เตือน !!', iconURL: 'https://futami.siraphop.me/assets/icon/warning.png' })
                    .setDescription('ดูเหมือนว่าจะไม่มีฟิลเตอร์ที่ชื่อ : **' + filter + "** นะ\nลองดูชื่อของฟิลเตอร์ใหม่อีกทีสิ !!")
                    .setTimestamp()

                return message.channel.send({ embeds: [Content] })
            }

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('🎛️ ระบบฟิลเตอร์')
                .setDescription(`ฟิลเตอร์ตอนนี้คือ : **${queue.filters.names.join(', ') || 'Off'}**\nสามารถใช้ฟิลเตอร์หลายๆอัน รวมกันได้ !!`)
                .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                .setTimestamp()

            return message.channel.send({ embeds: [Content] })
        }
    }
}
module.exports = {
    FilterCommand
};