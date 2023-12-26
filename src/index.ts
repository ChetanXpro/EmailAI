import dotenv from 'dotenv'
import { extractData, findEmailCategory } from './helper/extractInfo'
import { NEWSLETTER_EMAIL, OTP_EMAIL, APPOINTMENT_EMAIL } from './contants/sampleEmails'
import { callOpenAI } from './helper/helpers'
import { summarizeSystemPrompt } from './helper/prompts'
dotenv.config()

const main = async () => {
	const emailCategory = await findEmailCategory({ emailContent: APPOINTMENT_EMAIL })

	console.log('Email Category is ', emailCategory)

	if (!emailCategory) {
		throw new Error('Email type is not defined')
	}
	const extractedData = await extractData(emailCategory, [{ emailContent: APPOINTMENT_EMAIL }])

	console.log('Extracted data is ', extractedData)

	const result = await callOpenAI(summarizeSystemPrompt, NEWSLETTER_EMAIL)

	console.log('Result is ', result)
}

main()
