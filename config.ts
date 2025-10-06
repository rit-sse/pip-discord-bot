// @ts-nocheck

const { Client, GatewayIntentBits } = require('discord.js');
const crypto = require('node:crypto');
// Creates the client for the bot with the proper 'intents' it may need.
// Will be set up with process.env or otherwise, not saved directly within the GitHub.
// A bot is not connected yet.
module.exports = {
    client: new Client({ intents: [] }),
    clientId: process.env.TEST_CLIENT_ID, // The ID of the bot
    guildId: process.env.TEST_SERVER_ID, // The ID of the server (currently set to a test server)
    name: 'Pip',
    TOKEN: process.env.DISCORD_TOKEN, // Must be kept secret! Uploading this publicly will automatically reset it.
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SIGNING_SECRET: process.env.SIGNING_SECRET || crypto.randomUUID(), // Use persistent secret in production
    REDIRECT_URI: process.env.REDIRECT_URI,

    WEBSERVER_PORT: process.env.WEBSERVER_PORT || 3000,

}
