export enum Section {
  HOME = 'HOME',
  HISTORY = 'HISTORY',
  CULTURE = 'CULTURE',
  CUISINE = 'CUISINE',
  CITIES = 'CITIES',
  GUIDE = 'GUIDE'
}

export enum GameState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  ERROR = 'ERROR'
}

export interface ContentCardData {
  title: string;
  arabicTitle: string;
  description: string;
  details: string; // Detailed AI generated content
  tags: string[];
}

export interface RecipeData {
  name: string;
  arabicName: string;
  description: string;
  ingredients: string[];
  steps: string[];
  culturalSignificance: string;
}

export interface CityData {
  name: string;
  arabicName: string;
  population: string;
  significance: string;
  landmarks: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface MysteryWordData {
  word: string;
  partOfSpeech: string;
  definition: string;
  hints: string[];
}

export interface TranslationChallengeData {
  phrase: string;
  context: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResult {
  isCorrect: boolean;
  feedback: string;
  betterTranslation?: string;
}