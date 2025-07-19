'use server';

/**
 * @fileOverview Summarizes uploaded Excel data using AI.
 *
 * - summarizeExcelData - A server action that handles the summarization process.
 *   Input for this action should conform to an internal schema expecting an 'excelData' string.
 *   Output will be an object with a 'summary' string, conforming to an internal schema.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeExcelDataInputSchema = z.object({
  excelData: z
    .string()
    .describe('The uploaded Excel data as a string.'),
});

const SummarizeExcelDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the uploaded Excel data.'),
});

/**
 * Server action to summarize Excel data.
 * @param {z.infer<typeof SummarizeExcelDataInputSchema>} input - The input data containing the excel string.
 * @returns {Promise<z.infer<typeof SummarizeExcelDataOutputSchema>>} A promise that resolves to the summary.
 */
export async function summarizeExcelData(input) {
  return summarizeExcelDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeExcelDataPrompt',
  input: {schema: SummarizeExcelDataInputSchema},
  output: {schema: SummarizeExcelDataOutputSchema},
  prompt: `You are an expert data analyst. Please provide a concise summary of the following Excel data:\n\n{{{excelData}}}`,
});

const summarizeExcelDataFlow = ai.defineFlow(
  {
    name: 'summarizeExcelDataFlow',
    inputSchema: SummarizeExcelDataInputSchema,
    outputSchema: SummarizeExcelDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output;
  }
);
