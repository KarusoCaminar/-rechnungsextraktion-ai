import { useState, useEffect } from "react";
import { i18n, type Language } from "@/lib/i18n";

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(i18n.getLanguage());

  useEffect(() => {
    // Re-detect language on mount
    i18n.detectLanguage();
    setLanguageState(i18n.getLanguage());

    // Listen for language changes from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "language-change" && (event.data.language === "de" || event.data.language === "en")) {
        i18n.setLanguage(event.data.language);
        setLanguageState(event.data.language);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const setLanguage = (lang: Language) => {
    i18n.setLanguage(lang);
    setLanguageState(lang);
    
    // Notify parent window if in iframe
    if (window.parent !== window) {
      try {
        window.parent.postMessage({ type: "language-change", language: lang }, "*");
      } catch (e) {
        // Cross-origin, ignore
      }
    }
  };

  return {
    t: (key: string, params?: Record<string, string | number>) => i18n.t(key, params),
    language,
    setLanguage,
  };
}

