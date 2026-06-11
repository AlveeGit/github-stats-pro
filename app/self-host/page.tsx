import type { Metadata } from "next";
import { SelfHostContent } from "@/components/pages/self-host-content";

export const metadata: Metadata = {
  title: "Self-Hosting — GitHub Stats Pro",
  description:
    "Deploy your own GitHub Stats Pro instance on Vercel with a GitHub PAT and optional Upstash Redis.",
};

export default function SelfHostPage() {
  return <SelfHostContent />;
}
