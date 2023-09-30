const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const { color } = require('../../config.json');

class SkipCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'skip',
            aliases: ['sk'],
            description: 'skip this song'
        });
    }

    async messageRun(message) {
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
                const song = await queue.skip()

                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('⏭️ ข้ามเพลงแล้ว')
                    .setDescription('ข้ามเพลง : **' + queue.songs[0].name + '**')
                    .setTimestamp()

                return message.channel.send({ embeds: [Content] })
            }
        }
    }
}
module.exports = {
    SkipCommand
};