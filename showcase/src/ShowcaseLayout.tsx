import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Search, Sun, Moon, LayoutPanelTop, House, Settings, Sparkles } from "lucide-react";
import { buildMenu } from "./registry";

// ============================================================================
// Menu items
// ============================================================================

interface MenuItem {
  label: string;
  href: string;
  icon: "home" | "component" | "settings" | "skills"
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const MENU: (MenuItem | MenuGroup)[] = [
  { label: "Introduction", href: "/", icon: "home" },
  { label: "Setup", href: "/setup", icon: "settings" },
  { label: "Skills", href: "/skills", icon: "skills" },
  {
    label: "AGENT",
    items: buildMenu().map((m) => ({ ...m, icon: "component" as const })),
  },
];

// ============================================================================
// Theme toggle
// ============================================================================

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <span className="text-sm font-medium text-ak-content">agent-chatbox</span>
      <button
        onClick={onToggle}
        className="ml-auto flex h-7 w-12 items-center rounded-full border border-ak-border bg-ak-surface-hover px-0.5 transition-colors"
        aria-label="Toggle theme"
      >
        <span
          className="flex size-6 items-center justify-center rounded-full bg-ak-surface text-ak-content-secondary shadow-sm transition-transform"
          style={{ transform: dark ? "translateX(20px)" : "translateX(0)" }}
        >
          {dark ? <Moon size={16} /> : <Sun size={16} />}
        </span>
      </button>
    </div>
  );
}

// ============================================================================
// Sidebar
// ============================================================================

function SidebarItem({
  item,
  active,
}: {
  item: MenuItem;
  active: boolean;
}) {
  return (
    <Link
      to={item.href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${active
        ? "bg-ak-surface-hover text-ak-content font-medium"
        : "text-ak-content-secondary hover:bg-ak-surface-hover hover:text-ak-content"
        }`}
    >
      {item.icon === "home" ? (
        <House size={16} strokeWidth={1.5} />
      ) : item.icon === "settings" ? (
        <Settings size={16} strokeWidth={1.5} />
      ) : item.icon === "skills" ? (
        <Sparkles size={16} strokeWidth={1.5} />
      ) : (
        <LayoutPanelTop size={16} strokeWidth={1.5} />
      )}
      {item.label}
    </Link>
  );
}

function Sidebar({
  items,
  activePath,
  searchQuery,
  onSearch,
  dark,
  onToggleTheme,
}: {
  items: (MenuItem | MenuGroup)[];
  activePath: string;
  searchQuery: string;
  onSearch: (v: string) => void;
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    const flat: MenuItem[] = [];
    for (const item of items) {
      if ("items" in item) {
        flat.push(...item.items);
      } else {
        flat.push(item);
      }
    }
    return flat.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, searchQuery]);

  return (
    <div className="flex h-full flex-col min-w-60">
      {/* Search */}
      <div className="shrink-0 p-2">
        <div className="flex items-center gap-2 rounded-lg border border-ak-border bg-ak-surface px-3 py-2">
          <span className="text-ak-content-tertiary">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-ak-content outline-none placeholder:text-ak-content-tertiary"
          />
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 flex flex-col gap-0.5">
        {filtered.map((item, i) => {
          if ("items" in item) {
            return (
              <div key={i} className="mb-2">
                <div className="my-1.5 px-3 text-xs uppercase tracking-wide text-ak-content-tertiary">
                  {item.label}
                </div>
                <div className="flex flex-col gap-0.5">
                  {item.items.map((sub) => (
                    <SidebarItem
                      key={sub.href}
                      item={sub}
                      active={activePath === sub.href}
                    />
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="">
              <SidebarItem item={item} active={activePath === item.href} />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-ak-border">
        <ThemeToggle dark={dark} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}

// ============================================================================
// Layout
// ============================================================================

export function ShowcaseLayout() {
  const location = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTheme = () => {
    const swap = () => {
      flushSync(() => setDark((d) => !d));
    };

    if (document.startViewTransition) {
      document.startViewTransition(swap);
    } else {
      swap();
    }
  };

  // Apply dark class to <html> and persist to localStorage
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="flex h-svh w-full overflow-hidden p-2 bg-ak-surface">
      {/* Sidebar */}
      <Sidebar
        items={MENU}
        activePath={location.pathname}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        dark={dark}
        onToggleTheme={toggleTheme}
      />

      {/* Main content */}
      <div className="ml-1 flex h-full flex-1 flex-col overflow-auto rounded-xl border border-ak-border bg-ak-surface">
        <Outlet />
      </div>
    </div>
  );
}
