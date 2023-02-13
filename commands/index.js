const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
/**
 * @param {import('discord.js').CommandInteraction} interaction
 */

async function dm(interaction) {
	if ((interaction.user.id !== '274847072753025025' && interaction.user.id !== '937656707486736385')) {
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
	console.log(blackList);

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
				else console.log(`Skipping ${member.user.tag} because he is in a voice channel`);
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

	//await interaction.channel.send({ embeds: [responseEmbed], ephemeral: true });
}

async function getSteamID(interaction) {
	// Get all messages from the channel '1015214367064723506'
	const steamID64List = [];
	await interaction.guild.channels.cache.get('1015214367064723506').messages.fetch({ limit: 100 }).then(messages => {
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
		// Create an embed
		const responseEmbed = new EmbedBuilder()
			.setTitle('SteamID64')
			.setDescription(steamID64List.join('\n'))
			.setColor(0x0099FF);

		interaction.reply({ embeds: [responseEmbed], ephemeral: true });
	}
	else {
		interaction.reply({ content: 'No steamID64 found', ephemeral: true });
	}


};

module.exports = {
	dm: {
		data: new SlashCommandBuilder()
			.setName('dm')
			.setDescription('Enter a message to send to all members')
			.addStringOption(option =>
				option
					.setName('message')
					.setRequired(true)
					.setDescription('The message to send'))
			.addBooleanOption(option =>
				option
					.setName('skipplayerinvoicechannel')
					.setRequired(true)
					.setDescription('True if you don\'t want to send the message to all players who are in a voice channel.')),
		async execute(interaction) {
			dm(interaction);
		}
	},
	getSteamID: {
		data: new SlashCommandBuilder()
			.setName('getsteamid')
			.setDescription('Get steam profile from steamID64 channel'),
		async execute(interaction) {
			getSteamID(interaction);
		}
	}
};