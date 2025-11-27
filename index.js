const express = require('express');
const cors = require('cors');
const db = require('./db'); 
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json()); 
app.use(express.static('public'));

app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/usuarios', async (req, res) => {
    const { nombre, email } = req.body;
    try {
        const [result] = await db.query('INSERT INTO usuarios (nombre, email) VALUES (?, ?)', [nombre, email]);
        res.json({ id: result.insertId, nombre, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});