const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function getSteamID(interaction) {
	const steamID64List = [];
	await (await interaction.guild.channels.cache.get(Config.discord.steamIdChannelId)).messages.fetch({ limit: 100 }).then(messages => {
		// For every message search for all steamID64 in the message
		for (const message of messages.values()) {
			const steamID64 = message.content.match(/(7656119[0-9]{10})/g);
			if (steamID64) {
				// If a steamID64 is found, send all steamID64 found in the message to the variable steamID64
				
				for (const steamID of steamID64) {
					steamID64List.push(`https://steamcommunity.com/profiles/${steamID}`);
				}
			}
		}

	});
	if (steamID64List.length > 0) {
		// reverse the array to get the newest steamID64 first
		steamID64List.reverse();
		// Create an embed
		const responseEmbed = new EmbedBuilder()
        	.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('SteamID64')
			.setDescription(steamID64List.join('\n\n'))
			.setColor(0x0099FF);

		interaction.reply({ embeds: [responseEmbed], ephemeral: true });
	}
	else {
		interaction.reply({ content: 'No steamID64 found', ephemeral: true });
	}
};

module.exports = { getSteamID };