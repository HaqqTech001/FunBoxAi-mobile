export interface SubCategory {
  id: string;
  label: string;
  description?: string;
}

export const SUBCATEGORIES: Record<string, SubCategory[]> = {
  joke: [
    { id: 'general', label: 'General/Classic Jokes', description: 'Everyday humor anyone can relate to' },
    { id: 'african', label: 'African Jokes', description: 'Local humor, slang, culture, playful exaggerations' },
    { id: 'tech', label: 'Tech & Geek Jokes', description: 'Coding, gadgets, internet life' },
    { id: 'work', label: 'Work & School Jokes', description: 'Bosses, deadlines, exams, stress' },
    { id: 'dad', label: 'Dad Jokes', description: 'Short, corny, funny one-liners' }
  ],
  riddle: [
    { id: 'easy', label: 'Easy Riddles', description: 'Quick brain teasers' },
    { id: 'hard', label: 'Tricky/Hard Riddles', description: 'Make users think deeply' },
    { id: 'logic', label: 'Logic Riddles', description: 'Reasoning-based puzzles' },
    { id: 'word', label: 'Word Riddles', description: 'Language and wordplay' },
    { id: 'math', label: 'Math Riddles', description: 'Light numbers, no heavy calculations' }
  ],
  story: [
    { id: 'moral', label: 'Short Moral Stories', description: 'Life lessons' },
    { id: 'funny', label: 'Funny Stories', description: 'Humorous mini-stories' },
    { id: 'african', label: 'African Folktales', description: 'Cultural, traditional storytelling' },
    { id: 'adventure', label: 'Adventure Stories', description: 'Excitement, exploration' },
    { id: 'fantasy', label: 'Fantasy/AI Stories', description: 'Imagination, future, robots' }
  ],
  fact: [
    { id: 'general', label: 'General Fun Facts', description: 'Random interesting truths' },
    { id: 'science', label: 'Science & Tech Facts', description: 'Space, AI, inventions' },
    { id: 'body', label: 'Human Body Facts', description: 'Weird, cool biology facts' },
    { id: 'african', label: 'African Facts', description: 'History, culture, nature' },
    { id: 'mindblowing', label: 'Mind-Blowing Facts', description: '"Wow" moments' }
  ],
  pickup: [
    { id: 'cute', label: 'Cute Pickup Lines', description: 'Sweet and friendly' },
    { id: 'funny', label: 'Funny Pickup Lines', description: 'Laugh-first approach' },
    { id: 'romantic', label: 'Romantic Pickup Lines', description: 'Smooth and charming' },
    { id: 'bold', label: 'Bold/Confident Lines', description: 'Direct energy (still respectful)' },
    { id: 'tech', label: 'Tech Pickup Lines', description: 'Nerdy but attractive' }
  ],
  meme: [
    { id: 'relatable', label: 'Relatable Memes', description: 'Everyday life situations' },
    { id: 'work', label: 'Work/School Memes', description: 'Stress, deadlines, exams' },
    { id: 'tech', label: 'Tech Memes', description: 'Coding, apps, bugs' },
    { id: 'african', label: 'African Memes', description: 'Lifestyle, culture, humor' },
    { id: 'random', label: 'Random Funny Memes', description: 'Anything hilarious' }
  ]
};

export const getSubCategories = (contentType: string): SubCategory[] => {
  return SUBCATEGORIES[contentType] || [];
};

export const getSubCategoryLabel = (contentType: string, subCategoryId: string): string => {
  const subCategories = getSubCategories(contentType);
  const subCategory = subCategories.find(sc => sc.id === subCategoryId);
  return subCategory?.label || subCategoryId;
};