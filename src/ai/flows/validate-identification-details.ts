'use server';

/**
 * @fileOverview This file defines a Genkit flow for validating PAN and Aadhaar details using AI.
 *
 * The flow takes PAN and Aadhaar numbers as input and returns a validation result
 * indicating whether the provided details are likely to be valid and consistent
 * with publicly available information.
 *
 * @interface ValidateIdentificationDetailsInput - Input for the validateIdentificationDetails function.
 * @interface ValidateIdentificationDetailsOutput - Output of the validateIdentificationDetails function.
 * @function validateIdentificationDetails - Main function to validate identification details.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateIdentificationDetailsInputSchema = z.object({
  panNumber: z
    .string()
    .describe('The PAN number to validate.')
    .regex(/^([A-Z]{5}[0-9]{4}[A-Z]{1})$/, 'Invalid PAN format'),
  aadhaarNumber: z
    .string()
    .describe('The Aadhaar number to validate.')
    .regex(/^\d{12}$/, 'Invalid Aadhaar format'),
});
export type ValidateIdentificationDetailsInput = z.infer<
  typeof ValidateIdentificationDetailsInputSchema
>;

const ValidateIdentificationDetailsOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'Whether the PAN and Aadhaar details are likely to be valid and consistent.'
    ),
  validationDetails: z
    .string()
    .describe(
      'Details about the validation process, including any inconsistencies found.'
    ),
});
export type ValidateIdentificationDetailsOutput = z.infer<
  typeof ValidateIdentificationDetailsOutputSchema
>;

export async function validateIdentificationDetails(
  input: ValidateIdentificationDetailsInput
): Promise<ValidateIdentificationDetailsOutput> {
  return validateIdentificationDetailsFlow(input);
}

const validateIdentificationDetailsPrompt = ai.definePrompt({
  name: 'validateIdentificationDetailsPrompt',
  input: {schema: ValidateIdentificationDetailsInputSchema},
  output: {schema: ValidateIdentificationDetailsOutputSchema},
  prompt: `You are an AI assistant specializing in validating Indian PAN and Aadhaar details.

  Given the following PAN and Aadhaar numbers, determine if they are likely to be valid and consistent.
  Explain your reasoning in the validationDetails field.

  PAN Number: {{{panNumber}}}
  Aadhaar Number: {{{aadhaarNumber}}}

  Consider the following factors:
  - PAN numbers have a specific format (5 uppercase letters, 4 digits, 1 uppercase letter).
  - Aadhaar numbers have a specific format (12 digits).
  - While you cannot directly access external databases, use your general knowledge and reasoning to identify potential inconsistencies or red flags.

  Return a JSON object with the following format:
  {
    "isValid": boolean,
    "validationDetails": string
  }
  `,
});

const validateIdentificationDetailsFlow = ai.defineFlow(
  {
    name: 'validateIdentificationDetailsFlow',
    inputSchema: ValidateIdentificationDetailsInputSchema,
    outputSchema: ValidateIdentificationDetailsOutputSchema,
  },
  async input => {
    const {output} = await validateIdentificationDetailsPrompt(input);
    return output!;
  }
);
