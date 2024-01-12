import path from 'path';
import { client } from '@discord/demonic/Bot';
import env from '@fastify/env';
import Sensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import pressure from '@fastify/under-pressure';
import * as dotenv from 'dotenv';
import fastify from 'fastify';
import S from 'fluent-json-schema';
import p from 'pino';

dotenv.config();

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
                .prop('MONGODB_URL', S.string().required())
                .prop('SPOTIFY_CLIENT_ID', S.string().required())
                .prop('SPOTIFY_SECRET', S.string().required())
                .valueOf(),
        });
        server.register(fastifyStatic, {
            root: path.join(__dirname, '..', 'public'),
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
        server.get('/invite', () => {});
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
