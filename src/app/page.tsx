"use client";

import { useSession } from "next-auth/react";
import { LoginPrompt, Dashboard } from "@/components";

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return <LoginPrompt />;
  }

  return <Dashboard />;
}
