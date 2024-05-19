const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class VolumeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'volume',
            aliases: ['vol'],
            description: 'change the song volume',
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
            const Value = await args.rest('string');
            const volume = parseInt(Value)

            if (isNaN(volume)) {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`${emote.warning} เตือน !!`)
                    .setDescription('ใส่ตัวเลข 0-500 เท่านั้น ไม่สามารถใช้ตัวอักษรได้')
                    .setTimestamp()

                return message.channel.send({ embeds: [Content] })
            } else {
                if (volume > 500) {
                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('🔊 ระบบเสียง')
                        .setDescription(`${emote.error} ไม่สามารถปรับเสียงเป็น : **` + volume + `** % ได้\n${emote.warning} กรุณาใส่ตัวเลข 0-500 เท่านั้น`)
                        .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                        .setTimestamp()

                    return message.channel.send({ embeds: [Content] })
                } else {
                    queue.setVolume(volume)

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('🔊 ระบบเสียง')
                        .setDescription('ปรับระดับเสียงเป็น : **' + volume + `** %\n${emote.warning} การปรับระดับเสียงมากเกินไปอาจจะเป็นอันตรายต่อหู`)
                        .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
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