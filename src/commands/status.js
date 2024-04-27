const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder, ActivityType } = require('discord.js');

//const { color, owner } = require('../config.json');
const config = require('../config.json');
const color = config.chat.color
const owner = config.bot.owner

class StatusCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'status',
            aliases: ['st'],
            description: 'change bot status'
        });
    }

    async messageRun(message, args) {
        const { client } = container;
        if (message.author.id == owner) {
            const Status = await args.rest('string');

            client.user.setPresence({
                activities: [{
                    name: Status,
                    type: ActivityType.Streaming,
                    url: "https://www.twitch.tv/anime"
                }]
            });

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`เปลื่ยนสถานะละ ✅`)
                .setDescription(`ชื่อสถานะ : **` + Status + '**\nหมวดหมู่ : `Streaming`\nลิ้งค์ : https://www.twitch.tv/anime')
                .setTimestamp()

            return message.reply({ embeds: [Content] });
        } else {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('⚠️ เตือน !!')
                .setDescription('เป็นผู้พัฒนาถึงใช้งานคำสั่งได้')
                .setTimestamp()

            return message.reply({ embeds: [Content] });
        }
    }
}
module.exports = {
    StatusCommand
};
