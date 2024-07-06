const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder, Message, PermissionsBitField } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class KickCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            preconditions: ['AdminOnly']
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('kick').setDescription('เตะคนออก !!')
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('จะเตะใคร ??')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('มีเหตุผลป่าว ??')
                )
        );
    }

    async chatInputRun(interaction) {
        const User = interaction.options.getUser('user')
        const Reason = interaction.options.getString('reason') ?? 'ไม่มีเหตุผล'
        const Guild = interaction.guild

        const Guilduser = await Guild.members.fetch(User)

        await Guilduser.kick(Reason)

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle(`🪄 ระบบจัดการเชิฟเวอร์`)
            .setThumbnail(User.avatarURL())
            .setDescription(`${User} โดน เตะออกจากเชิฟเวอร์\nเหตุผล : \`${Reason}\``)
            .setFooter({ text: `ใช้คำสั่งโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
            .setTimestamp()

        return interaction.reply({ embeds: [Content] });
    }
}
module.exports = {
    KickCommand
};