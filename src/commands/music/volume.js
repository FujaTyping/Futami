const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const { color } = require('../../config.json');

class VolumeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'volume',
            aliases: ['vol'],
            description: 'play song from source'
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
                const Value = await args.rest('string');
                const volume = parseInt(Value)

                if (isNaN(volume)) {
                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('⚠️ เตือน !!')
                        .setDescription('ใส่ตัวเลข 0-100 เท่านั้น ไม่สามารถใช้ตัวอักษรได้')
                        .setTimestamp()

                    return message.channel.send({ embeds: [Content] })
                } else {
                    queue.setVolume(volume)

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('🔊 ระบบเสียง')
                        .setDescription('ปรับระดับเสียงเป็น : **' + volume + "** %")
                        .setTimestamp()

                    return message.channel.send({ embeds: [Content] })
                }
            }
        }
    }
}
module.exports = {
    VolumeCommand
};