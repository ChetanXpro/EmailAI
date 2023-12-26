import { ChatOpenAI } from 'langchain/chat_models/openai'
import { LLMChain } from 'langchain/chains'
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from 'langchain/prompts'

export const callOpenAI = async (systemMessage: string, prompt: string) => {
	const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(systemMessage)

	const humanMessage = `{prompt}`
	const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(humanMessage)

	const chatPrompt = ChatPromptTemplate.fromMessages([systemMessagePrompt, humanMessagePrompt])

	const chat = new ChatOpenAI({
		temperature: 0,
	})

	const chain = new LLMChain({
		llm: chat,
		prompt: chatPrompt,
	})

	const result = await chain.call({
		prompt: prompt,
	})

	return result
}
