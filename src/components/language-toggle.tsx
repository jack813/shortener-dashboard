"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";

import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {locale === "en" ? "中文" : "EN"}
    </Button>
  );
}
