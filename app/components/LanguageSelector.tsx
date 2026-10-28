"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  return (
    <div className="relative inline-block text-left">
      <select
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label={t("select_language")}
        title={t("select_language")}
        className="bg-gray-800 text-white text-sm border border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-gray-900 text-white">
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
}