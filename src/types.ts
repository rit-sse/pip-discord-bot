import { Collection, Client, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

// Extend the Discord.js Client to include our custom properties
declare module 'discord.js' {
  interface Client {
    sCommands: Collection<string, SlashCommand>;
  }
}

// Type for slash command structure
export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (client: Client, interaction: ChatInputCommandInteraction) => Promise<void> | void;
}

// Config type
export interface Config {
  client: Client;
  clientId?: string;
  guildId?: string;
  name: string;
  TOKEN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SIGNING_SECRET: string;
  REDIRECT_URI?: string;
  WEBSERVER_PORT: string | number;
}