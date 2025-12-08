import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../../src/components/Header';
import { THEME } from '../../src/utils/colors';

// const { width } = Dimensions.get('window');

interface ContentType {
  id: string;
  title: string;
  emoji: string;
  description: string;
  gradient: string[];
  route: string;
}

const contentTypes: ContentType[] = [
  {
    id: 'jokes',
    title: 'Jokes',
    emoji: '😂',
    description: 'Get your daily dose of laughter',
    gradient: ['#8B5CF6', '#3B82F6'],
    route: '/jokes',
  },
  {
    id: 'riddles',
    title: 'Riddles',
    emoji: '🤔',
    description: 'Challenge your mind',
    gradient: ['#1E3A8A', '#3B82F6'],
    route: '/riddles',
  },
  {
    id: 'stories',
    title: 'Stories',
    emoji: '📚',
    description: 'Short tales to spark imagination',
    gradient: ['#EA580C', '#DC2626'],
    route: '/stories',
  },
  {
    id: 'facts',
    title: 'Fun Facts',
    emoji: '💡',
    description: 'Discover amazing facts',
    gradient: ['#0891B2', '#0EA5E9'],
    route: '/facts',
  },
  {
    id: 'pickup',
    title: 'Pickup Lines',
    emoji: '💕',
    description: 'Try your luck with these',
    gradient: ['#EC4899', '#F43F5E'],
    route: '/pickup',
  },
  {
    id: 'memes',
    title: 'Memes',
    emoji: '🎭',
    description: 'Create or get random memes',
    gradient: ['#8B5CF6', '#EC4899'],
    route: '/memes',
  },
];

export default function Index() {
  return (
    <View style={styles.container}>
      <Header title="FunBox AI" gradient />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          >
            <Text style={styles.welcomeTitle}>Welcome to FunBox AI! 🎉</Text>
            <Text style={styles.welcomeSubtitle}>
              Choose your favorite type of entertainment and let AI create something amazing for you!
            </Text>
          </MotiView>
        </View>

        <View style={styles.contentTypes}>
          <AnimatePresence>
            {contentTypes.map((contentType, index) => (
              <MotiView
                key={contentType.id}
                from={{ opacity: 0, translateY: 20, scale: 0.9 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 300,
                  delay: index * 100,
                }}
              >
                <Link href={contentType.route} asChild>
                  <TouchableOpacity style={styles.contentCard}>
                    <LinearGradient
                      colors={contentType.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientContainer}
                    >
                      <View style={styles.cardContent}>
                        <Text style={styles.emoji}>{contentType.emoji}</Text>
                        <Text style={styles.cardTitle}>{contentType.title}</Text>
                        <Text style={styles.cardDescription}>
                          {contentType.description}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              </MotiView>
            ))}
          </AnimatePresence>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
  },
  contentTypes: {
    paddingHorizontal: 20,
    gap: 16,
  },
  contentCard: {
    width: '100%',
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientContainer: {
    flex: 1,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  bottomPadding: {
    height: 100,
  },
});