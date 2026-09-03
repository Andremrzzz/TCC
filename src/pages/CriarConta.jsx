import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Tabs,
  Tab,
  Link,
  InputAdornment,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

// Mesma constante do Login.jsx. Para evitar duplicação, considere mover
// PERFIS para um arquivo compartilhado (ex: src/constants/perfis.js).
const PERFIS = [
  { valor: 'morador', label: 'Sou Morador', rota: '/admin', icone: <ApartmentOutlinedIcon fontSize="small" /> },
  { valor: 'portaria', label: 'Sou Portaria', rota: '/portaria', icone: <SecurityOutlinedIcon fontSize="small" /> },
  { valor: 'convidado', label: 'Sou Convidado', rota: '/convidado', icone: <PersonOutlineIcon fontSize="small" /> },
];

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 2,
    transition: 'all 0.3s',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      '& fieldset': { borderColor: '#818CF8', borderWidth: '1px' },
    },
  },
};

export default function CriarConta() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfilIndex, setPerfilIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastrando:', { nome, email, senha, perfil: PERFIS[perfilIndex].valor });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        backgroundColor: '#0B1121',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #152340 0%, #0B1121 100%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 4, md: 5 },
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Stack spacing={0.5} alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Criar Nova Conta
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' }}>
            Preencha os dados abaixo para se cadastrar.
          </Typography>
        </Stack>

        <Tabs
          value={perfilIndex}
          onChange={(e, novoValor) => setPerfilIndex(novoValor)}
          variant="fullWidth"
          sx={{
            mb: 3,
            minHeight: 40,
            '& .MuiTabs-indicator': { backgroundColor: '#818CF8' },
            '& .MuiTab-root': {
              minHeight: 40,
              fontSize: '0.72rem',
              px: 1,
              color: 'rgba(255, 255, 255, 0.5)',
              '&.Mui-selected': { color: '#818CF8' },
            },
          }}
        >
          {PERFIS.map((perfil) => (
            <Tab key={perfil.valor} icon={perfil.icone} iconPosition="start" label={perfil.label} />
          ))}
        </Tabs>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Nome"
              fullWidth
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.6)' } }}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.6)' } }}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Senha"
              type="password"
              fullWidth
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.6)' } }}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                },
              }}
            >
              Cadastrar
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', mt: 1 }}>
              Já tem uma conta?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/')}
                sx={{
                  color: '#818CF8',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Faça Login
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}