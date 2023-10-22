const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const { color } = require('../../config.json');

class StopCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'stop',
            aliases: ['dc', "disconnect"],
            description: 'stop and leave voice channel'
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
                client.distube.voices.leave(message)

                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('👋🏻 ออกจากห้องแล้ว !!')
                    .setDescription('ไว้เจอกันใหม่น้า ~~\nขอบคุณที่ใช้ ฟูตามิ 💙')
                    .setTimestamp()

                return await message.channel.send({ embeds: [Content] });
            }
        }
    }
}
module.exports = {
    StopCommand
};