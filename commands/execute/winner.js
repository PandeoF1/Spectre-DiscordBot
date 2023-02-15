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
    // get thumnail from message
    const thumbnail = message.embeds[0].thumbnail.url;
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
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setTitle('Winner')
        .setDescription(`Choosing the winner.. ${member}`)
        .setThumbnail(thumbnail)
        .setTimestamp()
        .setColor(0x0099FF);

    await interaction.reply({ content: 'Choosing the winner...', ephemeral: true });
    const messages = await interaction.channel.send({ embeds: [responseEmbed]});
    
    // Change the winner 15 times every second
    for (let i = 0; i < 15; i++) {
        let numberofdots = '.';
        const choosing = members.random();
        if (i % 2 === 0) numberofdots += '.';
        else numberofdots += '..';
        
        messages.edit({ embeds: [responseEmbed.setDescription(`Choosing the winner${numberofdots} ${choosing}`)]});
    
        // Wait 1 second
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Send the winner
    const choosing = members.random();
    responseEmbed.setDescription(`The winner is ${choosing}`);
    messages.edit({ embeds: [responseEmbed]});

    await interaction.followUp({ content: `${choosing}` });
};

module.exports = { winner };