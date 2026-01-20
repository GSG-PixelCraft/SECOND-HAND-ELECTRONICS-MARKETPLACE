import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">
        {t("profile.title")}
      </h1>
      <p className="text-sm text-slate-600">{t("profile.subtitle")}</p>
    </div>
  );
};

export default ProfilePage;
