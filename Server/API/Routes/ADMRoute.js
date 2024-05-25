import AdmController from '../Controllers/admController.js';
import { postChapaItemMaquinaSchema, getChapaItemMaquinaSchema, getItemSchema } from '../validators/admValidator.js'

async function admRoute(fastify, options) {
    const admController = new AdmController(options.db);

    fastify.get('/getAll', {
      handler: async (request, reply) => {
        try {
          const data = await admController.getAll();
          reply.send(data);
        } catch (err) {
          console.log(err.message);
          reply.code(500).send({ message: 'Error retrieving data from SQLite database', error: err.message });
        }
      }
    });


    fastify.get('/item_maquina/:item', {
      schema: getChapaItemMaquinaSchema, handler: async (request, reply) => {

          try {
              const item_id = await admController.getItemMaquinaByItemId(request.params.item);
              reply.send(item_id);
          }
          catch (err) {
              console.log(err.message);
              reply.code(500).send({ message: 'Error retrieving data from SQLite database', error: err.message });
          }
      }
  });

    fastify.get('/chapa_item/:item', {
      schema: getItemSchema, handler: async (request, reply) => {

          try {
              const item_id = await admController.getChapaItem(request.params.item);
              reply.send(item_id);
          }
          catch (err) {
              console.log(err.message);
              reply.code(500).send({ message: 'Error retrieving data from SQLite database', error: err.message });
          }
      }
  });


    fastify.post('/add_ordem', {
      schema: postChapaItemMaquinaSchema, handler: async (request, reply) => {
        console.log(request.body);
    
        try {
          await admController.createChapaItemMaquina(request.body);
          reply.send({ message: 'Data received and inserted into SQLite database successfully' });
        } 
        catch (err) {
          console.log(err.message);
          reply.code(500).send({ message: 'Error inserting data into SQLite database', error: err.message });
        }
      }
    }
  )
}

export default admRoute;