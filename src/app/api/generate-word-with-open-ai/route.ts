import { NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from '@langchain/core/messages';

const openai = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY, // Add your OpenAI API key here
    model: "gpt-4o-mini",
    temperature: 0.7,
});

export async function GET() {
    try {
        const categoryOptions = ["science", "nature", "technology", "emotions", "abstract concepts", "animals", "fruits", "vegetables"];
        const randomCategory = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];

        const template = `
            Generate a random and unique English word for a guessing game. The word should:
            1. Be related to the category: ${randomCategory}.
            2. Be uncommon, between 5 and 15 characters long.
            3. Be distinct from typical words like "apple" or "chair."
            
            Provide a single creative hint alongside the word, formatted as:
            "Word: <word>, Hint: <hint>"

            Example:
            "Word: nebula, Hint: A massive cloud of gas and dust in outer space."
        `;

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
        console.error('ERROR GENERATING QUESTION', error);
        return NextResponse.json({ error: 'Error generating question' }, { status: 500 });
    }
}