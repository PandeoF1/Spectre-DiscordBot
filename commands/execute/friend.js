const Config = require('../../config/index.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
/**
 * @param {import('discord.js').CommandInteraction} interaction
 * @param {import('discord.js').Client} client
 */

async function friend(interaction) {
    // Join the channel of the user who sent the command
    if (interaction.member.voice.channel) {
        await joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const connection = await getVoiceConnection(interaction.guild.id);

        if (!connection) {
            await interaction.reply({ content: 'Failed to join the voice channel!', ephemeral: true });
            return;
        }

        if (!Config.discord.owners.includes(interaction.user.id)) {
            await interaction.reply({ content: 'You\'r not my friend :(.', ephemeral: true });
            return;
        }

        // Play a sound
        const stream = await ytdl('https://www.youtube.com/watch?v=7cXkZ1-f4-I', { filter: 'audioonly' });
        const player = createAudioPlayer();
        const resource = createAudioResource(stream);

        await player.play(resource);
        const dispatcher = await connection.subscribe(player);

        if (dispatcher) {
            setTimeout(() => {
                dispatcher.unsubscribe();
                connection.destroy();
            }, 15_000);
        }
    }
    else {
        await interaction.reply({ content: 'You need to join a voice channel first!', ephemeral: true });
    }

    await interaction.reply({ content: 'https://cdn.discordapp.com/attachments/1063081380243841115/1074746768320893019/hqdefault.jpg', ephemeral: true });
}

module.exports = { friend };