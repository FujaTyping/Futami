const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const { color } = require('../../config.json');

class VolumeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'volume',
            aliases: ['vol'],
            description: 'change the song volume'
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
                        .setDescription('ใส่ตัวเลข 0-500 เท่านั้น ไม่สามารถใช้ตัวอักษรได้')
                        .setTimestamp()

                    return message.channel.send({ embeds: [Content] })
                } else {
                    if (volume > 500) {
                        const Content = new EmbedBuilder()
                            .setColor(color)
                            .setTitle('🔊 ระบบเสียง')
                            .setDescription('🚫 ไม่สามารถปรับเสียงเป็น : **' + volume + "** % ได้\n⚠️ กรุณาใส่ตัวเลข 0-500 เท่านั้น")
                            .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                            .setTimestamp()

                        return message.channel.send({ embeds: [Content] })
                    } else {
                        queue.setVolume(volume)

                        const Content = new EmbedBuilder()
                            .setColor(color)
                            .setTitle('🔊 ระบบเสียง')
                            .setDescription('ปรับระดับเสียงเป็น : **' + volume + "** %\n⚠️ การปรับระดับเสียงมากเกินไปอาจจะเป็นอันตรายต่อหู")
                            .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                            .setTimestamp()

                        return message.channel.send({ embeds: [Content] })
                    }
                }
            }
        }
    }
}
module.exports = {
    VolumeCommand
};