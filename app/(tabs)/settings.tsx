import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../src/components/Header';
import { THEME } from '../../src/utils/colors';
import {
  clearAllData,
  getApiKey,
  getThemeMode,
  getUsername,
  setApiKey,
  setThemeMode,
  setUsername,
  testApiKey,
} from '../../src/utils/storage';

export default function Settings() {
  const [apiKey, setApiKeyInput] = useState('');
  const [username, setUsernameInput] = useState('');
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>('light');
  const [testingKey, setTestingKey] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);


  const GeminiapiKey= ""
  const loadSettings = async () => {
    try {
      const savedApiKey = await getApiKey();
      const savedUsername = await getUsername();
      const savedThemeMode = await getThemeMode();
      
      setApiKeyInput(savedApiKey || '');
      setUsernameInput(savedUsername || '');
      setThemeModeState(savedThemeMode);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key first');
      return;
    }

    setTestingKey(true);
    try {
      const isValid = await testApiKey(apiKey.trim());
      if (isValid) {
        Alert.alert('Success', 'API key is valid! 🎉');
      } else {
        Alert.alert('Error', 'Invalid API key. Please check and try again.');
      }
    } catch (error) {
      console.error('Error testing API key:', error);
      Alert.alert('Error', 'Failed to test API key. Please try again.');
    } finally {
      setTestingKey(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    setSavingKey(true);
    try {
      // Test the key before saving
      const isValid = await testApiKey(apiKey.trim());
      if (isValid) {
        await setApiKey(apiKey.trim());
        Alert.alert('Success', 'API key saved securely! 🔐');
      } else {
        Alert.alert('Error', 'Invalid API key. Please check and try again.');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Error', 'Failed to save API key. Please try again.');
    } finally {
      setSavingKey(false);
    }
  };

  const handleSaveUsername = async () => {
    setSavingUsername(true);
    try {
      await setUsername(username.trim());
      Alert.alert('Success', 'Username saved! 👋');
    } catch (error) {
      console.error('Error saving username:', error);
      Alert.alert('Error', 'Failed to save username. Please try again.');
    } finally {
      setSavingUsername(false);
    }
  };

  const handleThemeChange = async (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setThemeModeState(newTheme);
    try {
      await setThemeMode(newTheme);
      Alert.alert('Theme Updated', `Switched to ${newTheme} mode!`);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

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
              setApiKeyInput('');
              setUsernameInput('');
              setThemeModeState('light');
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

  return (
    <View style={styles.container}>
      <Header title="Settings" showBack gradient />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* API Key Section */}
        {/* <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 AI Configuration</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gemini API Key</Text>
              <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKeyInput}
                placeholder="Enter your Gemini API key"
                placeholderTextColor={THEME.text.muted}
                secureTextEntry
                autoCapitalize="none"
              />
              
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.testButton]}
                  onPress={handleTestApiKey}
                  disabled={testingKey}
                >
                  <Text style={styles.buttonText}>
                    {testingKey ? 'Testing...' : 'Test Key'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveApiKey}
                  disabled={savingKey}
                >
                  <Text style={styles.buttonText}>
                    {savingKey ? 'Saving...' : 'Save Key'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.helpText}>
                🔑 Get your API key from Google AI Studio
              </Text>
            </View>
          </View>
        </MotiView> */}

        {/* Username Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 100 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Personal</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsernameInput}
                placeholder="Enter your username"
                placeholderTextColor={THEME.text.muted}
                autoCapitalize="none"
              />
              
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveUsername}
                disabled={savingUsername}
              >
                <Text style={styles.buttonText}>
                  {savingUsername ? 'Saving...' : 'Save Username'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </MotiView>

        {/* Theme Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 200 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎨 Appearance</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Switch to dark theme
                </Text>
              </View>
              <Switch
                value={themeMode === 'dark'}
                onValueChange={handleThemeChange}
                trackColor={{ false: '#767577', true: THEME.primary }}
                thumbColor={themeMode === 'dark' ? '#fff' : '#f4f3f4'}
              />
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