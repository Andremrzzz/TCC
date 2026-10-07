import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';


/**
 * Componente reutilizável para telas ainda não desenvolvidas.
 * Mantém a identidade visual do MainPass (dark mode + índigo).
 */
function Placeholder({ title, subtitle, icon }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-8">
      {/* Efeitos de luz no fundo (mesmo padrão do Login) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 text-center bg-brand-800/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] px-10 py-12 max-w-md w-full">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full mb-4 shadow-[0_8px_20px_rgba(99,102,241,0.35)]">
          <i className={`fas ${icon} text-white text-2xl`}></i>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">{title}</h1>
        <p className="text-slate-400 mt-2 text-sm">{subtitle}</p>

        <Link
          to="/"
          className="inline-flex items-center mt-8 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}

/**
 * Tela 404 para rotas inexistentes.
 */
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
      <div className="min-h-screen bg-brand-900 text-slate-300 font-sans antialiased">
        <Routes>
          <Route path="/" element={<Login />} />

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

          <Route
            path="/convidado"
            element={
              <Placeholder
                title="Painel do Convidado"
                subtitle="Em desenvolvimento"
                icon="fa-qrcode"
              />
            }
          />

          {/* Rota coringa: qualquer URL não mapeada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}