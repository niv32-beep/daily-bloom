import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader() {
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-border/60 bg-background/80 px-3 backdrop-blur-md md:gap-3 md:px-8">
      <SidebarTrigger className="rounded-xl" />
      <div className="hidden flex-col leading-tight md:flex">
        <span className="text-xs text-muted-foreground">Today</span>
        <span className="text-sm font-medium text-foreground">{today}</span>
      </div>
      <div className="ml-auto flex items-center gap-1.5 md:gap-2">
        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks, notes…"
            aria-label="Search"
            className="h-10 w-64 rounded-2xl border-border/60 bg-card pl-9"
          />
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-2xl" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
