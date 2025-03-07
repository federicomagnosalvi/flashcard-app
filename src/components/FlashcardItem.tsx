import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import { Flashcard, FlashcardStatus } from '../types';
import { useStopwatch } from '../hooks/useStopwatch';

interface FlashcardItemProps {
  card: Flashcard;
  onAnswer: (cardId: string, isCorrect: boolean, timeSpent: number) => void;
  onNext: () => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ card, onAnswer, onNext }) => {
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState<FlashcardStatus>('unseen');
  const { time, isRunning, start, stop, reset, getFormattedTime } = useStopwatch();

  // Avvia il cronometro quando il componente viene montato
  React.useEffect(() => {
    start();
    return () => {
      stop();
      reset();
    };
  }, [card.id]); // Resetta quando cambia la carta

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
      stop(); // Ferma il cronometro quando la carta viene girata
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    setStatus(isCorrect ? 'correct' : 'incorrect');
    onAnswer(card.id, isCorrect, time);
  };

  const handleNext = () => {
    setFlipped(false);
    setStatus('unseen');
    reset();
    start();
    onNext();
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 500, 
        minHeight: 300,
        margin: '0 auto',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        position: 'relative',
        bgcolor: status === 'correct' ? '#e8f5e9' : status === 'incorrect' ? '#ffebee' : 'white',
        boxShadow: 3
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          display: 'flex', 
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '16px',
          padding: '4px 8px'
        }}
      >
        <TimerIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="body2">{getFormattedTime()}</Typography>
      </Box>

      <Box 
        sx={{ 
          backfaceVisibility: 'hidden',
          position: flipped ? 'absolute' : 'relative',
          width: '100%',
          height: '100%',
          display: flipped ? 'none' : 'block'
        }}
      >
        {card.imageUrl && (
          <CardMedia
            component="img"
            height="140"
            image={card.imageUrl}
            alt={card.question}
          />
        )}
        <CardContent sx={{ height: card.imageUrl ? 'calc(100% - 140px)' : '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5" component="div" align="center" gutterBottom>
            {card.question}
          </Typography>
          {card.category && (
            <Chip 
              label={card.category} 
              size="small" 
              sx={{ mt: 1 }} 
            />
          )}
          <Button 
            variant="contained" 
            onClick={handleFlip} 
            sx={{ mt: 3 }}
          >
            Mostra Risposta
          </Button>
        </CardContent>
      </Box>

      <Box 
        sx={{ 
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          position: flipped ? 'relative' : 'absolute',
          width: '100%',
          height: '100%',
          display: flipped ? 'block' : 'none'
        }}
      >
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5" component="div" align="center" gutterBottom>
            {card.answer}
          </Typography>
          
          {status === 'unseen' && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleAnswer(false)}
              >
                Non Sapevo
              </Button>
              <Button 
                variant="contained" 
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleAnswer(true)}
              >
                Sapevo
              </Button>
            </Box>
          )}
          
          {status !== 'unseen' && (
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Typography variant="body1" color={status === 'correct' ? 'success.main' : 'error.main'} gutterBottom>
                {status === 'correct' ? 'Risposta Corretta!' : 'Risposta Sbagliata'}
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleNext}
                sx={{ mt: 1 }}
              >
                Prossima Carta
              </Button>
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default FlashcardItem; 