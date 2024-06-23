const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class LoopCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'loop',
            aliases: ['lp'],
            description: 'loop song',
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
            try {
                const Status = await args.rest('string');

                let mode = null

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
            } catch (e) {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: 'เตือน !!', iconURL: 'https://futami.siraphop.me/assets/icon/warning.png' })
                    .setDescription('การใช้คำสั่งลูปจำเป็นต้องบอกด้วยจะลูปอะไร\n**ลูปที่มีทั้งหมด** : song , queue , off\n**วิธีการใช้** : `f.loop song`')
                    .setTimestamp()

                return message.channel.send({ embeds: [Content] })
            }
        }
    }
}
module.exports = {
    LoopCommand
};