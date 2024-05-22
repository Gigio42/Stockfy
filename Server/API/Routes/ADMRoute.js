import AdmController from '../Controllers/admController.js';
import { postItemMaquinaSchema, getItemMaquinaSchema } from '../validators/admValidator.js'

async function admRoute(fastify, options) {
    const admController = new AdmController(options.db);

    fastify.get('/:id_item_maquina', {
        schema: getItemMaquinaSchema, handler: async (request, reply) => {
            console.log(request.params.id_item_maquina);

            try {
                const item_maquina = await admController.getItemMaquina(request.params.id_item_maquina);
                reply.send(item_maquina);
            }
            catch (err) {
                console.log(err.message);
                reply.code(500).send({ message: 'Error retrieving data from SQLite database', error: err.message });
            }
        }
    });


    fastify.post('/', { schema: postItemMaquinaSchema, handler: async (request, reply) => {
      console.log(request.body);
  
      try {
        await admController.createItemMaquina(request.body);
        reply.send({ message: 'Data received and inserted into SQLite database successfully' });
      } 
      catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: 'Error inserting data into SQLite database', error: err.message });
      }
    }});
}

export default admRoute;