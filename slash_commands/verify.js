// This is to help set up the slash command!
const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

/**
 * All of these variables are for all of the menus, buttons, and modals that appear during the verification process.
 * They are defined here before the execute function to keep the function cleaner.
 */

// These constants are each of the 3 modals using Discord's ModalBuilder.
const emailVerificationModal = new ModalBuilder()
    .setCustomId('emailVerify')
    .setTitle('Verify Your Email');

const codeVerificationModal = new ModalBuilder()
    .setCustomId('codeVerify')
    .setTitle('Code Sent!');

const nicknameChangeModal = new ModalBuilder()
    .setCustomId('nicknameChange')
    .setTitle('Welcome to the SSE!');

// These constants are each of the inputs within each modal.
const emailInput = new TextInputBuilder()
    .setCustomId('emailInput')
    // The label is the prompt the user sees for this input
    .setLabel("Enter your RIT Email")
    .setPlaceholder("abc1234@rit.edu")
    // Short means only a single line of text
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

const codeInput = new TextInputBuilder()
    .setCustomId('codeInput')
    // The label is the prompt the user sees for this input
    .setLabel("Enter the code sent to your email")
    .setPlaceholder("123456")
    .setMinLength(6)
    .setMaxLength(6)
    // Short means only a single line of text
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const nicknameInput = new TextInputBuilder()
    .setCustomId('nicknameInput')
    // The label is the prompt the user sees for this input
    .setLabel("What is your name?")
    .setPlaceholder("John Doe")
    // Short means only a single line of text
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

const enterCodeButton = new ButtonBuilder()
    .setCustomId('enterCode')
    .setLabel('Enter Code')
    .setStyle(ButtonStyle.Primary);

// This puts the inputs and modals together and into each pop-up modal.
const emailVerificationRow = new ActionRowBuilder().addComponents(emailInput);
const codeVerificationRow = new ActionRowBuilder().addComponents(codeInput);
const nicknameChangeRow = new ActionRowBuilder().addComponents(nicknameInput);
const enterCodeButtonRow = new ActionRowBuilder().addComponents(enterCodeButton);
emailVerificationModal.addComponents(emailVerificationRow);
codeVerificationModal.addComponents(codeVerificationRow);
nicknameChangeModal.addComponents(nicknameChangeRow);

const data = new SlashCommandBuilder()
    // Lowercase only, Duplicates may cause problems
    .setName('verify')
    // Set's the description of the command.
    .setDescription('Verif your email in the RIT SSE Discord Server.');

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
    // Show the first modal!
    await interaction.showModal(emailVerificationModal);

    // Wait patiently for the user to respond. This only waits for the specific modal and the exact same member.
    const filterEmailModal = (modalInteraction) => modalInteraction.customId === 'emailVerify' && modalInteraction.member.id === interaction.member.id;
    interaction.awaitModalSubmit({ filter: filterEmailModal, time: 60_000 }) // Times out after 1 minute
        .then(async emailVerificationModalInteraction => {
            // The email that the user entered.
            const email = emailVerificationModalInteraction.fields.getTextInputValue('emailInput');

            // Reply to the modal to avoid an "interaction failed" error.
            const enterCodeMessage = await emailVerificationModalInteraction.reply({
                content: `Sent a code to the email that was provided. Please press the button below to enter the code. Code will expire in 5 minutes.`, // The message shown to the user
                components: [enterCodeButtonRow], // The Enter Code button
                flags: MessageFlags.Ephemeral // Hidden from other users
            });

            const filterEnterCodeButton = (buttonInteraction) => buttonInteraction.customId === 'enterCode' && buttonInteraction.member.id === interaction.member.id;
            enterCodeMessage.awaitMessageComponent({ filter: filterEnterCodeButton, time: 300_000 }) // Times out after 5 minutes.
                .then(async buttonInteraction => {
                    // Show the code verification modal!
                    await buttonInteraction.showModal(codeVerificationModal);

                    const filterEnterCodeInput = (modalInteraction) => modalInteraction.customId === 'codeInput' && modalInteraction.member.id === interaction.member.id;
                    interaction.awaitModalSubmit({ filter: filterEnterCodeInput, time: 60_000 })
                        .then(async codeVerificationModalInteraction => {
                            
                        })
                })

            /* ===== TODO =====
             * 1. Check if the user's email ends with @rit.edu or @g.rit.edu
             *  - If not, send an ephemeral error stating that they need to enter a full RIT email. If possible, Open and await the emailVerificationModal modal again and repeat step 1.
             * 
             * 2. Check if the user's email + user's discord id is within the database.
             *  - If so, check if the user has a nickname within the database.
             *      - If so, skip to step 7, but skip step 8.
             *      - If not, skip to step 7 but *don't* skip step 8.
             *  - If not, go to the next step.
             * 
             * 3. Send an email to the interaction member with a temporary verification code (5 minutes).
             * 
             * 4. Check the database if the user's Discord ID already created a verification code. Do not check the email.
             *  - If so, delete the old verification code and create a new one.
             *  - If not, create a new one under the user's Discord ID and Email.
             * 
             * 5. Send an ephemeral message with 1 button: "Enter Code". A "Send Again" or "Cancel" button is not required in order to streamline the process.
             *  - "Enter Code" button pushed will show 'codeVerificationModal', but can be opened as many times as necessary until the submission is CORRECT.
             *  - This entire step and verification code expires after 5 minutes. Delete the verification code. The user must start over with /verify.
             *  - If the code is incorrect, send an ephemeral error stating that they entered the wrong code.
             *  - If the code is correct, go to the next step.
             * 
             * 6. Store the user's Discord ID and Email as a verified member. 
             * 
             * 7. Give them a Verified role, delete all verification codes.
             * 
             * 8. Open and await the nicknameChangeModal. Store that value with the user's data as a nickname.
             * 
             * 9. Welcome the user to the server!
             */

            /* ============== PLEASE READ ==================
             * The current issue is getting a system to send an email, as well as setting
             * up a database for withholding temporary and permanent verification data.
             * 
             * There's a couple of options with a few pros and cons.
             * 
             * - We can use a MySQL database for no cost, but it would require more intense setup and potential maintenance.
             * It would be difficult to access, especially for storing who is who outside of the database, but it's the securest option.
             * 
             * - We can use a Google Sheet or similar generic spreadsheet, but it would be somewhat less secure.
             * 
             * Both have a risk of a data breach, at which we put several people's RIT emails at risk,
             * as well as risking the wrath of RIT's IT team.
             */
        })
        .catch(console.error);
}

module.exports = { data, execute };