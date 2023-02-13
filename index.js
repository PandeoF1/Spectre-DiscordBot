const { Client, GatewayIntentBits} = require('discord.js');
const Config = require('./config/index.js');
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
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.login(Config.discord.token).catch(console.error);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    if (client.user.username !== '.Spectre BOT') {
        await client.user.setUsername('.Spectre BOT');
        await client.user.setAvatar('https://cdn.discordapp.com/attachments/1063081380243841115/1074466865067348038/4da70b1ec609e8bfd2cd248131cee8b1.png');
    }

    // Register commands
    console.log('Registering commands : ');
    const pingCommand = await client.application.commands.create(Commands.dm.data);
    console.log(`   ${pingCommand.name}`);
    const steamIdCommand = await client.application.commands.create(Commands.getSteamID.data);
    console.log(`   ${steamIdCommand.name}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'dm') {
        Commands.dm.execute(interaction);
    }
    else if (interaction.commandName === 'getsteamid') {
        Commands.getSteamID.execute(interaction);
    }
});

client.on('messageCreate', async message => {
    console.log(`Message from ${message.author.tag}: ${message.content}, ${message.channel.type}`);
    if (message.partial) return;
    if (message.author.bot) return;
    console.log(`Message from ${message.author.tag}: ${message.content}, ${message.channel.type}`);
    if (message.channel.type === 1) {
        console.log(`DM from ${message.author.tag}: ${message.content}`);
    }
});