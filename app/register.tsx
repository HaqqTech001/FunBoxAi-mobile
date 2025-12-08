import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../src/utils/colors";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const user = { name, email, password };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("isLoggedIn", "true");

      Alert.alert("Success", "Account created!");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleShowPassword = () => {
    setShowPassword((showstate) => {
      return !showstate;
    });
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("isLoggedIn", "false");
    router.replace("/(tabs)");
  };

  return (
    //  <SafeAreaView style={styles.container}
    //  edges={["top", "bottom"]}>
    <View style={styles.container}>
      <LinearGradient
        colors={[THEME.background, THEME.surface]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, paddingHorizontal: 24 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join FunBox AI</Text>

            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor={THEME.text.muted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={THEME.text.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordInput}>
                <View style={{width:"85%"}}>
                  <TextInput
                     style={{color:"white",fontSize: 16,paddingInlineStart:8}}
                    placeholder="Create a password"
                    placeholderTextColor={THEME.text.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={showPassword ? false : true}
                  />
                </View>
                <TouchableOpacity onPress={handleShowPassword} style={{width:"10%"}}> 
                <View>
                  {showPassword ? (
                    <AntDesign name="eye-invisible" size={24} color="white" />
                  ) : (
                    <AntDesign name="eye" size={24} color="white" />
                  )}
                </View>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.passwordInput}>
                <View style={{width:"85%"}}>
                  <TextInput
                     style={{color:"white",fontSize: 16, paddingInlineStart:8}}
                    placeholder="Confirm your password"
                    placeholderTextColor={THEME.text.muted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={showPassword ? false : true}
                  />
                </View>
                <TouchableOpacity onPress={handleShowPassword} style={{width:"10%"}}> 
                <View>
                  {showPassword ? (
                    <AntDesign name="eye-invisible" size={24} color="white" />
                  ) : (
                    <AntDesign name="eye" size={24} color="white" />
                  )}
                </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            {/* <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Confirm your password"
                placeholderTextColor={THEME.text.muted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View> */}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, { opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={THEME.gradients.primary}
                style={styles.gradientButton}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Skip */}
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip Registration</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: THEME.primary }}>
                  Sign In
                </Link>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
    /* </SafeAreaView> */
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: THEME.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: { marginBottom: 20 },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: THEME.text.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: THEME.text.primary,
    borderWidth: 1,
    borderColor: THEME.text.muted,
  },
  passwordInput: {
   flexDirection:"row",
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 6,
    color: THEME.text.primary,
    borderWidth: 1,
    borderColor: THEME.text.muted,
    justifyContent: "space-between",
    alignItems: "center"
  },
  registerButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 16,
  },
  gradientButton: { paddingVertical: 16, alignItems: "center" },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: THEME.text.primary,
  },
  skipButton: {
    justifyContent: "center",
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.text.muted,
    borderRadius: 16,
    marginTop: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: THEME.text.secondary,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: THEME.text.secondary,
  },
});
