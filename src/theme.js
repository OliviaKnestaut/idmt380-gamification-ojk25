import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: { main: '#e88936', contrastText: '#fff' },
    secondary: { main: '#132d46' },
    background: { default: '#f5f1ea', paper: '#fffdf9' },
    text: { primary: '#132d46', secondary: '#647384' },
  },
  typography: {
    fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
    h1: { fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', fontWeight: 800, lineHeight: 0.98, letterSpacing: '-.05em' },
    h3: { fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-.04em' },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 750 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
});
