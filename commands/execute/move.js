const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function move(interaction) {
    if (!Config.discord.owners.includes(interaction.user.id)) {
        await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        return;
    }

    let count = 0;
    let total = 0;

    await interaction.reply({ content: 'Move in progres...', ephemeral: true });

    // Get all members in all voice channels
    const voiceChannels = interaction.guild.channels.cache.filter(channel => channel.type === 2);
    const voiceChannelId = interaction.member.voice.channelId;
    for (const channel of voiceChannels.values()) {
        const members = channel.members;
        // if same channel, skip
        if (channel.id === voiceChannelId) continue;
        for (const member of members.values()) {
            total++;
            try {
                await member.voice.setChannel(voiceChannelId);
                count++;
            } catch (error) {
                console.log(`Failed to move ${member.user.tag}: ${error.message}`.red);
            }
        }
    }

    const responseEmbed = new EmbedBuilder()
        .setTitle('MOVE')
        .setDescription(`Move ${count} members of ${total} members. (${Math.round(count / total * 100)}%)`)
        .setColor(0x0099FF);

    await interaction.channel.send({ embeds: [responseEmbed], ephemeral: true });
}

module.exports = { move };