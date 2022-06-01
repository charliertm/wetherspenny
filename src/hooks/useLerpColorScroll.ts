import { useEffect, useState } from "react";
import colorInterpolate from "../utils/colorInterpolate";

export default function useLerpColorScroll(
  colorA: string,
  colorB: string
): string {
  const [color, setColor] = useState<string>("");
  const [scrollRatio, setScrollRatio] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollRatio(
        window.scrollY / window.document.documentElement.scrollHeight
      );
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setColor(colorInterpolate(colorA, colorB, scrollRatio));
  }, [scrollRatio]);

  return color;
}
