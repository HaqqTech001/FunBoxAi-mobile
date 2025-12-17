import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useRef, useState } from 'react';
import {
   Dimensions,
   FlatList,
   StyleSheet,
   Text,
   TouchableOpacity,
   View
} from 'react-native';
import { THEME } from '../src/utils/colors';
import { setOnboardingComplete } from '../src/utils/storage';


const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to FunBox AI! 🎉',
    subtitle: 'Your AI-Powered Entertainment Hub',
    description: 'Experience the magic of AI-generated content including jokes, riddles, stories, fun facts, pickup lines, and hilarious memes!',
    icon: '🤖',
    gradient: [THEME.primary, THEME.secondary],
  },
  {
    id: '2',
    title: 'Endless Entertainment 🎭',
    subtitle: 'Six Amazing Content Types',
    description: 'From hilarious jokes to captivating stories, from mind-bending riddles to sweet pickup lines - we have something for everyone!',
    icon: '🎪',
    gradient: ['#8B5CF6', '#EC4899'],
  },
  {
    id: '3',
    title: 'Smart & Beautiful 💫',
    subtitle: 'AI That Understands You',
    description: 'Our advanced AI creates unique, personalized content every time. Plus, enjoy stunning visual designs with custom backgrounds!',
    icon: '🧠',
    gradient: ['#10B981', '#06B6D4'],
  },
  {
    id: '4',
    title: 'Save & Share 📱',
    subtitle: 'Your Content Library',
    description: 'Save your favorite content to your personal history library. Easily access and share your best finds anytime!',
    icon: '💾',
    gradient: ['#F97316', '#FB923C'],
  },
  {
    id: '5',
    title: 'Ready to Start? 🚀',
    subtitle: 'Let\'s Make Magic Happen!',
    description: 'Your FunBox AI adventure awaits! Get your API key from Google AI Studio and start generating amazing content right now!',
    icon: '✨',
    gradient: ['#EF4444', '#F97316'],
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigate = useRouter()

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      flatListRef.current?.scrollToIndex({ animated: true, index: currentSlide + 1 });
    }
  };

 const skipOnboarding = async () => {
  try {
    await setOnboardingComplete(true); 
    console.log('Onboarding skipped - marked as complete');
    navigate.replace("/login");
  } catch (error) {
    console.error('Error completing onboarding:', error);
    navigate.replace("/login"); 
  }
};

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      style={styles.slideContainer}
    >
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Icon */}
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 8, stiffness: 100, delay: 200 }}
            style={styles.iconContainer}
          >
            <Text style={styles.icon}>{item.icon}</Text>
          </MotiView>

          {/* Title */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300 }}
            style={styles.titleContainer}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </MotiView>

          {/* Description */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 500 }}
            style={styles.descriptionContainer}
          >
            <Text style={styles.description}>{item.description}</Text>
          </MotiView>
        </View>
      </LinearGradient>
    </MotiView>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentSlide ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slideIndex);
        }}
      />

      {/* Dots Indicator */}
      {renderDots()}

      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        {currentSlide === slides.length - 1 ? (
          <TouchableOpacity
            style={[styles.button, styles.getStartedButton]}
            onPress={() => { navigate.replace("/login")
            //   console.log('Onboarding completed!');
            }}
          >
            <Text style={styles.buttonText}> Get Started</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={nextSlide}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    padding: 10,
  },
  skipText: {
    color: THEME.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  slideContainer: {
    width,
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  descriptionContainer: {
    alignItems: 'center',
    maxWidth: '90%',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: THEME.primary,
    width: 30,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
  },
  getStartedButton: {
   color:THEME.primary,
    backgroundColor: THEME.accent,
    fontSize:16,
    fontWeight: "bold",
    padding:20
  },
  nextButton: {
    backgroundColor: THEME.primary,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-SemiBold',
  },
});