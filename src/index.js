const { SapphireClient } = require('@sapphire/framework');
const { GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express')
const { DisTube } = require('distube');

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

client.distube = new DisTube(client, {
    streamType: 1,
    leaveOnStop: false,
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
        app.get('/', function (req, res) {
            res.sendFile(__dirname + "../service/index.html")
        })
        const port = 6947
        app.listen(port)
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
    .on('playSong', (queue, song) => {
        const Img = new EmbedBuilder()
            .setColor(color)
            .setImage(song.thumbnail)

        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('💿 กำลังเล่นเพลง')
            .setDescription(`เพลง : **${song.name}**\nอัพโหลดเพลงโดย : \`${song.uploader.name}\`\nเล่นเพลงในห้อง : <#${queue.voiceChannel.id}> - \`${song.formattedDuration}\` นาที`)
            .setFooter({ text: `ขอเพลงโดย : ${song.user.username} | 👍🏻 : ${song.likes} คน , 👀 : ${song.views} คน`, iconURL: song.user.avatarURL() })
            .setTimestamp()

        const Button = new ButtonBuilder()
            .setLabel('ฟังเพลงบน ' + song.source)
            .setURL(song.url)
            .setStyle(ButtonStyle.Link);

        const Row = new ActionRowBuilder()
            .addComponents(Button);

        queue.textChannel.send({ embeds: [Img, Content], components: [Row] })
    }
    )
    .on('addSong', (queue, song) => {
        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('➕ เพิ่มเพลงไปที่คิว')
            .setThumbnail(song.thumbnail)
            .setDescription(`เพลง : **${song.name}**\nใช้คำสั่ง \`f.skip\` เพื่อข้ามไปเพลงต่อไป **(คิวที่ ${queue.queues.size})**`)
            .setFooter({ text: `ขอเพลงโดย : ${song.user.username}`, iconURL: song.user.avatarURL() })
            .setTimestamp()

        queue.textChannel.send({ embeds: [Content] })
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
            .setTitle('เล่นเพลงเสร็จละ ✅')
            .setDescription("ใช้คำสั่ง \`f.stop\` เพื่อนำบอทออกจากห้อง\nหรืออยากฟังเพลงต่อล่ะ ??")
            .setTimestamp()

        queue.textChannel.send({ embeds: [Content] })
    })


if (debug) {
    client.on("debug", (d) => {
        console.log(d)
    });
}