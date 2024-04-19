const fs = require('node:fs');
const { SapphireClient, ResultError } = require('@sapphire/framework');
const { GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, messageLink } = require('discord.js');
const express = require('express')
const { DisTube, Song } = require('distube');

const app = express()
const path = require('path');

require('dotenv').config()
const { prefix, debug } = require('./config.json');

const client = new SapphireClient({
    defaultPrefix: prefix,
    disableMentionPrefix: true,
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
    loadMessageCommandListeners: true
});

const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

let SongId = 0;
let LastData = {
    LastSong: [
        {
            id: SongId,
            name: "Nothing is playing previous",
            uploader: ""
        }
    ]
};

client.distube = new DisTube(client, {
    streamType: 1,
    leaveOnStop: false,
    leaveOnEmpty: true,
    leaveOnFinish: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ]
})

const main = async () => {
    try {
        client.logger.info('Connecting to Discord network');
        await client.login(process.env.token);
        client.logger.info(`Connected ${client.user.tag} successfully !`);
        app.use(express.static(path.join(__dirname, '../service')))
        app.use('/database', express.static(path.join(__dirname, './database.json')));
        app.get('/', function (req, res) {
            res.sendFile(__dirname + "../service/index.html")
        })
        const port = 6947
        app.listen(port)
        fs.writeFileSync('./src/database.json', JSON.stringify(LastData));
        client.logger.info('Web service is online at port : ' + port);
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

main();

const { color } = require('./config.json');

client.distube
    .on('playSong', async (queue, song) => {
        if (SongId == 0) {
            SongId = SongId + 1
            LastData = {
                LastSong: [
                    {
                        id: SongId,
                        name: `${song.name}`,
                        uploader: `${song.uploader.name}`
                    }
                ]
            };
        } else if (SongId >= 8) {
            SongId = 1
            LastData = {
                LastSong: [
                    {
                        id: SongId,
                        name: `${song.name}`,
                        uploader: `${song.uploader.name}`
                    }
                ]
            };
        } else if (SongId >= 1) {
            SongId = SongId + 1
            let NewLastData = {
                LastSong: {
                    id: SongId,
                    name: `${song.name}`,
                    uploader: `${song.uploader.name}`
                }
            };
            LastData.LastSong.push(NewLastData);
        }

        const Img = new EmbedBuilder()
            .setColor(color)
            .setImage(song.thumbnail)

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('💿 กำลังเล่นเพลง')
            .setDescription(`เพลง : **${song.name}**\nอัพโหลดเพลงโดย : \`${song.uploader.name}\`\nเล่นเพลงในห้อง : <#${queue.voiceChannel.id}> - \`${song.formattedDuration}\` นาที`)
            .setFooter({ text: `ขอเพลงโดย : ${song.user.username}`, iconURL: song.user.avatarURL() })
            .setTimestamp()

        const Button = new ButtonBuilder()
            .setLabel('ฟังเพลงบน ' + song.source)
            .setURL(song.url)
            .setStyle(ButtonStyle.Link);

        const Status = new ButtonBuilder()
            .setCustomId('status')
            .setLabel('ดูสถานะเพลง')
            .setStyle(ButtonStyle.Secondary);

        const Row = new ActionRowBuilder()
            .addComponents(Button, Status);

        const Msg = await queue.textChannel.send({ embeds: [Img, Content], components: [Row] })
        fs.writeFileSync('./src/database.json', JSON.stringify(LastData));

        const Collector = Msg.createMessageComponentCollector({
            filter: (buttonInteraction) => buttonInteraction.customId === 'status' && buttonInteraction.user.id === song.user.id,
            time: 60000,
            max: 1
        });

        Collector.on('collect', (buttonInteraction) => {
            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('💿 กำลังเล่นเพลง')
                .setDescription(`เพลง : **${song.name}**\nอัพโหลดเพลงโดย : \`${song.uploader.name}\`\nเล่นเพลงในห้อง : <#${queue.voiceChannel.id}> - \`${song.formattedDuration}\` นาที\n`)
                .setFooter({ text: `ขอเพลงโดย : ${song.user.username}`, iconURL: song.user.avatarURL() })
                .addFields(
                    { name: '💿 สถานะตัวเล่นเพลง', value: `- ระดับเสียง : **${queue.volume} %**\n- ระบบลูป : **${queue.repeatMode ? (queue.repeatMode === 2 ? 'ลูปเพลงในคิว' : 'ลูปแค่เพลงนี้') : 'ปิด (ไม่มีลูป)'}**`, inline: true },
                    { name: '🎵 ข้อมูลเพลง', value: `- ไลค์  : **${song.likes} คน**\n- ยอดคนดู : **${song.views} คน**`, inline: true }
                )
                .setTimestamp()

            const Status = new ButtonBuilder()
                .setCustomId('status')
                .setLabel('ดูสถานะเพลง')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);

            const Row = new ActionRowBuilder()
                .addComponents(Button, Status);

            return Msg.edit({ embeds: [Img, Content], components: [Row] })
        });

        Collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                const Status = new ButtonBuilder()
                    .setCustomId('status')
                    .setLabel('ดูสถานะเพลง')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);

                const Row = new ActionRowBuilder()
                    .addComponents(Button, Status);

                return Msg.edit({ embeds: [Img, Content], components: [Row] })
            }
        });
    }
    )
    .on('addSong', async (queue, song) => {
        const BeforeContent = new EmbedBuilder()
            .setColor(color)
            .setTitle('➕ เพิ่มเพลงไปที่คิว')
            .setThumbnail(song.thumbnail)
            .setDescription(`เพลง : **${song.name}**\nใช้คำสั่ง \`f.skip\` เพื่อข้ามไปเพลงต่อไป **(คิวที่ ${queue.queues.size})**`)
            .setFooter({ text: `ขอเพลงโดย : ${song.user.username}`, iconURL: song.user.avatarURL() })
            .setTimestamp()

        const Button = new ButtonBuilder()
            .setCustomId('skip')
            .setLabel('ข้ามเพลง (ที่เล่นอยู่)')
            .setStyle(ButtonStyle.Secondary);

        const Row = new ActionRowBuilder()
            .addComponents(Button);

        const Msg = await queue.textChannel.send({ embeds: [BeforeContent], components: [Row] })

        const Collector = Msg.createMessageComponentCollector({
            filter: (buttonInteraction) => buttonInteraction.customId === 'skip' && buttonInteraction.user.id === song.user.id,
            time: 30000,
            max: 1
        });

        Collector.on('collect', async (buttonInteraction) => {
            const song = await queue.skip()

            const Content = new EmbedBuilder()
                .setColor(color)
                .setTitle('⏭️ ข้ามเพลงแล้ว')
                .setDescription('ข้ามเพลง : **' + queue.songs[0].name + '**')
                .setFooter({ text: `ใช้คำสั่งโดย : ${song.user.username}`, iconURL: song.user.avatarURL() })
                .setTimestamp()

            queue.textChannel.send({ embeds: [Content] })

            const Button = new ButtonBuilder()
                .setCustomId('skip')
                .setLabel('ข้ามเพลง (ที่เล่นอยู่)')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);

            const Row = new ActionRowBuilder()
                .addComponents(Button);

            return Msg.edit({ embeds: [BeforeContent], components: [Row] })
        });

        Collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                const Button = new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel('ข้ามเพลง (ที่เล่นอยู่)')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);

                const Row = new ActionRowBuilder()
                    .addComponents(Button);

                return Msg.edit({ embeds: [BeforeContent], components: [Row] })
            }
        });
    }
    )
    .on('error', (channel, e) => {
        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('🛑 เกิดอะไรขึ้น')
            .setDescription("```\n" + `${e.toString().slice(0, 1974)}` + "\n```\nหากเป็นข้อผิดผลาดที่สำคัญ ไปบอกผู้พัฒนาด้วย !!")
            .setTimestamp()

        if (channel) {
            channel.send({ embeds: [Content] })
        } else {
            console.error(e)
        }
    })
    .on('empty', channel => channel.send('ดูเหมือนว่าห้องนี้จะไม่มีคน... ไปละ !!'))
    .on('searchNoResult', (message, query) => {
        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('⚠️ เตือน ??')
            .setDescription("ไม่พบเพลง : **" + query + "**\nใส่ลิ้งค์เพลง / ชื่อเพลง / เพลง ใหม่ด้วย")
            .setTimestamp()

        message.channel.send({ embeds: [Content] })
    }
    )
    .on('finish', queue => {
        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('เล่นเพลงเสร็จละ 🎙️')
            .setDescription("ใช้คำสั่ง \`f.stop\` เพื่อนำบอทออกจากห้อง\nหรืออยากฟังเพลงต่อล่ะ ??")
            .setTimestamp()

        queue.textChannel.send({ embeds: [Content] })
    })


if (debug) {
    client.on("debug", (d) => {
        console.log(d)
    });
}