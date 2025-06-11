import { useQuitStore } from "@/store/useQuitStore";
import { useEffect } from "react";
import DeleteConfirmation from "@/components/app/DeleteConfirmation";
import QuitForm from "@/components/app/QuitForm";
import QuitList from "@/components/app/QuitList";
import AppHeader from "@/components/app/AppHeader";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

function QuitTrackerApp() {
  const { updateCurrentTime, items } = useQuitStore();

  // Update current time every second for live countdown
  useEffect(() => {
    let timer = null;
    if (items.length > 0) {
      timer = setInterval(() => {
        updateCurrentTime();
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [items.length, updateCurrentTime]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AppHeader />
        <main role="main" aria-label="Quit tracking dashboard">
          <QuitList />
        </main>
        <DeleteConfirmation />
        {items.length > 0 && (
          <>
            <div className="block md:hidden fixed pt-4 bottom-[10px] right-[10px]">
              <QuitForm buttonType="icon" />
            </div>
            <div className="hidden md:flex sticky pt-4 bottom-4 left-0 right-0 justify-center">
              <QuitForm />
            </div>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QuitTrackerApp />
    </ThemeProvider>
  );
}

export default App;
