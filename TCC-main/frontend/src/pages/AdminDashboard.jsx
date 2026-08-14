import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Paper,
  TextField,
  InputAdornment,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

import { QRCodeCanvas } from 'qrcode.react';

const CONVIDADOS_INICIAIS = [
  {
    id: 1,
    nome: 'Felipe',
    documento: '123.456.789-00',
    token: 'A1B2-C3D4',
    status: 'Ativo',
    tipoAcesso: 'Uso Único',
    dataInicio: '14/08/2026',
    dataFim: '14/08/2026',
    horaInicio: '08:00',
    horaFim: '20:00',
  },
  {
    id: 2,
    nome: 'Raí',
    documento: '',
    token: 'E5F6-G7H8',
    status: 'Ativo',
    tipoAcesso: 'Múltiplos Acessos',
    dataInicio: '14/08/2026',
    dataFim: '16/08/2026',
    horaInicio: '09:00',
    horaFim: '18:00',
  },
];

const HISTORICO_INICIAL = [
  { id: 1, nome: 'Caio Merejoli', data: '13/08/2026', hora: '14:32' },
  { id: 2, nome: 'Felipe', data: '10/08/2026', hora: '09:15' },
];

const TIPOS_ACESSO = {
  unico: 'Uso Único',
  multiplo: 'Múltiplos Acessos',
  permanente: 'Permanente',
};

