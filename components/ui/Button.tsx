import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyles: ViewStyle[] = [
    styles.baseButton,
    variant === 'secondary' ? styles.secondary : undefined,
    disabled ? styles.disabled : undefined,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textStyles: TextStyle[] = [
    styles.baseText,
    styles[`${variant}Text` as const],
    disabled ? styles.disabledText : undefined,
    textStyle,
  ].filter(Boolean) as TextStyle[];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={[styles.baseButton, styles.primary, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={[Colors.emailight.primary, Colors.emailight.primaryDark]}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={textStyles}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.emailight.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  baseText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  primary: {
    marginBottom: Spacing.md,
  },
  primaryText: {
    color: Colors.emailight.text.light,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  secondary: {
    backgroundColor: Colors.emailight.background.card,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderWidth: 2,
    borderColor: Colors.emailight.background.cardBorder,
  },
  secondaryText: {
    color: Colors.emailight.text.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
});
