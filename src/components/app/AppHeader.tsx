"use client";

import { useColorMood } from "@/hooks/use-color-mood";
import { Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ColorMoodSelector } from "@/components/color-mood-selector";

export default function AppHeader() {
  const { currentMood } = useColorMood();

  return (
    <header className="text-center mb-8" role="banner">
      <div className="flex justify-between items-center mb-4">
        <div
          className="flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <h1 className="text-2xl font-bold text-text mb-2">Quit Toxic</h1>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-hover focus:ring-2 focus:ring-primary transition-all duration-200"
                aria-label="Open settings"
              >
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] md:w-[500px] bg-background border-border shadow-lg">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-text mb-2">Color Mood</h4>
                  <p className="text-sm text-text-secondary mb-3">
                    Current mood:
                    <span className="capitalize font-medium text-primary">
                      {currentMood}
                    </span>
                  </p>
                </div>
                <ColorMoodSelector variant="compact" />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
