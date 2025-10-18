import { motion } from "motion/react";
import { useNavigate } from "react-router";

import { useTranslate } from "@/shared/hooks/use-translation";
import { BadgeAlertIcon } from "@/shared/ui/icons";

import "./not-found.scss";

export function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslate();

  return (
    <main className="page boxed-container not-found">
      <BadgeAlertIcon size={120} />
      <motion.h1
        className="not-found__title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        404
      </motion.h1>
      <motion.p
        className="not-found__text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {t("page-not-found")}
      </motion.p>
      <motion.button
        className="not-found__button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        data-testid="go-to-home-link"
      >
        {t("go-back-home")}
      </motion.button>
      <motion.div
        className="not-found__glow"
        initial={{ scale: 0 }}
        animate={{ scale: [0.5, 2, 0.5] }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </main>
  );
}
