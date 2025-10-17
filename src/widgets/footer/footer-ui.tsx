import { useTranslate } from "@/shared/hooks/use-translation";

import "./footer.scss";

export function Footer() {
  const { t } = useTranslate();

  return (
    <footer data-testid="footer" className="footer">
      {t("footer.crafted")}{" "}
      <a href="https://www.manugo.dev" className="footer__link" target="_blank">
        @manugo.dev
      </a>
    </footer>
  );
}
