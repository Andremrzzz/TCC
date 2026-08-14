import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

import { QRCodeCanvas } from 'qrcode.react';

const CONVITE_MOCK = {
  id: 1,
  visitanteNome: 'Felipe',
  token: 'token-xyz',
  tipoAcesso: 'Uso Único',
  dataExpiracao: '2026-12-31T20:00:00',
  link: 'https://sistema-acesso.com/convite/token-xyz',
  ativo: true,
};

function formatarDataExpiracao(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(data));
}

export default function ConvidadoDashboard() {
  const navigate = useNavigate();
  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [erroAoCopiar, setErroAoCopiar] = useState(false);

  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(CONVITE_MOCK.link);
      setErroAoCopiar(false);
      setSnackbarAberto(true);
    } catch (error) {
      console.error('Não foi possível copiar o link:', error);
      setErroAoCopiar(true);
      setSnackbarAberto(true);
    }
  };

  const handleFecharSnackbar = (_, motivo) => {
    if (motivo === 'clickaway') return;
    setSnackbarAberto(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <QrCode2Icon sx={{ color: 'primary.main' }} />

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Meu Convite
          </Typography>

          <Tooltip title="Sair">
            <IconButton
              onClick={() => navigate('/')}
              sx={{ color: 'text.secondary' }}
            >
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          py: { xs: 3, sm: 5 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: { xs: 2.5, sm: 4 },
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Box>
              <Typography variant="h5" gutterBottom>
                Olá, {CONVITE_MOCK.visitanteNome}!
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Apresente este QR Code na portaria para validar seu acesso.
              </Typography>
            </Box>

            <Chip
              label={CONVITE_MOCK.ativo ? 'Convite ativo' : 'Convite expirado'}
              color={CONVITE_MOCK.ativo ? 'success' : 'error'}
              variant="outlined"
            />

            <Box
              sx={{
                width: 'fit-content',
                maxWidth: '100%',
                p: { xs: 1.5, sm: 2 },
                bgcolor: '#fff',
                borderRadius: 2.5,
                boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
              }}
            >
              <QRCodeCanvas
                value={CONVITE_MOCK.link}
                size={220}
                level="H"
                includeMargin
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  maxWidth: 220,
                }}
              />
            </Box>

            <Paper
              variant="outlined"
              sx={{
                width: '100%',
                p: 2,
                bgcolor: 'rgba(144, 202, 249, 0.06)',
                borderColor: 'primary.dark',
                borderRadius: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 0.75 }}
              >
                <EventAvailableOutlinedIcon
                  fontSize="small"
                  color="primary"
                />

                <Typography variant="subtitle2" color="primary.main">
                  Data e Hora de Expiração
                </Typography>
              </Stack>

              <Typography variant="body1" fontWeight={600}>
                {formatarDataExpiracao(CONVITE_MOCK.dataExpiracao)}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.75 }}
              >
                Tipo de acesso: {CONVITE_MOCK.tipoAcesso}
              </Typography>
            </Paper>

            <Box sx={{ width: '100%', textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Link do QR Code
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems="stretch"
              >
                <TextField
                  value={CONVITE_MOCK.link}
                  fullWidth
                  aria-label="Link do QR Code"
                  slotProps={{
                    input: {
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkOutlinedIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<ContentCopyOutlinedIcon />}
                  onClick={handleCopiarLink}
                  sx={{
                    minWidth: { sm: 150 },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Copiar Link
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>

      <Snackbar
        open={snackbarAberto}
        autoHideDuration={3500}
        onClose={handleFecharSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleFecharSnackbar}
          severity={erroAoCopiar ? 'error' : 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {erroAoCopiar
            ? 'Não foi possível copiar o link.'
            : 'Link copiado com sucesso!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}