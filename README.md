хочу подключить discord bot в своё приложение fastify проблема с websocket код ниже и вот код ошибки: 
Error: Used disallowed intents
    at WebSocketShard.onClose (C:\Users\alexb\projects\demonic-bot\node_modules\.pnpm\@discordjs+ws@1.0.2\node_modules\@discordjs\ws\src\ws\WebSocketShard.ts:805:13)
    at WebSocket.connection.onclose (C:\Users\alexb\projects\demonic-bot\node_modules\.pnpm\@discordjs+ws@1.0.2\node_modules\@discordjs\ws\src\ws\WebSocketShard.ts:206:14)
    at callListener (C:\Users\alexb\projects\demonic-bot\node_modules\.pnpm\ws@8.14.2\node_modules\ws\lib\event-target.js:290:14)
    at WebSocket.onClose (C:\Users\alexb\projects\demonic-bot\node_modules\.pnpm\ws@8.14.2\node_modules\ws\lib\event-target.js:220:9)
    at WebSocket.emit (node:events:519:28)
    at WebSocket.emitClose (C:\Users\alexb\projects\demonic-bot\node_modules\.pnpm\ws@8.14.2\node_modules\ws\lib\websocket.js:260:10)
    at TLSSocket.socketOnClose (C:\Users\alexb\projects\demonic-bot\node_modules\.pnpm\ws@8.14.2\node_modules\ws\lib\websocket.js:1272:15)
    at TLSSocket.emit (node:events:531:35)
    at node:net:337:12
    at TCP.done (node:_tls_wrap:657:7)


client: 

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

export type TClient = typeof client;

export { client };

plugin: 

import { TClient } from '@client/bot';
import fp from 'fastify-plugin';

interface IPluginOptions {
    client: TClient;
    token: string;
}

const PluginToken = fp(async (fastify, { client, token }: IPluginOptions): Promise<void> => {
    try {
        fastify.decorate('client', client);
        await client.login(token);
    } catch (e) {
        if (e) console.error(e);
    }
});

export { PluginToken };

root file: 

import { schema } from '@cfg';
import { client } from '@client/bot';
import { PluginAlias, PluginEnv } from '@plugins';
import { PluginToken } from '@plugins/bot';
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import p from 'pino';

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string',
                    },
                },
            },
        },
    },
};

const Bootstrap = async () => {
    try {
        // @ts-ignore
        const s: FastifyInstance = Fastify({
            logger: p({ level: 'info' }),
        });
        s.register(PluginAlias);
        s.register(PluginEnv, schema);
        s.register(PluginToken, {
            client,
            token: process.env.DISCORD_BOT_TOKEN as string,
        });
        s.setErrorHandler((error) => s.log.error(error));
        s.get('/', (_, reply) => {
            reply.send({ name: 'Demonic Bot' });
        });
        s.get('/ping', opts, async () => {
            return { pong: 'it worked!!' };
        });

        await s.listen({
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
