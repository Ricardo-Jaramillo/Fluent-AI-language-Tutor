"use client";

import { useState } from "react";
import { PanelRightOpen } from "lucide-react";
import MobileDrawer from "./MobileDrawer";

interface SidebarProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Sidebar({ title, children, className = "" }: SidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col w-72 border-l border-border overflow-y-auto p-4 ${className}`}
      >
        <h3 className="text-sm font-medium text-foreground/50 mb-3 uppercase tracking-wider">
          {title}
        </h3>
        {children}
      </aside>

      {/* Mobile trigger */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-24 right-4 lg:hidden p-3 rounded-full bg-surface-elevated border border-border shadow-lg hover:border-border-strong transition-colors"
        style={{ zIndex: "var(--z-dropdown)" }}
        aria-label={`Open ${title}`}
      >
        <PanelRightOpen className="h-5 w-5 text-foreground/60" />
      </button>

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={title}
        side="right"
      >
        {children}
      </MobileDrawer>
    </>
  );
}
