import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../../src/components/Header';
import { THEME } from '../../src/utils/colors';
import {
  clearAllData
} from '../../src/utils/storage';

export default function Settings() {
  const navigate = useRouter()

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete:\n• API key\n• Saved history\n• All app preferences\n\nAre you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              // setApiKeyInput('');
              // setUsernameInput('');
              // setThemeModeState('light');
              Alert.alert('Success', 'All data cleared successfully!');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };
  const handleLogout =async ()=>{
    await AsyncStorage.removeItem("IsLoggedIn")
    await AsyncStorage.removeItem("user")
  }

  return (
    <View style={styles.container}>
      <Header title="Settings" showBack gradient />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        

        {/* About Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 400 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ About FunBox AI</Text>
            
            <TouchableOpacity
              style={[styles.button, styles.aboutButton]}
              onPress={() => {
                Alert.alert(
                  'About FunBox AI',
                  'FunBox AI is an entertainment app powered by advanced AI technology. We create personalized jokes, riddles, stories, facts, pickup lines, and memes to brighten your day!\n\n🎭 Created with ❤️ by HaqqTech\n🚀 Powered by Google Gemini AI',
                  [{ text: 'Close', style: 'default' }]
                );
              }}
            >
              <Text style={styles.buttonText}>📱 App Information</Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* FAQ Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 500 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>❓ Help & FAQ</Text>
            
            <TouchableOpacity
              style={[styles.button, styles.faqButton]}
              onPress={() => {
                Alert.alert(
                  'Frequently Asked Questions',
                  '❓ How do I get started?\n→ Complete Or skip the onboarding Register and Login.\n\n❓ What content can I generate?\n→ Jokes, riddles, short stories, fun facts, pickup lines, and memes!\n\n❓ How does the history work?\n→ All generated content is automatically saved to your personal history library.\n\n❓ Is my data secure?\n→ Yes! Your data is stored securely and all data stays on your device.\n\n❓ Need more help?\n→ Contact us at haqqtech25@gmail.com',
                  [{ text: 'Close', style: 'default' }]
                );
              }}
            >
              <Text style={styles.buttonText}>🆘 View FAQ</Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Version & Credits */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 600 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔧 App Info</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Built by:</Text>
              <Text style={styles.infoValue}>HaqqTech</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>AI Engine:</Text>
              <Text style={styles.infoValue}>Google Gemini</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Framework:</Text>
              <Text style={styles.infoValue}>Expo + React Native</Text>
            </View>
          </View>
        </MotiView>

        {/* Data Management */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 300 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🗂️ Data Management</Text>
            
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClearAllData}
            >
              <Text style={styles.buttonText}>🗑️ Clear All Data</Text>
            </TouchableOpacity>
            
            <Text style={styles.helpText}>
              This will permanently delete all your data including API key, history, and preferences.
            </Text>
          </View>
        </MotiView>

        {/* Account Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 700 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔐 Account</Text>
            
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={() => {
                Alert.alert(
                  'Reset App',
                  'This will reset the app to its initial state. You will need to:\n• Re-enter your register and login\n• Start fresh with a new onboarding\n\nAre you sure you want to continue?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset App',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await clearAllData();
                          Alert.alert('Success', 'App reset successfully! Please restart the app.');
                        } catch (error) {
                          console.error('Error resetting app:', error);
                          Alert.alert('Error', 'Failed to reset app. Please try again.');
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.buttonText}>🔄 Reset App</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
        {/* Account Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 700 }}
        >
          <View style={styles.section}>
            <View style={{flexDirection:"row" ,alignItems:"center", gap:4, paddingBlock: 4, paddingBottom:10}}>
             <MaterialIcons name="logout" size={24} color="gold" />
              <Text style={{color:"white", fontWeight:"bold", fontSize:18 }}>Logout</Text>
              </View>
            
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={() => {
                Alert.alert(
                  'Logout?',
                  'Are you sure you want to Logout?',
                  [
                    { text: 'No', style: 'cancel' },
                    {
                      text: 'Yes',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await handleLogout;
                          // Alert.alert('Success', 'App reset successfully! Please restart the app.');
                          navigate.replace("/login")
                        } catch (error) {
                          console.error('Error resetting app:', error);
                          Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <View style={{flexDirection:"row" ,alignItems:"center", gap:4, }}>
                <MaterialIcons name="logout" size={24} color="" />
               <Text style={styles.buttonText}> Logout</Text>
                </View>
            </TouchableOpacity>
          </View>
        </MotiView>

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
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: THEME.surface,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text.primary,
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    backgroundColor: '#2D2D3A',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: THEME.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: THEME.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#059669',
  },
  saveButton: {
    backgroundColor: THEME.accent,
  },
  clearButton: {
    backgroundColor: THEME.danger,
  },
  aboutButton: {
    backgroundColor: '#3B82F6',
  },
  faqButton: {
    backgroundColor: '#8B5CF6',
  },
  logoutButton: {
    backgroundColor: THEME.danger,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 16,
    color: THEME.text.secondary,
    fontFamily: 'Inter-SemiBold',
  },
  infoValue: {
    fontSize: 16,
    color: THEME.text.primary,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  helpText: {
    fontSize: 14,
    color: THEME.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  settingDescription: {
    fontSize: 14,
    color: THEME.text.secondary,
    fontFamily: 'Inter-Regular',
  },
  bottomPadding: {
    height: 100,
  },
});