function formatarDataParaInput(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function formatarDataParaResumo(data) {
  if (!data) return '--/--/----';

  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function criarFormularioInicial() {
  const hoje = formatarDataParaInput(new Date());

  return {
    nome: '',
    documento: '',
    tipoAcesso: 'unico',
    dataInicio: hoje,
    dataFim: hoje,
    horaInicio: '08:00',
    horaFim: '20:00',
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState(criarFormularioInicial);
  const [convidados, setConvidados] = useState(CONVIDADOS_INICIAIS);
  const [historico] = useState(HISTORICO_INICIAL);
  const [convidadoEmFoco, setConvidadoEmFoco] = useState(null);

  const atualizarCampo = (campo) => (event) => {
    const valor = event.target.value;

    setFormulario((atual) => {
      if (
        campo === 'dataInicio' &&
        atual.dataFim &&
        valor > atual.dataFim
      ) {
        return {
          ...atual,
          dataInicio: valor,
          dataFim: valor,
        };
      }

      return {
        ...atual,
        [campo]: valor,
      };
    });
  };

  const handleTipoAcesso = (_, novoTipo) => {
    if (novoTipo !== null) {
      setFormulario((atual) => ({
        ...atual,
        tipoAcesso: novoTipo,
      }));
    }
  };

  const handleGerarConvite = (event) => {
    event.preventDefault();

    const nome = formulario.nome.trim();
    if (!nome) return;

    const token = Math.random()
      .toString(36)
      .slice(2, 10)
      .toUpperCase();

    const novoConvidado = {
      id: Date.now(),
      nome,
      documento: formulario.documento.trim(),
      token,
      status: 'Ativo',
      tipoAcesso: TIPOS_ACESSO[formulario.tipoAcesso],
      dataInicio: formatarDataParaResumo(formulario.dataInicio),
      dataFim: formatarDataParaResumo(formulario.dataFim),
      horaInicio: formulario.horaInicio,
      horaFim: formulario.horaFim,
    };

    // Futuramente, substitua o mock pela chamada ao Spring Boot:
    //
    // const resposta = await fetch('http://localhost:8080/api/convites', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formulario),
    // });
    //
    // const novoConvidado = await resposta.json();

    setConvidados((atual) => [novoConvidado, ...atual]);
    setConvidadoEmFoco(novoConvidado);
    setFormulario(criarFormularioInicial());
  };

  const handleRevogar = (id) => {
    // Futuramente:
    // await fetch(`http://localhost:8080/api/convites/${id}/revogar`, {
    //   method: 'PATCH',
    // });

    setConvidados((atual) =>
      atual.filter((convidado) => convidado.id !== id),
    );
  };

  const resumoConvite = [
    formulario.nome.trim() || 'Visitante',
    TIPOS_ACESSO[formulario.tipoAcesso],
    `${formatarDataParaResumo(formulario.dataInicio)} até ${formatarDataParaResumo(
      formulario.dataFim,
    )}`,
    `${formulario.horaInicio || '--:--'}–${formulario.horaFim || '--:--'}`,
  ].join(' • ');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
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
          <ApartmentOutlinedIcon sx={{ color: 'primary.main' }} />

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Painel do Morador
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

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={5}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <PersonAddAltIcon sx={{ color: 'primary.main' }} />

                <Box>
                  <Typography variant="h6">Novo Convidado</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Defina os dados e o período de acesso.
                  </Typography>
                </Box>
              </Stack>

              <Box component="form" onSubmit={handleGerarConvite}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Nome Completo do Visitante"
                    value={formulario.nome}
                    onChange={atualizarCampo('nome')}
                    required
                    fullWidth
                    autoComplete="name"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="RG ou CPF (opcional)"
                    value={formulario.documento}
                    onChange={atualizarCampo('documento')}
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlinedIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Box>
                    <Typography
                      component="label"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 1 }}
                    >
                      Tipo de Acesso
                    </Typography>

                    <ToggleButtonGroup
                      value={formulario.tipoAcesso}
                      onChange={handleTipoAcesso}
                      exclusive
                      fullWidth
                      color="primary"
                      aria-label="Tipo de acesso"
                      sx={{
                        width: '100%',
                        '& .MuiToggleButton-root': {
                          flex: 1,
                          minWidth: 0,
                          px: { xs: 0.75, sm: 1.5 },
                          fontSize: { xs: '0.68rem', sm: '0.78rem' },
                          lineHeight: 1.25,
                          whiteSpace: 'normal',
                        },
                      }}
                    >
                      <ToggleButton value="unico">
                        Uso Único
                      </ToggleButton>

                      <ToggleButton value="multiplo">
                        Múltiplos Acessos
                      </ToggleButton>

                      <ToggleButton value="permanente">
                        Permanente
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Data de Início"
                        type="date"
                        value={formulario.dataInicio}
                        onChange={atualizarCampo('dataInicio')}
                        required
                        fullWidth
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Data de Fim"
                        type="date"
                        value={formulario.dataFim}
                        onChange={atualizarCampo('dataFim')}
                        required
                        fullWidth
                        slotProps={{
                          inputLabel: { shrink: true },
                          htmlInput: {
                            min: formulario.dataInicio,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Hora de Início"
                        type="time"
                        value={formulario.horaInicio}
                        onChange={atualizarCampo('horaInicio')}
                        required
                        fullWidth
                        slotProps={{
                          inputLabel: { shrink: true },
                          htmlInput: {
                            step: 300,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Hora de Fim"
                        type="time"
                        value={formulario.horaFim}
                        onChange={atualizarCampo('horaFim')}
                        required
                        fullWidth
                        slotProps={{
                          inputLabel: { shrink: true },
                          htmlInput: {
                            step: 300,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: 'rgba(144, 202, 249, 0.06)',
                      borderColor: 'primary.dark',
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="primary.main"
                      sx={{ mb: 0.75 }}
                    >
                      Resumo do convite
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {resumoConvite}
                    </Typography>
                  </Paper>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<QrCode2Icon />}
                    sx={{
                      minHeight: 48,
                      fontWeight: 700,
                    }}
                  >
                    Salvar e gerar código
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Convidados Ativos
                </Typography>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Token</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Ações</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {convidados.map((convidado) => (
                        <TableRow key={convidado.id} hover>
                          <TableCell>{convidado.nome}</TableCell>

                          <TableCell>{convidado.tipoAcesso}</TableCell>

                          <TableCell
                            sx={{
                              fontFamily: "'JetBrains Mono', monospace",
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {convidado.token}
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={convidado.status}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </TableCell>

                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            <Tooltip title="Ver QR Code">
                              <IconButton
                                size="small"
                                sx={{ color: 'primary.main' }}
                                onClick={() =>
                                  setConvidadoEmFoco(convidado)
                                }
                              >
                                <QrCode2Icon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Revogar acesso">
                              <IconButton
                                size="small"
                                sx={{ color: 'error.main' }}
                                onClick={() =>
                                  handleRevogar(convidado.id)
                                }
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}

                      {convidados.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="center"
                            sx={{ color: 'text.secondary', py: 4 }}
                          >
                            Nenhum convidado ativo no momento.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Histórico de Entradas
                </Typography>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Hora</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {historico.map((registro) => (
                        <TableRow key={registro.id} hover>
                          <TableCell>{registro.nome}</TableCell>
                          <TableCell>{registro.data}</TableCell>
                          <TableCell>{registro.hora}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={Boolean(convidadoEmFoco)}
        onClose={() => setConvidadoEmFoco(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          QR Code de {convidadoEmFoco?.nome}

          <IconButton
            onClick={() => setConvidadoEmFoco(null)}
            size="small"
            aria-label="Fechar"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            pb: 4,
          }}
        >
          <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
            {convidadoEmFoco && (
              <QRCodeCanvas
                value={`https://sistema-acesso.com/convite/${convidadoEmFoco.token}`}
                size={200}
                level="H"
              />
            )}
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {convidadoEmFoco?.token}
          </Typography>

          {convidadoEmFoco && (
            <Typography variant="body2" color="text.secondary" align="center">
              {convidadoEmFoco.tipoAcesso}
              <br />
              {convidadoEmFoco.dataInicio} até {convidadoEmFoco.dataFim}
              <br />
              {convidadoEmFoco.horaInicio}–{convidadoEmFoco.horaFim}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}