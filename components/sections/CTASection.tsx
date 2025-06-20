import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants';

interface CTASectionProps {
  onAction: (action: string) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onAction }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Commencer gratuitement"
        onPress={() => onAction('Commencer gratuitement')}
        variant="primary"
      />
      <Button
        title="J'ai déjà un compte"
        onPress={() => onAction('Connexion')}
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
