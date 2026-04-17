import {
    ChannelType,
    ChatInputCommandInteraction,
    Client,
    Colors,
    EmbedBuilder,
    MessageFlags,
    PermissionsBitField,
    SlashCommandBuilder,
} from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create and send an embed to a selected channel.')
    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Channel where the embed should be sent.')
            .setRequired(true)
            .addChannelTypes(
                ChannelType.GuildText,
                ChannelType.GuildAnnouncement,
                ChannelType.PublicThread,
                ChannelType.PrivateThread,
                ChannelType.AnnouncementThread,
            ),
    )
    .addStringOption(option =>
        option
            .setName('title')
            .setDescription('Embed title (max 256 characters).')
            .setRequired(false),
    )
    .addStringOption(option =>
        option
            .setName('description')
            .setDescription('Embed description (max 4096 characters).')
            .setRequired(false),
    )
    .addStringOption(option =>
        option
            .setName('color')
            .setDescription('Hex color (#5865F2), decimal integer, or color name (red, blue, etc.).')
            .setRequired(false),
    )
    .addStringOption(option =>
        option
            .setName('footer_text')
            .setDescription('Footer text (max 2048 characters).')
            .setRequired(false),
    )
    .addAttachmentOption(option =>
        option
            .setName('image')
            .setDescription('Main image attachment.')
            .setRequired(false),
    );

function parseColor(value: string): number | null {
    let trimmed = value.trim().toLocaleLowerCase('en-US');

    const key = (trimmed.charAt(0).toUpperCase() + trimmed.slice(1)) as keyof typeof Colors;

    if (key in Colors) return Colors[key];
    else if (/^#?[\da-fA-F]{6}$/.test(trimmed)) {
        const normalized = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
        return Number.parseInt(normalized, 16);
    } else if (/^\d+$/.test(trimmed)) {
        const parsed = Number.parseInt(trimmed, 10);
        if (parsed >= 0 && parsed <= 0xffffff) {
            return parsed;
        }
    }

    return null;
}

async function execute(client: Client, interaction: ChatInputCommandInteraction): Promise<void> {
    const channel = interaction.options.getChannel('channel', true);
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const colorRaw = interaction.options.getString('color');
    const footerText = interaction.options.getString('footer_text');
    const image = interaction.options.getAttachment('image');

    // Check if this channel supports sending messages.
    if (!('send' in channel) || typeof channel.send !== 'function') {
        await interaction.reply({
            content: 'Cannot send messages in selected channel.',
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    if (!client.user || !interaction.guild) {
        await interaction.reply({
            content: 'Could not determine bot permissions in the target channel.',
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    if ('permissionsFor' in channel && typeof channel.permissionsFor === 'function') {
        let perms = null;

        try {
            perms = channel.permissionsFor(client.user);
        } catch {
            perms = null;
        }

        if (perms) {
            const missing: string[] = [];
            const sendFlag =
                channel.type === ChannelType.PublicThread ||
                    channel.type === ChannelType.PrivateThread ||
                    channel.type === ChannelType.AnnouncementThread
                    ? PermissionsBitField.Flags.SendMessagesInThreads
                    : PermissionsBitField.Flags.SendMessages;

            if (!perms.has(PermissionsBitField.Flags.ViewChannel)) missing.push('View Channel');
            if (!perms.has(sendFlag)) {
                missing.push(
                    sendFlag === PermissionsBitField.Flags.SendMessagesInThreads
                        ? 'Send Messages In Threads'
                        : 'Send Messages',
                );
            }
            if (!perms.has(PermissionsBitField.Flags.EmbedLinks)) missing.push('Embed Links');
            if (image && !perms.has(PermissionsBitField.Flags.AttachFiles)) missing.push('Attach Files');

            if (missing.length > 0) {
                await interaction.reply({
                    content: `I am missing the following permissions in ${channel.toString()}:\n**${missing.join('**, **')}**`,
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
        }
    }

    const embed = new EmbedBuilder();
    const errors: string[] = [];

    if (title) embed.setTitle(title);

    if (description) embed.setDescription(description);

    if (colorRaw) {
        const color = parseColor(colorRaw);
        if (color === null) {
            errors.push('Invalid color. Use #RRGGBB, RRGGBB, decimal 0-16777215, or a name like red/blue/green.');
        } else {
            embed.setColor(color);
        }
    }

    if (footerText) {
        embed.setFooter({
            text: footerText,
        });
    }

    if (image) {
        if (!(image.contentType?.startsWith('image/'))) {
            errors.push('Attachment must be an image file.');
        } else {
            embed.setImage(`attachment://${image.name}`);
        }
    }

    if (errors.length > 0) {
        await interaction.reply({
            content: `Could not build embed:\n- ${errors.join('\n- ')}`,
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    if (!title && !description && !colorRaw && !footerText && !image) {
        await interaction.reply({
            content: 'Please provide at least one embed property.',
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    try {
        await channel.send({
            embeds: [embed],
            files: image ? [image] : [],
        });
    } catch {
        await interaction.reply({
            content: `I couldn't send the embed in ${channel.toString()}. Please check my permissions (View Channel, Send Messages, Embed Links, and Attach Files if using an image).`,
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    await interaction.reply({
        content: `The following embed has been sent to ${channel.toString()}:`,
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
    });
}

export default { data, execute };
