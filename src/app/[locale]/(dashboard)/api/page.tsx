"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function APIPage() {
  const t = useTranslations("API");
  const [showKey, setShowKey] = useState(false);

  // Demo API key
  const apiKey = "sk_test_placeholder";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t("title")}
      </h1>

      {/* API Key card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          API Key
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Use this key to authenticate API requests. Keep it secure and never share it publicly.
        </p>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2.5">
            <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300 truncate">
              {showKey ? apiKey : "••••••••••••••••••••••••••••••••"}
            </code>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? "Hide" : "Show"}
            >
              {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy">
            <Copy className="size-4" />
          </Button>
          <Button variant="outline" size="icon" title="Regenerate">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      {/* Usage example */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Usage
        </h2>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-100">
{`curl -X POST https://api.0x1.in/v1/links \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
          </pre>
        </div>
      </div>
    </div>
  );
}