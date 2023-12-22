import { z } from 'zod'
import { EmailTypes, EmailSchemas } from '../types/emailTypes'

const OTP = {
	SchemaName: 'OTP',
	Schema: z.object({
		OTP: z.string(),
		LINK: z.string(),
	}),
}

const Newsletters = {
	SchemaName: 'Newsletters',
	Schema: z.object({
		NEWSLETTER_SUMMARY: z.string(),
	}),
}

// Here we have maping of email type to email object
export const emailJson: EmailSchemas = {
	OTP: OTP.Schema,
	Newsletters: Newsletters.Schema,
}

export const EmailEnum = Object.keys(emailJson) as EmailTypes[]
