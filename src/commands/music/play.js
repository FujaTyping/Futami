const { Command, container } = require('@sapphire/framework');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

const config = require('../../config.json');
const color = config.chat.color
const emote = config.default

const PlaylistDataJSON = fs.readFileSync('./src/commands/music/data/playlist.json', 'utf8');
const DataPlaylist = JSON.parse(PlaylistDataJSON);

class PlayCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'play',
            aliases: ['p'],
            description: 'play song from source',
            preconditions: ['InVoiceChannel']
        });
    }

    async messageRun(message, args) {
        let Song = await args.rest('string');
        const { client } = container;

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
                    .setAuthor({ name: 'เตือน !!', iconURL: 'https://futami.siraphop.me/assets/icon/warning.png' })
                    .setDescription(`ดูเหมือนว่าจะไม่มีเพลย์ลิส **${PlaylistName}** ในฐานข้อมูลของฟูตามินะ`)
                    .setTimestamp()

                const Button = new ButtonBuilder()
                    .setLabel('เพลย์ลิสของฟูตามิ')
                    .setURL('https://futami.siraphop.me/statics?playlist')
                    .setStyle(ButtonStyle.Link);

                const Row = new ActionRowBuilder()
                    .addComponents(Button);

                return await message.reply({ embeds: [Content], components: [Row] });
            }
        } else {
            const msg = await message.reply('กำลังหาเพลง ...');

            client.distube.play(message.member.voice.channel, Song, {
                member: message.member,
                textChannel: message.channel,
                message
            })

            return await msg.edit({ content: 'เจอเพลงล่ะ ✨'/*, embeds: [Content] */ });
        }
    }
}
module.exports = {
    PlayCommand
};
