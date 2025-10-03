// This is to help set up the slash command!
const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI, SIGNING_SECRET } = require('../config.js');
const { sign } = require('../ext/integrity.js');





const data = new SlashCommandBuilder()
    // Lowercase only, Duplicates may cause problems
    .setName('verify')
    // Set's the description of the command.
    .setDescription('Verify your email in the RIT SSE Discord Server.');

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

    // Create Button that returns the OAUTH2 link to verify their email.
    const oauth2LinkButton = new ButtonBuilder()
        .setLabel('Verify Email')
        .setStyle(ButtonStyle.Link)
        .setURL('https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            scope: 'email profile',
            hd: 'g.rit.edu',
            state: sign(JSON.stringify({
                discord: interaction.user.id,
                server: interaction.guildId
            }), SIGNING_SECRET)
        }))

    const oauth2LinkRow = new ActionRowBuilder()
        .addComponents(oauth2LinkButton);


    // Respond with a ephemeral message with the button to open the OAUTH2 link.
    await interaction.reply({
        content: 'To verify your email, please click the button below to verify.',
        components: [oauth2LinkRow],
        flags: MessageFlags.Ephemeral
    });

}

module.exports = { data, execute };