import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Search from './pages/Search';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Vert pour l'aspect écologique
    },
    secondary: {
      main: '#1976D2', // Bleu pour la confiance
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
