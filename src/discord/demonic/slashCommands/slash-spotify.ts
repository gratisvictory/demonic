import { Command } from '@utils/command';
import { createCanvas, loadImage } from 'canvas';
import {
    Activity,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    AttachmentBuilder,
    EmbedBuilder,
    GuildMember,
} from 'discord.js';

const SPOTIFY_OPTION_TYPE = ApplicationCommandOptionType.User;
const SPOTIFY_TYPE = ApplicationCommandType.ChatInput;

const Spotify: Command = {
    name: 'spotify',
    description: 'Display a users spotify status as a picture',
    type: SPOTIFY_TYPE,
    nameLocalizations: {
        'en-US': 'spotify',
    },
    options: [
        {
            name: 'user',
            type: SPOTIFY_OPTION_TYPE,
            description: 'Пользователь, для которого требуется получить статус Spotify',
            required: true,
        },
    ],
    run: async (_, interaction) => {
        try {
            if (!interaction.isCommand()) return;
            const { user, presence } = (interaction.options.getMember('user') as GuildMember) ?? {};
            if (user.bot)
                return await interaction.followUp({
                    content: 'Вы не можете получить статус Spotify у ботов',
                    ephemeral: true,
                });

            let status: Activity | null = null;

            if (!presence) {
                return await interaction.followUp({
                    content: `${user.displayName} не слушает Spotify`,
                    ephemeral: true,
                });
            }

            if (presence) {
                if (presence.activities.length === 1) {
                    status = presence.activities[0];
                } else if (presence.activities.length > 1) {
                    status = presence.activities[1];
                }
            }

            if (status !== null && status.name === 'Spotify' && status.assets !== null) {
                const canvas = createCanvas(750, 750);

                const ctx = canvas.getContext('2d');

                ctx.drawImage(
                    await loadImage(
                        `https://i.scdn.co/image/${status.assets.largeImage?.slice(8)}`,
                    ),
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );

                const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
                    name: 'spotify.png',
                });

                const embed = new EmbedBuilder()
                    .setColor('Aqua')
                    .setAuthor({
                        name: `${user.displayName}'s spotify status`,
                        iconURL: user.avatarURL({ extension: 'jpg' }) ?? '',
                    })
                    .addFields([
                        {
                            name: 'Song',
                            value: `${status.details}`,
                            inline: false,
                        },
                        {
                            name: 'Artist',
                            value: `${status.state}`,
                            inline: false,
                        },
                        {
                            name: 'Album',
                            value: `${status.assets.largeText}`,
                            inline: false,
                        },
                    ])
                    .setImage('attachment://spotify.png')
                    .setTimestamp()
                    .setFooter({ text: `Requested by ${interaction.user.displayName}` });
                await interaction.followUp({ embeds: [embed], files: [attachment] });
            }
        } catch (e) {
            await interaction.followUp({
                content: 'Не удалось получить статус Spotify',
                ephemeral: true,
            });
        }
    },
};

export { Spotify };
