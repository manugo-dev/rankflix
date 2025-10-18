import { motion } from "framer-motion";

import { useTranslate } from "@/shared/hooks/use-translation";

import { Button } from "../button";

import "./error-fallback.scss";

interface ErrorFallbackProps {
  error?: Error;
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
  const { t } = useTranslate();

  return (
    <motion.div
      className="error-fallback"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{t("error.title")}</h1>
      {error && <p style={{ maxWidth: "500px", opacity: 0.6 }}>{t("error.reported")}</p>}
      <Button onClick={() => globalThis.location.reload()} variant="danger">
        {t("error.reload")}
      </Button>
    </motion.div>
  );
}
