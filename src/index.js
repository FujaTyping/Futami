const fs = require("node:fs");
const { SapphireClient, ResultError } = require("@sapphire/framework");
const {
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  messageLink,
} = require("discord.js");
const express = require("express");
const https = require("https");
const cors = require("cors");
const { DisTube, Song } = require("distube");

const app = express();
const path = require("path");
app.use(
  cors({
    origin: "https://futami.siraphop.me",
    methods: "GET",
  }),
  express.json(),
);

const config = require("./config.json");
const prefix = config.bot.prefix;
const color = config.chat.color;
const port = config.server.port;
const apiOnly = config.server.apiOnly;
const ssl = config.server.ssl;
const debug = config.bot.debug;
const mobile = config.bot.mobile;
const emote = config.default;
require("dotenv").config();

if (mobile == true) {
  const {
    DefaultWebSocketManagerOptions: { identifyProperties },
  } = require("@discordjs/ws");
  identifyProperties.browser = "Discord Android";
}

const CurrentDate = new Date();
const DateString = `${CurrentDate.getDate()}/${CurrentDate.getMonth()}/${CurrentDate.getFullYear()} @ ${CurrentDate.getHours()}:${CurrentDate.getMinutes()}:${CurrentDate.getSeconds()}`;

const client = new SapphireClient({
  defaultPrefix: prefix,
  disableMentionPrefix: true,
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
  loadMessageCommandListeners: true,
});

const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { YouTubePlugin } = require("@distube/youtube");

const { GetCPUUsage, GetRAMUsage } = require("./compute.js");

let SongId = 0;
let LastData = {
  LastSong: [
    {
      id: SongId,
      name: "Nothing is playing previous",
      uploader: "-",
      thumbnail: "-",
    },
  ],
};

let MainSystemData = {
  System: {
    cpuusage: "00.00%",
    ramusage: "00.00%",
    ping: "0",
  },
  Bot: {
    guild: "0",
    users: "0",
  },
};

let ServiceStatus = { status: "Operational", code: 1 };

const Data404 = {
  error: true,
  statuscode: 404,
  message: "API that you finding does not exist",
};

const PlaylistDataJSON = fs.readFileSync(
  "./src/commands/music/data/playlist.json",
  "utf8",
);
const DataPlaylist = JSON.parse(PlaylistDataJSON);

client.distube = new DisTube(client, {
  plugins: [
    new YouTubePlugin(),
    new YtDlpPlugin(),
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
  ],
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
});

const Authenticate = (req, res, next) => {
  const AuthHeader = req.get("AuthToken");

  if (!AuthHeader || AuthHeader !== config.bot.owner) {
    return res.json({ errormessage: "Invalid credentials" });
  }

  next();
};

