// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { initializeApp } from "../src/utils/appInit";

// export default function RootLayout() {
//   useEffect(() => {
//     initializeApp().catch(console.error);
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen 
//           name="index"
//           // component={Splashscreen}
//           options={{ headerShown: false }}
//         />

//         <Stack.Screen
//           name="login"
//           // component={HomeScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="register"
//           // component={HomeScreen}
//           options={{ headerShown: false }}
//         />
//       </Stack>
//       <StatusBar style="light" backgroundColor="#1e1b4b" />
//     </SafeAreaProvider>
//   );
// }


import { isOnboardingComplete } from "@/src/utils/storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initializeApp } from "../src/utils/appInit";
import Onboarding from "./onboarding";
import SplashScreen from "./splash";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    initializeApp().catch(console.error);
  }, []);
const handleSplashComplete = async () => {
  setShowSplash(false);
  try {
    const completed = await isOnboardingComplete();
    if (!completed) {  
      setShowOnboarding(true);
    }
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    setShowOnboarding(true);
  }
};
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Save that onboarding is completed
  };

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <SplashScreen onComplete={handleSplashComplete} />
        <StatusBar style="light" backgroundColor="#1e1b4b" />
      </SafeAreaProvider>
    );
  }

  if (showOnboarding) {
    return (
      <SafeAreaProvider>
        <Onboarding />
        <StatusBar style="light" backgroundColor="#1e1b4b" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="light" backgroundColor="#1e1b4b" />
    </SafeAreaProvider>
  );
}