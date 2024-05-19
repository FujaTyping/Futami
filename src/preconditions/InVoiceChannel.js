const { Precondition } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

const color = config.chat.color
const emote = config.default

class InVoiceChannelPrecondition extends Precondition {
    async messageRun(message) {
        return this.isInVoiceChannel(message.member.voice.channel, message);
    }

    async chatInputRun(interaction) {
        return this.isInVoiceChannel(interaction.member.voice.channel, interaction);
    }

    async contextMenuRun(interaction) {
        return this.isInVoiceChannel(interaction.member.voice.channel, interaction);
    }

    async isInVoiceChannel(Channel, Action) {
        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle(`${emote.warning} เตือน !!`)
            .setDescription('การใช้งานคำสั่งนี้ทุกคำสั่ง ต้องเข้าในช่องเสียงก่อนทุกครั้ง')
            .setTimestamp()

        return Channel
            ? this.ok()
            : this.error(Action.reply({ embeds: [Content] }));
    }
}
module.exports = {
    InVoiceChannelPrecondition
};