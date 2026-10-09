import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mascote from '../assets/mascote.png';

/* -------------------------------------------------------------------------- */
/*  Validações                                                                */
/* -------------------------------------------------------------------------- */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = [
  { key: 'len', label: 'Mínimo de 8 caracteres', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'Uma letra maiúscula', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'Uma letra minúscula', test: (v) => /[a-z]/.test(v) },
  { key: 'num', label: 'Um número', test: (v) => /\d/.test(v) },
];

const validateEmail = (v) => EMAIL_REGEX.test(v);
const validatePassword = (v) => PASSWORD_RULES.every((r) => r.test(v));

/* -------------------------------------------------------------------------- */
/*  Estilos reutilizáveis                                                     */
/* -------------------------------------------------------------------------- */
const inputClass =
  'h-11 w-full rounded-lg border bg-brand-900 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-500 transition-colors duration-200 hover:border-white/20 focus:outline-none focus:ring-1';
const inputOk = 'border-white/10 focus:border-accent focus:ring-accent';
const inputErr = 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500';
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900';

/* -------------------------------------------------------------------------- */
/*  Campo de formulário                                                       */
/* -------------------------------------------------------------------------- */
function Field({ id, label, icon, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        <i
          className={`fas ${icon} pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-slate-500`}
        ></i>
        {children}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tela de Login / Cadastro                                                  */
/* -------------------------------------------------------------------------- */
export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const resetForm = () => {
    setName('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setEmailTouched(false);
  };

  const toggleMode = () => {
    setIsLogin((v) => !v);
    setError('');
    setNotice('');
    resetForm();
  };

  const passwordsMatch = password === confirmPassword;

  // No login basta ter e-mail válido e senha preenchida;
  // as regras de complexidade valem apenas no cadastro.
  const isFormValid = isLogin
    ? validateEmail(email) && password.length > 0
    : name.trim().length > 0 &&
      validateEmail(email) &&
      validatePassword(password) &&
      confirmPassword.length > 0 &&
      passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !isFormValid) return;

    setError('');
    setNotice('');
    setLoading(true);

    try {
      // TODO: substituir pela chamada real à API (Axios/Fetch -> Spring Boot)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (isLogin) {
        // TODO: salvar token/sessão e redirecionar conforme o perfil:
        // morador -> /admin | porteiro -> /portaria | convidado -> /dashboard
        navigate('/dashboard');
      } else {
        setIsLogin(true);
        resetForm();
        setNotice('Conta criada com sucesso. Faça login para continuar.');
      }
    } catch (err) {
      setError('Não foi possível concluir a operação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 font-sans text-slate-400 antialiased selection:bg-accent selection:text-white lg:grid lg:grid-cols-2">
      {/* ----------------------------- Formulário ----------------------------- */}
      <div className="flex min-h-screen flex-col justify-center px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-[400px]">
          {/* Marca */}
          <div className="mb-10 flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white">
              <img
                src={mascote}
                alt="Mascote MainPass"
                className="h-full w-full scale-125 object-cover"
                draggable="false"
              />
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-100">MainPass</span>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            {isLogin ? 'Entrar na sua conta' : 'Criar sua conta'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isLogin
              ? 'Use seu e-mail e senha para acessar o sistema.'
              : 'Preencha os dados abaixo para solicitar seu acesso.'}
          </p>

          {/* Avisos */}
          {notice && (
            <div
              role="status"
              className="mt-6 flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-3 text-sm text-emerald-300"
            >
              <i className="fas fa-circle-check mt-0.5 text-xs"></i>
              <span>{notice}</span>
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-300"
            >
              <i className="fas fa-circle-exclamation mt-0.5 text-xs"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {!isLogin && (
              <Field id="name" label="Nome completo" icon="fa-user">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Seu nome"
                  className={`${inputClass} ${inputOk}`}
                />
              </Field>
            )}

            <Field
              id="email"
              label="E-mail"
              icon="fa-envelope"
              error={emailTouched && email && !validateEmail(email) ? 'Insira um e-mail válido.' : ''}
            >
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                autoComplete="email"
                placeholder="voce@empresa.com"
                className={`${inputClass} ${
                  emailTouched && email && !validateEmail(email) ? inputErr : inputOk
                }`}
              />
            </Field>

            <div>
              <Field id="password" label="Senha" icon="fa-lock">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  className={`${inputClass} ${inputOk} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={`absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:text-slate-200 ${focusRing}`}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-[13px]`}></i>
                </button>
              </Field>

              {/* Checklist de requisitos (somente no cadastro) */}
              {!isLogin && password.length > 0 && (
                <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {PASSWORD_RULES.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <li
                        key={rule.key}
                        className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                          ok ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        <i className={`fas ${ok ? 'fa-circle-check' : 'fa-circle'} text-[10px]`}></i>
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {!isLogin && (
              <Field
                id="confirmPassword"
                label="Confirmar senha"
                icon="fa-lock"
                error={confirmPassword && !passwordsMatch ? 'As senhas não coincidem.' : ''}
              >
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`${inputClass} ${
                    confirmPassword && !passwordsMatch ? inputErr : inputOk
                  } pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className={`absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:text-slate-200 ${focusRing}`}
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-[13px]`}></i>
                </button>
              </Field>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-white shadow-card transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
            >
              {loading ? (
                <>
                  <i className="fas fa-circle-notch fa-spin text-xs"></i>
                  Processando...
                </>
              ) : isLogin ? (
                'Entrar'
              ) : (
                'Criar conta'
              )}
            </button>
          </form>

          {/* Alternar modo */}
          <p className="mt-8 text-center text-sm text-slate-400">
            {isLogin ? 'Ainda não tem acesso?' : 'Já possui uma conta?'}
            <button
              type="button"
              onClick={toggleMode}
              className={`ml-1.5 rounded font-medium text-accent-muted transition-colors duration-200 hover:text-indigo-300 ${focusRing}`}
            >
              {isLogin ? 'Criar conta' : 'Fazer login'}
            </button>
          </p>

          <p className="mt-10 text-center text-xs text-slate-600">
            MainPass © {new Date().getFullYear()} — Controle de Acesso
          </p>
        </div>
      </div>

      {/* ------------------------- Painel institucional ------------------------ */}
      <div className="relative hidden overflow-hidden border-l border-white/[0.08] bg-brand-800 lg:flex lg:items-center lg:justify-center">
        {/* Grade sutil (textura, sem brilho) */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
          }}
        ></div>

        <div className="relative z-10 w-full max-w-md px-10">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Controle de acesso para condomínios e empresas
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-slate-100">
            Cada entrada autorizada, registrada e rastreável.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Moradores, portaria e convidados em um único sistema, com QR Codes de validade definida e histórico completo.
          </p>

          <ul className="mt-10 space-y-6">
            {[
              {
                icon: 'fa-qrcode',
                title: 'QR Codes com validade',
                text: 'Cada acesso tem início e fim definidos, sem chaves ou senhas compartilhadas.',
              },
              {
                icon: 'fa-user-check',
                title: 'Aprovação pelo morador',
                text: 'Convites só liberam a entrada depois de confirmados pelo anfitrião.',
              },
              {
                icon: 'fa-clock-rotate-left',
                title: 'Histórico de acessos',
                text: 'Consulte quem entrou, quando e por qual portaria.',
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-brand-700 text-slate-300">
                  <i className={`fas ${item.icon} text-sm`}></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}