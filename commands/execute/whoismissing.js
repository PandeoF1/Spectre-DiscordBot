const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function whoismissing(interaction) {
    // Get all player in all voice channels
    // Get all player in the server who have the role
    // Compare the two lists
    
    const voiceChannels = interaction.guild.channels.cache.filter(channel => channel.type === 2);
    const voiceChannelId = interaction.member.voice.channelId;
    const members = await interaction.guild.members.fetch();
    const players = members.filter(member => member.roles.cache.has(Config.discord.roleId));
    let total = 0;
    
    for (const channel of voiceChannels.values()) {
        const members = channel.members;
        for (const member of members.values()) {
            if (!member.roles.cache.has(Config.discord.roleId)) continue;
            if (players.has(member.id)) {
                players.delete(member.id);
            }
        }
    }

    for (const player of players.values()) {
        total++;
    }

    const responseEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setTitle('Who is missing')
        .setDescription(`There are ${total} missing players.`)
        .addFields({ name: 'Players', value: players.map(player => player.user.tag).join('\n') })
        .setColor(0x0099FF);

    const message = await interaction.channel.send({ embeds: [responseEmbed] });
    await interaction.reply({ content: 'Done.', ephemeral: true });
}

module.exports = { whoismissing };