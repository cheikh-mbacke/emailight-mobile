import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, Spacing } from '@/constants';

interface TrustItemProps {
  icon: string;
  text: string;
}

const TrustItem: React.FC<TrustItemProps> = ({ icon, text }) => (
  <View style={styles.trustItem}>
    <ThemedText 
      style={styles.trustIcon}
      lightColor={Colors.emailight.primary}
      darkColor={Colors.emailight.primary}
    >
      {icon}
    </ThemedText>
    <ThemedText 
      style={styles.trustText}
      lightColor={Colors.emailight.text.primary}
      darkColor={Colors.emailight.text.primary}
    >
      {text}
    </ThemedText>
  </View>
);

export const TrustSection: React.FC = () => {
  return (
    <Card variant="trust" style={styles.container}>
      <TrustItem icon="🔒" text="Sécurisé" />
      <TrustItem icon="⭐" text="4.8/5" />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustIcon: {
    fontSize: Typography.sizes.sm,
    marginRight: Spacing.xs,
  },
  trustText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semiBold,
  },
});
