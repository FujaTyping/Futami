const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

const { color } = require('../config.json');

class AboutCommand extends Command {
    constructor(context, options) {
        super(context, { ...options });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('about').setDescription('อยากรู้อะไรเกี่ยวกับเราละ ??')
        );
    }

    async chatInputRun(interaction) {
        const Img = new EmbedBuilder()
            .setColor(color)
            .setImage('https://futami.fujatyping.dev/assets/banner/Card-Futami.png')

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('✌🏻 เกี่ยวกับ ฟูตามิ')
            .setDescription('ฟูตามิเป็นบอทเพลงที่สร้างขึ้นโดย [FujaTyping](https://fujatyping.dev/) เพื่อตอบสนองคำขอของ **ph007phop** เพื่อนสนิทของเขา ฟูตามิสามารถเปิดเพลงจากแหล่งต่างๆ ได้มากมายและได้รับความนิยมอย่างรวดเร็วในหมู่ผู้ใช้ Discord')
            .setTimestamp()

        const msg = await interaction.reply({ embeds: [Img, Content] });
    }
}
module.exports = {
    AboutCommand
};