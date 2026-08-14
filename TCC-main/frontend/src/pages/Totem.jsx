import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, Stack, CircularProgress } from '@mui/material';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const API_URL = 'http://localhost:8080/api/convites/validar';

const ESTADO = {
  AGUARDANDO: 'aguardando',
  VALIDANDO: 'validando',
  LIBERADO: 'liberado',
  NEGADO: 'negado',
};

export default function Totem() {
  const [token, setToken] = useState('');
  const [estado, setEstado] = useState(ESTADO.AGUARDANDO);
  const [mensagem, setMensagem] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const resetar = () => {
    setEstado(ESTADO.AGUARDANDO);
    setMensagem('');
    setToken('');
  };

  const handleValidar = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setEstado(ESTADO.VALIDANDO);

    try {
      const response = await fetch(`${API_URL}?token=${encodeURIComponent(token)}`, {
        method: 'POST',
      });
      const texto = await response.text();

      if (response.status === 200) {
        setMensagem(texto);
        setEstado(ESTADO.LIBERADO);
      } else {
        setMensagem(texto);
        setEstado(ESTADO.NEGADO);
      }
    } catch (err) {
      setMensagem('Não foi possível conectar ao servidor.');
      setEstado(ESTADO.NEGADO);
    }

    timeoutRef.current = setTimeout(resetar, 4000);
  };

  const corFundo = {
    [ESTADO.AGUARDANDO]: 'background.default',
    [ESTADO.VALIDANDO]: 'background.default',
    [ESTADO.LIBERADO]: '#1B8F4C',
    [ESTADO.NEGADO]: '#C62828',
  };

  const isResultado = estado === ESTADO.LIBERADO || estado === ESTADO.NEGADO;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        textAlign: 'center',
        bgcolor: corFundo[estado],
        transition: 'background-color 0.4s ease',
      }}
    >
      {!isResultado ? (
        <>
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              mb: 4,
              animation: estado === ESTADO.VALIDANDO ? 'none' : 'pulso 2.2s infinite',
              '@keyframes pulso': {
                '0%': { boxShadow: '0 0 0 0 rgba(45, 212, 224, 0.35)' },
                '70%': { boxShadow: '0 0 0 24px rgba(45, 212, 224, 0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(45, 212, 224, 0)' },
              },
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            {estado === ESTADO.VALIDANDO ? (
              <CircularProgress size={48} color="inherit" />
            ) : (
              <VideocamOutlinedIcon sx={{ fontSize: 64 }} />
            )}
          </Box>

          <Typography variant="h4" gutterBottom>
            {estado === ESTADO.VALIDANDO ? 'Validando...' : 'Aguardando Leitura do QR Code...'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
            Aproxime o QR Code do visitante da câmera.
          </Typography>

          <Box component="form" onSubmit={handleValidar} sx={{ width: '100%', maxWidth: 360 }}>
            <Stack spacing={2}>
              <TextField
                label="Token do QR Code"
                fullWidth
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={estado === ESTADO.VALIDANDO}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={estado === ESTADO.VALIDANDO}
              >
                Validar Token
              </Button>
            </Stack>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              mb: 4,
            }}
          >
            {estado === ESTADO.LIBERADO ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 72 }} />
            ) : (
              <HighlightOffIcon sx={{ fontSize: 72 }} />
            )}
          </Box>
          <Typography variant="h3" sx={{ color: '#fff', mb: 1 }}>
            {estado === ESTADO.LIBERADO ? 'ACESSO LIBERADO' : 'ACESSO NEGADO'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
            {mensagem}
          </Typography>
        </>
      )}
    </Box>
  );
}