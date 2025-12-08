import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../src/utils/colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
  gradient?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showSettings = false,
  gradient = true,
}) => {
  const router = useRouter();

  const HeaderContent = () => (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}><AntDesign name="arrow-left" size={24} color="white" /></Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightContainer}>
        {showSettings && (
          <Link href="/settings" asChild>
            <TouchableOpacity style={styles.settingsButton}>
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={['#1E1B4B', '#312E81']}
        style={styles.headerGradient}
      >
        <HeaderContent />
      </LinearGradient>
    );
  }

  return <View style={[styles.headerGradient, styles.solidHeader]}><HeaderContent /></View>;
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  solidHeader: {
    backgroundColor: THEME.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.text.primary,
    fontFamily: 'Poppins-Bold',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: THEME.text.primary,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 18,
    color: THEME.text.primary,
  },
});

export default Header;