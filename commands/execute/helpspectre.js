
const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function helpspectre(interaction, Commands) {
    // Display all commands in a embed with a description and all options
    const responseEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setTitle(Config.discord.username)
        .setThumbnail(Config.discord.logo)
        .setColor(0x0099FF);

    for (const command in Commands) {
        if (!Commands[command].help) continue;

        const commandData = Commands[command].data;
        const commandName = commandData.name;
        const commandDescription = commandData.description;
        const commandOptions = commandData.options;
        const commandOptionsString = commandOptions.map(option => `**${option.name}** - ${option.description}`).join('\n');

        if (commandOptionsString)
            responseEmbed.addFields({ name: `**${commandName}** - ${commandDescription}`, value: `${commandOptionsString}`});
        else
            responseEmbed.addFields({ name: `**${commandName}** - ${commandDescription}`, value: `No options`});
        responseEmbed.addFields({ name: '\u0020', value: '\u0020' });
    }

    await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
};

module.exports = { helpspectre };