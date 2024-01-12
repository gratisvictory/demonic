// import { client } from '@discord/client';
// import { log } from '@discord/utils/util';
// import { Routes } from 'discord-api-types/v10';
// import { ActivityType, Events, REST } from 'discord.js';

// client.on(Events.ClientReady, async (client) => {
//     const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN as string);
//     const activities = [`Developed by @gratisvictory`, `${client.user?.username ?? 'Unknown'}`];
//     let a = 0;
//     const botPresence = () => {
//         client.user &&
//             client.user.presence.set({
//                 activities: [
//                     { name: activities[a++ % activities.length], type: ActivityType.Listening },
//                 ],
//                 status: 'online',
//             });
//         setTimeout(botPresence, 5 * 60 * 1000);
//     };
//     botPresence();
//     log(`${client.user?.username} Ready`);
//     try {
//         await rest.put(Routes.applicationCommands(client.user?.id ?? ''), {
//             body: [],
//         });
//     } catch (e) {
//         if (e) console.error(e);
//     }
// });
