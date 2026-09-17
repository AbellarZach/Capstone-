"use client";

import { ReactNode, useEffect, useState } from "react";
import { clientApi } from "@/services/api";
import type { AuthUser } from "@/lib/types";
import { ClientTopBar } from "./ClientTopBar";
import { ClientSidebar } from "./ClientSidebar";
import { ClientFooter } from "./ClientFooter";

export function ClientPageShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }

    clientApi
      .getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      })
      .catch(() => undefined);
  }, []);

  const displayName = user?.fullname || user?.username || "Resident";

  return (
    <div className="client-page min-h-screen flex flex-col bg-[#F8FAFC]">
      <ClientTopBar rightSlot="home" displayName={displayName} />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col lg:flex-row">
        <ClientSidebar user={user} />
        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-10">
          {title ? (
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
              {subtitle ? <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p> : null}
            </div>
          ) : null}
          {children}
        </main>
      </div>
      <ClientFooter />
    </div>
  );
}
