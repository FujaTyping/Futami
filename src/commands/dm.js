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
            description: 'send DM to user',
            preconditions: ['OwnerOnly']
        });
    }

    async messageRun(message, args) {
        const { client } = container;
        const Message = await args.rest('string');
        const Args = Message.split(' ');

        if (Args[0] == client.user.id) {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: 'เตือน !!', iconURL: 'https://futami.siraphop.me/assets/icon/warning.png' })
                .setDescription(`ไม่สามารถส่งข้อความถึงตัวบอทเองได้`)
                .setTimestamp()

            return message.reply({ embeds: [Content] });
        } else {
            client.users.send(Args[0], `${Args.slice(1).join(' ')}`);

            const Content = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: 'ส่งข้อความไปยังส่วนตัวเรียบร้อยแล้ว !!', iconURL: 'https://futami.siraphop.me/assets/icon/checked.png' })
                .setDescription(`✉️ ข้อความ : **${Args.slice(1).join(' ')}**\n📩 ส่งไปยัง : **<@${Args[0]}>**`)
                .setTimestamp()

            return message.reply({ embeds: [Content] });
        }
    }
}
module.exports = {
    DMCommand
};