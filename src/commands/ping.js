const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const { color } = require('../config.json');

class PingCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'ping',
            aliases: ['pong'],
            description: 'check a bot response'
        });
    }

    async messageRun(message) {
        const msg = await message.channel.send('กำลังทดสอบ ...');

        const Latency = Math.round(this.container.client.ws.ping)
        const API = msg.createdTimestamp - message.createdTimestamp

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('ผลการทดสอบ 🏓')
            .setDescription('- 🤖 ความล่าช้าของ **บอท** : ' + Latency + "\n- 🪐 ความล่าช้าของ **API** : " + API)
            .setTimestamp()

        return msg.edit({ embeds: [Content] });
    }
}
module.exports = {
    PingCommand
};