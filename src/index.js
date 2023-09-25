const { SapphireClient } = require('@sapphire/framework');
const { GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express')
const { DisTube } = require('distube');

const app = express()

require('dotenv').config()
const { prefix } = require('./config.json');

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
        client.logger.info('Futami is waking up...');
        await client.login(process.env.token);
        client.logger.info('Futami is wake up!');
        app.get('/', function (req, res) {
            res.send('Hi - From Futami')
        })
        app.listen(6947)
        client.logger.info('Web service is ready!');
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
            .setDescription(`เพลง : **${song.name}**\nอัพโหลดเพลงโดย : \`${song.uploader.name}\`\nระยะเวลา : \`${song.formattedDuration}\` นาที\nขอเพลงโดย : ${song.user} - <#${queue.voiceChannel.id}>`)
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
            .setDescription(`เพลง : **${song.name}**\nขอเพลงโดย : ${song.user}\nใช้คำสั่ง \`f.skip\` เพื่อข้ามไปเพลงต่อไป`)
            .setTimestamp()

        queue.textChannel.send({ embeds: [Content] })
    }
    )
    .on('error', (channel, e) => {
        const Content = new EmbedBuilder()
            .setColor(color)
            .setTitle('🛑 เกิดอะไรขึ้น')
            .setDescription("```\n" + `${e.toString().slice(0, 1974)}` + "\n```")
            .setTimestamp()

        if (channel) channel.send({ embeds: [Content] })
        else console.error(e)
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
            .setDescription("ใช้คำสั่ง \`f.stop\` เพื่อนำบอทออกจากห้อง")
            .setTimestamp()

        queue.textChannel.send({ embeds: [Content] })
    })