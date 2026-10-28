// app/context/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { LANGUAGES, LanguageOption, translations } from "./translations";

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (langCode: string) => void;
  t: (key: string) => string;
  languages: LanguageOption[];
  currentLangInfo: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languageListeners = new Set<() => void>();

function subscribeToLanguage(onStoreChange: () => void) {
  languageListeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    languageListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getStoredLanguage() {
  const saved = localStorage.getItem("crm_language");
  return LANGUAGES.some((language) => language.code === saved) ? saved! : "en";
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const currentLanguage = useSyncExternalStore(
    subscribeToLanguage,
    getStoredLanguage,
    () => "en"
  );

  useEffect(() => {
    const language = LANGUAGES.find((item) => item.code === currentLanguage) || LANGUAGES[0];
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir || "ltr";
  }, [currentLanguage]);

  const handleSetLanguage = (langCode: string) => {
    if (!LANGUAGES.some((language) => language.code === langCode)) {
      throw new Error(`Unsupported language: ${langCode}`);
    }
    localStorage.setItem("crm_language", langCode);
    languageListeners.forEach((listener) => listener());
  };

  // Translation helper function (Fallback: English ya Key khud)
  const t = (key: string): string => {
    return (
      translations[currentLanguage]?.[key] ||
      translations["en"]?.[key] ||
      key
    );
  };

  const currentLangInfo =
    LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: handleSetLanguage,
        t,
        languages: LANGUAGES,
        currentLangInfo,
      }}
    >
      <div dir={currentLangInfo.dir || "ltr"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};