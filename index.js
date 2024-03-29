const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const Config = require('./config/index.js');
const { Partials } = require('discord.js');
const colors = require('colors');
const Commands = require('./commands/index.js');

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

    let error = false;

    // delete command "timer"
    // const deleteList = await client.application.commands.fetch();
    // const toDelete = deleteList.find(command => command.name === 'timer');
    // if (toDelete) {
    //     await toDelete.delete();
    // }

    try {
        await client.user.setUsername(Config.discord.username);
    }
    catch (e) {
        error = true;
        console.log("  -  Skip setUsername".red);
    }

    try {
        await client.user.setAvatar(Config.discord.logo);
    }
    catch (e) {
        error = true;
        console.log("  -  Skip setAvatar".red);
    }

    try {
        client.user.setPresence({
            activities: [{ name: '/helpspectre', type: ActivityType.Listening }],
            status: 'online'
        });
    }
    catch (e) {
        error = true;
        console.log("  -  Skip setPresence".red);
    }

    // Register commands
    const commands = await client.application.commands.fetch();
    const globalLatency = Date.now();

    if (error)
        console.log('');

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
    if (interaction.guildId !== Config.discord.guildId) {
        interaction.reply({ content: 'This command can only be used in the Spectre Discord server.', ephemeral: true });
        return;
    }

    for (const Command of Object.values(Commands)) {
        if (interaction.commandName === Command.data.name) {
            try {
                await Command.execute(interaction, client, Commands);
                return;
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
        const channel = client.channels.cache.get(Config.discord.logChannelId);
        channel.send({ content: `${message.author.tag}: ${message.content}` });
        if (message.attachments.size > 0) {
            channel.send({ content: `${message.attachments.first().url}` });
        }
    }
    else if (message.channel.type === 0) {
        if (message.reference && message.reference.messageId && message.reference.channelId === Config.discord.logChannelId) {
            // Get the discord tag in the message reference and send the message to the user
            const messageReference = await client.channels.cache.get(Config.discord.logChannelId).messages.fetch(message.reference.messageId);
            const discordTag = messageReference.content.split(':')[0];
            if (discordTag)
            {
                // search in the guild for the user
                const members = await message.guild.members.fetch();
                for (const member of members.values()) {
                    if (member.user.tag === discordTag) {
                        member.send({ content: message.content });
                        if (message.attachments.size > 0) {
                            member.send({ content: `${message.attachments.first().url}` });
                        }
                        return;
                    }
                }
            }
        }
    }
});

client.on('usernameUpdate', async (user, oldUsername, newUsername) => {
    if (newUsername !== Config.discord.username) {
        await client.user.setUsername(Config.discord.username);
        await client.user.setAvatar(Config.discord.logo);
    }
});

client.on('disconnect', () => {
    console.log('Disconnected from Discord!'.red);
    // Quit the process
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\nDisconnected from Discord!'.red);
    client.destroy();
    // Quit the process
    process.exit(1);
});