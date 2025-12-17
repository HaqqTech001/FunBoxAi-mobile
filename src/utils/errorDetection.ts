// Utility functions for detecting error responses

export const isErrorResponse = (caption: string): boolean => {
  if (!caption || typeof caption !== 'string') return true;
  
  const errorPatterns = [
    'Oops! Something went wrong',
    'Failed to process AI response',
    'API key not configured',
    'Network error',
    'API quota exceeded',
    'Failed to parse AI response',
    'Please check your API key',
    'Please try again later',
    'Failed to generate',
    'Error:',
    '❌',
    '🚨',
    '💥',
    '😅',
    '🔄',
    '🔑',
    '🌐',
    '⏳',
    '📝'
  ];
  
  return errorPatterns.some(pattern => caption.includes(pattern));
};

export const getErrorMessage = (caption: string): string | null => {
  if (isErrorResponse(caption)) {
    return caption;
  }
  return null;
};