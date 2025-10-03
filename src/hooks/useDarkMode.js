import '../styles/theme.css';
import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'darkMode'; // mantive a chave existente para compatibilidade

// helpers para suportar valores antigos (booleans) e novos (strings 'dark'/'light')
const parseStored = (raw) => {
  if (raw === null || raw === undefined) return null;
  // já no formato 'dark' | 'light'
  if (raw === 'dark' || raw === 'light') return raw;
  // versões antigas podem ter salvo "true"/"false" ou JSON boolean
  try {
    const maybe = JSON.parse(raw);
    if (typeof maybe === 'boolean') return maybe ? 'dark' : 'light';
  } catch {}
  // fallback: se for string "true"/"false"
  if (raw === 'true') return 'dark';
  if (raw === 'false') return 'light';
  return null;
};

const writeStored = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
};

// aplica classe 'dark' no root
const applyClass = (isDark) => {
  const root = document.documentElement;
  if (isDark) root.classList.add('dark');
  else root.classList.remove('dark');
};

// aplica inicialmente no carregamento do módulo para evitar flash
let initialIsDark = false;
let initialHasUserPref = false;
if (typeof window !== 'undefined') {
  try {
    const savedRaw = localStorage.getItem(STORAGE_KEY);
    const saved = parseStored(savedRaw);
    if (saved === 'dark' || saved === 'light') {
      initialHasUserPref = true;
      initialIsDark = saved === 'dark';
    } else if (window.matchMedia) {
      initialIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyClass(initialIsDark);
  } catch (e) {
    // fallback para sistema
    try {
      initialIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyClass(initialIsDark);
    } catch {}
  }
}

export const useDarkMode = () => {
  // isDarkMode = estado atual do tema (boolean)
  // isUserPref = se existe preferência explícita do usuário (se devemos persistir / ignorar mudanças do sistema)
  const [isDarkMode, setIsDarkMode] = useState(() => initialIsDark);
  const [isUserPref, setIsUserPref] = useState(() => initialHasUserPref);
  const mountedRef = useRef(false);

  // aplica classe + dispatch de evento sempre que o tema muda
  useEffect(() => {
    applyClass(isDarkMode);
    try {
      window.dispatchEvent(new CustomEvent('theme-change', { detail: isDarkMode }));
    } catch {}
  }, [isDarkMode]);

  // Função que o usuário (ou código) chama para setar o tema.
  // persist=true grava em localStorage e marca como preferência do usuário.
  const setDarkMode = (val, persist = true) => {
    const booleanVal = Boolean(val);
    setIsDarkMode(booleanVal);
    if (persist) {
      setIsUserPref(true);
      try {
        writeStored(booleanVal ? 'dark' : 'light');
      } catch {}
    }
  };

  // Toggle que persiste a escolha do usuário
  const toggleDarkMode = () => setDarkMode(!isDarkMode, true);

  // Remove preferência do usuário: volta a seguir o sistema (não grava nada)
  const clearUserPreference = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setIsUserPref(false);
    // recalcula a preferência do sistema
    const systemPref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(Boolean(systemPref));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onThemeChange = (e) => {
      try {
        const val = e?.detail;
        if (typeof val === 'boolean') setIsDarkMode(val);
      } catch {}
    };

    const onStorage = (e) => {
      try {
        if (e.key === STORAGE_KEY) {
          // e.newValue pode ser null (remoção) ou string
          if (e.newValue === null) {
            // preferência removida em outra aba -> seguir sistema
            setIsUserPref(false);
            const sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(Boolean(sys));
          } else {
            const parsed = parseStored(e.newValue);
            if (parsed === 'dark' || parsed === 'light') {
              setIsUserPref(true); // mudança em outra aba indica preferência do usuário
              setIsDarkMode(parsed === 'dark');
            }
          }
        }
      } catch {}
    };

    // listener para mudanças do sistema (prefers-color-scheme)
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const onMq = (ev) => {
      try {
        // só reage a mudanças do sistema SE não houver preferência do usuário
        if (!isUserPref && !document.hidden) {
          setIsDarkMode(ev.matches);
        }
      } catch {}
    };

    window.addEventListener('theme-change', onThemeChange);
    window.addEventListener('storage', onStorage);
    if (mq) {
      if (mq.addEventListener) mq.addEventListener('change', onMq);
      else mq.addListener && mq.addListener(onMq);
    }

    mountedRef.current = true;
    return () => {
      window.removeEventListener('theme-change', onThemeChange);
      window.removeEventListener('storage', onStorage);
      if (mq) {
        if (mq.removeEventListener) mq.removeEventListener('change', onMq);
        else mq.removeListener && mq.removeListener(onMq);
      }
    };
    // isUserPref é intencionalmente omitido das dependências para evitar re-subscribe.
    // alterações em isUserPref são tratadas no handler onMq via leitura da variável de estado mais recente.
  }, []);

  return { isDarkMode, toggleDarkMode, setDarkMode, clearUserPreference, isUserPref };
};


