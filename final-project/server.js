const express = require('express');
const fs = require('fs').promises;
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const resourcesFilePath = './final-project/public/resources.json';

async function readResources() {
    try {
        const data = await fs.readFile(resourcesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error fetching resources: ', error);
        return [];
    }
}

const port = 3030; 
app.listen(port, () => {
    console.log("Server running on port 3030");
});

app.get('/resources', async (req, res) => {
    const resources = await readResources();
    res.json(resources);
});