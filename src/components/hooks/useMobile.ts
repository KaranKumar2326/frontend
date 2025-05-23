import { useState, useEffect, useMemo } from "react";

type Breakpoints = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
};

const defaultBreakpoints: Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type BreakpointKey = keyof Breakpoints;

export function useMobile(breakpoint: BreakpointKey = "md", customBreakpoints?: Partial<Breakpoints>) {
  const breakpoints = useMemo(
    () => ({ ...defaultBreakpoints, ...customBreakpoints }),
    [customBreakpoints]
  );

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < breakpoints[breakpoint] : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoints[breakpoint]);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint, breakpoints]);

  return isMobile;
}

export default useMobile;
