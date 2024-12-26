import { useState, useEffect } from "react";

const useViewportHeight = (vh: number): number => {
  const [pixelValue, setPixelValue] = useState(
    () => (vh / 100) * window.innerHeight
  );

  useEffect(() => {
    const handleResize = () => {
      setPixelValue((vh / 100) * window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [vh]);

  return pixelValue;
};

export default useViewportHeight;
