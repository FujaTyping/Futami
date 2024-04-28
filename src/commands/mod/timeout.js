const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder, Message, PermissionsBitField } = require('discord.js');

const config = require('../../config.json');
const color = config.chat.color

class TimeoutCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('timeout').setDescription('มีคนทำผิดกฏหรอ ??')
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('ใครเป็นคนทำ !!')
                        .setRequired(true)
                )
                .addNumberOption((option) =>
                    option
                        .setName('duration')
                        .setDescription('นานไหม ??')
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
        const Rawtime = interaction.options.getNumber('duration')
        const Reason = interaction.options.getString('reason') ?? 'ไม่มีเหตุผล'
        const Guild = interaction.guild

        const Guilduser = await Guild.members.fetch(User)
        const Time = (Rawtime * 60) * 1000

        const Fetchuser = Guild.members.cache.get(interaction.user.id);

        async function Main() {
            await Guilduser.timeout(Time, Reason)

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`🪄 ระบบจัดการเชิฟเวอร์`)
                .setThumbnail(User.avatarURL())
                .setDescription(`${User} โดน Timeout\nระยะเวลา : **${Rawtime}** นาที\nเหตุผล : \`${Reason}\``)
                .setFooter({ text: `ใช้คำสั่งโดย : ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp()

            return interaction.reply({ embeds: [Content] });
        }

        if (Fetchuser.permissions.has(PermissionsBitField.Flags.Administrator)) {
            Main()
        } else {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle(`⚠️ เตือน !!`)
                .setDescription(`<@${interaction.user.id}> คิดจะทำอะไรหนะ ??\nถ้าจะใช้คำสั่งนี้ต้องมีสิทธ์ Administrator ก่อน !!`)
                .setTimestamp()

            return interaction.reply({ embeds: [Content] });
        }
    }
}
module.exports = {
    TimeoutCommand
};