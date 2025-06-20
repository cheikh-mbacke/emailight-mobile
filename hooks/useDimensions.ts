import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

interface WindowDimensions {
  width: number;
  height: number;
}

export const useDimensions = (): WindowDimensions => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get("window"));

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

// constants/Spacing.tsx (version finale simple)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
