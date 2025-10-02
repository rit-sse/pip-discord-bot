# Environment Variables Setup

This document explains how to set up the required environment variables for the Pip Discord Bot.

## Getting Started

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your specific values (see sections below)

## Required Environment Variables

### Discord Bot Configuration

#### `DISCORD_TOKEN`
Your Discord bot's token from the Discord Developer Portal.

**How to get it:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Go to the "Bot" section
4. Copy the token

**Format:** `DISCORD_TOKEN=your-bot-token-here`

#### `TEST_CLIENT_ID`
Your Discord application's client ID.

**How to get it:**
1. In the Discord Developer Portal, go to your application
2. In the "General Information" section, copy the "Application ID"

**Format:** `TEST_CLIENT_ID=000000000000000000`

#### `TEST_SERVER_ID`
The Discord server (guild) ID where you want to test the bot.

**How to get it:**
1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click on your server name
3. Click "Copy Server ID"

**Format:** `TEST_SERVER_ID=000000000000000000`

### Google OAuth2 Configuration

#### `GOOGLE_CLIENT_ID`
Your Google OAuth2 client ID for email verification.

**How to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
4. Configure the OAuth consent screen
    - Add "http://localhost:3000" to "Authorized JavaScript origins"
    - Add "http://localhost:3000/api/auth/" to "Authorized redirect URIs"
    - Save OAuth Client

5. Copy the Client ID

**Format:** `GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com`

#### `GOOGLE_CLIENT_SECRET`
Your Google OAuth2 client secret.

**How to get it:**
1. From the same Google Cloud Console credentials page as GOOGLE_CLIENT_ID
2. Copy the Client Secret

**Format:** `GOOGLE_CLIENT_SECRET=your-client-secret`

#### `REDIRECT_URI`
The redirect URI for OAuth2 callbacks. Defaults to `http://localhost:3000/api/auth` in development.

**Format:** `REDIRECT_URI=http://localhost:3000/api/auth`
