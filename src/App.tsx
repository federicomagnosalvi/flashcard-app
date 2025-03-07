import React, { useState, useEffect } from 'react';
import { 
  Container, 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { v4 as uuidv4 } from 'uuid';

import FlashcardForm from './components/FlashcardForm';
import FlashcardStudy from './components/FlashcardStudy';
import { Flashcard, FlashcardDeck, StudySession } from './types';

// Tema dell'applicazione
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Dati di esempio
const sampleDeck: FlashcardDeck = {
  id: 'sample-deck-1',
  name: 'Vocaboli Italiani',
  cards: [
    {
      id: 'card-1',
      question: 'Cosa significa "Ciao"?',
      answer: 'Hello / Goodbye',
      category: 'Saluti',
    },
    {
      id: 'card-2',
      question: 'Come si dice "Thank you" in italiano?',
      answer: 'Grazie',
      category: 'Frasi comuni',
    },
    {
      id: 'card-3',
      question: 'Cosa significa "Buongiorno"?',
      answer: 'Good morning / Good day',
      category: 'Saluti',
    },
  ],
  createdAt: new Date(),
  lastModified: new Date(),
};

function App() {
  const [decks, setDecks] = useState<FlashcardDeck[]>([sampleDeck]);
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [categories, setCategories] = useState<string[]>(['Saluti', 'Frasi comuni', 'Grammatica']);

  // Gestione delle schede
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Gestione del drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Seleziona un deck
  const selectDeck = (deck: FlashcardDeck) => {
    setActiveDeck(deck);
    setActiveTab(1); // Passa alla scheda di studio
    setDrawerOpen(false);
  };

  // Aggiungi una nuova flashcard
  const addFlashcard = (card: Omit<Flashcard, 'id' | 'timeSpent'>) => {
    if (!activeDeck) return;

    const newCard: Flashcard = {
      ...card,
      id: uuidv4(),
    };

    const updatedDeck: FlashcardDeck = {
      ...activeDeck,
      cards: [...activeDeck.cards, newCard],
      lastModified: new Date(),
    };

    setDecks(decks.map(deck => 
      deck.id === updatedDeck.id ? updatedDeck : deck
    ));
    
    setActiveDeck(updatedDeck);

    // Aggiungi la categoria se è nuova
    if (card.category && !categories.includes(card.category)) {
      setCategories([...categories, card.category]);
    }
  };

  // Completa una sessione di studio
  const completeStudySession = (session: StudySession) => {
    setSessions([...sessions, session]);
    setActiveTab(0); // Torna alla scheda principale
  };

  // Esci dalla sessione di studio
  const exitStudy = () => {
    setActiveTab(0);
  };

  // Crea un nuovo deck
  const createNewDeck = () => {
    const newDeck: FlashcardDeck = {
      id: uuidv4(),
      name: `Nuovo Mazzo ${decks.length + 1}`,
      cards: [],
      createdAt: new Date(),
      lastModified: new Date(),
    };

    setDecks([...decks, newDeck]);
    setActiveDeck(newDeck);
    setActiveTab(0);
    setDrawerOpen(false);
  };

  // Imposta il deck attivo all'avvio
  useEffect(() => {
    if (decks.length > 0 && !activeDeck) {
      setActiveDeck(decks[0]);
    }
  }, [decks, activeDeck]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FlashCard App
            </Typography>
            {activeDeck && (
              <Typography variant="subtitle1" component="div">
                {activeDeck.name}
              </Typography>
            )}
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
          >
            <List>
              <ListItem button onClick={createNewDeck}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Nuovo Mazzo" />
              </ListItem>
            </List>
            <Divider />
            <List>
              {decks.map((deck) => (
                <ListItem 
                  button 
                  key={deck.id} 
                  onClick={() => selectDeck(deck)}
                  selected={activeDeck?.id === deck.id}
                >
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={deck.name} 
                    secondary={`${deck.cards.length} carte`} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
          {activeDeck ? (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="flashcard tabs">
                  <Tab label="Crea" />
                  <Tab label="Studia" />
                </Tabs>
              </Box>

              {activeTab === 0 && (
                <FlashcardForm 
                  onSave={addFlashcard} 
                  categories={categories}
                />
              )}

              {activeTab === 1 && (
                <FlashcardStudy 
                  deck={activeDeck} 
                  onComplete={completeStudySession} 
                  onExit={exitStudy}
                />
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
              <Typography variant="h5" gutterBottom>
                Benvenuto nell'App FlashCard!
              </Typography>
              <Typography variant="body1" paragraph>
                Seleziona un mazzo dal menu o crea un nuovo mazzo per iniziare.
              </Typography>
            </Box>
          )}
        </Container>

        <Box component="footer" sx={{ py: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            FlashCard App © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 