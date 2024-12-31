const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const Item = mongoose.model('Item', ItemSchema);


app.get('/', (req, res) => {
    res.send('running');
});


app.post('/api/items', async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        const newItem = new Item({ name, description });
        const savedItem = await newItem.save();

        res.status(201).json({ message: 'Item saved successfully', item: savedItem });
    } catch (err) {
        console.error('Error saving item:', err);
        res.status(500).json({ error: 'Failed to save item' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
