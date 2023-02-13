const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function randomtp(interaction) {
	if (!Config.discord.owners.includes(interaction.user.id)) {
		await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
		return;
	}

    // Create a list of all voice channels
    const voiceChannels = interaction.guild.channels.cache.filter(channel => channel.type === 2);    const playerTMP = interaction.options.getUser('player');
    const player = interaction.guild.members.cache.get(playerTMP.id);

    if (!player)
        return interaction.reply({ content: 'Player not found.', ephemeral: true });
    if (!player.voice.channel)
        return interaction.reply({ content: 'Player is not in a voice channel.', ephemeral: true });

    // Get the player's current voice channel
    const originalChannel = player.voice.channel;
    let count = 0;

    interaction.reply({ content: 'Teleportation in progress...', ephemeral: true });

    while (count < 10) {
        // Teleport the player to a random voice channel
        const randomChannel = voiceChannels.random();
        await player.voice.setChannel(randomChannel);

        count++;
        await new Promise(r => setTimeout(r, 250));
    }

    // Teleport the player to the original voice channel
    await player.voice.setChannel(originalChannel.id);
};

module.exports = { randomtp };