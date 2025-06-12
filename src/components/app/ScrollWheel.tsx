"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ScrollWheelProps {
  options: Array<{ value: number; label: string }>;
  value: number;
  onChange: (value: number) => void;
  itemHeight?: number;
}

export default function ScrollWheel({
  options,
  value,
  onChange,
  itemHeight = 50,
}: ScrollWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserInteractingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef(0);
  const visibleItems = 3; // Fixed to show exactly 3 items
  const paddingItems = 1; // 1 item above and below the center item

  // Create extended options array with padding
  const extendedOptions = [
    ...Array(paddingItems)
      .fill(null)
      .map(() => ({ value: -1, label: "" })),
    ...options,
    ...Array(paddingItems)
      .fill(null)
      .map(() => ({ value: -1, label: "" })),
  ];

  const scrollToValue = useCallback(
    (targetValue: number, smooth = false) => {
      const index = options.findIndex((option) => option.value === targetValue);
      if (index !== -1 && containerRef.current) {
        isProgrammaticScrollRef.current = true;
        const scrollTop = index * itemHeight;

        if (smooth) {
          containerRef.current.scrollTo({
            top: scrollTop,
            behavior: "smooth",
          });
        } else {
          containerRef.current.scrollTop = scrollTop;
        }

        // Reset the flag after animation completes
        setTimeout(
          () => {
            isProgrammaticScrollRef.current = false;
          },
          smooth ? 300 : 50
        );
      }
    },
    [options, itemHeight]
  );

  const updateSelectedValue = useCallback(
    (scrollTop: number) => {
      const index = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
      const option = options[clampedIndex];

      if (option && option.value !== value && option.value !== -1) {
        onChange(option.value);
      }
    },
    [options, itemHeight, value, onChange]
  );

  const snapToNearestItem = useCallback(() => {
    if (
      !containerRef.current ||
      isProgrammaticScrollRef.current ||
      isUserInteractingRef.current
    ) {
      return;
    }

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
    const snapScrollTop = clampedIndex * itemHeight;

    // Only snap if we're not already at the correct position
    if (Math.abs(scrollTop - snapScrollTop) > 2) {
      isProgrammaticScrollRef.current = true;
      containerRef.current.scrollTo({
        top: snapScrollTop,
        behavior: "smooth",
      });

      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 300);
    }

    // Update the selected value
    updateSelectedValue(snapScrollTop);
  }, [options, itemHeight, updateSelectedValue]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isProgrammaticScrollRef.current) return;

    const now = Date.now();
    const scrollTop = containerRef.current.scrollTop;
    lastScrollTimeRef.current = now;

    // Clear existing timeout and animation frame
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Update value immediately during scroll for responsive feedback
    updateSelectedValue(scrollTop);

    // Handle snapping based on interaction state
    if (isUserInteractingRef.current) {
      // User is actively scrolling, don't snap yet
      return;
    } else {
      // User has stopped scrolling, set up delayed snapping
      scrollTimeoutRef.current = setTimeout(() => {
        // Double check that user hasn't started interacting again
        if (
          !isUserInteractingRef.current &&
          Date.now() - lastScrollTimeRef.current > 100
        ) {
          snapToNearestItem();
        }
      }, 150);
    }
  }, [updateSelectedValue, snapToNearestItem]);

  const handleInteractionStart = useCallback(() => {
    isUserInteractingRef.current = true;

    // Clear any pending snapping
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    isUserInteractingRef.current = false;

    // Delay the snapping to allow for momentum scrolling to settle
    setTimeout(() => {
      if (!isUserInteractingRef.current) {
        snapToNearestItem();
      }
    }, 250);
  }, [snapToNearestItem]);

  const handleTouchCancel = useCallback(() => {
    handleInteractionEnd();
  }, [handleInteractionEnd]);

  // Initialize scroll position when value changes externally
  useEffect(() => {
    if (!isUserInteractingRef.current && !isProgrammaticScrollRef.current) {
      scrollToValue(value);
    }
  }, [value, scrollToValue]);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Touch events for mobile
    container.addEventListener("touchstart", handleInteractionStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleInteractionEnd, {
      passive: true,
    });
    container.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });

    // Mouse events for desktop
    container.addEventListener("mousedown", handleInteractionStart, {
      passive: true,
    });
    container.addEventListener("mouseup", handleInteractionEnd, {
      passive: true,
    });
    container.addEventListener("mouseleave", handleInteractionEnd, {
      passive: true,
    });

    return () => {
      container.removeEventListener("touchstart", handleInteractionStart);
      container.removeEventListener("touchend", handleInteractionEnd);
      container.removeEventListener("touchcancel", handleTouchCancel);
      container.removeEventListener("mousedown", handleInteractionStart);
      container.removeEventListener("mouseup", handleInteractionEnd);
      container.removeEventListener("mouseleave", handleInteractionEnd);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleInteractionStart, handleInteractionEnd, handleTouchCancel]);

  return (
    <div className="relative w-full scroll-wheel-container">
      {/* Background */}
      <div className="absolute inset-0 p-1">
        <div className="w-full h-full bg-card/50 rounded-lg border border-border/20"></div>
      </div>
      {/* Selection highlight - positioned at the center (2nd item, index 1) */}
      <div
        className="absolute left-1 right-1 bg-primary/15 border-2 border-primary/40 rounded-lg z-10 shadow-inner"
        style={{
          top: `${Math.floor(visibleItems / 2) * itemHeight + 1}px`, // Center item
          height: `${itemHeight}px`,
        }}
      />
      {/* Scroll container - fixed height for exactly 3 items */}
      <div
        ref={containerRef}
        className="relative z-20 overflow-y-scroll scrollbar-hide touch-pan-y w-full"
        style={{
          height: `${visibleItems * itemHeight}px`,
          WebkitOverflowScrolling: "touch", // Better iOS scrolling
          scrollBehavior: "auto", // Prevent conflicting smooth scroll
          minWidth: "100%", // Ensure minimum width
          maxWidth: "100%", // Prevent width expansion
        }}
        onScroll={handleScroll}
      >
        {extendedOptions.map((option, index) => (
          <div
            key={`${option.value}-${index}`}
            className={`px-6 flex items-center justify-center font-bold transition-all duration-200 cursor-pointer select-none touch-manipulation w-full scroll-wheel-item ${
              option.value === -1
                ? "opacity-0 pointer-events-none"
                : "opacity-50 hover:opacity-80 active:opacity-90"
            } ${
              option.value === value
                ? "text-primary text-xl font-extrabold scale-110 drop-shadow-md"
                : "text-muted-foreground text-lg"
            }`}
            style={{
              height: `${itemHeight}px`,
              minWidth: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
            onClick={() => {
              if (option.value !== -1) {
                isUserInteractingRef.current = false;
                onChange(option.value);
                scrollToValue(option.value, true);
              }
            }}
            onTouchStart={(e) => {
              // Prevent click delay on mobile
              e.preventDefault();
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
