import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeroSection } from "../components/sections/HeroSection";
import { ValuePropsSection } from "../components/sections/ValuePropsSection";
import { TestimonialSection } from "../components/sections/TestimonialSection";
import { CTASection } from "../components/sections/CTASection";
import { TrustSection } from "../components/sections/TrustSection";
import { Colors, Spacing } from "../constants";

export default function HomeScreen() {
  const screenData = Dimensions.get("screen"); // Hauteur totale de l'écran
  const insets = useSafeAreaInsets();

  const handleAction = (action: string) => {
    Alert.alert("Action", `${action} - Redirection vers l'authentification...`);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/happy.jpg")}
        style={[
          styles.backgroundImage,
          {
            width: screenData.width,
            height: screenData.height,
          },
        ]}
        resizeMode="cover"
      >
        {/* Overlay qui couvre TOUTE la hauteur d'écran */}
        <View
          style={[
            styles.overlay,
            {
              width: screenData.width,
              height: screenData.height,
            },
          ]}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              // Espace pour la status bar + un peu plus
              paddingTop: Platform.OS === "ios" ? insets.top + 20 : 50,
              // Espace pour la barre du bas (iPhone avec encoche)
              paddingBottom: Math.max(insets.bottom + 20, Spacing.xxxl),
            },
          ]}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <HeroSection />
          <ValuePropsSection />
          <TestimonialSection />
          <CTASection onAction={handleAction} />
          <TrustSection />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // Fallback au cas où
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: Colors.emailight.background.overlay,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    zIndex: 2, // Au-dessus de l'overlay
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
  },
});
