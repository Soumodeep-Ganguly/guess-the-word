import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AISTUDIO_API_KEY); // Add your Google AiStudio API key here
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const result = await model.generateContent(template);
        const text = result?.response?.text()
        console.log(text);

        const match = text?.match(/Word:\s*(.+),\s*Hint:\s*(.+)/);
        if (!match) return NextResponse.json({ error: 'Unexpected response format from Gemini.' }, { status: 500 });
        
        const word = match[1];
        const hint = match[2];
        
        return NextResponse.json({ word, hint });
    } catch (error) {
        console.error('ERROR GENERATING QUESTION', error);
        return NextResponse.json({ error: 'Error generating question' }, { status: 500 });
    }
}