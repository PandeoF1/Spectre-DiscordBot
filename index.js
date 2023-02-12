const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Config = require('./config/index.js');
const Commands = require('./commands/index.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
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
    const command = await client.application.commands.create(Commands.ping);
    console.log(`   ${command.name}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'dm') {
        if ((interaction.user.id !== '274847072753025025' && interaction.user.id !== '937656707486736385'))
        {
            await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
            return;
        }

        let count = 0;
        let total = 0;

        const members = await interaction.guild.members.fetch();

        const sentEmbed = new EmbedBuilder()
            .setTitle('Important Message !')
            .setDescription(interaction.options.getString('message'))
            .setColor(0x8B0000)
            .setTimestamp();

        for (const member of members.values()) {
            total++;
            if (member.id === '274847072753025025') {
                try {
                    await member.send({ embeds: [sentEmbed]});
                    count++;
                } catch (error) {
                    console.log(`Failed to send DM to ${member.user.tag}: ${error}`);
                }

            }
        }

        // Create an embed
        const responseEmbed = new EmbedBuilder()
            .setTitle('DM')
            .setDescription(`Sent to ${count} members of ${total} members. (${Math.round(count / total * 100)}%)`)
            .setColor(0x0099FF);

        await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
    }
});
