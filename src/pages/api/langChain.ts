import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatOpenAI } from "langchain/chat_models/openai"
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from 'langchain/prompts'
import { ConversationChain } from 'langchain/chains'
import { BufferMemory } from "langchain/memory";


const chat = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0 });

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "The following is a friendly conversation between a human and an AI. The AI is talkative and is very friendly. If the AI does not know the answer to a question, it truthfully says it does not know."
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const chain = new ConversationChain({
  memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
  prompt: chatPrompt,
  llm: chat,
});

function checkMemory (){
    // user needs a token to prevent memory leaks and access diffferent keys on Buffer memory, this need to be stored
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message } = req.body

  if(!message || message == '') return res.status(400).json({error: 'you need to send a message'})

  try{
    const r = await chain.call({input: message});
    
    return res.status(200).json(r.response)

  }catch (error: any){

    if (error.response) {
      console.log(error.response.data)
      res.status(error.response.status).json(error.response.data.error.message);
      
    } else {

      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });

    }

  }

}