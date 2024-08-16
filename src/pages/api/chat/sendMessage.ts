import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { authenticate } from '../../../backend/middleware/auth';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';


// interface CaseData {
//     id: string;
//     order_num: number;
//     citation: string;
//     title: string;
//     court: string;
//     year: number;
//     page_no: number;
//     citation_name: string;
//     referLinks: string;
//     related_case_type: string;
//     description: string;
//     case_description: string;
//     case_facts: string;
//     case_judgements: string;
//     case_proceedings: string;
//     keywords: string;
//     judges: string;
//     parties_involved: string;
//     summary: string;
//     case_type: string;
//     decision_date: string;
//   }
  

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// function filterRelevantCases(data: CaseData[], query: string): CaseData[] {
//   return data.filter((caseData) =>
//     caseData.citation.toLowerCase().includes(query.toLowerCase()) ||
//     caseData.court.toLowerCase().includes(query.toLowerCase()) ||
//     caseData.keywords.toLowerCase().includes(query.toLowerCase()) ||
//     caseData.title.toLowerCase().includes(query.toLowerCase()) ||
//     caseData.case_description.toLowerCase().includes(query.toLowerCase()) ||
//     caseData.summary.toLowerCase().includes(query.toLowerCase())
//   );
// }


// function constructPrompt(query: string, relevantCases: CaseData[]): string {
//   if (relevantCases.length === 0) {
//     return `The user has asked about: "${query}". No relevant cases were found in the database.`;
//   }

//   const casesText = relevantCases.slice(0, 5).map((caseData) => `
//     ### Case ${caseData.order_num}:
//     - *Case Title:* ${caseData.title}
//     - *Citation:* ${caseData.citation}
//     - *Court:* ${caseData.court}
//     - *Key Facts:* ${caseData.case_facts}
//     - *Proceedings:* ${caseData.case_proceedings}
//     - *Judge's Decision:* ${caseData.case_judgements}
//     - *Reference URL:* http://localhost:2000/download/${caseData.id}
//   `).join('\n');

//   return `
//   You are an intelligent assistant who can handle both general conversation and specific questions about Pakistani law cases from various reports such as PLD, SCMR, MLD, PCrLJ, PTD, PLC-Service, PLC-Labour, YLR, CLC, CLD, and GBLR.

//   When responding to general conversation, please provide friendly and engaging responses. Examples include:
//   - Greetings like "Hi", "Hello"
//   - Responses to "How are you?"
//   - Small talk like "What's up?", "Good morning", "Good evening"

//   When responding to questions about specific cases:
//   - Provide information related to the case title, citation, court, key facts, proceedings, and the judge's decision.
//   - If multiple cases match the query:
//   - If 5 or fewer cases are found, provide a brief summary of each case.
//   - If more than 5 cases are found, give the detail based on the query specifics.
//   - For each case, include a reference URL in the format: "http://localhost:2000/download/case_id", where "id" is the unique identifier for each case.

//   Use information from columns such as 'case_description', 'case_facts', 'case_proceedings', and 'case_judgements'.
//   Provide accurate and detailed answers.

//   Example response when multiple cases are found:
//   ${casesText}

//   Your responses should be grounded and detailed in the provided context, drawn from the descriptions and details in the law reports.
//   Be as detailed as possible in your answers, relying on information from the columns like 'case_description', 'case_facts', 'case_proceedings', and 'case_judgements' to provide accurate and relevant information.
//   If the query cannot be answered with the available data, you must state that you do not know.
//   `;
// }

const generateAIResponse = async (query: string): Promise<string> => {
    // const contextData = await loadData();
    // const relevantCases = filterRelevantCases(contextData, query);
    // console.log(relevantCases,"relevantCases")
    // const prompt = constructPrompt(query, relevantCases);
    const prompt = "You are an intelligent assistant who can handle both general conversation and specific questions about Pakistani law cases from various reports such as PLD, SCMR, MLD, PCrLJ, PTD, PLC-Service, PLC-Labour, YLR, CLC, CLD, and GBLR"
  
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an intelligent assistant who provides detailed information on legal cases based on context.' },
          { role: 'user', content: prompt },
        ],
      });
  
      const aiContent = response.choices && response.choices[0]?.message?.content?.trim();
      return aiContent || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  };
  
  const sendMessage = async (req: NextApiRequest, res: NextApiResponse) => {
    const { chatId, content } = req.body;
  
    if (!chatId || !content) {
      return res.status(400).json({ message: 'Chat ID and content are required' });
    }
  
    if (typeof req.userId !== 'string') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const chatIdString = chatId as string;
      const userIdString = req.userId;
      const pairId = uuidv4();
  
      const lastMessage = await prisma.message.findFirst({
        where: { chatId: chatIdString },
        orderBy: { createdAt: 'desc' },
      });
  
      const newSequence = (lastMessage?.sequence || 0) + 1;
  
      const userMessage = await prisma.message.create({
        data: {
          chatId: chatIdString,
          senderId: userIdString,
          content,
          senderType: 'user',
          messageType: 'QUERY',
          sequence: newSequence,
          pairId: pairId,
        },
      });
  
      const aiContent = await generateAIResponse(content);
      const aiMessage = await prisma.message.create({
        data: {
          chatId: chatIdString,
          senderId: null,
          content: aiContent,
          senderType: 'AI',
          messageType: 'RESPONSE',
          sequence: newSequence + 1,
          parentId: userMessage.id,
          pairId: pairId,
        },
      });
  
      res.status(201).json({
        pair: {
          userMessage: {
            content: userMessage.content,
            senderType: userMessage.senderType,
            createdAt: userMessage.createdAt,
            pairId: userMessage.pairId,
          },
          aiMessage: {
            content: aiMessage.content,
            senderType: aiMessage.senderType,
            createdAt: aiMessage.createdAt,
            pairId: aiMessage.pairId,
          },
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Error sending message', error: error });
    }
  };
  
  export default authenticate(sendMessage);
  
  