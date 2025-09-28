const { SlashCommandBuilder } = require('discord.js');
// This is to help set up the slash command!

const data = new SlashCommandBuilder()
    // Lowercase only, Duplicates may cause problems
    .setName('test')
    // Set's the description of the command.
    .setDescription('Replies with a test command!');

// For all of the options you can use for the builder, use the link below and experiment!
// https://discordjs.guide/interactive-components/interactions.html#component-interactions
/**
* The function ran when this file's slash command is used.
* 
* @param {DiscordClient} client The API client of the bot.
* @param {config.js} config The configuration set in config.js.
* @param {DiscordInteraction} interaction The slash command interaction.
*/
async function execute(client, config, interaction) {
    await interaction.reply('Hey, it works!');
    // Replies to the interaction with a message!
    
    /*
    Using the builder at the top of the file, the Slash Command will already but updated in whatever server

    Any code to do!

    Create a new command:
    - Add a new file (name it whatever you want).
    - Create a new module.exports like this file.
    - At the top of the file, you can set name and description to any string.

    Parameters:
    - "client" is the bot's client.
    - "config" accesses all variables in the config file.
    - "interaction" https://discord.com/developers/docs/interactions/receiving-and-responding
    
    - Any added parameters must be set in index.js in an identical order. Execute parameters must be the same in all files.
    - Parameters work as local variables; Their values can be changed within the function.
    */
}

// Exports the data and execute function for use in index.js
module.exports = { data, execute };