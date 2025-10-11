import { StyleSheet } from 'react-native';
import { FONTS, FONT_SIZES, FONT_WEIGHTS } from '../constants/fonts';

// Estilos de tipografía reutilizables
export const typography = StyleSheet.create({
  // Barlow Regular
  h1: {
    fontFamily: FONTS.BARLOW_BOLD,
    fontSize: FONT_SIZES.XXXL,
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: 40,
  },
  h2: {
    fontFamily: FONTS.BARLOW_SEMIBOLD,
    fontSize: FONT_SIZES.XXL,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    lineHeight: 32,
  },
  h3: {
    fontFamily: FONTS.BARLOW_MEDIUM,
    fontSize: FONT_SIZES.XL,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    lineHeight: 28,
  },
  body: {
    fontFamily: FONTS.BARLOW_REGULAR,
    fontSize: FONT_SIZES.MD,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: FONTS.BARLOW_REGULAR,
    fontSize: FONT_SIZES.SM,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: 20,
  },
  caption: {
    fontFamily: FONTS.BARLOW_REGULAR,
    fontSize: FONT_SIZES.XS,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: 16,
  },

  // Barlow Condensed
  h1Condensed: {
    fontFamily: FONTS.BARLOW_CONDENSED_BOLD,
    fontSize: FONT_SIZES.XXXL,
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: 36,
  },
  h2Condensed: {
    fontFamily: FONTS.BARLOW_CONDENSED_SEMIBOLD,
    fontSize: FONT_SIZES.XXL,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    lineHeight: 28,
  },
  bodyCondensed: {
    fontFamily: FONTS.BARLOW_CONDENSED_REGULAR,
    fontSize: FONT_SIZES.MD,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: 22,
  },

  // Barlow Semi Condensed
  h1SemiCondensed: {
    fontFamily: FONTS.BARLOW_SEMI_CONDENSED_BOLD,
    fontSize: FONT_SIZES.XXXL,
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: 38,
  },
  h2SemiCondensed: {
    fontFamily: FONTS.BARLOW_SEMI_CONDENSED_SEMIBOLD,
    fontSize: FONT_SIZES.XXL,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    lineHeight: 30,
  },
  bodySemiCondensed: {
    fontFamily: FONTS.BARLOW_SEMI_CONDENSED_REGULAR,
    fontSize: FONT_SIZES.MD,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: 23,
  },
});
