import mongodb from '@fastify/mongodb';
import fp from 'fastify-plugin';

interface IPluginOptions {
    url: string | undefined;
}

const Connection = fp(async (fastify, { url }: IPluginOptions): Promise<void> => {
    try {
        fastify.register(mongodb, {
            forceClose: true,
            url,
        });
    } catch (e) {
        if (e) console.error(e);
    }
});

export { Connection };
