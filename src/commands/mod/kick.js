const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder, Message, PermissionsBitField } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

class KickCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
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

        const Fetchuser = Guild.members.cache.get(interaction.user.id);

        async function Main() {
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

        if (Fetchuser.permissions.has(PermissionsBitField.Flags.Administrator)) {
            Main()
        } else {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: 'เตือน !!', iconURL: 'https://futami.siraphop.me/assets/icon/warning.png' })
                .setDescription(`<@${interaction.user.id}> คิดจะทำอะไรหนะ ??\nถ้าจะใช้คำสั่งนี้ต้องมีสิทธ์ Administrator ก่อน !!`)
                .setTimestamp()

            return interaction.reply({ embeds: [Content] });
        }
    }
}
module.exports = {
    KickCommand
};