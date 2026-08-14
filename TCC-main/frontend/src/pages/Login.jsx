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
  InputAdornment,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import { useAuth } from '../App';

const PERFIS = [
  { valor: 'morador', label: 'Sou Morador', rota: '/admin', icone: <ApartmentOutlinedIcon fontSize="small" /> },
  { valor: 'portaria', label: 'Sou Portaria', rota: '/portaria', icone: <SecurityOutlinedIcon fontSize="small" /> },
  { valor: 'convidado', label: 'Sou Convidado', rota: '/convidado', icone: <PersonOutlineIcon fontSize="small" /> },
];

export default function Login() {
  const navigate = useNavigate();
  const { setUsuario } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfilIndex, setPerfilIndex] = useState(0);

  const perfilAtual = PERFIS[perfilIndex];

  const handleSubmit = (e) => {
    e.preventDefault();

    // MOCK: login simulado, sem chamada real. No futuro, troque por:
    // const resp = await fetch('http://localhost:8080/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, senha }),
    // });
    // const dados = await resp.json(); // { nome, perfil, token }
    // setUsuario(dados);

    setUsuario({
      nome: email.split('@')[0] || 'Usuário',
      email,
      perfil: perfilAtual.valor,
    });

    navigate(perfilAtual.rota);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background: 'radial-gradient(circle at 50% 0%, #1A2230 0%, #10131A 60%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderTop: '3px solid',
          borderColor: 'primary.main',
          borderRadius: 3,
          boxShadow: '0 0 40px rgba(45, 212, 224, 0.08)',
        }}
      >
        <Stack spacing={0.5} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5">Controle de Acesso</Typography>
          <Typography variant="body2" color="text.secondary">
            Entre de acordo com o seu perfil
          </Typography>
        </Stack>

        <Tabs
          value={perfilIndex}
          onChange={(e, novoValor) => setPerfilIndex(novoValor)}
          variant="fullWidth"
          sx={{ mb: 3, minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontSize: '0.72rem', px: 1 } }}
        >
          {PERFIS.map((perfil) => (
            <Tab key={perfil.valor} icon={perfil.icone} iconPosition="start" label={perfil.label} />
          ))}
        </Tabs>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" />
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1 }}>
              Entrar como {perfilAtual.label.replace('Sou ', '')}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}