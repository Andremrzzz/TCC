import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

/* -------------------------------------------------------------------------- */
/*  Dados de exemplo (substituir pela resposta da API do Spring Boot)         */
/* -------------------------------------------------------------------------- */
const H = 60 * 60 * 1000;
const BASE = Date.now();

const MOCK_PASSES = [
  {
    id: 'PS-1042',
    unit: 'Apartamento 42 - Bloco B',
    host: 'Mariana Souza',
    approved: true,
    validFrom: BASE - 2 * H,
    validUntil: BASE + 30 * H,
    code: 'MP-7F3A-91C2-B042',
    guest: {
      name: 'Carlos Eduardo Lima',
      cpf: '12345678901',
      email: 'carlos.lima@email.com',
      phone: '(11) 98765-4321',
    },
  },
  {
    id: 'PS-1043',
    unit: 'Cobertura 101 - Bloco A',
    host: 'Roberto Almeida',
    approved: true,
    validFrom: BASE - 24 * H,
    validUntil: BASE + 5 * 24 * H,
    code: 'MP-2B8D-44E1-A101',
    guest: {
      name: 'Fernanda Oliveira',
      cpf: '98765432100',
      email: 'fernanda.o@email.com',
      phone: '(11) 91234-5678',
    },
  },
  {
    id: 'PS-1044',
    unit: 'Casa 15 - Rua das Acácias',
    host: 'Juliana Prado',
    approved: false,
    validFrom: BASE + 24 * H,
    validUntil: BASE + 48 * H,
    code: 'MP-9C1E-70D5-C015',
    guest: {
      name: 'Pedro Henrique Santos',
      cpf: '45612378955',
      email: 'pedro.hs@email.com',
      phone: '(21) 99876-1234',
    },
  },
  {
    id: 'PS-1039',
    unit: 'Apartamento 42 - Bloco B',
    host: 'Mariana Souza',
    approved: true,
    validFrom: BASE - 72 * H,
    validUntil: BASE - 24 * H,
    code: 'MP-5A6F-12B8-B039',
    guest: {
      name: 'Lucas Martins',
      cpf: '32165498700',
      email: 'lucas.m@email.com',
      phone: '(11) 97777-8888',
    },
  },
];

const NOTIFICATIONS = [
  { id: 1, icon: 'fa-circle-check', text: 'O acesso PS-1042 foi liberado pela portaria.', time: 'há 2 h' },
  { id: 2, icon: 'fa-hourglass-half', text: 'O acesso PS-1044 aguarda aprovação do morador.', time: 'há 5 h' },
  { id: 3, icon: 'fa-triangle-exclamation', text: 'O acesso PS-1039 expirou.', time: 'ontem' },
];

const MENU_ITEMS = [
  { key: 'passes', label: 'Meus QR Codes / Passes', icon: 'fa-ticket' },
  { key: 'perfil', label: 'Dados do Perfil', icon: 'fa-user' },
  { key: 'historico', label: 'Histórico de Acessos', icon: 'fa-clock-rotate-left' },
  { key: 'ajuda', label: 'Regras & Ajuda', icon: 'fa-circle-question' },
];

const STATUS = {
  valido: {
    label: 'Válido',
    badge: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    dot: 'bg-emerald-400',
    bar: 'bg-emerald-500',
  },
  pendente: {
    label: 'Pendente',
    badge: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    dot: 'bg-amber-400',
    bar: 'bg-amber-500',
  },
  expirado: {
    label: 'Expirado',
    badge: 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
    dot: 'bg-rose-400',
    bar: 'bg-rose-500/70',
  },
};

