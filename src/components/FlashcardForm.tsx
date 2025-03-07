import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Flashcard } from '../types';

interface FlashcardFormProps {
  onSave: (card: Omit<Flashcard, 'id' | 'timeSpent'>) => void;
  categories?: string[];
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ onSave, categories = [] }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    question: false,
    answer: false,
  });

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageUrl('');
  };

  const validateForm = (): boolean => {
    const newErrors = {
      question: question.trim() === '',
      answer: answer.trim() === '',
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newCard: Omit<Flashcard, 'id' | 'timeSpent'> = {
        question: question.trim(),
        answer: answer.trim(),
        category: category || undefined,
        imageUrl: imageUrl || undefined,
      };
      
      onSave(newCard);
      
      // Reset form
      setQuestion('');
      setAnswer('');
      setCategory('');
      setImageUrl('');
      setImagePreview(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Crea Nuova Flashcard
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Domanda"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              error={errors.question}
              helperText={errors.question ? 'La domanda è obbligatoria' : ''}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Risposta"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              error={errors.answer}
              helperText={errors.answer ? 'La risposta è obbligatoria' : ''}
              multiline
              rows={3}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Categoria</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Categoria"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">
                  <em>Nessuna</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
                sx={{ mb: 1 }}
              >
                Aggiungi Immagine
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
            
            {imagePreview && (
              <Box sx={{ position: 'relative', width: 'fit-content', mb: 2 }}>
                <img
                  src={imagePreview}
                  alt="Anteprima"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'error.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'error.dark' },
                  }}
                  onClick={removeImage}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Salva Flashcard
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default FlashcardForm; 