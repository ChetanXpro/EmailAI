// import { DocumentSchemas } from './../types/emailTypes'
import { EmailEnum, emailJson } from '../contants/Schema'
import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import { EmailTypes } from '../types/emailTypes'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { JsonOutputFunctionsParser } from 'langchain/output_parsers'
import { HumanMessage } from 'langchain/schema'

import { createExtractionChainFromZod } from 'langchain/chains'
import { z } from 'zod'

import { PDFLoader } from 'langchain/document_loaders/fs/pdf'

type DocumentSchemas = {
	[K in EmailTypes]: z.ZodObject<any>
}

const loadDocument = async (documentPath: string) => {
	const loader = new PDFLoader(documentPath, {
		splitPages: false,
	})

	const docs = await loader.load()

	return docs
}

export const findEmailType = async (email: { emailContent: string }): Promise<string | undefined> => {
	try {
		const parser = new JsonOutputFunctionsParser()
		const extractionFunctionSchema = {
			name: 'extractor',
			description: 'Extracts fields from the input.',
			parameters: {
				type: 'object',
				properties: {
					emailType: {
						type: 'string',
						enum: EmailEnum,
						description: 'Email type',
					},
				},
				required: ['emailType'],
			},
		}

		const model = new ChatOpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0 })

		const runnable: any = model
			.bind({
				functions: [extractionFunctionSchema],
				function_call: { name: 'extractor' },
			})
			.pipe(parser)

		const result = await runnable.invoke([
			new HumanMessage(
				`
        Email content is defined between three stars

        ***

        ${email.emailContent}

        ***
        `
			),
		])

		// console.log(result)s

		return result?.emailType
	} catch (error) {
		console.error('Error in finding email type:', error)
		return undefined
	}
}

export const extractData = async (emailType: string, email: { emailContent: string }[]) => {
	try {
		if (!emailType) {
			console.error('Email type is not defined')
			return undefined
		}

		const chatModel = new ChatOpenAI({
			modelName: 'gpt-3.5-turbo',
			temperature: 0,
		})

		const schema = emailJson[emailType as EmailTypes]

		if (schema) {
			const chain = createExtractionChainFromZod(schema, chatModel)

			const data = await chain.run(email[0].emailContent)

			return data
		} else {
			console.log('extractData: No schema found')
		}
	} catch (error) {
		console.log(error)
		console.log('extractData: Error in parsing the document')
	}
}

// Final function
// const run = async () => {
// 	// 1. Load the document
// 	const loadDocumentStart = Date.now()
// 	const docs = await loadDocument('./W22.pdf')
// 	const loadDocumentEnd = Date.now()
// 	console.log(`loadDocument Time: ${((loadDocumentEnd - loadDocumentStart) / 1000).toFixed(2)} s`)

// 	// 2. Find the document type
// 	const findDocumentTypeStart = Date.now()
// 	const documentType = await findDocumentType(docs)
// 	const findDocumentTypeEnd = Date.now()
// 	console.log(`findDocumentType Time: ${((findDocumentTypeEnd - findDocumentTypeStart) / 1000).toFixed(2)} s`)

// 	if (!documentType) {
// 		console.log('Document type not found')
// 		return
// 	}

// 	console.log('Document type:', documentType)

// 	// 3. Extract the data
// 	const extractDataStart = Date.now()
// 	const extractedData = await extractData(documentType, docs)

// 	if (!extractedData) {
// 		console.log('extractedData not found')
// 		return
// 	}

// 	const extractDataEnd = Date.now()
// 	console.log(extractedData)
// 	console.log(`extractData Time: ${((extractDataEnd - extractDataStart) / 1000).toFixed(2)} s`)
// }
