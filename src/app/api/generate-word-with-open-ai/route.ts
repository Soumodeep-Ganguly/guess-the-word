import { NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from '@langchain/core/messages';

const openai = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY, // Add your OpenAI API key here
    model: "gpt-4o-mini",
    temperature: 0.7,
});

const template = `
    Generate a random English word for a guessing game along with a single-sentence hint describing the word. 
    Please format the output like this:
    "Word: <word>, Hint: <hint>"
`;

export async function GET() {
    try {
        const response = await openai.call([
            new HumanMessage(template), // Pass the template as the user input
        ]);
        const text = response?.text?.trim();

        const match = text?.match(/Word:\s*(.+),\s*Hint:\s*(.+)/);
        if (!match) return NextResponse.json({ error: 'Unexpected response format from OpenAI.' }, { status: 500 });
        
        const word = match[1];
        const hint = match[2];
        
        return NextResponse.json({ word, hint });
    } catch (error) {
        console.error('USER UPDATING ERROR', error);
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}