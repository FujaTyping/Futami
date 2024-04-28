const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color

class LoopCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'loop',
            aliases: ['lp'],
            description: 'loop song'
        });
    }

    async messageRun(message, args) {
        const { client } = container;

        if (!message.member.voice.channel) {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('⚠️ เตือน !!')
                .setDescription('การใช้งานคำสั่งเพลงทุกคำสั่ง ต้องเข้าในช่องเสียงก่อนทุกครั้ง')
                .setTimestamp()

            return await message.reply({ embeds: [Content] });
        } else {
            const queue = client.distube.getQueue(message)

            if (!queue) {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('⚠️ เตือน !!')
                    .setDescription('ยังไม่มีเพลงที่เล่นอยู่ ลองเพิ่มมาสักเพลงดูสิ')
                    .setTimestamp()

                return message.channel.send({ embeds: [Content] })
            } else {
                let mode = null
                const Status = await args.rest('string');

                switch (Status) {
                    case 'off':
                        mode = 0
                        break
                    case 'song':
                        mode = 1
                        break
                    case 'queue':
                        mode = 2
                        break
                }

                mode = queue.setRepeatMode(mode)
                mode = mode ? (mode === 2 ? 'ลูปเพลงในคิว' : 'ลูปแค่เพลงนี้') : 'ปิด (ไม่มีลูป)'

                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('🔁 ระบบลูป')
                    .setDescription('สถานะตอนนี้คือ : **' + mode + '**')
                    .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                    .setTimestamp()

                return message.channel.send({ embeds: [Content] })
            }
        }
    }
}
module.exports = {
    LoopCommand
};