import { GoogleGenAI, Type } from "@google/genai";
import { LoreResponse } from "../types";

// Initialize Gemini
// Note: process.env.API_KEY is injected by the runtime environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCharacterLore = async (characterName: string): Promise<LoreResponse> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a storyteller for the game Sekiro: Shadows Die Twice. 
      Provide a cryptic, atmospheric, and deep lore description for the character "${characterName}".
      Also provide a famous or fitting quote associated with them or their philosophy.
      
      Tone: Dark, mysterious, feudal Japanese, mythological.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lore: { type: Type.STRING, description: "A deep, atmospheric paragraph about the character's history and nature. Max 80 words." },
            quote: { type: Type.STRING, description: "A memorable quote or philosophy line." }
          },
          required: ["lore", "quote"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as LoreResponse;
    }
    
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      lore: "The mists of Ashina obscure the truth. The archives are currently unreachable.",
      quote: "..."
    };
  }
};
