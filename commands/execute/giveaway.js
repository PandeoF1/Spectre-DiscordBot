const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function giveaway(interaction) {
    // Create an embed
	if (!Config.discord.owners.includes(interaction.user.id)) {
		await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
		return;
	}

    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('mention');
    const creator = interaction.options.getUser('creator');
    const thumbnail = interaction.options.getString('thumbnail');

    // Parse description for \n and replace with new line
    const descriptionArray = description.split('\\n');
    const descriptionString = descriptionArray.join('\n');


    const responseEmbed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(descriptionString)
        .setColor(0x0099FF)
        .setAuthor({ name: creator.username, iconURL: creator.displayAvatarURL() })
        .setThumbnail(thumbnail)
        .setTimestamp();
    
    // send the embed to the channel
    const message = await channel.send({ embeds: [responseEmbed] });
    message.react('🎉');
    await channel.send({ content: `${role.toString()}` });
    await interaction.reply({ content: 'Done.', ephemeral: true });
};

module.exports = { giveaway };