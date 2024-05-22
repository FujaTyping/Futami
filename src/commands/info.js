const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const os = require('os');

const config = require('../config.json');
const color = config.chat.color

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
        const { client } = container;
        const cpu = os.cpus();

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('ℹ️ ข้อมูลบอท')
            .setDescription(`เวลาที่ออนไลน์ : **${Uptime(os.uptime())}** || อยู่ใน **${client.guilds.cache.size}** เชิฟเวอร์`)
            .addFields(
                { name: '🖥️ เครื่องเชิฟเวอร์', value: `ซีพียู (**${cpu.length}** คอร์) : **${cpu[0].model}**\nแรม : **${(os.totalmem() / (1024 ** 3)).toFixed(2) + ' กิกะไบต์'}**\`\nแพลตฟอร์ม : **${os.platform()}**\nไทพ์ : **${os.type()}**`, inline: true },
                { name: '🖥️ รันไทม์', value: `ชีพียู : **${getCPUUsage()}**\nแรม : **${getRAMUsage()}**\nชาร์ด : **${client.options.shardCount}**`, inline: true },
            )
            .setTimestamp()

        const Button = new ButtonBuilder()
            .setLabel('ดูสถานะต่างๆ')
            .setURL('https://status.siraphop.me/')
            .setStyle(ButtonStyle.Link);

        const Row = new ActionRowBuilder()
            .addComponents(Button);

        const msg = await interaction.reply({ embeds: [Content], components: [Row] });
    }
}

function Uptime(time) {
    const days = Math.floor(time / (3600 * 24));
    const hours = Math.floor((time % (3600 * 24)) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
}

function getCPUUsage() {
    const cpu = os.cpus();
    const CPUUsage = cpu.map((cpu) => {
        const total = cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
        const idle = cpu.times.idle;
        const usagePercentage = ((total - idle) / total) * 100;
        return usagePercentage.toFixed(2) + ' %';
    });
    return CPUUsage;
}

function getRAMUsage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage = ((usedMemory / totalMemory) * 100).toFixed(2);
    return memoryUsagePercentage + ' %';
}
module.exports = {
    InfoCommand
};