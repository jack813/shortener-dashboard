"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { useQuota } from "@/lib/api/use-quota";
import { useLinks } from "@/lib/api/use-links";
import { Link2, MousePointer, BarChart3, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuotaCard } from "@/components/dashboard/quota-card";
import { TrafficCard } from "@/components/dashboard/traffic-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentLinks } from "@/components/dashboard/recent-links";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { username } = useAuth();
  const { quota } = useQuota();
  const { links, loading: linksLoading } = useLinks();

  // Calculate stats from links
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  const customCount = links.filter((link) => link.is_custom).length;
  const permanentCount = links.filter((link) => link.is_permanent).length;

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t("welcome")}, {username}!
        </h1>
        <p className="text-blue-100">{t("welcomeSubtitle")}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("totalLinks")}
          value={totalLinks.toString()}
          icon={<Link2 className="size-5" />}
        />
        <StatCard
          title={t("totalClicks")}
          value={totalClicks.toLocaleString()}
          icon={<MousePointer className="size-5" />}
        />
        <StatCard
          title={t("customLinks")}
          value={customCount.toString()}
          icon={<BarChart3 className="size-5" />}
        />
        <StatCard
          title={t("permanentLinks")}
          value={permanentCount.toString()}
          icon={<Clock className="size-5" />}
        />
      </div>

      {/* Quota, Traffic and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuotaCard quota={quota} />
        <TrafficCard />
        <QuickActions />
      </div>

      {/* Recent links */}
      <RecentLinks links={links} loading={linksLoading} />
    </div>
  );
}