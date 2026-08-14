import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Paper,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { Html5Qrcode } from 'html5-qrcode';

// MOCK: dados iniciais fixos. No futuro, busque com useEffect ao montar a tela:
// fetch('http://localhost:8080/api/portaria/historico').then(r => r.json()).then(setHistorico)
// fetch('http://localhost:8080/api/portaria/moradores').then(r => r.json()).then(setMoradores)
const HISTORICO_GERAL_INICIAL = [
  { id: 1, convidado: 'Caio Merejoli', morador: 'Ana Silva', data: '13/08/2026', hora: '14:32', status: 'Liberado' },
  { id: 2, convidado: 'Raí', morador: 'Bruno Costa', data: '13/08/2026', hora: '10:05', status: 'Liberado' },
  { id: 3, convidado: 'Felipe', morador: 'Ana Silva', data: '12/08/2026', hora: '18:10', status: 'Liberado' },
  { id: 4, convidado: 'Token expirado', morador: '-', data: '11/08/2026', hora: '23:58', status: 'Negado' },
];

const MORADORES_INICIAIS = [
  { id: 1, nome: 'Ana Silva', apartamento: 'Apto 12' },
  { id: 2, nome: 'Bruno Costa', apartamento: 'Apto 45' },
  { id: 3, nome: 'Mariana Alves', apartamento: 'Apto 08' },
];

const LEITOR_ID = 'leitor-qrcode';

export default function PortariaDashboard() {
  const navigate = useNavigate();
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [historico, setHistorico] = useState(HISTORICO_GERAL_INICIAL);
  const [moradores] = useState(MORADORES_INICIAIS);
  const [dialogManualAberto, setDialogManualAberto] = useState(false);
  const [tokenManual, setTokenManual] = useState('');
  const leitorRef = useRef(null);

  const validarToken = (token) => {
    // MOCK: valida localmente e insere no histórico. No futuro, troque por:
    // const resp = await fetch(`http://localhost:8080/api/convites/validar?token=${encodeURIComponent(token)}`, { method: 'POST' });
    // const liberado = resp.status === 200;
    // const mensagem = await resp.text();

    const liberado = Math.random() > 0.3;
    setHistorico((atual) => [
      {
        id: Date.now(),
        convidado: token,
        morador: liberado ? moradores[Math.floor(Math.random() * moradores.length)].nome : '-',
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: liberado ? 'Liberado' : 'Negado',
      },
      ...atual,
    ]);
  };

  // Ativa/desativa a câmera sempre que "scannerAtivo" muda. A div alvo
  // (#leitor-qrcode) já existe no DOM antes deste efeito rodar.
  useEffect(() => {
    if (!scannerAtivo) return undefined;

    const html5QrCode = new Html5Qrcode(LEITOR_ID);
    leitorRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (textoDecodificado) => {
          validarToken(textoDecodificado);
          setScannerAtivo(false);
        },
        () => {
          // callback chamado a cada frame sem QR encontrado — ignorar
        }
      )
      .catch(() => {
        alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
        setScannerAtivo(false);
      });

    return () => {
      if (leitorRef.current) {
        leitorRef.current
          .stop()
          .then(() => leitorRef.current?.clear())
          .catch(() => {});
        leitorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannerAtivo]);

  const handleValidarManual = () => {
    if (!tokenManual.trim()) return;
    validarToken(tokenManual);
    setTokenManual('');
    setDialogManualAberto(false);
  };

  const handleBloqueioEmergencia = () => {
    // MOCK: aciona bloqueio local. No futuro, troque por:
    // await fetch('http://localhost:8080/api/portaria/bloqueio-emergencia', { method: 'POST' });
    setScannerAtivo(false);
    alert('Bloqueio de emergência acionado. Nenhum acesso será liberado até a portaria ser reaberta.');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Toolbar sx={{ gap: 1.5 }}>
          <SecurityOutlinedIcon sx={{ color: 'warning.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Painel da Portaria
          </Typography>
          <Tooltip title="Sair">
            <IconButton onClick={() => navigate('/')} sx={{ color: 'text.secondary' }}>
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Scanner de QR Code
                </Typography>

                <Box
                  id={LEITOR_ID}
                  sx={{
                    width: '100%',
                    minHeight: 260,
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: '#05070A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    border: '1px dashed rgba(255,255,255,0.16)',
                  }}
                >
                  {!scannerAtivo && <VideocamOutlinedIcon sx={{ fontSize: 56, color: 'text.secondary' }} />}
                </Box>

                {!scannerAtivo ? (
                  <Button variant="contained" size="large" fullWidth startIcon={<VideocamOutlinedIcon />} onClick={() => setScannerAtivo(true)}>
                    Ativar Scanner
                  </Button>
                ) : (
                  <Button variant="outlined" color="error" size="large" fullWidth onClick={() => setScannerAtivo(false)}>
                    Parar Scanner
                  </Button>
                )}
              </Paper>

              <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  A câmera do visitante não está funcionando?
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button variant="outlined" startIcon={<KeyboardOutlinedIcon />} onClick={() => setDialogManualAberto(true)} fullWidth>
                    Entrada Manual
                  </Button>
                  <Button variant="outlined" color="error" startIcon={<WarningAmberOutlinedIcon />} onClick={handleBloqueioEmergencia} fullWidth>
                    Bloqueio de Emergência
                  </Button>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ px: 1, pt: 1 }}>
                  Moradores Cadastrados
                </Typography>
                <List dense>
                  {moradores.map((m) => (
                    <ListItem key={m.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'rgba(45, 212, 224, 0.15)', color: 'primary.main' }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={m.nome} secondary={m.apartamento} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>
              Histórico Geral de Entradas
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Convidado</TableCell>
                    <TableCell>Morador</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historico.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{h.convidado}</TableCell>
                      <TableCell>{h.morador}</TableCell>
                      <TableCell>{h.data}</TableCell>
                      <TableCell>{h.hora}</TableCell>
                      <TableCell>
                        <Chip label={h.status} size="small" color={h.status === 'Liberado' ? 'success' : 'error'} variant="outlined" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={dialogManualAberto} onClose={() => setDialogManualAberto(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Entrada Manual</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Token do convidado"
            fullWidth
            value={tokenManual}
            onChange={(e) => setTokenManual(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogManualAberto(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleValidarManual}>
            Validar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}