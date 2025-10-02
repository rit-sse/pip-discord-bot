// The purpose of this file is purely initialization of the bot and all of its commands, as well as command handling.

// Discord definitions (CommonJS requires)
const { Collection, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
// Sets the config file as a variable (supports both module.exports and ES default export)
const config = require('./config.js');
const { client, clientId, guildId, name, TOKEN } = config;
// "fs" to read files
const { readdirSync } = require('node:fs');
// "path" to find files without having to input a path.
const { join } = require('node:path');

// Finds the path of the folder titled "slash_commands"
const sCommandsPath = join(__dirname, 'slash_commands'); // __dirname is the current directory of this file
// Finds all JavaScript files in the folder called "slash_commands".
const sCommandFiles = readdirSync(sCommandsPath).filter(file => file.endsWith('.js'));

// This array is interpreted as slash commands to Discord's API.
const sCommands = []
// This collection is used to call and run the correct function when a slash command is called.
client.sCommands = new Collection();

// Gets all slash commands and their contents
for (const file of sCommandFiles) {
  const filePath = join(sCommandsPath, file);
  const command = require(filePath);
  // This is required to do to update the slash commands!
  sCommands.push(command.data)
  // For each file, the file is retrieved and put in the "client.sCommands" collection under the slash command's name.
  // In this instance, the key is the command's name, and the value is the command file entirely.
  client.sCommands.set(command.data.name, command);
}

// Once the bot is online, do this ONCE...
client.once('clientReady', async () => {
  // When the client boots up, it'll tell you in the Output/Terminal.
  console.log(`\n\n${name} IS ONLINE!\n\n`);

  // This sets the bots' custom status. The "type" variants are:
  // LISTENING, WATCHING, PLAYING, STREAMING, COMPETING (uppercase required)
  client.user.setActivity(`I'm...alive...!`);

  // This sets the authorization token that should be used for requests. The bots' token is the key to any listeners.
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  // Start the web server
  require('./ext/webserver.js');

  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: sCommands.map(command => command.toJSON()) })
     .then(() => console.log(`Successfully re-registered application commands.\n\n`))
     .catch(console.error);
  // (Basically) updates and creates all slash commands in the slash_commands folder!

  /*
  
      Delete a Slash Command: Follow the guide linked below. It's a slow process, but it works!
      https://discordjs.guide/slash-commands/deleting-commands.html#deleting-specific-commands

      To have all of the slash commands work across multiple servers, change line 13 to the following:
      await rest.put(Routes.applicationCommands(clientId), body: sCommands.map(command => command.toJSON() })

  */
});

// When an "interaction" for the bot has been ran, such as a slash command or button press...
client.on('interactionCreate', async interaction => {
  // Only accounts for slash commands. All other interaction types should be handed within their respective functions.
  if (!interaction.isChatInputCommand()) return;
  // Grabs the name of the slash command that was initiated!
  const { commandName } = interaction;
  // Attempts to find the requested command
  const called = client.sCommands.get(commandName);
  // This executes the files and sets the parameters client, config, and interaction.
  // If you change this parameters list, you may have to change it in all files under the "slash_commands" folder.
  if (called) called.execute(client, config, interaction);

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
client.on('guildCreate', async guild => {
  // Because this bot is curated for the current SSE Discord, it would work improperly in others.
  // guild.leave();
})

// Username here, Forgot Password button there and...done!
client.login(TOKEN);