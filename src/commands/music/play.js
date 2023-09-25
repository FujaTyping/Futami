const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const { color } = require('../../config.json');

class PlayCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'play',
            aliases: ['p'],
            description: 'play song from source'
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
            const Song = await args.rest('string');

            client.distube.play(message.member.voice.channel, Song, {
                member: message.member,
                textChannel: message.channel,
                message
            })
        }
    }
}
module.exports = {
    PlayCommand
};