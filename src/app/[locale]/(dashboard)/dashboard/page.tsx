"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { Link2, MousePointer, BarChart3, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      {trend && (
        <div className="text-xs text-green-600 dark:text-green-400">
          {trend}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { username } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t("welcome")}, {username}!
        </h1>
        <p className="text-blue-100">
          Here&apos;s an overview of your short links performance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Links"
          value="128"
          icon={<Link2 className="size-5" />}
          trend="+12 this week"
        />
        <StatCard
          title="Total Clicks"
          value="4,521"
          icon={<MousePointer className="size-5" />}
          trend="+8.2% vs last week"
        />
        <StatCard
          title="Click Rate"
          value="3.2%"
          icon={<BarChart3 className="size-5" />}
        />
        <StatCard
          title="Avg. Response"
          value="45ms"
          icon={<Clock className="size-5" />}
        />
      </div>

      {/* Recent links table placeholder */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Recent Links
          </h2>
        </div>
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <p>No recent links to display.</p>
          <p className="text-sm mt-1">Create your first short link to get started.</p>
        </div>
      </div>
    </div>
  );
}