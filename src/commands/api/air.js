const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command, err } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

const config = require('../../config.json');
const color = config.chat.color
require('dotenv').config()

class AirCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('air').setDescription('เช็คสถานะการณ์ PM 2.5 กันหน่อย !!')
                .addStringOption((option) =>
                    option
                        .setName('city')
                        .setDescription('เลือกเมือง ?')
                        .addChoices(
                            { name: 'กรุงเทพ', value: 'bangkok' },
                            { name: 'หาดใหญ่', value: '@A47920' },
                            { name: 'เชียงใหม่', value: '@A40330' },
                            { name: 'ยะลา', value: '@A112192' },
                            { name: 'กระบี่', value: '@A419488' },
                            { name: 'อุดรธานี', value: '@13637' },
                            { name: 'พิษณุโลก', value: '@A473494' },
                            { name: 'สงขลา', value: '@A419365' },
                            { name: 'ชุมพร', value: '@A248455' },
                            { name: 'เพชรบุรี', value: '@A419617' },
                            { name: 'นครพนม', value: '@A197185' },
                            { name: 'ระยอง', value: '@A234487' },
                            { name: 'ระนอง', value: '@A419548' },
                            { name: 'ประจวบคีรีขันธ์', value: '@A121969' },
                            { name: 'สมุทรสงคราม', value: '@A419419' },
                            { name: 'กาญจนบุรี', value: '@A236419' },
                            { name: 'อุทัยธานี', value: '@A473482' },
                            { name: 'กาฬสินธุ์', value: '@A419266' },
                            { name: 'สุโขทัย', value: '@A419233' },
                            { name: 'หนองคาย', value: '@A477193' }
                        )
                        .setRequired(true)
                )
        );
    }

    async chatInputRun(interaction) {
        const City = interaction.options.getString('city')

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('😷 สถานะการณ์ PM 2.5')
            .setDescription('กำลังตรวจสอบข้อมูล ..')
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Content], fetchReply: true });

        axios.get(`https://api.waqi.info/feed/${City}/?token=${process.env.waqi}`)
            .then(response => {
                const Response = response.data.data;

                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`😷 สถานะการณ์ PM 2.5`)
                    .setDescription(`ผลการตรวจสอบข้อมูลจาก : [${Response.city.name}](${Response.attributions[0].url})\n- PM 2.5 : **${Response.iaqi.pm25.v} µg/m3** | ${CheckAir(Response.iaqi.pm25.v)}\n- PM 10 : **${Response.iaqi.pm10.v} µg/m3** | ${CheckAir(Response.iaqi.pm10.v)}\n- อุณหภูมิ : **${Response.iaqi.t.v} °C**`)
                    .setFooter({ text: `ข้อมูล ณ วันที่ : ${Response.time.s}` })
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content] });
            })
            .catch(error => {
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`🛑 เกิดอะไรขึ้น`)
                    .setDescription("```\n" + error + "\n```")
                    .setTimestamp()

                return interaction.editReply({ embeds: [Content] });
            });
    }
}

function CheckAir(Value) {
    if (Value > 300) {
        return '⭕ อันตราย'
    } else if (Value >= 201) {
        return '🟣 ไม่ดีต่อสุขภาพมาก'
    } else if (Value >= 151) {
        return '🔴 ไม่ดีต่อสุขภาพ'
    } else if (Value >= 101) {
        return '🟠 ไม่ดีต่อสุขภาพสําหรับกลุ่มที่บอบบาง'
    } else if (Value >= 51) {
        return '🟡 ปานกลาง'
    } else if (Value <= 50) {
        return '🟢 ยอดเยี่ยม'
    }
}
module.exports = {
    AirCommand
};