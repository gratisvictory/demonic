import { Commands } from '@utils/commands';
import { Client } from 'discord.js';

const DEMONIC_BOT = 'Demonic Bot';

const ready = (client: Client): void => {
    client.on('ready', async () => {
        if (!client.user || !client.application) return;

        await client.application.commands.set(Commands);
        console.log(`${(client.user.username = DEMONIC_BOT)} is online!`);
    });
};

export default ready;
