import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#FF8C2F', light: '#FFB86C', dark: '#E67923', contrastText: '#fff' },
    background: { default: '#F9FAFB', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#475569' },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif' },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #F1F5F9',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 4,
        }
      }
    }
  },
});

export default theme;
