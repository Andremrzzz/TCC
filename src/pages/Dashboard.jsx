import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

export default function Dashboard() {
  const navigate = useNavigate();

  const acoes = [
    {
      titulo: 'Gerar Novo Convite',
      descricao: 'Crie um QR Code de acesso temporário para um visitante.',
      icone: <QrCode2Icon sx={{ fontSize: 40 }} />,
      rota: '/novo-acesso',
    },
    {
      titulo: 'Totem de Portaria',
      descricao: 'Abra a leitura de QR Code para liberar o acesso.',
      icone: <VideocamOutlinedIcon sx={{ fontSize: 40 }} />,
      rota: '/totem',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <ShieldOutlinedIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Controle de Acesso MVC
          </Typography>
          <Tooltip title="Sair">
            <IconButton onClick={() => navigate('/')} sx={{ color: 'text.secondary' }}>
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" gutterBottom>
          O que você precisa fazer?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          Escolha uma opção para continuar.
        </Typography>

        <Grid container spacing={3}>
          {acoes.map((acao) => (
            <Grid item xs={12} sm={6} key={acao.rota}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  '&:hover': { borderColor: 'primary.main', transform: 'translateY(-4px)' },
                }}
              >
                <CardActionArea onClick={() => navigate(acao.rota)} sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(45, 212, 224, 0.1)',
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      {acao.icone}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {acao.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {acao.descricao}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}