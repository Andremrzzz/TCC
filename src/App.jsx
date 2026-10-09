import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';

/**
 * Tela provisória para páginas ainda não desenvolvidas.
 * Segue a mesma linguagem visual do restante do sistema.
 */
function Placeholder({ title, subtitle, icon }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-white/[0.08] bg-brand-800 px-8 py-10 text-center shadow-card">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.08] bg-brand-700 text-slate-300">
          <i className={`fas ${icon}`}></i>
        </div>

        <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-100">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded text-sm font-medium text-accent-muted transition-colors duration-200 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <i className="fas fa-arrow-left text-xs"></i>
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <Placeholder
      title="Página não encontrada"
      subtitle="O endereço que você tentou acessar não existe."
      icon="fa-triangle-exclamation"
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-900 font-sans text-slate-400 antialiased">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Rota antiga: redireciona para o novo dashboard */}
          <Route path="/convidado" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/admin"
            element={
              <Placeholder
                title="Painel do Morador / Admin"
                subtitle="Em desenvolvimento"
                icon="fa-user-shield"
              />
            }
          />
          <Route
            path="/portaria"
            element={
              <Placeholder
                title="Painel da Portaria"
                subtitle="Em desenvolvimento"
                icon="fa-door-open"
              />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}