const main = async () => {
  try {
    client.logger.info("Connecting to Discord network");
    await client.login(process.env.token);
    client.logger.info(`Connected ${client.user.tag} successfully !`);
    //app.get('/.well-known/acme-challenge/YOUR_SECRET', function (req, res) { res.sendFile(__dirname + "/ssl/YOUR_SSL_HERE") })
    app.get("/system", (req, res) => {
      res.json(MainSystemData);
    });
    app.get("/status", (req, res) => {
      res.json(ServiceStatus);
    });
    app.patch("/status", Authenticate, (req, res) => {
      const code = req.body.code;

      if (!code) {
        res.json({ errormessage: "Missing status code" });
      } else {
        if (code == 0) {
          ServiceStatus.code = code;
          ServiceStatus.status = "Service Disruption";
        } else if (code == 1) {
          ServiceStatus.code = code;
          ServiceStatus.status = "Operational";
        } else if (code == 2) {
          ServiceStatus.code = code;
          ServiceStatus.status = "Degraded Performance";
        } else {
          return res.json({ errormessage: "Status code not match" });
        }

        return res.json(ServiceStatus);
      }
    });
    app.get("/player", (req, res) => {
      res.json(LastData);
    });
    app.get("/player/playlist", (req, res) => {
      res.json(DataPlaylist);
    });
    if (apiOnly == false) {
      app.use(express.static(path.join(__dirname, "../service")));
      app.get("/", function (req, res) {
        res.sendFile(__dirname + "../service/index.html");
      });
      app.use((req, res, next) => {
        res
          .status(404)
          .sendFile(path.join(__dirname, "../service", "404.html"));
      });
    } else {
      app.use((req, res, next) => {
        res.status(404).json(Data404);
      });
    }
    if (ssl == true) {
      https
        .createServer(
          {
            key: fs.readFileSync("./src/ssl/key.pem"), //privkey.pem
            cert: fs.readFileSync("./src/ssl/cert.pem"), //fullchain.pem
          },
          app,
        )
        .listen(port);
    } else {
      app.listen(port);
    }
    UpdateSystemData();
    setInterval(() => {
      UpdateSystemData();
    }, 180000);
    client.logger.info("Web service is online at port : " + port);
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
};

main();

client.distube
  .on("playSong", async (queue, song) => {
    if (SongId == 0) {
      SongId = SongId + 1;
      LastData = {
        LastSong: [
          {
            id: SongId,
            name: `${song.name}`,
            uploader: `${song.uploader.name}`,
            thumbnail: `${song.thumbnail}`,
          },
        ],
      };
    } else if (SongId >= 18) {
      SongId = SongId + 1;
      let NewLastData = {
        id: SongId,
        name: `${song.name}`,
        uploader: `${song.uploader.name}`,
        thumbnail: `${song.thumbnail}`,
      };
      LastData.LastSong.shift();
      LastData.LastSong.push(NewLastData);
    } else if (SongId >= 1) {
      SongId = SongId + 1;
      let NewLastData = {
        id: SongId,
        name: `${song.name}`,
        uploader: `${song.uploader.name}`,
        thumbnail: `${song.thumbnail}`,
      };
      LastData.LastSong.push(NewLastData);
    }

    const Img = new EmbedBuilder().setColor(color).setImage(song.thumbnail);

    const Content = new EmbedBuilder()
      .setColor(color)
      .setTitle("💿 กำลังเล่นเพลง")
      .setDescription(
        `เพลง : **${song.name}**\nอัพโหลดเพลงโดย : \`${song.uploader.name}\`\nเล่นเพลงในห้อง : <#${queue.voiceChannel.id}> - \`${song.formattedDuration}\` นาที`,
      )
      .setFooter({
        text: `ขอเพลงโดย : ${song.user.username}`,
        iconURL: song.user.avatarURL(),
      })
      .setTimestamp();

    const Button = new ButtonBuilder()
      .setLabel("ฟังเพลงบน " + song.source)
      .setURL(song.url)
      .setStyle(ButtonStyle.Link);

    const Status = new ButtonBuilder()
      .setCustomId("status")
      .setLabel("ดูสถานะเพลง")
      .setStyle(ButtonStyle.Secondary);

    const Row = new ActionRowBuilder().addComponents(Button, Status);

    const Msg = await queue.textChannel.send({
      embeds: [Img, Content],
      components: [Row],
    });

    const Collector = Msg.createMessageComponentCollector({
      filter: (buttonInteraction) =>
        buttonInteraction.customId === "status" &&
        buttonInteraction.user.id === song.user.id,
      time: song.duration * 1000,
      max: 1,
    });

    Collector.on("collect", (buttonInteraction) => {
      const Content = new EmbedBuilder()
        .setColor(color)
        .setTitle("💿 กำลังเล่นเพลง")
        .setDescription(
          `เพลง : **${song.name}**\nอัพโหลดเพลงโดย : \`${song.uploader.name}\`\nเล่นเพลงในห้อง : <#${queue.voiceChannel.id}> - \`${song.formattedDuration}\` นาที\n`,
        )
        .setFooter({
          text: `ขอเพลงโดย : ${song.user.username}`,
          iconURL: song.user.avatarURL(),
        })
        .addFields(
          {
            name: "💿 สถานะตัวเล่นเพลง",
            value: `- ระดับเสียง : **${queue.volume} %**\n- ระบบลูป : **${queue.repeatMode ? (queue.repeatMode === 2 ? "ลูปเพลงในคิว" : "ลูปแค่เพลงนี้") : "ปิด (ไม่มีลูป)"}**`,
            inline: true,
          },
          {
            name: "🎵 ข้อมูลเพลง",
            value: `- ไลค์  : **${song.likes} คน**\n- ยอดคนดู : **${song.views} คน**`,
            inline: true,
          },
        )
        .setTimestamp();

      const Status = new ButtonBuilder()
        .setCustomId("status")
        .setLabel("ดูสถานะเพลง")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

      const Row = new ActionRowBuilder().addComponents(Button, Status);

      return Msg.edit({ embeds: [Img, Content], components: [Row] });
    });

    Collector.on("end", (collected, reason) => {
      if (reason === "time") {
        const Status = new ButtonBuilder()
          .setCustomId("status")
          .setLabel("ดูสถานะเพลง")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true);

        const Row = new ActionRowBuilder().addComponents(Button, Status);

        return Msg.edit({ embeds: [Img, Content], components: [Row] });
      }
    });
  })
  .on("addSong", async (queue, song) => {
    const BeforeContent = new EmbedBuilder()
      .setColor(color)
      .setTitle("➕ เพิ่มเพลงไปที่คิว")
      .setThumbnail(song.thumbnail)
      .setDescription(
        `เพลง : **${song.name}**\nใช้คำสั่ง \`f.skip\` เพื่อข้ามไปเพลงต่อไป **(คิวที่ ${queue.queues.size})**`,
      )
      .setFooter({
        text: `ขอเพลงโดย : ${song.user.username}`,
        iconURL: song.user.avatarURL(),
      })
      .setTimestamp();

    const Button = new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("ข้ามเพลง (ที่เล่นอยู่)")
      .setStyle(ButtonStyle.Secondary);

    const Row = new ActionRowBuilder().addComponents(Button);

    const Msg = await queue.textChannel.send({
      embeds: [BeforeContent],
      components: [Row],
    });

    const Collector = Msg.createMessageComponentCollector({
      filter: (buttonInteraction) =>
        buttonInteraction.customId === "skip" &&
        buttonInteraction.user.id === song.user.id,
      time: (song.duration * 1000) / 2,
      max: 1,
    });

    Collector.on("collect", async (buttonInteraction) => {
      const song = await queue.skip();

      const Content = new EmbedBuilder()
        .setColor(color)
        .setTitle("⏭️ ข้ามเพลงแล้ว")
        .setDescription("ข้ามเพลง : **" + queue.songs[0].name + "**")
        .setFooter({
          text: `ใช้คำสั่งโดย : ${song.user.username}`,
          iconURL: song.user.avatarURL(),
        })
        .setTimestamp();

      queue.textChannel.send({ embeds: [Content] });

      const Button = new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("ข้ามเพลง (ที่เล่นอยู่)")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

      const Row = new ActionRowBuilder().addComponents(Button);

      return Msg.edit({ embeds: [BeforeContent], components: [Row] });
    });

    Collector.on("end", (collected, reason) => {
      if (reason === "time") {
        const Button = new ButtonBuilder()
          .setCustomId("skip")
          .setLabel("ข้ามเพลง (ที่เล่นอยู่)")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true);

        const Row = new ActionRowBuilder().addComponents(Button);

        return Msg.edit({ embeds: [BeforeContent], components: [Row] });
      }
    });
  })
  .on("error", (channel, e) => {
    const Content = new EmbedBuilder()
      .setColor(color)
      .setAuthor({
        name: "เกิดอะไรขึ้น ??",
        iconURL: "https://futami.siraphop.me/assets/icon/error.png",
      })
      .setDescription(
        "```\n" +
          `${e.toString().slice(0, 1974)}` +
          "\n```\nหากเป็นข้อผิดผลาดที่สำคัญ ไปบอกผู้พัฒนาด้วย !!",
      )
      .setTimestamp();

    if (channel) {
      channel.send({ embeds: [Content] });
    } else {
      console.error(e);
    }
  })
  .on("empty", (queue) =>
    queue.textChannel.send("👋🏻 ดูเหมือนว่าห้องนี้จะไม่มีคน... ไปละ !!"),
  )
  .on("searchNoResult", (message, query) => {
    const Content = new EmbedBuilder()
      .setColor(color)
      .setAuthor({
        name: "เตือน !!",
        iconURL: "https://futami.siraphop.me/assets/icon/warning.png",
      })
      .setDescription(
        "ไม่พบเพลง : **" +
          query +
          "**\nใส่ลิ้งค์เพลง / ชื่อเพลง / เพลง ใหม่ด้วย",
      )
      .setTimestamp();

    message.channel.send({ embeds: [Content] });
  })
  .on("finish", (queue) => {
    const Content = new EmbedBuilder()
      .setColor(color)
      .setTitle("เล่นเพลงเสร็จละ 🎙️")
      .setDescription(
        "ใช้คำสั่ง `f.stop` เพื่อนำบอทออกจากห้อง\nหรืออยากฟังเพลงต่อล่ะ ??",
      )
      .setTimestamp();

    queue.textChannel.send({ embeds: [Content] });
  });

if (debug) {
  client.on("debug", (d) => {
    console.log(d);
  });
}

function UpdateSystemData() {
  MainSystemData = {
    System: {
      cpuusage: `${GetCPUUsage()}`,
      ramusage: `${GetRAMUsage()}`,
      uptimesince: `${DateString}`,
    },
    Bot: {
      guild: `${client.guilds.cache.size}`,
      users: `${client.users.cache.size}`,
      ping: `${client.ws.ping}`,
    },
  };
}
