import { z } from 'zod'

// Define all document types here
export type EmailTypes = 'OTP' | 'Newsletters'

export type EmailSchemas = {
	[K in EmailTypes]: z.ZodObject<any>
}
