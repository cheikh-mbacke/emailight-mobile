import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { ThemedText } from "../ThemedText";
import { Logo } from "../ui/Logo";
import { Colors, Typography, Spacing, BorderRadius } from "../../constants";

export const HeroSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo size={70} />
      </View>

      <ThemedText
        style={styles.appName}
        lightColor={Colors.emailight.text.light}
        darkColor={Colors.emailight.text.light}
      >
        Emailight
      </ThemedText>

      <View style={styles.taglineContainer}>
        <ThemedText
          style={styles.tagline}
          lightColor={Colors.emailight.text.light}
          darkColor={Colors.emailight.text.light}
        >
          Écrivez naturellement, nous nous occupons du style parfait pour chaque
          situation
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
    paddingTop: Platform.OS === "android" ? Spacing.md : 0,
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.extraBold,
    marginBottom: Spacing.sm,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  taglineContainer: {
    backgroundColor: Colors.emailight.background.tagline,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.sm,
  },
  tagline: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
    lineHeight: Typography.lineHeights.relaxed,
    fontWeight: Typography.weights.semiBold,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});
