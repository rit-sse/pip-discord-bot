const { Client, GatewayIntentBits } = require('discord.js');

// Creates the client for the bot with the proper 'intents' it may need.
// Will be set up with process.env or otherwise, not saved directly within the GitHub.
// A bot is not connected yet.
module.exports = {
    client: new Client({ intents: [] }),
    clientId: process.env.TEST_CLIENT_ID, // The ID of the bot
    guildId: process.env.TEST_SERVER_ID, // The ID of the server (currently set to a test server)
    name: 'Pip',
    TOKEN: process.env.DISCORD_TOKEN // Must be kept secret! Uploading this publicly will automatically reset it.
}

//  Within the slash_commands folder, the "config" parameter references this file and can get these properties (e.g "config.client").