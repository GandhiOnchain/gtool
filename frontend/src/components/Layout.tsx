import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeSelector } from "@/components/ThemeSelector";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  appName?: string;
  showHeader?: boolean;
  stickyHeader?: boolean;
}

export function Layout({
  children,
  appName = "App Name",
  showHeader = true,
  stickyHeader = false
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeader && (
        <header className={cn(
          "w-full border-b border-border bg-background",
          stickyHeader && "sticky top-0 z-50"
        )}>
          <div className="px-4 md:px-8">
            <div className="mx-auto max-w-7xl">
              <div className={cn(
                "flex items-center justify-between",
                appName ? "h-16" : "h-12"
              )}>
                {appName && (
                  <Link to="/" className="text-xl font-bold">
                    {appName}
                  </Link>
                )}
                <div className={cn(
                  "flex items-center gap-2",
                  !appName && "ml-auto"
                )}>
                  <ThemeSelector />
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>
    </div>
  );
}
