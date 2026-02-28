"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { createClient } from "@/lib/supabase";
import { Menu, X, LayoutDashboard, GraduationCap, Settings, LogOut, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/components/ui/Avatar";
import { useAuthStore } from "@/stores/auth";

const localeConfig = [
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
  { value: "fr", label: "FR" },
  { value: "de", label: "DE" },
] as const;

export default function NavBar() {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleLangSwitch = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  const navLinks = [
    { href: "/dashboard" as const, label: t("dashboard"), icon: LayoutDashboard },
    { href: "/session" as const, label: t("session"), icon: GraduationCap },
    { href: "/settings" as const, label: t("settings"), icon: Settings },
  ];

  return (
    <header
      className="sticky top-0 border-b border-border bg-[var(--bg-base)]/80 backdrop-blur-xl"
      style={{ zIndex: "var(--z-sticky)" }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold gradient-text font-[family-name:var(--font-display)]">
          Fluent
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-all duration-[var(--duration-fast)] ${
                  isActive
                    ? "text-primary-400 bg-primary-600/10"
                    : "text-foreground/50 hover:text-foreground hover:bg-surface-elevated"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}

          <div className="ml-2 h-6 w-px bg-border" />

          {/* Language switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-md)] text-xs font-medium text-foreground/50 hover:text-foreground hover:bg-surface-elevated transition-all"
              aria-label="Switch language"
            >
              <Globe className="h-3.5 w-3.5" />
              {locale.toUpperCase()}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 bg-surface-elevated border border-border rounded-[var(--radius-md)] shadow-lg overflow-hidden"
                  style={{ zIndex: "var(--z-dropdown)" }}
                >
                  {localeConfig.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleLangSwitch(value)}
                      className={`flex items-center w-full px-4 py-2 text-xs font-medium transition-colors ${
                        locale === value
                          ? "text-primary-400 bg-primary-600/10"
                          : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-border" />

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm text-foreground/50 hover:text-foreground hover:bg-surface-elevated transition-all"
          >
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </button>
          <div className="ml-2">
            <Avatar name={user?.displayName ?? user?.email ?? "User"} size="sm" />
          </div>
        </nav>

        {/* Mobile right controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile language switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 p-2 rounded-[var(--radius-md)] text-xs font-medium text-foreground/50 hover:text-foreground hover:bg-surface-elevated transition-colors"
              aria-label="Switch language"
            >
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 bg-surface-elevated border border-border rounded-[var(--radius-md)] shadow-lg overflow-hidden"
                  style={{ zIndex: "var(--z-dropdown)" }}
                >
                  {localeConfig.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleLangSwitch(value)}
                      className={`flex items-center w-full px-4 py-2 text-xs font-medium transition-colors ${
                        locale === value
                          ? "text-primary-400 bg-primary-600/10"
                          : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-[var(--radius-md)] text-foreground/50 hover:text-foreground hover:bg-surface-elevated transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-14 bg-black/40 backdrop-blur-sm md:hidden"
              style={{ zIndex: "var(--z-overlay)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-14 border-b border-border bg-surface-elevated p-4 space-y-1 md:hidden"
              style={{ zIndex: "var(--z-overlay)" }}
            >
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm transition-colors ${
                      isActive
                        ? "text-primary-400 bg-primary-600/10 border-l-4 border-primary-500"
                        : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-sm text-error/70 hover:text-error hover:bg-error/5 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                {t("signOut")}
              </button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
