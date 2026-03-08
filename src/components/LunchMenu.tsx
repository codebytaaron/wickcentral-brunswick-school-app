const DINING_URL = "https://my.brunswickschool.org/calendars/dining";

export function LunchMenu() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <iframe
        src={DINING_URL}
        className="flex-1 w-full border-0"
        title="Lunch Menu"
        allow="fullscreen"
      />
    </div>
  );
}
