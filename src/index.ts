import dotenv from 'dotenv'
import { extractData, findEmailType } from './helper/extractInfo'
import { NEWSLETTER_EMAIL, OTP_EMAIL } from './contants/sampleEmails'
dotenv.config()

const main = async () => {
	const emailType = await findEmailType({ emailContent: OTP_EMAIL })
	console.log('Email Type is ', emailType)

	if (!emailType) {
		console.error('Email type is not defined')
		return undefined
	}

	const extractedData = await extractData(emailType, [{ emailContent: OTP_EMAIL }])

	console.log('Extracted data is ', extractedData)
}

main()
