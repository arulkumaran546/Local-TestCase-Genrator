const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const OLLAMA_URL = 'http://127.0.0.1:11434/api/chat';

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.post('/api/chat', async (req, res) => {
    try {
        console.log("Incoming request for model:", req.body.model);

        // Proxy the request to local Ollama
        const response = await axios.post(OLLAMA_URL, req.body, {
            headers: { 'Content-Type': 'application/json' },
            responseType: req.body.stream ? 'stream' : 'json' // Correctly handle stream vs json
        });

        // If not streaming, just send data back
        if (!req.body.stream) {
            res.json(response.data);
        } else {
            // Pipe stream if we enabled it (future proofing)
            response.data.pipe(res);
        }

    } catch (error) {
        console.error("Error connecting to Ollama:", error.message);
        console.error("Full Error:", error);
        if (error.response) {
            console.error("Ollama Response Status:", error.response.status);
            console.error("Ollama Response Data:", error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
            console.error("No response received from Ollama. Request was:", error.request);
            res.status(500).json({ error: "No response from Ollama (Connection Refused). Check port 11434." });
        } else {
            res.status(500).json({ error: `Backend Error: ${error.message}` });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
    console.log(`Proxying to Ollama at ${OLLAMA_URL}`);
});
