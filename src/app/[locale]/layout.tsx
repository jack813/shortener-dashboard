import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { AuthProvider } from "@/components/auth/auth-provider";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid.
  if (!["en", "zh"].includes(locale)) {
    notFound();
  }

  const messages = (await import(`../../locales/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
