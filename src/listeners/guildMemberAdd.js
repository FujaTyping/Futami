const { Listener } = require('@sapphire/framework');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { GlobalFonts, createCanvas, loadImage } = require('@napi-rs/canvas')

const config = require('../config.json');
const color = config.chat.color
const guildID = config.bot.guild
const compact = true

GlobalFonts.registerFromPath('./src/assets/canvas/font/UniSans.otf', 'Uni Sans')

class GuildMemberAddListener extends Listener {
    async run(member) {
        if (member.guild.id == guildID) {
            const Channel = member.guild.channels.cache.get('1015645355406278679')

            const canvas = createCanvas(1024, 500)
            const ctx = canvas.getContext('2d')
            const Text = member.user.username

            const Bg = await loadImage('./src/assets/canvas/Welcome.png')
            const Avatar = await loadImage(`${member.user.avatarURL().replace(".webp", ".png")}`)

            ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
            ctx.drawImage(Avatar, 453.5, 42, 165, 165)

            const x = 660;
            const y = 452;

            ctx.font = '40px Uni Sans'
            ctx.fillStyle = 'white'
            ctx.textAlign = 'center'
            ctx.fillText(Text, x, y)

            const Buffer = canvas.toBuffer('image/png')
            const FinishImage = new AttachmentBuilder(Buffer, { name: 'Welcome.png' });

            if (compact) {
                return Channel.send({ files: [FinishImage] })
            } else {
                const Content = new EmbedBuilder()
                    .setColor(16195357)
                    .setTitle(`🎉 ยินดีต้อนรับ สมาชิกใหม่ !`)
                    .setDescription(`ยินดีต้อนรับ <@${member.id}> เข้าสู่ **${member.guild.name}** !\nคุณเป็นสมาชิกคนที่ **#${member.guild.memberCount}** ของดิสนี้`)
                    .setImage('attachment://Welcome.png')
                    .setFooter({ text: `ข้อความอัตโนมัติ` })
                    .setTimestamp()

                return Channel.send({ embeds: [Content], files: [FinishImage] })
            }
        }
    }
}
module.exports = {
    GuildMemberAddListener
};