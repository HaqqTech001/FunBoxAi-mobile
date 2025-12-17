import { API_TEST_PROMPT, CONTENT_PROMPTS, SYSTEM_PROMPT } from './prompts';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface AIResponse {
  type: 'joke' | 'riddle' | 'story' | 'fact' | 'pickup' | 'meme';
  caption: string;
  templateIndex: number;
  emojiEnhancement?: boolean;
  imageData?: string;
  subCategory?: string;
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
  prompt: string = '',
  uploadedImageBase64?: string
): Promise<AIResponse> => {
  try {
    console.log('🔄 Starting content generation for type:', contentType);
    
    const apiKey = "AIzaSyD4HctnmJarBhSJPrpZHC5yTCxM45mU2lw";
    if (!apiKey) {
      console.error('❌ API key not found');
      throw new Error('API key not found. Please set your Gemini API key in settings.');
    }
    
    console.log('✅ API key retrieved successfully');

    let userPrompt = prompt || '';
    
    if (contentType === 'meme') {
      const hasImage = !!uploadedImageBase64;
      userPrompt = CONTENT_PROMPTS.meme(hasImage, userPrompt) as string;
    } else if (prompt) {
      // Use custom prompt if provided (for sub-categories)
      userPrompt = prompt;
    } else {
      userPrompt = CONTENT_PROMPTS[contentType];
    }

    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Request: ${userPrompt}`;
    console.log('📝 Full prompt prepared:', fullPrompt.substring(0, 200) + '...');

    const requestBody = {
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
    };
    
    console.log('🌐 Making API request to:', GEMINI_API_URL);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API request failed:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    console.log('📊 Raw API response data:', JSON.stringify(data, null, 2));
    
    // Validate response structure
    if (!data || !data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error('❌ Invalid API response structure:', data);
      throw new Error('Invalid API response structure');
    }

    const candidate = data.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts) || candidate.content.parts.length === 0) {
      console.error('❌ Invalid candidate structure:', candidate);
      throw new Error('Invalid candidate structure');
    }

    const generatedText = candidate.content.parts[0].text;
    console.log('📝 Generated text:', generatedText);
    
    if (!generatedText || typeof generatedText !== 'string') {
      console.error('❌ No valid text in response:', generatedText);
      throw new Error('No text generated in response');
    }
    
    // Parse JSON response
    console.log('🔄 Starting JSON parsing...');
    let aiResponse: AIResponse;
    try {
      // Clean the response to extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      console.log('🔍 JSON match result:', jsonMatch);
      
      if (jsonMatch && jsonMatch[0]) {
        console.log('📄 Attempting to parse JSON:', jsonMatch[0]);
        const parsedResponse = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON parsed successfully:', parsedResponse);
        
        // Validate parsed response has required fields
        if (parsedResponse && typeof parsedResponse === 'object') {
          aiResponse = {
            type: contentType,
            caption: parsedResponse.caption || generatedText.trim(),
            templateIndex: parsedResponse.templateIndex || Math.floor(Math.random() * 5) + 1,
            emojiEnhancement: parsedResponse.emojiEnhancement !== false,
          };
          console.log('🎯 Final AI response:', aiResponse);
        } else {
          console.error('❌ Parsed response is not a valid object:', parsedResponse);
          throw new Error('Parsed response is not a valid object');
        }
      } else {
        console.error('❌ No JSON found in response. Raw text:', generatedText);
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      console.error('📄 Raw response that failed to parse:', generatedText);
      
      // Fallback response - use cleaned text
      const cleanedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
      console.log('🧹 Cleaned text:', cleanedText);
      
      aiResponse = {
        type: contentType,
        caption: cleanedText || 'Here\'s some content for you!',
        templateIndex: Math.floor(Math.random() * 5) + 1,
        emojiEnhancement: true,
      };
      console.log('🔄 Using fallback response:', aiResponse);
    }

    // Validate response
    console.log('✅ Validating final response...');
    if (!aiResponse.type || !aiResponse.caption) {
      console.error('❌ Invalid AI response format:', aiResponse);
      throw new Error('Invalid AI response format');
    }

    // Ensure templateIndex is within range (1-5)
    aiResponse.templateIndex = Math.max(1, Math.min(5, aiResponse.templateIndex || 1));
    
    // Include imageData in response if this is a meme with an uploaded image
    if (contentType === 'meme' && uploadedImageBase64) {
      aiResponse.imageData = uploadedImageBase64;
    }
    
    console.log('🎉 Content generation completed successfully:', aiResponse);

    return aiResponse;
  } catch (error) {
    console.error('💥 AI Generation Error:', error);
    console.error('🔍 Error type:', error?.constructor?.name);
    console.error('📄 Error message:', error?.message);
    console.error('📊 Error stack:', error?.stack);
    
    // Provide specific error messages based on error type
    let errorMessage = 'Oops! Something went wrong 😅';
    
    if (error instanceof TypeError) {
      console.error('🚨 TypeError detected - likely undefined object access');
      errorMessage = 'Failed to process AI response. Please try again! 🔄';
    } else if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'API key not configured. Please set your Gemini API key in settings! 🔑';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection! 🌐';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'API quota exceeded. Please try again later! ⏳';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Failed to parse AI response. Please try again! 📝';
      }
    }
    
    console.log('🛠️ Returning error response:', errorMessage);
    
    // Return friendly error message with error details
    return {
      type: contentType,
      caption: errorMessage,
      templateIndex: 1,
      emojiEnhancement: true,
    };
  }
};

export const testApiKey = async (apiKey: string): Promise<boolean> => {
  try {
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
                text: API_TEST_PROMPT,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 50,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('API key test error:', error);
    return false;
  }
};

// Helper function to validate AI response structure
export const validateAIResponse = (response: any): response is AIResponse => {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.caption === 'string' &&
    typeof response.templateIndex === 'number' &&
    response.type &&
    ['joke', 'riddle', 'story', 'fact', 'pickup', 'meme'].includes(response.type)
  );
};

// Helper function to create standardized AI response
export const createAIResponse = (
  type: AIResponse['type'],
  caption: string,
  templateIndex: number = 1,
  subCategory?: string
): AIResponse => {
  return {
    type,
    caption,
    templateIndex: Math.max(1, Math.min(5, templateIndex)),
    emojiEnhancement: true,
    subCategory,
  };
};

// Helper function to format sub-category prompts
export const formatSubCategoryPrompt = (
  contentType: AIResponse['type'],
  subCategoryLabel: string,
  customPrompt?: string
): string => {
  const basePrompt = customPrompt || CONTENT_PROMPTS[contentType];
  return `${basePrompt} Focus on ${subCategoryLabel.toLowerCase()} content.`;
};

// Helper function to extract JSON from AI response
export const extractJSONFromResponse = (text: string): any => {
  try {
    // Try to find JSON block
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch && jsonMatch[0]) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found');
  } catch (error) {
    console.error('Failed to extract JSON:', error);
    return null;
  }
};