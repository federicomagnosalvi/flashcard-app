import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, Chip, Stack } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FlashcardItem from './FlashcardItem';
import { Flashcard, StudySession } from '../types';

interface FlashcardStudyProps {
  deck: {
    id: string;
    name: string;
    cards: Flashcard[];
  };
  onComplete: (session: StudySession) => void;
  onExit: () => void;
}

const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ deck, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studiedCards, setStudiedCards] = useState<Record<string, { isCorrect: boolean; timeSpent: number }>>({});
  const [startTime] = useState<Date>(new Date());
  
  const totalCards = deck.cards.length;
  const currentCard = deck.cards[currentIndex];
  const isLastCard = currentIndex === totalCards - 1;
  
  const correctAnswers = Object.values(studiedCards).filter(card => card.isCorrect).length;
  const progress = (Object.keys(studiedCards).length / totalCards) * 100;
  
  const totalTimeSpent = Object.values(studiedCards).reduce((total, card) => total + card.timeSpent, 0);
  const averageTimePerCard = Object.keys(studiedCards).length > 0 
    ? totalTimeSpent / Object.keys(studiedCards).length 
    : 0;
  
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleAnswer = (cardId: string, isCorrect: boolean, timeSpent: number) => {
    setStudiedCards(prev => ({
      ...prev,
      [cardId]: { isCorrect, timeSpent }
    }));
  };
  
  const handleNext = () => {
    if (isLastCard) {
      completeSession();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const completeSession = () => {
    const session: StudySession = {
      deckId: deck.id,
      startTime: startTime,
      endTime: new Date(),
      cardsStudied: Object.keys(studiedCards).length,
      correctAnswers: correctAnswers
    };
    
    onComplete(session);
  };
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {deck.name}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              mb: 1,
              '& .MuiLinearProgress-bar': {
                backgroundColor: progress === 100 ? 'success.main' : 'primary.main'
              }
            }} 
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {Object.keys(studiedCards).length} di {totalCards} carte
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
        </Box>
        
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <Chip 
            icon={<CheckCircleIcon />} 
            label={`Corrette: ${correctAnswers}`} 
            color="success" 
            variant="outlined" 
          />
          <Chip 
            icon={<CancelIcon />} 
            label={`Errate: ${Object.keys(studiedCards).length - correctAnswers}`} 
            color="error" 
            variant="outlined" 
          />
          <Chip 
            icon={<TimerIcon />} 
            label={`Tempo medio: ${formatTime(averageTimePerCard)}`} 
            color="primary" 
            variant="outlined" 
          />
        </Stack>
      </Paper>
      
      {currentCard && (
        <FlashcardItem 
          card={currentCard} 
          onAnswer={handleAnswer} 
          onNext={handleNext} 
        />
      )}
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={onExit}
          sx={{ mr: 2 }}
        >
          Esci
        </Button>
        
        {isLastCard && Object.keys(studiedCards).includes(currentCard.id) && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={completeSession}
          >
            Completa Sessione
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FlashcardStudy; 