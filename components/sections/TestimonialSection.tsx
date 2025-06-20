import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, Spacing } from '@/constants';

export const TestimonialSection: React.FC = () => {
  return (
    <Card variant="testimonial" style={styles.container}>
      <ThemedText 
        style={styles.quote}
        lightColor="rgba(255, 255, 255, 0.3)"
        darkColor="rgba(255, 255, 255, 0.3)"
      >
        &quot;
      </ThemedText>
      <ThemedText 
        style={styles.text}
        lightColor={Colors.emailight.text.light}
        darkColor={Colors.emailight.text.light}
      >
        Fini les blocages ! Je tape mes idées en vrac et l'app me sort des e-mails parfaits. Un gain de temps énorme !
      </ThemedText>
      <ThemedText 
        style={styles.author}
        lightColor={Colors.emailight.text.muted}
        darkColor={Colors.emailight.text.muted}
      >
        — Sarah, Chef de projet
      </ThemedText>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxxl,
    position: 'relative',
  },
  quote: {
    fontSize: Typography.sizes.xxxl,
    position: 'absolute',
    top: -8,
    left: 16,
    fontFamily: 'serif',
  },
  text: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.normal,
    marginBottom: Spacing.md,
    fontStyle: 'italic',
    fontWeight: Typography.weights.medium,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  author: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
});
