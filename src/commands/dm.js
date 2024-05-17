const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const config = require('../config.json');
const color = config.chat.color
const owner = config.bot.owner
const emote = config.default

class DMCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'DM',
            aliases: ['dm'],
            description: 'send DM to user'
        });
    }

    async messageRun(message, args) {
        const { client } = container;
        if (message.author.id == owner) {
            const Message = await args.rest('string');
            const Args = Message.split(' ');
            client.users.send(Args[0], `${Args.slice(1).join(' ')}`);

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${emote.success} ส่งข้อความไปยังส่วนตัวเรียบร้อยแล้ว`)
                .setDescription(`- ✉️ ข้อความ : **${Args.slice(1).join(' ')}**\n- 📩 ส่งไปยัง : **${Args[0]}**`)
                .setTimestamp()

            return message.reply({ embeds: [Content] });
        } else {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${emote.warning} เตือน !!`)
                .setDescription('เป็นผู้พัฒนาถึงใช้งานคำสั่งได้')
                .setTimestamp()

            return message.reply({ embeds: [Content] });
        }
    }
}
module.exports = {
    DMCommand
};