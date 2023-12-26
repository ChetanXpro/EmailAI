import { z } from 'zod'
import { EmailTypes, EmailSchemas } from '../types/emailTypes'

const OTP = {
	SchemaName: 'OTP',
	Schema: z.object({
		OTP: z.string(),
		LINK: z.string(),
	}),
}

const PatientAppointment = {
	SchemaName: 'PatientAppointment',
	Schema: z.object({
		PatientName: z.string(),
		PatientCountry: z.string(),
		PatientEmail: z.string(),
		PatientHealthConcern: z.string(),
	}),
}

// Here we have maping of email type to email object
export const emailJson: EmailSchemas = {
	OTP: OTP.Schema,
	PatientAppointment: PatientAppointment.Schema,
}

export const EmailEnum = Object.keys(emailJson) as EmailTypes[]
