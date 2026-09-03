import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Login from './pages/Login';
import ConvidadoDashboard from './pages/ConvidadoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PortariaDashboard from './pages/PortariaDashboard';

// --- Autenticação mock ---
// Guardado apenas em memória (Context). Ao recarregar a página o estado se
// perde, pois ainda não há token/sessão persistida. Quando plugar o Spring
// Boot, troque por um Context que valide um JWT vindo do backend.
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function RotaProtegida({ perfilPermitido, children }) {
  const { usuario } = useAuth();
  if (!usuario || usuario.perfil !== perfilPermitido) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#10131A',
      paper: '#1A1F2B',
    },
    primary: {
      main: '#2DD4E0',
      contrastText: '#0A0E14',
    },
    secondary: {
      main: '#8B93A7',
    },
    success: {
      main: '#1B8F4C',
    },
    error: {
      main: '#C62828',
    },
    warning: {
      main: '#F5A623',
    },
    text: {
      primary: '#E8EAF0',
      secondary: '#8B93A7',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h1: { fontFamily: "'Space Grotesk', sans-serif" },
    h2: { fontFamily: "'Space Grotesk', sans-serif" },
    h3: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ usuario, setUsuario }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RotaProtegida perfilPermitido="morador">
                  <AdminDashboard />
                </RotaProtegida>
              }
            />
            <Route
              path="/portaria"
              element={
                <RotaProtegida perfilPermitido="portaria">
                  <PortariaDashboard />
                </RotaProtegida>
              }
            />
            <Route
              path="/convidado"
              element={
                <RotaProtegida perfilPermitido="convidado">
                  <ConvidadoDashboard />
                </RotaProtegida>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}