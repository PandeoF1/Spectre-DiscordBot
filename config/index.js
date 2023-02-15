require('dotenv').config();

module.exports = {
    discord: {
        username: process.env.SBOT_DISCORD_USERNAME || '',
        clientId: process.env.SBOT_DISCORD_CLIENT_ID || '',
        token: process.env.SBOT_DISCORD_TOKEN || '',
        owners: process.env.SBOT_DISCORD_AUTHORISED_CLIENT_IDS || '',
        logo: process.env.SBOT_DISCORD_LOGO || '',
        roleId: process.env.SBOT_DISCORD_ROLE_ID || '',
    }
};