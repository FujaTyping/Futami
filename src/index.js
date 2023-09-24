const { SapphireClient } = require('@sapphire/framework');
const { GatewayIntentBits } = require('discord.js');
const express = require('express')

const app = express()

require('dotenv').config()
const { prefix } = require('./config.json');

const client = new SapphireClient({
    defaultPrefix: prefix,
    disableMentionPrefix: true,
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    loadMessageCommandListeners: true
});

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