// // Read the .env file.
// import * as dotenv from 'dotenv';
// // Require the framework
// import fastify from 'fastify';

// dotenv.config();

// // Instantiate Fastify with some config
// const app = fastify({
//     logger: true,
// });

// // Register your application as a normal plugin.
// app.register(import('../index.ts'));

// export default async (req, res) => {
//     await app.ready();
//     app.server.emit('request', req, res);
// };
