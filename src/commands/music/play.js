const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

const config = require('../../config.json');
const color = config.chat.color

const PlaylistDataJSON = fs.readFileSync('./src/commands/music/data/playlist.json', 'utf8');
const DataPlaylist = JSON.parse(PlaylistDataJSON);

class PlayCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'play',
            aliases: ['p'],
            description: 'play song from source'
        });
    }

    async messageRun(message, args) {
        let Song = await args.rest('string');
        const { client } = container;

        if (!message.member.voice.channel) {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('⚠️ เตือน !!')
                .setDescription('การใช้งานคำสั่งเพลงทุกคำสั่ง ต้องเข้าในช่องเสียงก่อนทุกครั้ง')
                .setTimestamp()

            return await message.reply({ embeds: [Content] });
        } else {
            if (Song.includes('--playlist')) {
                let PlaylistName = Song.replace('--playlist', '').trim();
                const Playlist = DataPlaylist.Playlist.find(PlaySong => PlaySong.name === PlaylistName);

                if (Playlist) {
                    Song = Playlist.url
                    const msg = await message.reply('กำลังดึงเพลงจากเพลย์ลิส ...');

                    client.distube.play(message.member.voice.channel, Song, {
                        member: message.member,
                        textChannel: message.channel,
                        message
                    })

                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('▶️ ข้อมูลเพลย์ลิส')
                        .setDescription(`เพลย์ลิส : **${Playlist.title}**\nเพิ่มโดย : \`${Playlist.request}\``)
                        .setTimestamp()

                    return await msg.edit({ content: 'ดึงข้อมูลเพลงเสร็จล่ะ ✨', embeds: [Content] });
                } else {
                    let PlaylistName = Song.replace('--playlist', '').trim();
                    const Content = new EmbedBuilder()
                        .setColor(color)
                        .setTitle('⚠️ เตือน !!')
                        .setDescription(`ดูเหมือนว่าจะไม่มีเพลย์ลิส **${PlaylistName}** ในฐานข้อมูลของฟูตามินะ`)
                        .setTimestamp()

                    return await message.reply({ embeds: [Content] });
                }
            } else {
                const msg = await message.reply('กำลังหาเพลง ...');

                client.distube.play(message.member.voice.channel, Song, {
                    member: message.member,
                    textChannel: message.channel,
                    message
                })

                /*
                const Content = new EmbedBuilder()
                    .setColor(color)
                    .setTitle('📣 ประกาศ !!')
                    .setDescription('ช่วงนี้บอทอาจจะหาเพลงไม่เจอบ่อย\n`Error : 429 too many request`')
                    .setTimestamp()
                */

                return await msg.edit({ content: 'เจอเพลงล่ะ ✨'/*, embeds: [Content] */ });
            }
        }
    }
}
module.exports = {
    PlayCommand
};