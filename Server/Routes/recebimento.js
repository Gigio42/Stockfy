const express = require('express');
const db = require('../Database');

const router = express.Router();

router.post('/', async (request, response) => {
    console.log(request.body);

    let insert = 'INSERT INTO produtos (qualidade, medida, quantidade, vincos) VALUES (?,?,?,?)';
    
    const promises = request.body.map(item => {
        const [qualidade, medida, quantidade, vincos] = item;
        return db.run(insert, [qualidade, medida, quantidade, vincos]);
    });
    try {
        await Promise.all(promises);
        response.json({ message: 'Data received and inserted into SQLite database successfully' });
    } catch (err) {
        console.log(err.message);
        response.status(500).json({ message: 'Error inserting data into SQLite database', error: err.message });
    }
});

module.exports = router;