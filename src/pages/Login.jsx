import React, { useState } from 'react';
import mascote from '../assets/mascote.png';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPassword('');
    setConfirmPassword('');
    setName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const validatePassword = (val) => {
    // Mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número.
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(val);
  };

  const validateConfirmPassword = () => {
    return password === confirmPassword;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulando chamada na API (Substituir pelo Axios/Fetch para o Spring Boot)
    setTimeout(() => {
      setLoading(false);
      alert(isLogin ? 'Login efetuado com sucesso!' : 'Conta criada com sucesso!');
    }, 1500);
  };

  const isFormValid = isLogin
    ? email && validateEmail(email) && password && validatePassword(password)
    : name && email && validateEmail(email) && password && validatePassword(password) && confirmPassword && validateConfirmPassword();

  return (
    <div className="min-h-screen relative overflow-hidden flex bg-brand-900 text-slate-300 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Efeitos de Luz no Fundo (Background Glow) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Lado Esquerdo - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-md">
          
          {/* Container Glassmorphism */}
          <div className="bg-brand-800/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8">
            
            {/* Cabeçalho / Logo */}
<div className="text-center mb-8">
  <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-3xl mb-4 overflow-hidden shadow-[0_8px_30px_rgba(99,102,241,0.35)] ring-4 ring-indigo-500/30">
    <img
  src={mascote}
  alt="Mascote MainPass"
  className="w-32 h-32 object-contain mx-auto mb-4 drop-shadow-[0_8px_20px_rgba(99,102,241,0.45)]"
  draggable="false"
/>
  </div>
  <h2 className="text-3xl font-extrabold text-white tracking-tight">
    Main<span className="text-indigo-400">Pass</span>
  </h2>
  <p className="text-slate-400 mt-2 text-sm">
    {isLogin ? 'Faça login para acessar o sistema' : 'Crie sua conta de acesso'}
  </p>
</div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} noValidate>
              
              {/* Campo Nome (Apenas Registro) */}
              {!isLogin && (
                <div className="mb-5 transition-opacity duration-300">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white placeholder-slate-500 outline-none"
                      placeholder="Seu nome"
                    />
                    <i className="fas fa-user absolute right-4 top-3.5 text-slate-500"></i>
                  </div>
                </div>
              )}

              {/* Campo E-mail */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-300 mb-2">E-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white placeholder-slate-500 outline-none"
                    placeholder="seu@email.com"
                  />
                  <i className="fas fa-envelope absolute right-4 top-3.5 text-slate-500"></i>
                </div>
                {email && !validateEmail(email) && (
                  <p className="mt-1.5 text-xs text-red-400">Insira um e-mail válido.</p>
                )}
              </div>

              {/* Campo Senha */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white placeholder-slate-500 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    tabIndex="-1"
                    className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={showPassword ? 'fas fa-eye-slash w-5 h-5' : 'fas fa-eye w-5 h-5'}></i>
                  </button>
                </div>
                {password && !validatePassword(password) && (
                  <p className="mt-1.5 text-xs text-red-400">
                    Mínimo 8 caracteres, incluindo maiúscula, minúscula e número.
                  </p>
                )}
              </div>

              {/* Campo Confirmar Senha (Apenas Registro) */}
              {!isLogin && (
                <div className="mb-6 transition-opacity duration-300">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar Senha</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white placeholder-slate-500 outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      tabIndex="-1"
                      className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors p-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={showConfirmPassword ? 'fas fa-eye-slash w-5 h-5' : 'fas fa-eye w-5 h-5'}></i>
                    </button>
                  </div>
                  {confirmPassword && !validateConfirmPassword() && (
                    <p className="mt-1.5 text-xs text-red-400">As senhas não coincidem.</p>
                  )}
                </div>
              )}

              {/* Botão Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:from-indigo-400 hover:to-indigo-500 focus:ring-4 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <span className="inline-flex items-center">
                    <i className="fas fa-circle-notch fa-spin -ml-1 mr-2"></i>
                    Processando...
                  </span>
                ) : (
                  <span>{isLogin ? 'Entrar no Sistema' : 'Criar Conta'}</span>
                )}
              </button>

              {/* Alternar Form */}
              <p className="mt-6 text-center text-sm text-slate-400">
                <span>{isLogin ? 'Não possui acesso?' : 'Já tem uma conta?'}</span>
                <button
                  type="button"
                  className="ml-1 text-indigo-400 hover:text-indigo-300 font-semibold focus:outline-none transition-colors"
                  onClick={toggleMode}
                >
                  <span>{isLogin ? 'Criar conta' : 'Fazer login'}</span>
                </button>
              </p>
            </form>
          </div>

          {/* Rodapé */}
          <p className="text-center text-xs text-slate-600 mt-6">
            MainPass © {new Date().getFullYear()} — Controle de Acesso
          </p>

        </div>
      </div>

      {/* Lado Direito - Imagem de Fundo (Moderna/Tech) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80')" }}
        ></div>
        {/* Overlay Degradê */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-brand-900/60 to-indigo-900/80"></div>
        
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-white border-l-4 border-indigo-500 pl-8">
            <h2 className="text-4xl font-bold mb-4 leading-tight">Segurança e Agilidade em um só lugar.</h2>
            <p className="text-lg text-slate-300">Gerencie a entrada de moradores, portarias e convidados através de um sistema unificado e tecnologia de aproximação.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}