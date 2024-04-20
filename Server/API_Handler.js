const express = require('express');
const cors = require('cors'); 
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors()); // middleware para resolver problema de host com ports diferentes (3000 pro serv e 5500 pro client)

app.use(express.json());

let db = new sqlite3.Database('./estoque.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

  app.post('/data', (request, response) => {
    console.log(request.body);

    let insert = 'INSERT INTO produtos (qualidade, medida, quantidade, vincos) VALUES (?,?,?,?)';

    request.body.forEach(item => {
      const [qualidade, medida, quantidade, vincos] = item;
      db.run(insert, [qualidade, medida, quantidade, vincos], function(err) {
        if (err) {
          console.log(err.message);
          response.status(500).json({ message: 'Error inserting data into SQLite database' });
          return;
        }
      });
    });

    response.json({ message: 'Data received and inserted into SQLite database successfully' });
  });

app.listen(5500, () => console.log('Server is listening on port 5500'));