"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Language, User } from "@/types";
import { getActiveUser, clearActiveUser, saveUser } from "@/lib/storage";
import { t as translate } from "@/lib/i18n";

// ── Language Context ───────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "id",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    const user = getActiveUser();
    if (user?.language) setLangState(user.language);
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    const user = getActiveUser();
    if (user) {
      saveUser({ ...user, language: l });
    }
  }

  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(key, lang, vars);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

// ── Auth Context ───────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
  logout: () => {},
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUserState(getActiveUser());
    setMounted(true);
  }, []);

  function setUser(u: User | null) {
    setUserState(u);
  }

  function logout() {
    clearActiveUser();
    setUserState(null);
  }

  function refreshUser() {
    setUserState(getActiveUser());
  }

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
