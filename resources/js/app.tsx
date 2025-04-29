import 'src/global.css';
import Fab from '@mui/material/Fab';
import { Router } from './routes/sections';
import { useScrollToTop } from './hooks/use-scroll-to-top';
import { ThemeProvider } from './theme/theme-provider';
import { Iconify } from './components/iconify';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}
