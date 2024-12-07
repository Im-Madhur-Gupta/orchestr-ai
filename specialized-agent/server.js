import express from 'express';
import { handleRequest } from './utils.js';

const app = express();
app.use(express.json());

const CONSTANTS = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  PORT: process.env.PORT || 3000
};

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.post('/api', async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    // Handle the request
    await handleRequest(input);

    return res.json({
      response: "PR created successfully",
      timeTaken: 0
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(CONSTANTS.PORT, () => {
  console.log(`Server running on port ${CONSTANTS.PORT}`);
}); 