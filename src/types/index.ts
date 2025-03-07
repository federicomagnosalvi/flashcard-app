export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  imageUrl?: string;
  category?: string;
  timeSpent?: number; // in milliseconds
}

export interface FlashcardDeck {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: Date;
  lastModified: Date;
}

export interface StudySession {
  deckId: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  correctAnswers: number;
}

export type FlashcardStatus = 'unseen' | 'correct' | 'incorrect'; 