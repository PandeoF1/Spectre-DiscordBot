const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function send(interaction) {
    if (!Config.discord.owners.includes(interaction.user.id)) {
        await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        return;
    }

    const user = interaction.options.getUser('user');
    const message = interaction.options.getString('message');

    await user.send(message);
    await interaction.reply({ content: 'Message sent.', ephemeral: true });
};

module.exports = { send };