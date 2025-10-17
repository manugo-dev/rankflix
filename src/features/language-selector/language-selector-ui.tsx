import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) ?? languages[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="language-selector">
      <motion.button
        className="language-selector__trigger"
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <img
          src={currentLanguage.flag}
          alt={currentLanguage.label}
          className="language-selector__flag"
        />
        <motion.span
          className="language-selector__arrow"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="language-selector__dropdown"
            role="listbox"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {languages.map(({ code, flag, label }) => (
              <motion.li
                key={code}
                role="option"
                aria-selected={i18n.language === code}
                tabIndex={0}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleSelect(code)}
                className={`language-selector__item ${i18n.language === code ? "active" : ""}`}
              >
                <img src={flag} alt={label} className="language-selector__flag" />
                <span className="language-selector__label">{label}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
