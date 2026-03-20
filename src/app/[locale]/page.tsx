import { redirect } from "@/navigation";

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  redirect("/login");
}