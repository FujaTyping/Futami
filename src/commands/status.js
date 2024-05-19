const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder, ActivityType } = require('discord.js');

const config = require('../config.json');
const color = config.chat.color
const emote = config.default

class StatusCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'status',
            aliases: ['st'],
            description: 'change bot status',
            preconditions: ['OwnerOnly']
        });
    }

    async messageRun(message, args) {
        const { client } = container;
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
            .setTitle(`เปลื่ยนสถานะละ ${emote.success}`)
            .setDescription(`ชื่อสถานะ : **` + Status + '**\nหมวดหมู่ : `Streaming`\nลิ้งค์ : https://www.twitch.tv/anime')
            .setTimestamp()

        return message.reply({ embeds: [Content] });
    }
}
module.exports = {
    StatusCommand
};