const TABS = [
  { key: 'todos', label: 'Todos' },
  { key: 'valido', label: 'Válidos' },
  { key: 'pendente', label: 'Pendentes' },
  { key: 'expirado', label: 'Expirados' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */
const getStatus = (pass, now) => {
  if (!pass.approved) return 'pendente';
  if (now > pass.validUntil) return 'expirado';
  return 'valido';
};

const fmtDate = (ts) =>
  new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const fmtShort = (ts) =>
  new Date(ts).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const fmtRemaining = (ms) => {
  if (ms <= 0) return 'Encerrado';
  const totalMin = Math.floor(ms / 60000);
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  if (d > 0) return `${d}d ${h}h restantes`;
  if (h > 0) return `${h}h ${m}min restantes`;
  return `${m}min restantes`;
};

const maskCpf = (cpf) => {
  const d = cpf.replace(/\D/g, '');
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
};

const getProgress = (pass, now) => {
  const total = pass.validUntil - pass.validFrom;
  const elapsed = Math.min(Math.max(now - pass.validFrom, 0), total);
  return Math.round((elapsed / total) * 100);
};

const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

/* -------------------------------------------------------------------------- */
/*  Componentes de apoio                                                      */
/* -------------------------------------------------------------------------- */
function StatusBadge({ status }) {
  const st = STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${st.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`}></span>
      {st.label}
    </span>
  );
}

function SidebarContent({ userName, activeMenu, onSelect, onLogout, onClose }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <i className="fas fa-qrcode text-sm"></i>
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-100">MainPass</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-slate-200 ${focusRing}`}
            aria-label="Fechar menu"
          >
            <i className="fas fa-xmark"></i>
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Navegação principal">
        <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Menu
        </p>
        <ul className="space-y-0.5">
          {MENU_ITEMS.map((item) => {
            const active = activeMenu === item.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onSelect(item.key)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${focusRing} ${
                    active
                      ? 'bg-white/[0.06] text-slate-100'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <i
                    className={`fas ${item.icon} w-4 text-center text-[13px] ${
                      active ? 'text-accent-muted' : 'text-slate-500'
                    }`}
                  ></i>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-white/[0.08] p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-slate-200">
            {getInitials(userName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-100">{userName}</p>
            <p className="text-xs text-slate-500">Convidado / Morador</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className={`mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-rose-500/10 hover:text-rose-400 ${focusRing}`}
        >
          <i className="fas fa-right-from-bracket w-4 text-center text-[13px]"></i>
          Sair
        </button>
      </div>
    </div>
  );
}

function PassCard({ pass, now, onOpen }) {
  const isValid = pass.status === 'valido';
  const isExpired = pass.status === 'expirado';

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex flex-col rounded-xl border border-white/[0.08] bg-brand-800 p-6 text-left shadow-card transition-all duration-200 ease-out hover:border-white/[0.16] hover:bg-brand-700/60 ${focusRing} ${
        isExpired ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={pass.status} />
        <span className="font-mono text-xs text-slate-500">{pass.id}</span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug text-slate-100">{pass.unit}</h3>
          <p className="mt-1.5 truncate text-sm text-slate-400">{pass.guest.name}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">Anfitrião: {pass.host}</p>
        </div>

        <div className="relative h-16 w-16 shrink-0 rounded-lg border border-white/10 bg-white p-1.5">
          <QRCodeCanvas
            value={`MAINPASS|${pass.id}|${pass.code}`}
            size={120}
            level="M"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              filter: isValid ? 'none' : 'blur(2px)',
              opacity: isValid ? 1 : 0.3,
            }}
          />
          {!isValid && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-700">
              <i className={`fas ${pass.status === 'pendente' ? 'fa-hourglass-half' : 'fa-lock'} text-sm`}></i>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-white/[0.06] pt-4">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">Validade</span>
          <span className="text-slate-300">
            {fmtShort(pass.validFrom)} – {fmtShort(pass.validUntil)}
          </span>
        </div>

        {isValid && (
          <div className="mt-3">
            <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full ${STATUS.valido.bar}`}
                style={{ width: `${getProgress(pass, now)}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xs text-slate-500">{fmtRemaining(pass.validUntil - now)}</p>
          </div>
        )}
        {pass.status === 'pendente' && (
          <p className="mt-3 text-xs text-slate-500">Aguardando aprovação do morador.</p>
        )}
        {isExpired && (
          <p className="mt-3 text-xs text-slate-500">Encerrado em {fmtDate(pass.validUntil)}.</p>
        )}
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal de detalhes do QR Code                                              */
/* -------------------------------------------------------------------------- */
function PassModal({ pass, now, onClose, onToast }) {
  const qrWrapRef = useRef(null); 
  const status = pass.status;
  const isActive = status === 'valido';

  const handleDownload = () => {
    const src = qrWrapRef.current?.querySelector('canvas');
    if (!src) return;

    // Gera a imagem com margem branca para facilitar a leitura
    const pad = 40;
    const out = document.createElement('canvas');
    out.width = src.width + pad * 2;
    out.height = src.height + pad * 2;
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(src, pad, pad);

    const link = document.createElement('a');
    link.download = `mainpass-${pass.id}.png`;
    link.href = out.toDataURL('image/png');
    link.click();
    onToast('QR Code salvo no seu dispositivo.');
  };

  const handleWhatsApp = () => {
    const msg =
      `Olá, ${pass.guest.name.split(' ')[0]}! Seu acesso ao ${pass.unit} (MainPass) está liberado.\n` +
      `Código: ${pass.code}\n` +
      `Válido de ${fmtDate(pass.validFrom)} até ${fmtDate(pass.validUntil)}.\n` +
      `Apresente o QR Code na portaria.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  const details = [
    { label: 'Nome completo', value: pass.guest.name },
    { label: 'CPF', value: maskCpf(pass.guest.cpf), mono: true },
    { label: 'E-mail', value: pass.guest.email },
    { label: 'Telefone', value: pass.guest.phone },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes do acesso ${pass.id}`}
    >
      <div className="mp-fade absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="mp-pop relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-white/[0.08] bg-brand-800 shadow-overlay sm:max-w-lg sm:rounded-xl">
        {/* Cabeçalho */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.08] bg-brand-800 px-6 py-5">
          <div className="min-w-0">
            <StatusBadge status={status} />
            <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-100">{pass.unit}</h3>
            <p className="mt-1 text-sm text-slate-400">Anfitrião: {pass.host}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-slate-200 ${focusRing}`}
            aria-label="Fechar"
          >
            <i className="fas fa-xmark"></i>
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                ref={qrWrapRef}
                className={`rounded-xl border border-white/10 bg-white p-4 transition-all duration-200 ${
                  isActive ? '' : 'select-none opacity-40 blur-md'
                }`}
              >
                <QRCodeCanvas
                  value={`MAINPASS|${pass.id}|${pass.code}`}
                  size={360}
                  level="H"
                  style={{ width: 208, height: 208, display: 'block' }}
                />
              </div>

              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-brand-900 text-slate-300">
                    <i className={`fas ${status === 'pendente' ? 'fa-hourglass-half' : 'fa-lock'}`}></i>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-100">
                    {status === 'pendente' ? 'Aguardando aprovação' : 'Acesso expirado'}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">QR Code indisponível</p>
                </div>
              )}
            </div>
            <p className="mt-4 font-mono text-xs tracking-widest text-slate-500">{pass.code}</p>
          </div>

          {/* Validade */}
          <section>
            <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500">Validade</h4>
            <div className="mt-3 rounded-lg border border-white/[0.08] bg-brand-900/50 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-400">
                  {status === 'pendente'
                    ? 'Aguardando aprovação'
                    : fmtRemaining(pass.validUntil - now)}
                </span>
                <span className={`font-medium ${isActive ? 'text-slate-100' : 'text-slate-500'}`}>
                  {status === 'expirado' ? '100%' : status === 'pendente' ? '0%' : `${getProgress(pass, now)}%`}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${STATUS[status].bar}`}
                  style={{
                    width: `${status === 'expirado' ? 100 : status === 'pendente' ? 0 : getProgress(pass, now)}%`,
                  }}
                ></div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">Início</dt>
                  <dd className="mt-1 text-slate-200">{fmtDate(pass.validFrom)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Expira em</dt>
                  <dd className="mt-1 text-slate-200">{fmtDate(pass.validUntil)}</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Dados do convidado */}
          <section>
            <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Dados do convidado
            </h4>
            <dl className="mt-1 divide-y divide-white/[0.06]">
              {details.map((d) => (
                <div key={d.label} className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-sm text-slate-500">{d.label}</dt>
                  <dd className={`break-all text-right text-sm text-slate-200 ${d.mono ? 'font-mono' : ''}`}>
                    {d.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Ações */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!isActive}
              className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-white shadow-card transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
            >
              <i className="fas fa-download text-xs"></i>
              Baixar / Salvar QR Code
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              disabled={!isActive}
              className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-transparent text-sm font-medium text-slate-200 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
            >
              <i className="fab fa-whatsapp text-base text-emerald-400"></i>
              Compartilhar via WhatsApp
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`h-10 w-full rounded-lg text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-slate-200 ${focusRing}`}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashboard                                                                 */
/* -------------------------------------------------------------------------- */
export default function UserDashboard({ userName = 'Usuário' }) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('passes');
  const [selectedPass, setSelectedPass] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [query, setQuery] = useState('');
  const [showHelp, setShowHelp] = useState(true);
  const [toast, setToast] = useState('');
  const [now, setNow] = useState(Date.now());

  const firstName = userName.split(' ')[0];

  // Atualiza o "agora" a cada 30s (contador de validade / status)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // Fecha overlays com ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedPass(null);
        setSidebarOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Trava o scroll do fundo quando há drawer ou modal aberto
  useEffect(() => {
    document.body.style.overflow = sidebarOpen || selectedPass ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, selectedPass]);

  // Toast temporário
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const passes = useMemo(
    () => MOCK_PASSES.map((p) => ({ ...p, status: getStatus(p, now) })),
    [now]
  );

  const counts = useMemo(
    () => ({
      todos: passes.length,
      valido: passes.filter((p) => p.status === 'valido').length,
      pendente: passes.filter((p) => p.status === 'pendente').length,
      expirado: passes.filter((p) => p.status === 'expirado').length,
    }),
    [passes]
  );

  const visiblePasses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return passes.filter((p) => {
      if (filter !== 'todos' && p.status !== filter) return false;
      if (!q) return true;
      return [p.unit, p.host, p.id, p.guest.name].some((v) => v.toLowerCase().includes(q));
    });
  }, [passes, filter, query]);

  const currentPass = selectedPass ? passes.find((p) => p.id === selectedPass) : null;

  const handleMenuSelect = (key) => {
    setActiveMenu(key);
    setSidebarOpen(false);
    if (key !== 'passes') setToast('Esta seção estará disponível em breve.');
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    // TODO: limpar token / sessão antes de redirecionar
    navigate('/');
  };

  const handleRequestAccess = () => {
    // TODO: abrir formulário / chamar API de solicitação de acesso
    setToast('Solicitação de novo acesso enviada ao morador.');
  };

  return (
    <div className="min-h-screen bg-brand-900 font-sans text-slate-400 antialiased selection:bg-accent selection:text-white">
      <style>{`
        @keyframes mp-pop { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes mp-fade { from { opacity: 0; } to { opacity: 1; } }
        .mp-pop { animation: mp-pop .2s ease-out; }
        .mp-fade { animation: mp-fade .2s ease-out; }
        @media (prefers-reduced-motion: reduce) { .mp-pop, .mp-fade { animation: none; } }
      `}</style>

      {/* Sidebar fixa (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.08] bg-brand-800 lg:block">
        <SidebarContent
          userName={userName}
          activeMenu={activeMenu}
          onSelect={handleMenuSelect}
          onLogout={handleLogout}
        />
      </aside>

      {/* Drawer (mobile) */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!sidebarOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-white/[0.08] bg-brand-800 shadow-overlay transition-transform duration-200 ease-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent
            userName={userName}
            activeMenu={activeMenu}
            onSelect={handleMenuSelect}
            onLogout={handleLogout}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>
      </div>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-brand-900/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-300 transition-colors duration-200 hover:border-white/[0.16] hover:text-white lg:hidden ${focusRing}`}
                aria-label="Abrir menu"
              >
                <i className="fas fa-bars text-sm"></i>
              </button>
              <p className="truncate text-sm text-slate-400">
                Olá, <span className="font-medium text-slate-100">{firstName}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-300 transition-colors duration-200 hover:border-white/[0.16] hover:text-white ${focusRing}`}
                  aria-label="Notificações"
                  aria-expanded={notifOpen}
                >
                  <i className="fas fa-bell text-sm"></i>
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-muted"></span>
                </button>

                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)}></div>
                    <div className="mp-pop absolute right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/[0.08] bg-brand-800 shadow-overlay">
                      <div className="border-b border-white/[0.08] px-4 py-3 text-sm font-medium text-slate-100">
                        Notificações
                      </div>
                      <ul className="max-h-72 divide-y divide-white/[0.06] overflow-y-auto">
                        {NOTIFICATIONS.map((n) => (
                          <li key={n.id} className="flex gap-3 px-4 py-3.5 transition-colors duration-200 hover:bg-white/[0.03]">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-brand-700 text-xs text-slate-300">
                              <i className={`fas ${n.icon}`}></i>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm leading-snug text-slate-200">{n.text}</p>
                              <p className="mt-1 text-xs text-slate-500">{n.time}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              <div className="hidden h-6 w-px bg-white/[0.08] sm:block"></div>

              <div className="hidden items-center gap-2.5 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-slate-200">
                  {getInitials(userName)}
                </div>
                <span className="max-w-[10rem] truncate text-sm font-medium text-slate-200">{userName}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* Título + ação primária */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-100">Meus acessos</h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Selecione um passe para ver o QR Code e os detalhes do acesso.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRequestAccess}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white shadow-card transition-colors duration-200 hover:bg-accent-hover ${focusRing}`}
            >
              <i className="fas fa-plus text-xs"></i>
              Solicitar novo acesso
            </button>
          </div>

          {/* Como utilizar (dispensável) */}
          {showHelp && (
            <section className="mt-8 rounded-xl border border-white/[0.08] bg-brand-800 p-6 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-sm font-semibold text-slate-100">Como utilizar seu acesso</h2>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className={`-mr-2 -mt-1 flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors duration-200 hover:bg-white/[0.06] hover:text-slate-200 ${focusRing}`}
                  aria-label="Dispensar instruções"
                >
                  <i className="fas fa-xmark text-sm"></i>
                </button>
              </div>
              <ol className="mt-4 grid gap-5 sm:grid-cols-3">
                {[
                  'Escolha um passe com status Válido.',
                  'Abra o QR Code e aumente o brilho da tela.',
                  'Aproxime o QR Code do leitor na entrada da portaria.',
                ].map((text, i) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-brand-700 text-xs font-medium text-slate-300">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-snug text-slate-400">{text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Filtros + busca */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div
              className="-mb-px flex gap-1 overflow-x-auto border-b border-white/[0.08] sm:border-b-0"
              role="tablist"
              aria-label="Filtrar passes por status"
            >
              {TABS.map((t) => {
                const active = filter === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(t.key)}
                    className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 pb-3 pt-1 text-sm font-medium transition-colors duration-200 ${focusRing} ${
                      active
                        ? 'border-accent text-slate-100'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {t.label}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-xs ${
                        active ? 'bg-white/[0.08] text-slate-200' : 'bg-white/[0.04] text-slate-500'
                      }`}
                    >
                      {counts[t.key]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <i className="fas fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"></i>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por unidade ou convidado"
                aria-label="Buscar passes"
                className="h-10 w-full rounded-lg border border-white/10 bg-brand-800 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 transition-colors duration-200 hover:border-white/20 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Grade de passes */}
          <div className="mt-6">
            {visiblePasses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visiblePasses.map((pass) => (
                  <PassCard
                    key={pass.id}
                    pass={pass}
                    now={now}
                    onOpen={() => setSelectedPass(pass.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/[0.12] px-6 py-14 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.08] bg-brand-800 text-slate-500">
                  <i className="fas fa-ticket"></i>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-100">Nenhum passe encontrado</p>
                <p className="mt-1 text-sm text-slate-500">
                  Ajuste o filtro ou a busca para ver outros acessos.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilter('todos');
                    setQuery('');
                  }}
                  className={`mt-5 rounded text-sm font-medium text-accent-muted transition-colors duration-200 hover:text-indigo-300 ${focusRing}`}
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>

          <p className="mt-12 text-center text-xs text-slate-600">
            MainPass © {new Date().getFullYear()} — Controle de Acesso
          </p>
        </main>
      </div>

      {/* Modal */}
      {currentPass && (
        <PassModal
          pass={currentPass}
          now={now}
          onClose={() => setSelectedPass(null)}
          onToast={setToast}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2" role="status">
          <div className="mp-pop flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-brand-700 px-4 py-3 text-sm text-slate-100 shadow-overlay">
            <i className="fas fa-circle-check text-xs text-emerald-400"></i>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}