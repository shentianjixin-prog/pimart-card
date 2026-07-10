"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { t, type Lang } from "./translations";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };

const LangContext = createContext<LangCtx>({ lang: "en", setLang: () => {} });

export function LangProvider({
  initial,
  children,
}: {
  initial: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initial);
  const router = useRouter();

  function setLang(l: Lang) {
    setLangState(l);
    document.cookie = `lang=${l}; path=/; max-age=${365 * 24 * 3600}; SameSite=Lax`;
    router.refresh(); // 让服务器组件用新语言重新渲染（翻译 DB 内容）
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function useT() {
  const { lang } = useLang();
  return (key: string) => t(key, lang);
}
