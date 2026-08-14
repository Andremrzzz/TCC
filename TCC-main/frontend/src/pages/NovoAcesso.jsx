import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ReplayIcon from '@mui/icons-material/Replay';

const API_URL = 'http://localhost:8080/api/convites/gerar';

export default function NovoAcesso() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [convite, setConvite] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleGerar = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setCarregando(true);
    setErro('');

    try {
      const response = await fetch(`${API_URL}?nome=${encodeURIComponent(nome)}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar convite');
      }

      const data = await response.json();
      setConvite(data);
    } catch (err) {
      setErro('Falha ao conectar com o servidor. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleReiniciar = () => {
    setConvite(null);
    setNome('');
    setErro('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        position: 'relative',
      }}
    >
      <IconButton
        onClick={() => navigate('/dashboard')}
        sx={{ position: 'absolute', top: 20, left: 20, color: 'text.secondary' }}
      >
        <ArrowBackIcon />
      </IconButton>

      {!convite ? (
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 4,
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3,
          }}
        >
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(45, 212, 224, 0.1)',
                color: 'primary.main',
                mb: 1,
              }}
            >
              <PersonAddAltIcon />
            </Box>
            <Typography variant="h5">Novo Convite</Typography>
            <Typography variant="body2" color="text.secondary">
              Gere um QR Code de acesso válido por 5 minutos.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleGerar}>
            <Stack spacing={2.5}>
              <TextField
                label="Nome do Visitante"
                fullWidth
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoFocus
              />
              {erro && <Alert severity="error">{erro}</Alert>}
              <Button type="submit" variant="contained" size="large" fullWidth disabled={carregando}>
                {carregando ? <CircularProgress size={24} color="inherit" /> : 'Gerar Convite'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 380,
            p: 4,
            textAlign: 'center',
            border: '1px dashed rgba(255,255,255,0.24)',
            borderRadius: 3,
          }}
        >
          <Typography variant="overline" color="text.secondary">
            Crachá de acesso
          </Typography>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {convite.visitanteNome}
          </Typography>

          <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#fff', borderRadius: 2, mb: 2 }}>
            <QRCodeCanvas value={convite.token} size={200} />
          </Box>

          <Typography
            variant="caption"
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'text.secondary',
              display: 'block',
              wordBreak: 'break-all',
              mb: 2,
            }}
          >
            {convite.token}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Válido por 5 minutos. Apresente este código na portaria.
          </Typography>

          <Button variant="outlined" startIcon={<ReplayIcon />} onClick={handleReiniciar} fullWidth>
            Gerar outro convite
          </Button>
        </Paper>
      )}
    </Box>
  );
}