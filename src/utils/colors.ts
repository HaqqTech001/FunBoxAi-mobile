// Color themes and templates for each content type
export interface GradientTemplate {
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const CONTENT_TEMPLATES = {
  jokes: [
    { colors: ['#8B5CF6', '#3B82F6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Purple→Blue
    { colors: ['#EC4899', '#8B5CF6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Pink→Purple
    { colors: ['#FEF3C7', '#FDE68A'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Light Yellow
    { colors: ['#10B981', '#6EE7B7'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Neon Green
    { colors: ['#F97316', '#FDBA74'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Soft Orange
  ] as GradientTemplate[],
  
  riddles: [
    { colors: ['#1E3A8A', '#3B82F6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Dark Blue Gradient
    { colors: ['#6366F1', '#8B5CF6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Purple Pattern
    { colors: ['#F3F4F6', '#E5E7EB'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Soft Gray
    { colors: ['#0891B2', '#06B6D4'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Aqua Gradient
    { colors: ['#7C3AED', '#A855F7'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Violet Soft Glow
  ] as GradientTemplate[],
  
  stories: [
    { colors: ['#EA580C', '#DC2626'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Warm Gradient (Orange→Red)
    { colors: ['#DBEAFE', '#93C5FD'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Light Blue
    { colors: ['#FECACA', '#F87171'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Pink→Purple Gradient
    { colors: ['#FEF3C7', '#FDE68A'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Soft Beige
    { colors: ['#06B6D4', '#22D3EE'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Aqua Glow
  ] as GradientTemplate[],
  
  facts: [
    { colors: ['#0891B2', '#0EA5E9'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Bright Cyan→Blue
    { colors: ['#059669', '#10B981'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Light Green Gradient
    { colors: ['#EA580C', '#F97316'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Orange Accent
    { colors: ['#FEF3C7', '#FDE68A'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Pastel Yellow
    { colors: ['#8B5CF6', '#A78BFA'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Soft Purple
  ] as GradientTemplate[],
  
  pickup: [
    { colors: ['#EC4899', '#F43F5E'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Pink→Red Gradient
    { colors: ['#A855F7', '#C084FC'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Light Violet
    { colors: ['#8B5CF6', '#A855F7'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Neon Purple Glow
    { colors: ['#EC4899', '#F472B6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Soft Magenta
    { colors: ['#06B6D4', '#22D3EE'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Aqua Pastel
  ] as GradientTemplate[],
  
  memes: [
    { colors: ['#8B5CF6', '#3B82F6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Gradient Purple→Blue
    { colors: ['#EC4899', '#8B5CF6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Gradient Pink→Purple
    { colors: ['#111827', '#1F2937'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Solid Black
    { colors: ['#F3F4F6', '#E5E7EB'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Pattern Image 1
    { colors: ['#FECACA', '#F87171'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }, // Pattern Image 2
  ] as GradientTemplate[],
};

export const getRandomTemplate = (contentType: keyof typeof CONTENT_TEMPLATES): GradientTemplate => {
  const templates = CONTENT_TEMPLATES[contentType];
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
};

export const getTemplateByIndex = (
  contentType: keyof typeof CONTENT_TEMPLATES,
  templateIndex: number
): GradientTemplate => {
  const templates = CONTENT_TEMPLATES[contentType];
  const index = Math.max(0, Math.min(templates.length - 1, templateIndex - 1));
  return templates[index];
};

// Theme colors for the app
export const THEME = {
  primary: '#8B5CF6',
  secondary: '#EC4899',
  accent: '#10B981',
  warning: '#F97316',
  danger: '#EF4444',
  background: '#0F0F23',
  surface: '#1E1B4B',
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    muted: '#737373',
  },
  gradients: {
    primary: ['#8B5CF6', '#EC4899'],
    secondary: ['#10B981', '#06B6D4'],
    accent: ['#F97316', '#FB923C'],
  },
};