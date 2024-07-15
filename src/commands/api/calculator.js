const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command, err } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

const Choices = [
    { name: 'รูปอย่างง่าย', value: 'simplify', example: '2^2+2(2)' },
    { name: 'แฟกเตอร์', value: 'factor', example: 'x^2+2x' },
    { name: 'อนุพันธ์', value: 'derive',  example: 'x^2+2x' },
    { name: 'ปริพันธ์', value: 'integrate',  example: 'x^2+2x' },
    { name: 'พื้นที่ใต้กราฟ', value: 'area',  example: '2:4lx^3' },
    { name: 'เส้นสัมผัส (ตรีโกณมิติ)', value: 'tangent',  example: '2lx^3' },
    { name: 'Cos (ตรีโกณมิติ)', value: 'cos',  example: 'pi' },
    { name: 'Sin (ตรีโกณมิติ)', value: 'sin',  example: '0' },
    { name: 'Tan (ตรีโกณมิติ)', value: 'tan',  example: '0' },
    { name: 'Arc cos', value: 'arccos',  example: '1' },
    { name: 'Arc sin', value: 'arcsin',  example: '0' },
    { name: 'Arc tan', value: 'arctan',  example: '0' },
    { name: 'ค่าสัมบูรณ์', value: 'abs',  example: '1' },
    { name: 'ลอการิทึม', value: 'log',  example: '3' }
];

class CalculatorCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('calculator').setDescription('ปวดห้วกับการคิดเลขไหม ??')
                .addStringOption((option) =>
                    option
                        .setName('operation')
                        .setDescription('ต้องการแก้โจทย์ปัญหาแบบไหน ??')
                        .addChoices(Choices)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('expression')
                        .setDescription('โจทย์ปัญหาคือ ??')
                        .setRequired(true)
                )
        );
    }

    async chatInputRun(interaction) {
        const Operation = interaction.options.getString('operation')
        const Expression = interaction.options.getString('expression')

        const Type = Choices.find(choice => choice.value === Operation)?.name;
        const Example = Choices.find(choice => choice.value === Operation)?.example;

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('📳 เครื่องคิดเลข')
            .setDescription('กำลังแก้สัมการ ..')
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

        axios.get(`https://newton.vercel.app/api/v2/${Operation}/${Expression}`)
            .then(response => {
                const Response = response.data;

                if (Response.result == 'NaN') {
                  const Content = new EmbedBuilder()
                      .setColor(color)
                      .setTitle(`📳 เครื่องคิดเลข`)
                      .setDescription(`ไม่สามารถแก้สมการ \`${Expression}\` โดยใช้ **${Type}** ได้\nตัวอย่างโจทย์ปัญหา ${Type} : ${Example}`)
                      .setTimestamp()

                  return interaction.editReply({ embeds: [Content] });
                } else {
                  const Content = new EmbedBuilder()
                      .setColor(color)
                      .setTitle(`📳 เครื่องคิดเลข`)
                      .setDescription(`ผลลัพธ์การแก้สมการโดยใช้ **${Type}** ด้วย \`${Expression}\` คือ\n`+"```\n" + Response.result + "\n```"+`\nตัวอย่างโจทย์ปัญหา ${Type} : ${Example}`)
                      .setTimestamp()

                  return interaction.editReply({ embeds: [Content] });
                }
            })
            .catch(error => {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: 'เกิดอะไรขึ้น ??', iconURL: 'https://futami.siraphop.me/assets/icon/error.png' })
                    .setDescription("```\n" + error + "\n```")
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content] });
            });
    }
}
module.exports = {
    CalculatorCommand
};
