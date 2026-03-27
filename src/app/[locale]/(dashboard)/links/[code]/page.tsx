import type { Metadata } from "next";
import { StatsDetailClient } from "./client";

// Generate static params for the [code] route
// For static export, we provide a placeholder. The actual code is determined at runtime via client-side navigation.
// When deployed to Cloudflare Pages with Functions, this can be made fully dynamic.
export function generateStaticParams() {
  // Generate params for each locale with a placeholder code
  // This creates a fallback page that handles client-side navigation
  return [{ code: "_code_" }];
}

export const metadata: Metadata = {
  title: "Stats Detail",
};

export default function StatsDetailPage() {
  return <StatsDetailClient />;
}