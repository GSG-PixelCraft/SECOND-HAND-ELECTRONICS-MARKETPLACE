import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-semibold tracking-wide">
            {t("footer.logo")}
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-white/80">
            {t("footer.description")}
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
              @
            </span>
            <div className="text-left text-sm">
              <p className="text-white/70">{t("footer.contactLabel")}</p>
              <a
                className="font-semibold text-white hover:text-white/90"
                href="mailto:unreal@outlook.com"
              >
                {t("footer.contactEmail")}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {["facebook", "twitter", "instagram", "youtube"].map((network) => (
              <button
                key={network}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm transition hover:scale-105"
                type="button"
                aria-label={t(`footer.social.${network}`)}
              >
                <span className="text-xs font-semibold">
                  {t(`footer.social.abbr.${network}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-white/20 pt-6 text-xs text-white/80 md:flex-row md:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a className="hover:text-white" href="#about">
              {t("footer.links.about")}
            </a>
            <a className="hover:text-white" href="#contact">
              {t("footer.links.contact")}
            </a>
            <a className="hover:text-white" href="#privacy">
              {t("footer.links.privacy")}
            </a>
            <a className="hover:text-white" href="#terms">
              {t("footer.links.terms")}
            </a>
          </div>
          <span>{t("footer.rights")}</span>
        </div>
      </div>
    </footer>
  );
};
