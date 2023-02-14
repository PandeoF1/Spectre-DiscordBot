const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function timer(interaction) {
    const time = interaction.options.getInteger('time');
    const name = interaction.options.getString('name');
    const role = interaction.options.getRole('role');
    const member = interaction.options.getUser('user');

    // Check if the time is valid and not negative and not 0 and not upepr than 4 hours
    if (!time || time < 1 || time > 14400) {
        await interaction.reply({ content: 'Invalid time. Time must be between 1 and 14400 seconds (4 hours).', ephemeral: true });
        return;
    }

    // Create a new embed for the end of the timer
    const timerEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setTitle('Timer')
        .setDescription(`Timer **${name}** has ended.\nTime elapsed: **${time}** seconds`)
        .setColor(0x0099FF)
        .setTimestamp();

    await interaction.reply({ content: `Timer **${name}** has started.`, ephemeral: true });

    // Wait for the time and then send the embed
    setTimeout(async () => {
        await interaction.channel.send({ embeds: [timerEmbed] });

        if (role) await role.members.forEach(member => member.send({ embeds: [timerEmbed] }));
        if (member) await member.send({ embeds: [timerEmbed] });

        // mention the role and the member after the embed
        if (member) await interaction.channel.send({ content: `${member}` });
        if (role) await interaction.channel.send({ content: `${role}` });
    }, time * 1000);
};

module.exports = { timer };