import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../components/ThemedText";
import { Logo } from "../components/ui/Logo";
import { BorderRadius, Colors, Spacing, Typography } from "../constants";
import { apiService } from "../services/api";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation nom
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Le nom ne peut pas dépasser 100 caractères";
    }

    // Validation email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiService.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data && response.data.token) {
        // Stocker le token et les données utilisateur
        // TODO: Implémenter le storage sécurisé (AsyncStorage/SecureStore)

        Alert.alert(
          "Succès !",
          "Votre compte a été créé avec succès. Bienvenue dans Emailight !",
          [
            {
              text: "Commencer",
              onPress: () => {
                // Navigation vers l'app principale
                router.replace("/dashboard");
              },
            },
          ]
        );
      } else {
        setErrors({
          general:
            response.message ||
            "Une erreur est survenue lors de la création du compte",
        });
      }
    } catch (error: any) {
      console.error("Erreur inscription:", error);

      // Gestion des erreurs spécifiques selon votre API
      if (error.status === 409 || error.message?.includes("déjà utilisé")) {
        setErrors({ email: "Un compte avec cet email existe déjà" });
      } else if (error.message?.includes("validation")) {
        setErrors({
          general: "Données invalides. Veuillez vérifier vos informations.",
        });
      } else {
        setErrors({ general: "Erreur de connexion. Veuillez réessayer." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const goToLogin = () => {
    // Navigation vers l'écran de connexion
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Platform.OS === "ios" ? insets.top + 20 : 50,
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
            Bienvenue !
          </ThemedText>

          <ThemedText
            style={styles.subtitle}
            lightColor={Colors.emailight.text.secondary}
          >
            Créez votre compte pour commencer.
          </ThemedText>

          {/* Message d'erreur général */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{errors.general}</ThemedText>
            </View>
          )}

          {/* Champ Nom */}
          <View style={styles.inputGroup}>
            <ThemedText
              style={styles.inputLabel}
              lightColor={Colors.emailight.text.primary}
            >
              Nom complet
            </ThemedText>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Jean Dupont"
              placeholderTextColor="rgba(74, 55, 40, 0.5)" // Placeholder plus contrasté
              maxLength={100}
              autoCapitalize="words"
              autoCorrect={false}
            />
            {errors.name && (
              <ThemedText style={styles.fieldError}>{errors.name}</ThemedText>
            )}
          </View>

          {/* Champ Email */}
          <View style={styles.inputGroup}>
            <ThemedText
              style={styles.inputLabel}
              lightColor={Colors.emailight.text.primary}
            >
              Adresse email
            </ThemedText>
            <TextInput
              style={[styles.textInput, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              placeholder="jean@example.com"
              placeholderTextColor="rgba(74, 55, 40, 0.5)" // Placeholder plus contrasté
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
            {errors.email && (
              <ThemedText style={styles.fieldError}>{errors.email}</ThemedText>
            )}
          </View>

          {/* Champ Mot de passe */}
          <View style={styles.inputGroup}>
            <ThemedText
              style={styles.inputLabel}
              lightColor={Colors.emailight.text.primary}
            >
              Mot de passe
            </ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  styles.passwordInput,
                  errors.password && styles.inputError,
                ]}
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                placeholder="Minimum 6 caractères"
                placeholderTextColor="rgba(74, 55, 40, 0.5)" // Placeholder plus contrasté
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
                  {showPassword ? "🙈" : "👁️"}
                </ThemedText>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <ThemedText style={styles.fieldError}>
                {errors.password}
              </ThemedText>
            )}
          </View>

          {/* Champ Confirmation mot de passe */}
          <View style={styles.inputGroup}>
            <ThemedText
              style={styles.inputLabel}
              lightColor={Colors.emailight.text.primary}
            >
              Confirmer le mot de passe
            </ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  styles.passwordInput,
                  errors.confirmPassword && styles.inputError,
                ]}
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                placeholder="Retapez votre mot de passe"
                placeholderTextColor="rgba(74, 55, 40, 0.5)" // Placeholder plus contrasté
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <ThemedText
                  style={styles.eyeIcon}
                  lightColor={Colors.emailight.primary}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </ThemedText>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <ThemedText style={styles.fieldError}>
                {errors.confirmPassword}
              </ThemedText>
            )}
          </View>

          {/* Bouton Submit */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
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
                <ActivityIndicator
                  color={Colors.emailight.text.light}
                  size="small"
                />
              ) : (
                <ThemedText
                  style={styles.submitButtonText}
                  lightColor={Colors.emailight.text.light}
                >
                  Créer mon compte
                </ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Terms */}
          <ThemedText
            style={styles.termsText}
            lightColor={Colors.emailight.text.secondary}
          >
            En vous inscrivant, vous acceptez nos{" "}
            <ThemedText
              style={styles.linkText}
              lightColor={Colors.emailight.primary}
            >
              Conditions d'utilisation
            </ThemedText>{" "}
            et notre{" "}
            <ThemedText
              style={styles.linkText}
              lightColor={Colors.emailight.primary}
            >
              Politique de confidentialité
            </ThemedText>
          </ThemedText>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText
              style={styles.dividerText}
              lightColor={Colors.emailight.text.secondary}
            >
              Déjà un compte ?
            </ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link */}
          <TouchableOpacity onPress={goToLogin}>
            <ThemedText
              style={styles.loginLink}
              lightColor={Colors.emailight.primary}
            >
              Se connecter
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
    backgroundColor: "#f8f4f0", // Fond beige très clair pour plus de contraste
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl, // Padding minimal sur les côtés
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xxxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff", // Fond blanc pur
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: Typography.weights.bold, // Plus gras
    color: Colors.emailight.text.primary, // Couleur explicite
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
    paddingTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    textAlign: "center",
    marginBottom: Spacing.xxxl,
  },
  mainTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xxxl,
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: "#dc3545",
    fontSize: Typography.sizes.sm,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold, // Plus gras pour plus de contraste
    marginBottom: Spacing.sm,
    color: Colors.emailight.text.primary, // Couleur explicite
  },
  textInput: {
    borderWidth: 2,
    borderColor: "rgba(74, 55, 40, 0.2)", // Bordure plus foncée
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: Typography.sizes.md,
    backgroundColor: "#ffffff", // Fond blanc pur
    color: Colors.emailight.text.primary,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputError: {
    borderColor: "#dc3545",
    backgroundColor: "rgba(220, 53, 69, 0.05)",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: Spacing.lg,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  eyeIcon: {
    fontSize: 20,
  },
  fieldError: {
    color: "#dc3545",
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
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  termsText: {
    fontSize: Typography.sizes.xs,
    textAlign: "center",
    marginBottom: Spacing.xxl,
    lineHeight: Typography.lineHeights.normal,
  },
  linkText: {
    fontWeight: Typography.weights.medium,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(74, 55, 40, 0.2)",
  },
  dividerText: {
    marginHorizontal: Spacing.lg,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  loginLink: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semiBold,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
});
