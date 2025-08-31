import { Client, GatewayIntentBits } from 'discord.js';

// Creates the client for the bot with the proper 'intents' it may need.
// Will be set up with process.env or otherwise, not saved directly within the GitHub.
// A bot is not connected yet.
export const client = new Client({ intents: [] });
export const clientId = `<CLIENT ID>`;
export const guildId = `<SERVER ID>`;
export const name = 'Pip';
export const TOKEN = `<BOT_TOKEN>`;

//  Within the slash_commands folder, "config" references this file and can get these properties (e.g "config.client").