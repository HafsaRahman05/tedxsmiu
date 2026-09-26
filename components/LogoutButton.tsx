"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await authClient.signOut();
    router.push("/dashboard/login");
    router.refresh();
  };

  return (
    <button
      onClick={logout}
      className="border border-line bg-surface px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-paper-dim transition-all duration-300 hover:border-red hover:bg-transparent hover:text-red active:scale-95"
    >
      Sign Out
    </button>
  );
}