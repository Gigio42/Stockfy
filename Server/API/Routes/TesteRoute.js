// import TesteController from '../Controllers/TesteController.js';

// async function TesteRoute(fastify, options) {
//     const testeController = new TesteController(options.db);

//     fastify.get('/', async (request, reply) => {
//         try {
//             const data = await testeController.getAll(request.query);
//             reply.send(data);
//         } catch (err) {
//             console.log(err.message);
//             reply.code(500).send({ message: 'Error retrieving data from SQLite database', error: err.message });
//         }
//     });
// }

// export default TesteRoute;