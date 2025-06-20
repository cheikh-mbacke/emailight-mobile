import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Largeur de référence (iPhone 12)
const widthBaseScale = SCREEN_WIDTH / 390;
const heightBaseScale = SCREEN_HEIGHT / 844;

function normalize(size: number, based: 'width' | 'height' = 'width'): number {
  const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// Largeur responsive
export const widthPixel = (size: number): number => {
  return normalize(size, 'width');
};

// Hauteur responsive
export const heightPixel = (size: number): number => {
  return normalize(size, 'height');
};

// Font responsive
export const fontPixel = (size: number): number => {
  return heightPixel(size);
};
