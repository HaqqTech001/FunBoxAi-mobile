import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEvent } from "expo";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableWithoutFeedback } from "react-native";

export default function Splashscreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [shouldShowVideo, setShouldShowVideo] = useState(false);
  const navigation = useRouter()

  // 🎯 Define goNext BEFORE useEvent
  const goNext = useCallback(async () => {
    await AsyncStorage.setItem("splashShown", "true");

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace("/login");
    });
  }, []);

  // Setup video player (expo-video)
  const player = useVideoPlayer(require("@/assets/images/splash.mp4"), (player) => {
    player.loop = false;
    player.play();
  });

  // 🎯 Now goNext is defined before using it
  useEvent(player, "ended", () => {
    goNext();
  });

  // Check if splash previously shown
  useEffect(() => {
    const checkSplash = async () => {
      const shown = await AsyncStorage.getItem("splashShown");

      if (shown) {
        navigation.replace("login");
      } else {
        setShouldShowVideo(true);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
      }
    };
    checkSplash();
  }, []);

  if (!shouldShowVideo) return null;

  return (
    <TouchableWithoutFeedback onPress={goNext}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <VideoView
          style={styles.video}
          player={player}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
