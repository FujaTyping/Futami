const fs = require('node:fs');
const { SapphireClient, ResultError } = require('@sapphire/framework');
const { GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, messageLink } = require('discord.js');
const express = require('express')
const https = require("https");
const cors = require('cors');
const { DisTube, Song } = require('distube');

const app = express()
const path = require('path');
app.use(cors({
    origin: '*'
}));

//const { prefix, port, ssl, debug } = require('./config.json');
const config = require('./config.json');
const prefix = config.bot.prefix
const port = config.server.port
const ssl = config.server.ssl
const debug = config.bot.debug
require('dotenv').config()

const CurrentDate = new Date();
const DateString = `${CurrentDate.getDate()}/${CurrentDate.getMonth()}/${CurrentDate.getFullYear()} @ ${CurrentDate.getHours()}:${CurrentDate.getMinutes()}:${CurrentDate.getSeconds()}`;

const client = new SapphireClient({
    defaultPrefix: prefix,
    disableMentionPrefix: true,
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
    loadMessageCommandListeners: true
});

const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

const { GetCPUUsage, GetRAMUsage } = require('./compute.js')

let SongId = 0;
let LastData = {
    LastSong: [
        {
            id: SongId,
            name: "Nothing is playing previous",
            uploader: "-",
            thumbnail: "-"
        }
    ]
};

let StartSystemData = {
    System: {
        cpuusage: "00.00%",
        ramusage: "00.00%",
        ping: "0"
    },
    Bot: {
        guild: "0",
        users: "0"
    }
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
        app.use('/system', express.static(path.join(__dirname, './system.json')));
        app.use('/player', express.static(path.join(__dirname, './player.json')));
        //app.use('/.well-known/acme-challenge/YOUR_SECRET', express.static(path.join(__dirname, './YOUR_FILE')));
        app.get('/', function (req, res) {
            res.sendFile(__dirname + "../service/index.html")
        })
        app.use((req, res, next) => {
            res.status(404).sendFile(path.join(__dirname, '../service', '404.html'));
        });
        if (ssl == true) {
            https.createServer({
                key: fs.readFileSync("./src/ssl/key.pem"), //privkey.pem
                cert: fs.readFileSync("./src/ssl/cert.pem"), //fullchain.pem
            }, app).listen(port);
        } else {
            app.listen(port)
        }
        fs.writeFileSync('./src/player.json', JSON.stringify(LastData));
        fs.writeFileSync('./src/system.json', JSON.stringify(StartSystemData));
        UpdateSystemData()
        setInterval(() => {
            UpdateSystemData()
        }, 180000)
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
                        uploader: `${song.uploader.name}`,
                        thumbnail: `${song.thumbnail}`
                    }
                ]
            };
        } else if (SongId >= 15) {
            SongId = SongId + 1
            let NewLastData = {
                id: SongId,
                name: `${song.name}`,
                uploader: `${song.uploader.name}`,
                thumbnail: `${song.thumbnail}`
            };
            LastData.LastSong.shift();
            LastData.LastSong.push(NewLastData);
        } else if (SongId >= 1) {
            SongId = SongId + 1
            let NewLastData = {
                id: SongId,
                name: `${song.name}`,
                uploader: `${song.uploader.name}`,
                thumbnail: `${song.thumbnail}`
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
        fs.writeFileSync('./src/player.json', JSON.stringify(LastData));

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
    .on('empty', queue => queue.textChannel.send('👋🏻 ดูเหมือนว่าห้องนี้จะไม่มีคน... ไปละ !!'))
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

function UpdateSystemData() {
    let SystemData = {
        System: {
            cpuusage: `${GetCPUUsage()}`,
            ramusage: `${GetRAMUsage()}`,
            uptimesince: `${DateString}`
        },
        Bot: {
            guild: `${client.guilds.cache.size}`,
            users: `${client.users.cache.size}`,
            ping: `${client.ws.ping}`
        }
    };

    fs.writeFileSync('./src/system.json', JSON.stringify(SystemData));
}
