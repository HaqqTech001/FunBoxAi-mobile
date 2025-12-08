// import { getApiKey } from '../../src/utils/storage';
import { CONTENT_PROMPTS, SYSTEM_PROMPT } from './prompts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
// $$\mathbf{\text{const GEMINI\_API\_URL = '[https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent](https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent)';}}$$

export interface AIResponse {
  type: 'joke' | 'riddle' | 'story' | 'fact' | 'pickup' | 'meme';
  caption: string;
  templateIndex: number;
  emojiEnhancement?: boolean;
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const generateContent = async (
  contentType: AIResponse['type'],
  userInput?: string,
  uploadedImageBase64?: string
): Promise<AIResponse> => {
  try {
    const apiKey = "AIzaSyD4HctnmJarBhSJPrpZHC5yTCxM45mU2lw";
    if (!apiKey) {
      throw new Error('API key not found. Please set your Gemini API key in settings.');
    }

    let prompt = userInput || '';
    
    if (contentType === 'meme') {
      const hasImage = !!uploadedImageBase64;
      prompt = CONTENT_PROMPTS.meme(hasImage, userInput) as string;
    } else {
      prompt = CONTENT_PROMPTS[contentType];
    }

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Request: ${prompt}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse JSON response
    let aiResponse: AIResponse;
    try {
      // Clean the response to extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response
      aiResponse = {
        type: contentType,
        caption: generatedText.trim(),
        templateIndex: Math.floor(Math.random() * 5) + 1,
        emojiEnhancement: true,
      };
    }

    // Validate response
    if (!aiResponse.type || !aiResponse.caption) {
      throw new Error('Invalid AI response format');
    }

    // Ensure templateIndex is within range (1-5)
    aiResponse.templateIndex = Math.max(1, Math.min(5, aiResponse.templateIndex || 1));

    return aiResponse;
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Return friendly error message
    return {
      type: contentType,
      caption: 'Oops! Something went wrong 😅',
      templateIndex: 1,
      emojiEnhancement: true,
    };
  }
};

// export const testApiKey = async (apiKey: string): Promise<boolean> => {
//   try {
//     const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 text: API_TEST_PROMPT,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           maxOutputTokens: 50,
//         },
//       }),
//     });

//     return response.ok;
//   } catch (error) {
//     console.error('API key test error:', error);
//     return false;
//   }
// };

