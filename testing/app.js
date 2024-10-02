// app.js
const express = require('express');
const app = express();

app.use(express.json()); // To handle JSON payloads

// Simple GET route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// GET route with params
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ id: userId, name: 'John Doe' });
});

// POST route to create a user
app.post('/user', (req, res) => {
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).json({ error: 'Name and age are required' });
    }
    res.status(201).json({ id: 1, name, age });
});

// PUT route to update a user
app.put('/user/:id', (req, res) => {
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).json({ error: 'Name and age are required' });
    }
    res.json({ id: req.params.id, name, age });
});

// DELETE route to delete a user
app.delete('/user/:id', (req, res) => {
    res.status(200).json({ message: `User with id ${req.params.id} deleted` });
});

// Error handling for non-existing routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});

module.exports = app;
