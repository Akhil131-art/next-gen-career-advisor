
import { GoogleGenAI, Type } from "@google/genai";
import { PersonalityResults, CareerAnalysisResponse, ChatMessage } from "../types";

export const analyzeCareer = async (results: PersonalityResults): Promise<CareerAnalysisResponse> => {
  // Initialize inside the function to ensure process.env.API_KEY is picked up from Vite define
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Act as an elite Senior Career Architect. Analyze this personality profile:
  MBTI: ${results.mbti}
  OCEAN Traits: O:${results.ocean.openness}%, C:${results.ocean.conscientiousness}%, E:${results.ocean.extraversion}%, A:${results.ocean.agreeableness}%, N:${results.ocean.neuroticism}%

  Task: Provide exactly TOP 5 IT/Tech career matches in JSON format.
  For each recommendation, provide:
  1. A reasoning based on trait alignment.
  2. 5 technical skills.
  3. 3 specific certifications with valid URLs (e.g., Coursera, AWS, Google Cloud).
  4. A detailed 6-step roadmap with title, description, and duration.
  
  Confidence scores must reflect the true alignment.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topMatches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  career: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  certifications: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        url: { type: Type.STRING }
                      },
                      required: ["name", "url"]
                    }
                  },
                  roadmap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        duration: { type: Type.STRING }
                      },
                      required: ["title", "description", "duration"]
                    }
                  }
                },
                required: ["career", "confidence", "description", "skills", "certifications", "roadmap"]
              }
            }
          },
          required: ["topMatches"]
        }
      }
    });

    const text = response.text || '';
    // Clean potential markdown artifacts if any
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini analyzeCareer error:", error);
    throw error;
  }
};

export const chatWithAI = async (history: ChatMessage[], message: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a professional yet brief career assistant. STRICT RULES: 1. Keep casual talk to 1-2 sentences maximum. 2. Only explain what the user explicitly asks for. 3. Be direct, efficient, and helpful. 4. Avoid unnecessary fluff.",
    },
  });

  const lastMessages = history.slice(-5).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
  
  try {
    const response = await chat.sendMessage({ message: `${lastMessages}\nUser: ${message}` });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini chatWithAI error:", error);
    throw error;
  }
};
