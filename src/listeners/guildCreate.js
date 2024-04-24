const { Listener } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { name, color } = require('../config.json');

class GuildCreateListener extends Listener {
    run(guild) {
        const Img = new EmbedBuilder()
            .setColor(color)
            .setImage('https://futami.siraphop.me/assets/banner/Card-Futami.png')

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle(`😘 สวัสดี ! ฟูตามิขอขอบคุณที่เชิญฟูตามิเข้าเซิร์ฟเวอร์ ${guild.name}`)
            .setDescription("สามารถใช้คำสั่งได้ทั้ง 2 แบบ คือ : `/` Slash command และ `f.` Prefix\n\n**นี้คือคำสั่งบางส่วนของฟูตามิ**\n- `/about` : ดูข้อมูลเกี่ยวกับบอท\n- `/info` : ดูข้อมูลเกี่ยวกับระบบ\n\nส่วนคำสั่งที่ใช้ `f.` สามารถดูวิธีการใช้ได้ที่เว็ปไซต์\nอยากลองคุยกับฟูตามิดูไหมหละ ลองพิพม์ **ฟูตามิ** หรือ <@1155156868554043484> ดูสิ!")
            .setFooter({ text: `ข้อความอัตโนมัติ` })
            .setTimestamp()

        const Button = new ButtonBuilder()
            .setLabel('เว็ปไซต์ของฟูตามิ')
            .setURL('https://futami.siraphop.me/')
            .setStyle(ButtonStyle.Link);

        const Row = new ActionRowBuilder()
            .addComponents(Button);

        guild.systemChannel.send({ embeds: [Img, Content], components: [Row] })
    }
}
module.exports = {
    GuildCreateListener
};