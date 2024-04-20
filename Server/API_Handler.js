const express = require('express');
const cors = require('cors'); 
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors()); // middleware para resolver problema de host com ports diferentes (3000 pro serv e 5500 pro client)
app.use(express.json());

const recebimentoRoutes = require('./Routes/recebimento');
app.use('/recebimento', recebimentoRoutes);

const port = 5500;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`))