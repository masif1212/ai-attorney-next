// import { OpenAI } from 'openai';
// import fs from 'fs';
// import path from 'path';
// import dotenv from 'dotenv';
// import { NextApiResponse } from 'next';

// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// const chunkText = (text: string, maxTokens: number): string[] => {
//   const words = text.split(' ');
//   const chunks: string[] = [];
//   let chunk = '';

//   for (const word of words) {
//     if ((chunk + ' ' + word).length > maxTokens) {
//       chunks.push(chunk.trim());
//       chunk = word;
//     } else {
//       chunk += ' ' + word;
//     }
//   }

//   if (chunk) {
//     chunks.push(chunk.trim());
//   }

//   return chunks;
// };

// export default async function initEmbeddings(documents: any[], res: NextApiResponse) {
//   try {
//     const embeddingsPath = path.join(process.cwd(), 'embeddings.json');
//     fs.writeFileSync(embeddingsPath, '');

//     const embeddingsData: { id: string; embedding: number[] }[] = [];
//     const maxTokens = 8192;
//     for (const doc of documents) {
//       const text = Object.values(doc).join(' ');
//       const chunks = chunkText(text, maxTokens);

//       for (const chunk of chunks) {
//         const response = await openai.embeddings.create({
//           model: 'text-embedding-ada-002',
//           input: chunk,
//         });

//         const embedding = response.data[0]?.embedding;
//         if (embedding) {
//           embeddingsData.push({ id: doc.id.toString(), embedding });
//           fs.appendFileSync(embeddingsPath, JSON.stringify({ id: doc.id.toString(), embedding }) + '\n');
//         }
//       }
//     }

//     res.status(200).json({ message: 'Embeddings initialized successfully' });
//   } catch (error) {
//     console.error('Error initializing embeddings:', error);
//     res.status(500).json({ error: 'Error initializing embeddings' });
//   }
// }
