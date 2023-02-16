require('dotenv').config();

module.exports = {
    discord: {
        username: process.env.SBOT_DISCORD_USERNAME || '',
        clientId: process.env.SBOT_DISCORD_CLIENT_ID || '',
        token: process.env.SBOT_DISCORD_TOKEN || '',
        owners: process.env.SBOT_DISCORD_AUTHORISED_CLIENT_IDS || '',
        logo: process.env.SBOT_DISCORD_LOGO || '',
        roleId: process.env.SBOT_DISCORD_ROLE_ID || '',
        logChannelId: process.env.SBOT_DISCORD_LOG_CHANNEL_ID || '',
        guildId: process.env.SBOT_DISCORD_GUILD_ID || '',
        steamIdChannelId: process.env.SBOT_DISCORD_STEAM_ID_CHANNEL_ID || '',
    }
};