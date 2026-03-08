import { ExternalLink, Leaf } from "lucide-react";

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

export function LunchMenu() {
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="px-5 pb-2 pt-4">
        <h1 className="text-2xl leading-tight">Lunch</h1>
        <p className="mt-0.5 text-sm text-muted-foreground font-sans">{todayStr}</p>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-24 no-scrollbar space-y-4">
        {/* Open in Safari */}
        <a
          href={DINING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-5 text-primary-foreground active:opacity-90 transition-opacity"
        >
          <div className="flex items-center gap-3.5">
            <span className="text-2xl">🍽️</span>
            <div>
              <p className="text-base font-semibold tracking-tight">View Today's Menu</p>
              <p className="text-xs opacity-60 mt-0.5">Opens in browser</p>
            </div>
          </div>
          <ExternalLink className="h-4.5 w-4.5 opacity-70" />
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
              Gluten-free items available daily. For allergen info, contact the school nurse.
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
