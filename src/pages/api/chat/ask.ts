// pages/api/ask.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { cosineSimilarity } from '../../../lib/similarity';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function ask(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { question, chatId } = req.body;

    if (!question || !chatId) {
      return res.status(400).json({ error: 'Invalid request, question and chatId are required' });
    }

    const embeddingsPath = path.join(process.cwd(), 'embeddings.json');
    const embeddingsData = fs.readFileSync(embeddingsPath, 'utf-8').split('\n').filter(Boolean).map(line => JSON.parse(line));

    const questionResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: question,
    });

    const questionEmbedding = questionResponse.data[0].embedding;

    let mostRelevantContext = '';
    let highestSimilarity = -Infinity;

    for (const { id, embedding } of embeddingsData) {
      const similarity = cosineSimilarity(questionEmbedding, embedding);

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostRelevantContext = id; 
      }
    }

    const completionResponse = await openai.completions.create({
      model: 'gpt-3.5-turbo',
      prompt: `
      You are an intelligent assistant that answers questions based on the context provided.
      Question: ${question}
      Context: ${mostRelevantContext}
      Answer:`,
      max_tokens: 150,
    });

    res.status(200).json({ response: completionResponse.choices[0].text });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
}
