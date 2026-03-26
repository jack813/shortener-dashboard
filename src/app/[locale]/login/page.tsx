"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { Github } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("Login");
  const { isLoggedIn, isLoading, login } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [isLoading, isLoggedIn, router, locale]);

  const handleGithubLogin = () => {
    login();
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render login form if already logged in
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Shortener Dashboard
            </h1>
            <p className="text-slate-400 text-sm">
              {t("title")}
            </p>
          </div>

          {/* GitHub Login Button */}
          <Button
            onClick={handleGithubLogin}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-medium py-6 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <Github className="size-5" />
            {t("loginWithGithub")}
          </Button>

          {/* Language toggle */}
          <div className="mt-6 flex justify-center">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </div>
  );
}