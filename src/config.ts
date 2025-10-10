import { Client } from 'discord.js';
import crypto from 'node:crypto';

// Creates the client for the bot with the proper 'intents' it may need.
// Will be set up with process.env or otherwise, not saved directly within the GitHub.
// A bot is not connected yet.
export const client: Client = new Client({ intents: [] });

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required but not set.`);
    }
    return value;
}

export const clientId: string = requireEnv('TEST_CLIENT_ID');
export const guildId: string = requireEnv('TEST_SERVER_ID');
export const name: string = 'Pip';
export const TOKEN: string = requireEnv('DISCORD_TOKEN');
export const GOOGLE_CLIENT_ID: string = requireEnv('GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET: string = requireEnv('GOOGLE_CLIENT_SECRET');
export const SIGNING_SECRET: string = process.env.SIGNING_SECRET || crypto.randomUUID();
export const REDIRECT_URI: string = requireEnv('REDIRECT_URI');
export const WEBSERVER_PORT: number = Number(process.env.WEBSERVER_PORT) || 3000;
