const { Client, GatewayIntentBits } = require('discord.js');
const Config = require('./config/index.js');
const Commands = require('./commands/index.js');
const { Partials } = require('discord.js');
const colors = require('colors');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,

    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.login(Config.discord.token).catch(console.error);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!\n`.green);

    if (client.user.username !== '.Spectre BOT') {
        await client.user.setUsername('.Spectre BOT');
        await client.user.setAvatar('https://cdn.discordapp.com/attachments/1063081380243841115/1074466865067348038/4da70b1ec609e8bfd2cd248131cee8b1.png');
    }

    // Register commands
    const commands = await client.application.commands.fetch();
    const globalLatency = Date.now();
    console.log('Registering commands : '.gray);
    for (const Command of Object.values(Commands)) {
        const latency = Date.now();
        // Update only if the command has changed
        // Retrieve all commands
        const command = commands.find(command => command.name === Command.data.name);
        if (command) {
            // Compare command options and description
            if (command.description !== Command.data.description) {
                // delete the command
                await client.application.commands.delete(command.id);
                // create the command
                const newCommand = await client.application.commands.create(Command.data);
                console.log(`  -  `.green + `${newCommand.name}`.yellow, `(${newCommand.description})`.gray, `(${Date.now() - latency}ms)`.green);
            }
            else
                console.log(`  -  `.red + `${command.name}`.yellow, `(${command.description})`.gray, `(${Date.now() - latency}ms)`.green);
            continue;
        }
        else {
            const newCommand = await client.application.commands.create(Command.data);
            console.log(`  -  `.green + `${newCommand.name}`.yellow, `(${newCommand.description})`.gray, `(${Date.now() - latency}ms)`.green);
        }
    }
    console.log(`\n${Object.keys(Commands).length} commands registered in ${Date.now() - globalLatency}ms\n`.green);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (interaction.guildId !== '937665835076575313') {
        interaction.reply({ content: 'This command can only be used in the Spectre Discord server.', ephemeral: true });
        return;
    }

    for (const Command of Object.values(Commands)) {
        if (interaction.commandName === Command.data.name) {
            try {
                await Command.execute(interaction, client);
            }
            catch (error) {
                console.log(error.message);
                interaction.reply({ content: `An error occured ${interaction.user.tag} | ${error.message}` });
            }
        }
    }
});

client.on('messageCreate', async message => {
    if (message.partial) return;
    if (message.author.bot) return;
    if (message.channel.type === 1) {
        const channel = client.channels.cache.get('1074654133925199902');
        channel.send({ content: `${message.author.tag}: ${message.content}` });
        if (message.attachments.size > 0) {
            channel.send({ content: `${message.attachments.first().url}` });
        }
    }
});

client.on('usernameUpdate', async (user, oldUsername, newUsername) => {
    if (newUsername !== '.Spectre BOT') {
        await client.user.setUsername('.Spectre BOT');
        await client.user.setAvatar('https://cdn.discordapp.com/attachments/1063081380243841115/1074466865067348038/4da70b1ec609e8bfd2cd248131cee8b1.png');
    }
});
