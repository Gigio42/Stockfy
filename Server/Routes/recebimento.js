module.exports = async function(fastify, options) {
    const db = options.db;
  
    fastify.post('/', async (request, reply) => {
      console.log(request.body);
  
      let insert = 'INSERT INTO produtos (qualidade, medida, quantidade, vincos) VALUES (?,?,?,?)';
  
      const promises = request.body.map(item => {
        const [qualidade, medida, quantidade, vincos] = item;
        return db.run(insert, [qualidade, medida, quantidade, vincos]);
      });
  
      try {
        await Promise.all(promises);
        reply.send({ message: 'Data received and inserted into SQLite database successfully' });
      } catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: 'Error inserting data into SQLite database', error: err.message });
      }
    });
  };