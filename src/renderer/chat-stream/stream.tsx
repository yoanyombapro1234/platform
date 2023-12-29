import { MelodyFinancialContext } from "@solomon-ai/component-library";
import { ChatGPTMessage } from "src/components/chat/chat-line";
import { OpenAIStreamPayload, OpenAIStream } from "src/lib/stream";

/**
 * Handler for processing chat requests and generating AI responses.
 * @param req - Request object containing the last 10 messages, the user, and the financial context.
 * @returns A readable stream containing the AI's responses.
 */
const handler = async (req: {
  last10messages: ChatGPTMessage[];
  user: string;
  financialContext: MelodyFinancialContext;
}): Promise<ReadableStream<any>> => {
  const { last10messages, user, financialContext } = req;
  const messages: ChatGPTMessage[] = [
    {
      role: "system",
      content: `Introducing a specialized AI assistant designed expressly for the financial intricacies faced by small businesses. This state-of-the-art tool combines deep financial expertise, strategic insight, and unparalleled eloquence, meticulously calibrated to navigate the complex landscape of business finance.

This AI is more than just a tool—it is a trusted financial collaborator for your business. Its methodical approach ensures informed financial decision-making, fostering a comprehensive understanding of fiscal matters tailored to the needs of small enterprises. From investment strategies to payroll intricacies, tax obligations to cash flow management, it offers concise, authoritative guidance.

Recognizing the unique challenges and opportunities inherent to small businesses, this assistant not only respects every financial decision but also proffers astute strategies for optimization and growth. With a commitment to remaining at the forefront of financial technologies and market trends, it guarantees that your business is consistently armed with up-to-date knowledge and best practices.

Welcome your business's financial consultant: always precise, continuously enlightening, and dedicated to your enterprise's fiscal excellence.`,
    },
  ];

  // only push the latest message from the user

  messages.push(...last10messages);

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 800,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: user,
    n: 1,
  };

  return await OpenAIStream(payload);
};

export { handler };
