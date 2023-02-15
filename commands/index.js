const Config = require('../config/index.js');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

const { wipe } = require('./execute/wipe');
const { dm } = require('./execute/dm');
const { getSteamID } = require('./execute/getsteamid');
const { move } = require('./execute/move.js');
const { friend } = require('./execute/friend.js');
const { giveaway } = require('./execute/giveaway.js');
const { winner } = require('./execute/winner.js');
const { randomtp } = require('./execute/random.js');
const { helpspectre } = require('./execute/helpspectre.js');
const { timer } = require('./execute/timer.js');

/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

module.exports = {
	helpspectre: {
		data: new SlashCommandBuilder()
			.setName('helpspectre')
			.setDescription('Display all commands for Spectre BOT (/help is for the rust bot)'),
		async execute(interaction, client, Commands) {
			helpspectre(interaction, Commands);
		},
		help: false,
	},
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
		async execute(interaction, client, Commands) {
			dm(interaction);
		},
		help: true,
	},
	getSteamID: {
		data: new SlashCommandBuilder()
			.setName('getsteamid')
			.setDescription('Get steam profile from steamID64 channel'),
		async execute(interaction, client, Commands) {
			getSteamID(interaction);
		},
		help: true,
	},
	updateAvatar: {
		data: new SlashCommandBuilder()
			.setName('updateavatar')
			.setDescription('Update the bot avatar'),
		async execute(interaction, client, Commands) {
			if ((interaction.user.id !== '274847072753025025') || (interaction.user.id !== '937656707486736385')) {
				await client.user.setUsername('.Spectre BOT');
				await client.user.setAvatar('https://cdn.discordapp.com/attachments/1063081380243841115/1074466865067348038/4da70b1ec609e8bfd2cd248131cee8b1.png');
				interaction.reply({ content: 'Avatar updated', ephemeral: true });
			}
			else {
				interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
			}
		},
		help: false,
	},
	wipe: {
		data: new SlashCommandBuilder()
			.setName('wipe')
			.setDescription('Display new wipe information')
			.addStringOption(option =>
				option
					.setName('servername')
					.setRequired(true)
					.setDescription('The name of the server'))
			.addStringOption(option =>
				option
					.setName('serverip')
					.setRequired(true)
					.setDescription('The IP of the server'))
			.addStringOption(option =>
				option
					.setName('date')
					.setRequired(true)
					.setDescription('The date of the wipe'))
			.addBooleanOption(option =>
				option
					.setName('sondage')
					.setRequired(true)
					.setDescription('Create a poll for ✅💤❌'))
			.addRoleOption(option =>
				option
					.setName('mention')
					.setRequired(false)
					.setDescription('Mention a role')),
		async execute(interaction, client, Commands) {
			wipe(interaction);
		},
		help: true,
	},
	move: {
		data: new SlashCommandBuilder()
			.setName('move')
			.setDescription('Move all members to your channel'),
		async execute(interaction, client, Commands) {
			move(interaction);
		},
		help: true,
	},
	friend: {
		data: new SlashCommandBuilder()
			.setName('friend')
			.setDescription('I will become ur friend <3'),
		async execute(interaction, client, Commands) {
			friend(interaction);
		},
		help: true,
	},
	giveaway: {
		data: new SlashCommandBuilder()
			.setName('giveaway')
			.setDescription('Create a giveaway')
			.addChannelOption(option =>
				option
					.setName('channel')
					.setRequired(true)
					.setDescription('The channel where the giveaway will be created'))
			.addStringOption(option =>
				option
					.setName('title')
					.setRequired(true)
					.setDescription('The title of the giveaway'))
			.addStringOption(option =>
				option
					.setName('description')
					.setRequired(true)
					.setDescription('The description of the giveaway'))
			.addRoleOption(option =>
				option
					.setName('mention')
					.setRequired(true)
					.setDescription('Mention a role'))
			.addUserOption(option =>
				option
					.setName('creator')
					.setRequired(true)
					.setDescription('The creator of the giveaway'))
			.addStringOption(option =>
				option
					.setName('thumbnail')
					.setRequired(true)
					.setDescription('The thumbnail of the giveaway')),
		async execute(interaction, client, Commands) {
			giveaway(interaction);
		},
		help: true,
	},
	winner: {
		data: new SlashCommandBuilder()
			.setName('winner')
			.setDescription('Choose a winner for the giveaway')
			.addStringOption(option =>
				option
					.setName('messageid')
					.setRequired(true)
					.setDescription('The message id of the giveaway')),
		async execute(interaction, client, Commands) {
			winner(interaction);
		},
		help: true,
	},
	randomtp: {
		data: new SlashCommandBuilder()
			.setName('randomtp')
			.setDescription('Teleport a player to a bunch of random channels')
			.addUserOption(option =>
				option
					.setName('player')
					.setRequired(true)
					.setDescription('The player to teleport')),
		async execute(interaction, client, Commands) {
			randomtp(interaction);
		},
		help: true,
	},
	timer: {
		data: new SlashCommandBuilder()
			.setName('timer')
			.setDescription('Create a timer')
			.addStringOption(option =>
				option
					.setName('name')
					.setRequired(true)
					.setDescription('The name of the timer'))
			.addIntegerOption(option =>
				option
					.setName('time')
					.setRequired(true)
					.setDescription('The time of the timer in seconds (1 to 14400 (4 hours)'))
			.addRoleOption(option =>
				option
					.setName('role')
					.setDescription('Mention a role'))
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('Mention a user')),
		async execute(interaction, client, Commands) {
			timer(interaction);
		},
		help: true,
	},					
};