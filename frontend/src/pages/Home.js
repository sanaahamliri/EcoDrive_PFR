import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import GroupIcon from '@mui/icons-material/Group';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Voyagez Écologique au Maroc
          </Typography>
          <Typography variant="h5" paragraph>
            Rejoignez la communauté de covoiturage la plus verte du Maroc
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/search')}
            sx={{ mt: 2 }}
          >
            Rechercher un Trajet
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              <Typography variant="h5" gutterBottom>
                Trajets Économiques
              </Typography>
              <Typography>
                Partagez les frais de transport et économisez sur vos déplacements
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <EmojiNatureIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              <Typography variant="h5" gutterBottom>
                Écologique
              </Typography>
              <Typography>
                Réduisez votre empreinte carbone en partageant votre trajet
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <GroupIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              <Typography variant="h5" gutterBottom>
                Communauté
              </Typography>
              <Typography>
                Rencontrez des personnes partageant les mêmes valeurs
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
