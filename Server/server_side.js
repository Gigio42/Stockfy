const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(cors()); // middleware para resolver problema de host com ports diferentes (3000 pro serv e 5500 pro client)

app.use(express.json());

app.post('/data', (req, res) => {
  console.log(req.body); 
  res.json({ message: 'Data received successfully' }); 
});

app.listen(5500, () => console.log('Server is listening on port 5500'));