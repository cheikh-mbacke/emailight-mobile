import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants';

interface CardProps extends ViewProps {
  variant?: 'default' | 'testimonial' | 'trust';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  variant = 'default', 
  ...props 
}) => {
  const cardStyles: ViewStyle[] = [
    styles.baseCard,
    styles[variant],
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.emailight.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  default: {
    backgroundColor: Colors.emailight.background.card,
    borderWidth: 1,
    borderColor: Colors.emailight.background.cardBorder,
  },
  testimonial: {
    backgroundColor: Colors.emailight.background.testimonial,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0.4,
  },
  trust: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: Colors.emailight.background.cardBorder,
    shadowOpacity: 0.2,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
});
