const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const { color } = require('../../config.json');

class PauseCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'pause',
            aliases: ['ps'],
            description: 'pause song is playing'
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
                if (queue.paused) {
                    queue.resume()

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('🛠️ ระบบควบคุม')
                        .setDescription(`เล่นเพลง (ต่อ) : **${queue.songs[0].name}**`)
                        .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                        .setTimestamp()

                    return message.channel.send({ embeds: [Content] })
                } else {
                    queue.pause()

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('🛠️ ระบบควบคุม')
                        .setDescription(`หยุดเพลง (ชั่วคราว) : **${queue.songs[0].name}**`)
                        .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                        .setTimestamp()

                    return message.channel.send({ embeds: [Content] })
                }
            }
        }
    }
}
module.exports = {
    PauseCommand
};