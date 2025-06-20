import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { Card } from "../ui/Card";
import { Colors, Typography, Spacing } from "../../constants";

interface ValuePropData {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const VALUE_PROPS_DATA: ValuePropData[] = [
  {
    id: "1",
    icon: "🎨",
    title: "Styles adaptés",
    description: "Professionnel, amical, formel ou décontracté",
  },
  {
    id: "2",
    icon: "🧠",
    title: "IA intelligente",
    description: "Comprend le contexte et l'intention",
  }
];

interface ValuePropProps {
  icon: string;
  title: string;
  description: string;
}

const ValueProp: React.FC<ValuePropProps> = ({ icon, title, description }) => {
  return (
    <Card style={styles.valuePropContainer}>
      <ThemedText style={styles.icon}>{icon}</ThemedText>
      <ThemedText
        style={styles.title}
        lightColor={Colors.emailight.text.primary}
        darkColor={Colors.emailight.text.primary}
      >
        {title}
      </ThemedText>
      <ThemedText
        style={styles.description}
        lightColor={Colors.emailight.text.secondary}
        darkColor={Colors.emailight.text.secondary}
      >
        {description}
      </ThemedText>
    </Card>
  );
};

export const ValuePropsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {VALUE_PROPS_DATA.map((prop) => (
        <ValueProp
          key={prop.id}
          icon={prop.icon}
          title={prop.title}
          description={prop.description}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxxl,
  },
  valuePropContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: Typography.sizes.xl,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  description: {
    fontSize: Typography.sizes.xs,
    textAlign: "center",
    lineHeight: Typography.lineHeights.tight,
    fontWeight: Typography.weights.medium,
  },
});
