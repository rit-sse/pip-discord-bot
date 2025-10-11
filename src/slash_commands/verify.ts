import { 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  MessageFlags,
  Client,
  ChatInputCommandInteraction 
} from 'discord.js';
import { GOOGLE_CLIENT_ID, REDIRECT_URI, SIGNING_SECRET } from '../config.js';
import { sign } from '../ext/integrity.js';
import { OAuth2Payload } from '../types.js';

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
async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
    
    if (!GOOGLE_CLIENT_ID || !REDIRECT_URI) {
        await interaction.reply({
            content: 'OAuth2 configuration is not properly set up.',
            flags: MessageFlags.Ephemeral
        });
        return;
    }

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
            } as OAuth2Payload), SIGNING_SECRET)
        }).toString());

    const oauth2LinkRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(oauth2LinkButton);

    // Respond with a ephemeral message with the button to open the OAUTH2 link.
    await interaction.reply({
        content: 'To verify your email, please click the button below to verify.',
        components: [oauth2LinkRow],
        flags: MessageFlags.Ephemeral
    });
}

export default { data, execute };