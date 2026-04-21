"use client";

import Link from "next/link";
import { useState } from "react";
import { LifeBuoy, Menu, Settings, X } from "lucide-react";

export function DashboardHamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="Open dashboard menu"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-border bg-white p-2 text-black shadow-xl">
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100"
          >
            <Settings className="h-4 w-4 text-primary" />
            Settings
          </Link>
          <Link
            href="/dashboard/support"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100"
          >
            <LifeBuoy className="h-4 w-4 text-primary" />
            Support
          </Link>
        </div>
      ) : null}
    </div>
  );
}
