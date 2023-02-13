const Config = require('../../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function winner(interaction) {
	if (!Config.discord.owners.includes(interaction.user.id)) {
		await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
		return;
	}
    // Create an embed
    const messageid = interaction.options.getString('messageid');
    // Get all members from the reaction 🎉 from the message
    const message = await interaction.channel.messages.fetch(messageid)
    const reaction = message.reactions.cache.get('🎉');
    const members = await reaction.users.fetch();

    if (members.size === 0) {
        interaction.reply({ content: 'No one reacted to the message.', ephemeral: true });
        return;
    }
    // Get a random member
    const member = members.random();

    // Create an embed
    const responseEmbed = new EmbedBuilder()
        .setTitle('Winner')
        .setDescription(`The winner is ${member}`)
        .setColor(0x0099FF);

    interaction.reply({ embeds: [responseEmbed]});
};

module.exports = { winner };