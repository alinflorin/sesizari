import { useState, useEffect } from "react";

const useViewportWidth = (vw: number): number => {
  const [pixelValue, setPixelValue] = useState(
    () => (vw / 100) * window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setPixelValue((vw / 100) * window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [vw]);

  return pixelValue;
};

export default useViewportWidth;
