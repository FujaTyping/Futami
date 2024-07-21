const axios = require("axios");
const { Listener } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");

const config = require("../config.json");
const ChatEndpoint = config.chat.chatEndpoint;
const color = config.chat.color;
const Emote = config.default;
require("dotenv").config();

let model = "v1.5-instruct";

class MessageCreateListener extends Listener {
  run(message) {
    if (!message.author.bot) {
      let AnswerAlready = false;
      const Keyword = [
        "Futami",
        "futami",
        "ฟูตามิ",
        "ฟุตามิ",
        "<@1155156868554043484>",
      ];
      const ContentMessage = message.content.replaceAll("--70b", "");

      if (
        message.content.includes("--70b") &&
        message.author.id == config.bot.owner
      ) {
        model = "v1.5x-70b-instruct";
      } else if (message.content.includes("--70b")) {
        const Content = new EmbedBuilder()
          .setColor(color)
          .setAuthor({
            name: "เตือน !!",
            iconURL: "https://futami.siraphop.me/assets/icon/warning.png",
          })
          .setDescription("เป็นผู้พัฒนาถึงใช้งานโมเดลภาษาขนาดใหญ่ได้")
          .setTimestamp();

        return message.reply({ embeds: [Content] });
      }

      Keyword.forEach(async (keyword) => {
        if (AnswerAlready == false) {
          if (message.content.includes(keyword)) {
            AnswerAlready = true;
            await message.channel.sendTyping();
            let CurrentDate = new Date();
            let DateString = `${CurrentDate.getDate()}/${CurrentDate.getMonth()}/${CurrentDate.getFullYear()}`;

            let Prompt = JSON.stringify({
              model: `typhoon-${model}`,
              messages: [
                {
                  role: "system",
                  content: `You are Futami (ฟูตามิ), a friendly and easy-going male AI. You provide concise answers and won't respond to inappropriate questions, reminding users to stay respectful. Developed by FujaTying. Data fixed as of ${DateString}. Futami in Thai , English and Japanese only with short answers.`,
                },
                {
                  role: "user",
                  content: `${ContentMessage}`,
                },
              ],
              max_tokens: 90,
              temperature: 0.6,
              top_p: 1,
              //"repetition_penalty": 1.1,
              stream: false,
            });
            let Config = {
              method: "post",
              maxBodyLength: Infinity,
              url: `${ChatEndpoint}`,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.typoon}`,
              },
              data: Prompt,
            };

            axios
              .request(Config)
              .then(async (response) => {
                let Data = response.data;
                let Msg = Data.choices[0].message.content;
                let ContentMsg = Msg.replaceAll("คะ", "ครับ").replaceAll(
                  "ค่ะ",
                  "ครับ",
                );
                const Warning = `${Emote.mutedwarning} Futami NOT collect your chat & message data`;

                const Content = new EmbedBuilder()
                  .setColor(color)
                  .setAuthor({ name: `${ContentMsg}` })
                  .setFooter({
                    text: `futami-${model}`,
                    iconURL:
                      "https://futami.siraphop.me/assets/icon/typoon.png",
                  });

                return await message.reply({
                  content: `-# ${Warning}`,
                  embeds: [Content],
                });
              })
              .catch(async (error) => {
                const Content = new EmbedBuilder()
                  .setColor(color)
                  .setAuthor({
                    name: `ตอนนี้ไม่สามารถคุยกับคุณได้`,
                    iconURL: "https://futami.siraphop.me/assets/icon/error.png",
                  })
                  .setDescription("```\n" + error + "\n```");

                return await message.reply({ embeds: [Content] });
              });
          }
        }
      });
    }
  }
}
module.exports = {
  MessageCreateListener,
};
