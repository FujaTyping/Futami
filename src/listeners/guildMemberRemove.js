const { Listener } = require('@sapphire/framework');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { registerFont, createCanvas, loadImage } = require('canvas')

const config = require('../config.json');
const color = config.chat.color
const system = config.bot.systemchannel
const guildID = config.bot.guild
const compact = true

//registerFont('./src/assets/canvas/font/UniSans.otf', { family: 'Uni Sans' })

class GuildMemberRemoveListener extends Listener {
    run(member) {
        if (member.guild.id == guildID) {
            const Channel = member.guild.channels.cache.get(system)

            const canvas = createCanvas(1024, 500)
            const ctx = canvas.getContext('2d')
            const Text = member.user.username
            loadImage('./src/assets/canvas/GoodByeREM.png').then((Bg) => {
                loadImage(`${member.user.avatarURL().replace(".webp", ".png")}`).then((Avatar) => {
                    ctx.drawImage(Bg, 0, 0, canvas.width, canvas.height)
                    ctx.drawImage(Avatar, 407, 42, 165, 165)

                    const x = 360;
                    const y = 452;

                    ctx.font = '40px Uni Sans'
                    ctx.fillStyle = 'white'
                    ctx.textAlign = 'center'
                    ctx.fillText(Text, x, y)

                    const Buffer = canvas.toBuffer('image/png')
                    const FinishImage = new AttachmentBuilder(Buffer, { name: 'GoodBye.png' });

                    if (compact) {
                        return Channel.send({ files: [FinishImage] })
                    } else {
                        const Content = new EmbedBuilder()
                            .setColor(7054307)
                            .setTitle(`สมาชิกได้ออกไปแล้ว 👋🏻`)
                            .setDescription(`<@${member.id}> ได้ออกจาก **${member.guild.name}** แล้ว !\nสมาชิกที่เหลือทั้งหมด **${member.guild.memberCount}** คนของดิสนี้`)
                            .setImage('attachment://GoodBye.png')
                            .setFooter({ text: `ข้อความอัตโนมัติ` })
                            .setTimestamp()

                        return Channel.send({ embeds: [Content], files: [FinishImage] })
                    }
                })
            })
        }
    }
}
module.exports = {
    GuildMemberRemoveListener
};