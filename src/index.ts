import { Collection, Routes, REST, SlashCommandBuilder } from "discord.js";
import { TOKEN, client, clientId, guildId, name } from "./config.js";
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import type { SlashCommand } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sCommandsPath = join(__dirname, 'slash_commands');
const sCommandFiles = readdirSync(sCommandsPath).filter(file => file.endsWith('.ts'));

const sCommands: SlashCommandBuilder[] = [];
client.sCommands = new Collection<string, SlashCommand>();

for (const file of sCommandFiles) {
  const filePath = join(sCommandsPath, file);
  const command = await import(filePath) as { default: SlashCommand };
  sCommands.push(command.default.data);
  client.sCommands.set(command.default.data.name, command.default);
}

client.once('clientReady', async () => {
  console.log(`\n\n${name} IS ONLINE!\n\n`);

  if (client.user) {
    client.user.setActivity(`I'm...alive...!`);
  }

  if (!TOKEN) {
    throw new Error('DISCORD_TOKEN is required');
  }
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  await import('./ext/webserver');

  if (!clientId || !guildId) {
    throw new Error('CLIENT_ID and GUILD_ID are required');
  }

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { 
    body: sCommands.map(command => command.toJSON()) 
  })
     .then(() => console.log(`Successfully re-registered application commands.\n\n`))
     .catch(console.error);
  
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  // Grabs the name of the slash command that was initiated!
  const { commandName } = interaction;
  // Attempts to find the requested command
  const called = client.sCommands.get(commandName);
  // This executes the files and sets the parameters client, config, and interaction.
  // If you change this parameters list, you may have to change it in all files under the "slash_commands" folder.
  if (called) {
    called.execute(client, interaction);
  }

  /*
  
  There's no need to check if this was ran in the DMs or by a bot. Bots cannot use slash commands
  and as long as the slash commands are server-only (set by default), there's no worry for them in the DMs.
  
  In a server with the bot, type /test to execute the test.js file in the slash_commands folder.
  The test command should only be made visible to administrators and people working on the bot, but may cause crashing.
  Update those settings in Discord Server Settings.
      
  Contact me on Discord (Jgouken) if you have any questions or feedback on this project!
  
  */
});

// When a user is added to the Discord Server...
client.on('guildMemberAdd', async member => {
  member.send(`Welcome to the RIT SSE Discord Server! Please read \`#info\` channel and verify using \`/verify\`!`)
  // Add unverified role?
})

// When the bot is invited to another server...
client.on('guildCreate', async () => {
  // Because this bot is curated for the current SSE Discord, it would work improperly in others.
  // guild.leave();
})

// Username here, Forgot Password button there and...done!
client.login(TOKEN);