import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { Logo } from '../components/ui/Logo';
import { Colors, Spacing, Typography, BorderRadius } from '../constants';
import { apiService } from '../services/api';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiService.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data && response.data.token) {
        // Stocker le token et les données utilisateur
        // TODO: Implémenter le storage sécurisé (AsyncStorage/SecureStore)
        
        Alert.alert(
          'Connexion réussie !',
          'Bienvenue dans Emailight !',
          [
            {
              text: 'Continuer',
              onPress: () => {
                // Navigation vers l'app principale (pour l'instant retour à l'index)
                router.replace('/'); // Temporaire, jusqu'à création de la route dashboard
              },
            },
          ]
        );
      } else {
        setErrors({ general: response.message || 'Erreur de connexion' });
      }
    } catch (error: any) {
      console.error('Erreur connexion:', error);
      
      // Gestion des erreurs spécifiques selon votre API
      if (error.status === 401) {
        setErrors({ general: 'Email ou mot de passe incorrect' });
      } else if (error.status === 404) {
        setErrors({ email: 'Aucun compte trouvé avec cet email' });
      } else {
        setErrors({ general: 'Erreur de connexion. Veuillez réessayer.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const goToSignUp = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Mot de passe oublié',
      'Cette fonctionnalité sera bientôt disponible !',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 50,
              paddingBottom: Math.max(insets.bottom + 20, Spacing.xxxl),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header simple avec bouton retour */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ThemedText
                style={styles.backButtonText}
                lightColor={Colors.emailight.text.primary}
              >
                ‹
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <Logo size={80} />
          </View>

          {/* Titre de bienvenue */}
          <ThemedText
            style={styles.welcomeTitle}
            lightColor={Colors.emailight.text.primary}
          >
            Bon retour !
          </ThemedText>

          <ThemedText
            style={styles.subtitle}
            lightColor={Colors.emailight.text.secondary}
          >
            Connectez-vous à votre compte
          </ThemedText>

          {/* Message d'erreur général */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>
                {errors.general}
              </ThemedText>
            </View>
          )}

          {/* Champ Email */}
          <View style={styles.inputGroup}>
            <ThemedText
              style={styles.inputLabel}
              lightColor={Colors.emailight.text.primary}
            >
              Adresse email
            </ThemedText>
            <TextInput
              style={[
                styles.textInput,
                errors.email && styles.inputError,
              ]}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="jean@example.com"
              placeholderTextColor="rgba(74, 55, 40, 0.5)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
            {errors.email && (
              <ThemedText style={styles.fieldError}>
                {errors.email}
              </ThemedText>
            )}
          </View>

          {/* Champ Mot de passe */}
          <View style={styles.inputGroup}>
            <View style={styles.passwordHeader}>
              <ThemedText
                style={styles.inputLabel}
                lightColor={Colors.emailight.text.primary}
              >
                Mot de passe
              </ThemedText>
              <TouchableOpacity onPress={handleForgotPassword}>
                <ThemedText
                  style={styles.forgotPasswordLink}
                  lightColor={Colors.emailight.primary}
                >
                  Mot de passe oublié ?
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  styles.passwordInput,
                  errors.password && styles.inputError,
                ]}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Votre mot de passe"
                placeholderTextColor="rgba(74, 55, 40, 0.5)"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <ThemedText
                  style={styles.eyeIcon}
                  lightColor={Colors.emailight.primary}
                >
                  {showPassword ? '🙈' : '👁️'}
                </ThemedText>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <ThemedText style={styles.fieldError}>
                {errors.password}
              </ThemedText>
            )}
          </View>

          {/* Bouton Submit */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.emailight.primary, Colors.emailight.primaryDark]}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.emailight.text.light} size="small" />
              ) : (
                <ThemedText
                  style={styles.submitButtonText}
                  lightColor={Colors.emailight.text.light}
                >
                  Se connecter
                </ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText
              style={styles.dividerText}
              lightColor={Colors.emailight.text.secondary}
            >
              Nouveau sur Emailight ?
            </ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* SignUp Link */}
          <TouchableOpacity onPress={goToSignUp}>
            <ThemedText
              style={styles.signupLink}
              lightColor={Colors.emailight.primary}
            >
              Créer un compte
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4f0',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: Typography.weights.bold,
    color: Colors.emailight.text.primary,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    paddingTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  errorContainer: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: '#dc3545',
    fontSize: Typography.sizes.sm,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.emailight.text.primary,
  },
  forgotPasswordLink: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  textInput: {
    borderWidth: 2,
    borderColor: 'rgba(74, 55, 40, 0.2)',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.sizes.md,
    backgroundColor: '#ffffff',
    color: Colors.emailight.text.primary,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputError: {
    borderColor: '#dc3545',
    backgroundColor: 'rgba(220, 53, 69, 0.05)',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.lg,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  eyeIcon: {
    fontSize: 20,
  },
  fieldError: {
    color: '#dc3545',
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
  },
  submitButton: {
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: Colors.emailight.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(74, 55, 40, 0.2)',
  },
  dividerText: {
    marginHorizontal: Spacing.lg,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  signupLink: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semiBold,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});