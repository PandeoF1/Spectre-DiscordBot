const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	ping: new SlashCommandBuilder()
		.setName('dm')
		.setDescription('Enter a message to send to all members')
        .addStringOption(option =>
			option
				.setName('message')
                .setRequired(true)
				.setDescription('The message to send'))
};