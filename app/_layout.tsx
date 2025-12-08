import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initializeApp } from "../src/utils/appInit";

export default function RootLayout() {
  useEffect(() => {
    initializeApp().catch(console.error);
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index"
          // component={Splashscreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="login"
          // component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register"
          // component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="light" backgroundColor="#1e1b4b" />
    </SafeAreaProvider>
  );
}
