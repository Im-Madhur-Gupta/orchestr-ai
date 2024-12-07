import express from 'express';
import { z } from 'zod';
import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const CONSTANTS = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  PORT: process.env.PORT || 3000
};

const openai = new ChatOpenAI({
  openAIApiKey: CONSTANTS.OPENAI_API_KEY,
  temperature: 0,
  apiKey: CONSTANTS.OPENAI_API_KEY,
});

const responseSchema = z.object({
  github_repo_url: z.string(),
  improvements: z.string()
});

async function getChatGPTStructuredResponse(prompt: string, schema: z.Schema) {
  const structuredLlm = openai.withStructuredOutput(schema);
  const response = await structuredLlm.invoke(prompt);
  return response;
}

app.post('/api', async (req, res) => {
  try {
    const startTime = Date.now();
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    // Modify the input string, add to it that divide it into chunks of 1000 characters
    const modifiedInput = `${input} \n\n\n From the above text, give me structured output in the following format: ${JSON.stringify(responseSchema)} containing the github repo url and improvements to the code.`;

    const response = await getChatGPTStructuredResponse(modifiedInput, responseSchema);
    const timeTaken = Date.now() - startTime;

    // TODO:
    // 1. We pull the index.html from the github repo url 
    // 2. We apply the improvements to the index.html -> raise a PR -> and return its link

    return res.json({
      response,
      timeTaken
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(CONSTANTS.PORT, () => {
  console.log(`Server running on port ${CONSTANTS.PORT}`);
}); 