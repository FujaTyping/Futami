const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color

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
            client.distube.voices.leave(message)

            const Button = new ButtonBuilder()
                .setLabel('สนับสนุนฟูตามิโดยการชื้อกาแฟให้ได้นะ')
                .setURL('https://buymeacoffee.com/fujatyping')
                .setStyle(ButtonStyle.Link);

            const Row = new ActionRowBuilder()
                .addComponents(Button);

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('👋🏻 ออกจากห้องแล้ว !!')
                .setDescription('ขอบคุณที่ใช้ ฟูตามิ 💙 ไว้เจอกันใหม่น้า ~~\nสนับสนุนฟูตามิโดยการซื้อกาแฟได้ที่ : <:BTBMAC:1230573925881221162> [Buy me a coffee](https://buymeacoffee.com/fujatyping)')
                .setFooter({ text: `ใช้คำสั่งโดย : ${message.author.username}`, iconURL: message.author.avatarURL() })
                .setTimestamp()

            return await message.channel.send({ embeds: [Content] });
        }
    }
}
module.exports = {
    StopCommand
};