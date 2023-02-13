const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function dm(interaction) {
	if (!Config.discord.owners.includes(interaction.user.id)) {
		await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
		return;
	}

	let count = 0;
	let total = 0;
	const blackList = [];
	if (interaction.options.getBoolean('skipplayerinvoicechannel') === true) {
		// Get all members in all voice channels
		const voiceChannels = interaction.guild.channels.cache.filter(channel => channel.type === 2);
		for (const channel of voiceChannels.values()) {
			const members = channel.members;
			for (const member of members.values()) {
				blackList.push(member.user.id);
			}
		}
	}

	const members = await interaction.guild.members.fetch();

	const sentEmbed = new EmbedBuilder()
		.setTitle('Important Message !')
		.setDescription(interaction.options.getString('message'))
		.setColor(0x8B0000)
		.setTimestamp();
	await interaction.reply({ content: 'Sending DM to all members...', ephemeral: true });
	for (const member of members.values()) {
		if (member.roles.cache.has('956310830780137642')) {
			total++;
			try {
				if (!blackList.includes(member.user.id)) await member.send({ embeds: [sentEmbed] });
				//else console.log(`Skipping ${member.user.tag} because he is in a voice channel`);
				count++;
			} catch (error) {
				console.log(`Failed to send DM to ${member.user.tag}: ${error}`);
			}

		}
	}

	const responseEmbed = new EmbedBuilder()
		.setTitle('DM')
		.setDescription(`Sent to ${count} members of ${total} members. (${Math.round(count / total * 100)}%)`)
		.setColor(0x0099FF);

	await interaction.channel.send({ embeds: [responseEmbed], ephemeral: true });
}

module.exports = { dm };