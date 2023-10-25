const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const os = require('os');

const { color } = require('../config.json');

class InfoCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('info').setDescription('นี้คือข้อมูลระบบของเราล่ะ')
        );
    }

    async chatInputRun(interaction) {
        const cpu = os.cpus();

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('ℹ️ ข้อมูลระบบ')
            .setDescription(`- เวลา : \`${new Date(os.uptime() * 1000).toISOString().substr(11, 8) + ' นาที'}\`\n- ซีพียู : \`${cpu[0].model}\`\n- แรม : \`${(os.totalmem() / (1024 ** 3)).toFixed(2) + ' กิกะไบต์'}\`\n- แพลตฟอร์ม : \`${os.platform()}\`\n- ไทพ์ : \`${os.type()}\``)
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Content] });
    }
}
module.exports = {
    InfoCommand
};