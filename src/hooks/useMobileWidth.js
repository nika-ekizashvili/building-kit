import { useState, useEffect } from "react";

const getWidth = () => {
  if (typeof window !== "undefined") {
    return (
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    );
  }
};

export const useMobileWidth = () => {
  let [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1000
  );

  useEffect(() => {
    let timeoutId = null;
    const resizeListener = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => setWidth(getWidth()), 150);
    };

    window.addEventListener("resize", resizeListener);

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", resizeListener);
      }
    };
  }, []);

  return { width };
};
