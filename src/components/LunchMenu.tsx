import { useEffect, useState } from "react";
import { ExternalLink, Leaf, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DINING_URL = "https://my.brunswickschool.org/calendars/dining";

const DAILY_OFFERINGS = [
  { icon: "🥯", label: "Bagels & Cream Cheese" },
  { icon: "🥗", label: "Garden Salad" },
  { icon: "🥬", label: "Daily Salad" },
  { icon: "🍎", label: "Hand Fruit" },
  { icon: "🍇", label: "Fruit Salad" },
  { icon: "🥛", label: "Yogurt Cups" },
  { icon: "💧", label: "Milk, Water & Infused Water" },
];

const ITEM_EMOJIS: Record<string, string> = {
  soup: "🍜",
  chicken: "🍗",
  rice: "🍚",
  pizza: "🍕",
  pasta: "🍝",
  salmon: "🐟",
  fish: "🐟",
  steak: "🥩",
  beef: "🥩",
  sandwich: "🥪",
  burger: "🍔",
  fries: "🍟",
  salad: "🥗",
  fruit: "🍎",
  bread: "🍞",
  naan: "🫓",
  wings: "🍗",
  taco: "🌮",
  wrap: "🌯",
  caesar: "🥗",
  yogurt: "🥛",
  granola: "🥣",
};

function getEmoji(item: string): string {
  const lower = item.toLowerCase();
  for (const [key, emoji] of Object.entries(ITEM_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "🍽️";
}

export function LunchMenu() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todayKey = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  })();

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "fetch-lunch-menu",
        { body: null, headers: {} }
      );

      if (fnError) throw fnError;

      // Find today's menu from all events
      const events = data?.events as Array<{ date: string; items: string[] }> | undefined;
      if (events) {
        const todayEvent = events.find((e) => e.date === todayKey);
        setItems(todayEvent?.items ?? []);
      } else if (data?.items) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error("Failed to fetch lunch menu:", e);
      setError("Couldn't load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const isSchoolClosed =
    items.length === 1 && items[0].toUpperCase().includes("SCHOOL CLOSED");
  const hasMenu = items.length > 0 && !isSchoolClosed;

  return (
    <div className="flex flex-1 flex-col">
      <header className="px-5 pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl leading-tight">Lunch</h1>
            <p className="mt-0.5 text-sm text-muted-foreground font-sans">
              {todayStr}
            </p>
          </div>
          <button
            onClick={fetchMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary active:bg-border transition-colors"
            aria-label="Refresh menu"
          >
            <RefreshCw className={`h-4 w-4 text-foreground ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-24 no-scrollbar space-y-4">
        {/* Today's Menu */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={fetchMenu}
              className="mt-2 text-xs font-medium text-accent active:opacity-70"
            >
              Try again
            </button>
          </div>
        ) : isSchoolClosed ? (
          <div className="rounded-2xl bg-secondary p-6 text-center">
            <span className="text-3xl">🏖️</span>
            <p className="mt-2 text-sm font-medium">No Lunch Today</p>
            <p className="text-xs text-muted-foreground mt-1">School is closed</p>
          </div>
        ) : hasMenu ? (
          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Today's Menu
            </p>
            <div className="space-y-1.5">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl bg-card border border-border px-4 py-3"
                >
                  <span className="text-base">{getEmoji(item)}</span>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-secondary p-6 text-center">
            <span className="text-3xl">📋</span>
            <p className="mt-2 text-sm font-medium">No Menu Available</p>
            <p className="text-xs text-muted-foreground mt-1">
              Check back on a school day
            </p>
          </div>
        )}

        {/* Open full menu in browser */}
        <a
          href={DINING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground active:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-3.5">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Full Week Menu
              </p>
              <p className="text-xs opacity-60 mt-0.5">Opens in browser</p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 opacity-70" />
        </a>

        {/* Daily Offerings */}
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Available Every Day
          </p>
          <div className="space-y-1.5">
            {DAILY_OFFERINGS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl bg-card border border-border px-4 py-3"
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="rounded-2xl bg-secondary/60 p-4">
          <div className="flex items-start gap-2">
            <Leaf className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gluten-free items available daily. For allergen info, contact the
              school nurse.
            </p>
          </div>
        </div>

        {/* Credit */}
        <p className="text-right text-[6px] text-muted-foreground/20 tracking-wide pr-1">
          Teddy Aaron & Jack Wendell
        </p>
      </div>
    </div>
  );
}
