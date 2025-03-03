import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" color="text.secondary" align="center">
          © {new Date().getFullYear()} EcoDrive. Tous droits réservés.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Créé avec ❤️ pour un transport plus écologique au Maroc - '}
          <Link color="inherit" href="/about">
            À propos
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
