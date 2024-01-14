import path from 'path';
import env from '@fastify/env';
import Sensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import pressure from '@fastify/under-pressure';
// import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import * as dotenv from 'dotenv';
import fastify from 'fastify';
import rawBody from 'fastify-raw-body';
import S from 'fluent-json-schema';
import p from 'pino';

import { client } from './discord/demonic/Bot';

dotenv.config();

// const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_APPLICATION_ID}&scope=applications.commands`;

// const INVITE_COMMAND = {
//     name: 'Invite',
//     description: 'Get an invite link to add the bot to your server',
// };

// const SLAP_COMMAND = {
//     name: 'Slap',
//     description: 'Sometimes you gotta slap a person with a large trout',
//     options: [
//         {
//             name: 'user',
//             description: 'The user to slap',
//             type: 6,
//             required: true,
//         },
//     ],
// };

const Bootstrap = async () => {
    try {
        const server = fastify({
            logger: p({ level: 'info' }),
        });
        server.register(env, {
            dotenv: true,
            logLevel: 'info',
            schema: S.object()
                .prop('NODE_ENV', S.string().required())
                .prop('PORT', S.integer().required())
                .prop('BASE_URL', S.string().required())
                .prop('DISCORD_CLIENT_ID', S.string().required())
                .prop('DISCORD_CLIENT_SECRET', S.string().required())
                .prop('DISCORD_PERMISSION', S.string().required())
                .prop('DISCORD_BOT_TOKEN', S.string().required())
                .prop('DISCORD_SCOPE', S.string().required())
                .prop('DISCORD_APPLICATION_ID', S.string().required())
                .prop('DISCORD_PUBLIC_KEY', S.string().required())
                .prop('MONGODB_URL', S.string().required())
                .prop('SPOTIFY_CLIENT_ID', S.string().required())
                .prop('SPOTIFY_SECRET', S.string().required())
                .valueOf(),
        });
        server.register(rawBody, {
            runFirst: true,
        });
        server.register(fastifyStatic, {
            root: path.join(__dirname, '..', 'dist'),
        });
        server.register(Sensible);
        server.register(pressure, {
            maxEventLoopDelay: 1000,
            maxHeapUsedBytes: 1000000000,
            maxRssBytes: 1000000000,
            maxEventLoopUtilization: 0.98,
        });
        server.setErrorHandler((error, request, reply) => {
            if (error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
                server.log.error(error);
                reply.status(500).send({ ok: false });
            } else {
                reply.send(error);
            }
        });
        // server.get('/', (request, response) => {
        //     server.log.info('Handling GET request');
        // });
        // server.addHook('preHandler', async (request, response) => {
        //     // We don't want to check GET requests to our root url
        //     if (request.method === 'POST') {
        //         const signature = request.headers['x-signature-ed25519'];
        //         const timestamp = request.headers['x-signature-timestamp'];
        //         const isValidRequest = verifyKey(
        //             request.rawBody as any,
        //             signature as any,
        //             timestamp as any,
        //             process.env.DISCORD_PUBLIC_KEY ?? '',
        //         );
        //         if (!isValidRequest) {
        //             server.log.info('Invalid Request');
        //             return response.status(401).send({ error: 'Bad request signature ' });
        //         }
        //     }
        // });

        // server.post('/interactions', async (request, response) => {
        //     const message = request.body as any;

        //     if (message.type === InteractionType.PING) {
        //         server.log.info('Handling Ping request');
        //         response.send({
        //             type: InteractionResponseType.PONG,
        //         });
        //     } else if (message.type === InteractionType.APPLICATION_COMMAND) {
        //         switch (message.data.name.toLowerCase()) {
        //             case SLAP_COMMAND.name.toLowerCase():
        //                 response.status(200).send({
        //                     type: 4,
        //                     data: {
        //                         content: `*<@${message.member.user.id}> slaps <@${message.data.options[0].value}> around a bit with a large trout*`,
        //                     },
        //                 });
        //                 server.log.info('Demonic Request');
        //                 break;
        //             case INVITE_COMMAND.name.toLowerCase():
        //                 response.status(200).send({
        //                     type: 4,
        //                     data: {
        //                         content: INVITE_URL,
        //                         flags: 64,
        //                     },
        //                 });
        //                 server.log.info('Invite request');
        //                 break;
        //             default:
        //                 server.log.error('Unknown Command');
        //                 response.status(400).send({ error: 'Unknown Type' });
        //                 break;
        //         }
        //     } else {
        //         server.log.error('Unknown Type');
        //         response.status(400).send({ error: 'Unknown Type' });
        //     }
        // });
        await client.login(process.env.DISCORD_BOT_TOKEN);
        await server.listen({
            port: process.env.PORT as unknown as number,
        });
    } catch (e) {
        console.error(e);
    }
};

process.on('unhandledRejection', (e) => {
    console.error(e);
    process.exit(1);
});

Bootstrap();
