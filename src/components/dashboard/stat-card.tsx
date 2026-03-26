"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
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