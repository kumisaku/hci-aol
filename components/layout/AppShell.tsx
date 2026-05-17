"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  Grid3X3,
  Sprout,
  BookOpen,
  CalendarDays,
  NotebookPen,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useAuth, useLang } from "@/lib/contexts";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "nav.plants", href: "/plants", icon: Leaf },
  { key: "nav.planner", href: "/planner", icon: Grid3X3 },
  { key: "nav.myGarden", href: "/my-garden", icon: Sprout },
  { key: "nav.learn", href: "/learn", icon: BookOpen },
  { key: "nav.calendar", href: "/calendar", icon: CalendarDays },
  { key: "nav.journal", href: "/journal", icon: NotebookPen },
];

const bottomItems = [
  { key: "nav.settings", href: "/settings", icon: Settings },
  { key: "nav.help", href: "/help", icon: HelpCircle },
];

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        active
          ? "bg-primary text-white shadow-sm"
          : "text-text-muted hover:bg-sage-50 hover:text-text-dark",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-border p-4 fixed top-0 left-0 bottom-0 z-40">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 mb-6 mt-1">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-primary-dark tracking-tight">EcoPath</span>
        </Link>

        {/* Main nav */}
        <nav className="flex-1 flex flex-col gap-0.5">
          {navItems.map(({ key, href, icon }) => (
            <NavLink
              key={href}
              href={href}
              icon={icon}
              label={t(key)}
              active={pathname === href || (href !== "/dashboard" && pathname.startsWith(href))}
            />
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="border-t border-border pt-3 mt-3 flex flex-col gap-0.5">
          {bottomItems.map(({ key, href, icon }) => (
            <NavLink
              key={href}
              href={href}
              icon={icon}
              label={t(key)}
              active={pathname === href}
            />
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>{t("nav.logout")}</span>
          </button>
        </div>

        {/* User profile at bottom */}
        <div className="border-t border-border pt-3 mt-3">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-dark truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.city}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-border p-4 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-primary-dark tracking-tight">EcoPath</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-sage-50"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5">
          {navItems.map(({ key, href, icon }) => (
            <NavLink
              key={href}
              href={href}
              icon={icon}
              label={t(key)}
              active={pathname === href || (href !== "/dashboard" && pathname.startsWith(href))}
            />
          ))}
        </nav>

        <div className="border-t border-border pt-3 mt-4 flex flex-col gap-0.5">
          {bottomItems.map(({ key, href, icon }) => (
            <NavLink
              key={href}
              href={href}
              icon={icon}
              label={t(key)}
              active={pathname === href}
            />
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>{t("nav.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-3 px-4 md:px-6 h-14">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-sage-50"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5 text-text-muted" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-sm hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  placeholder="Cari tanaman, artikel..."
                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-sage-50 border-0 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex-1 md:hidden" />

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-sage-50 text-text-muted hover:text-text-dark transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
                    {initials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-text-dark">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-border shadow-card z-40 py-1">
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-dark hover:bg-sage-50"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        {t("nav.settings")}
                      </Link>
                      <hr className="my-1 border-border" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("nav.logout")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 animate-fade-in">
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.slice(0, 5).map(({ key, href, icon: Icon }) => {
              const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                    active ? "text-primary" : "text-text-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{t(key).split(" ")[0]}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
