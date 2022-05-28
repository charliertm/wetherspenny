import { useEffect, useState } from "react";
import colorInterpolate from "../utils/colorInterpolate";

export default function useLerpColorScroll(colorA, colorB) {
  const [color, setColor] = useState();
  const [scrollRatio, setScrollRatio] = useState(0);

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
