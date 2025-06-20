import React from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Spacing } from "@/constants";

interface CTASectionProps {
  onAction?: (action: string) => void; // Rendre optionnel
}

export const CTASection: React.FC<CTASectionProps> = ({ onAction }) => {
  const handleSignUp = () => {
    // Navigation directe vers l'écran d'inscription
    router.push("/signup");
  };

  const handleLogin = () => {
    // Navigation vers l'écran de connexion
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Button
        title="Commencer gratuitement"
        onPress={handleSignUp}
        variant="primary"
      />
      <Button
        title="J'ai déjà un compte"
        onPress={handleLogin}
        variant="secondary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxl,
  },
});
