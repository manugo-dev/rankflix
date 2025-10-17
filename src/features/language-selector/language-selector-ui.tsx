import { motion } from "framer-motion";

import type { LanguageOption } from "@/shared/config";
import { useTranslate } from "@/shared/hooks/use-translation";

import flagDe from "./flags/de.svg";
import flagEn from "./flags/en.svg";
import flagEs from "./flags/es.svg";

import "./language-selector.scss";

const languages: LanguageOption[] = [
  { code: "es", flag: flagEs, label: "Español" },
  { code: "en", flag: flagEn, label: "English" },
  { code: "de", flag: flagDe, label: "Deutsch" },
];

export function LanguageSelector() {
  const { i18n } = useTranslate();

  return (
    <div className="language-selector">
      {languages.map(({ code, flag, label }) => (
        <motion.button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`language-selector__option ${i18n.language === code ? "active" : ""}`}
          whileTap={{ scale: 0.9 }}
          title={label}
        >
          <img src={flag} alt={label} className="language-selector__flag" />
        </motion.button>
      ))}
    </div>
  );
}
