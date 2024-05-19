const { Precondition } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

const color = config.chat.color
const emote = config.default

class OwnerOnlyPrecondition extends Precondition {
    async messageRun(message) {
        return this.checkOwner(message.author.id, message);
    }

    async chatInputRun(interaction) {
        return this.checkOwner(interaction.user.id, interaction);
    }

    async contextMenuRun(interaction) {
        return this.checkOwner(interaction.user.id, interaction);
    }

    async checkOwner(UserId, Action) {
        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle(`${emote.warning} เตือน !!`)
            .setDescription('เป็นผู้พัฒนาถึงใช้งานคำสั่งได้')
            .setTimestamp()

        return config.bot.owner.includes(UserId)
            ? this.ok()
            : this.error(Action.reply({ embeds: [Content] }));
    }
}
module.exports = {
    OwnerOnlyPrecondition
};