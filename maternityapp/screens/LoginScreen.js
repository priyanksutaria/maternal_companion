import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [uid, setUid] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [showMobile, setShowMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!uid.trim() || !mobile.trim()) {
      setError('Please enter your Pregnancy UID and Mobile Number.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1200); // Simulate loading
  };

  return (
    <LinearGradient colors={['#4f8cff', '#6dd5ed', '#fff']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../assets/logo.png')}
                  style={styles.logoLarge}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appName}>MaternalCare</Text>
              <Text style={styles.quote}>
                "Empowering every mother, every day."
              </Text>
              <View style={styles.softDivider} />
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="lock-closed" size={22} color="#4f8cff" />
                </View>
                <Text style={styles.cardTitle}>Secure Login</Text>
              </View>
              
              <Text style={styles.cardDescription}>
                Enter your credentials to access your pregnancy dashboard
              </Text>

              {/* UID Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Pregnancy UID</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="key-outline" size={20} color="#4f8cff" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your 12-digit UID"
                    placeholderTextColor="#b0c4de"
                    value={uid}
                    onChangeText={setUid}
                    autoCapitalize="characters"
                    maxLength={12}
                  />
                  {uid.length > 0 && (
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  )}
                </View>
                <Text style={styles.helperText}>
                  UID received via SMS after registration
                </Text>
              </View>

              {/* Mobile Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="call-outline" size={20} color="#4f8cff" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your 10-digit mobile"
                    placeholderTextColor="#b0c4de"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                    maxLength={10}
                    secureTextEntry={!showMobile}
                  />
                  <TouchableOpacity onPress={() => setShowMobile((v) => !v)}>
                    <MaterialIcons
                      name={showMobile ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="#4f8cff"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>
                  Registered mobile number for OTP verification
                </Text>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#e53935" />
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}

              {/* Login Button */}
              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                ) : (
                  <Ionicons name="log-in-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                )}
                <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login Securely'}</Text>
              </TouchableOpacity>

              {/* Forgot UID */}
              <TouchableOpacity style={styles.forgotLink}>
                <Text style={styles.forgotText}>Forgot your UID?</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>New User?</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('NotRegistered')}
              >
                <Ionicons name="person-add-outline" size={20} color="#4f8cff" style={{ marginRight: 8 }} />
                <Text style={styles.registerButtonText}>Register at Nearest Center</Text>
              </TouchableOpacity>

              {/* Support Section */}
              <View style={styles.supportSection}>
                <Text style={styles.supportTitle}>Need Help?</Text>
                <View style={styles.supportOptions}>
                  <TouchableOpacity style={styles.supportButton}>
                    <Ionicons name="call" size={18} color="#4f8cff" />
                    <Text style={styles.supportButtonText}>Call Support</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.supportButton}>
                    <Ionicons name="chatbubble" size={18} color="#4f8cff" />
                    <Text style={styles.supportButtonText}>Live Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Security Badge */}
            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              <Text style={styles.securityText}>Your data is secure and protected</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e3f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 40,
    alignSelf: 'center',
    shadowColor: '#4f8cff',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logoLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    opacity: 0.98,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4f8cff',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-medium',
  },
  quote: {
    fontSize: 17,
    color: '#4f8cff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 18,
    fontStyle: 'italic',
    letterSpacing: 0.2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Italic' : 'serif',
    opacity: 0.92,
  },
  softDivider: {
    width: '60%',
    height: 2,
    backgroundColor: '#e3f0ff',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
    marginTop: 2,
    opacity: 0.7,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#4f8cff',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#4f8cff',
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(79,140,255,0.13)',
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4f8cff',
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-medium',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f8cff',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f0ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(79,140,255,0.2)',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2d3a4b',
    paddingVertical: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  error: {
    color: '#e53935',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f8cff',
    paddingHorizontal: 38,
    paddingVertical: 16,
    borderRadius: 24,
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-medium',
  },
  forgotLink: {
    paddingVertical: 8,
  },
  forgotText: {
    color: '#4f8cff',
    fontWeight: '500',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  bottomSection: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#e3f0ff',
    borderRadius: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 14,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(79,140,255,0.3)',
  },
  registerButtonText: {
    color: '#4f8cff',
    fontWeight: '600',
    fontSize: 16,
  },
  supportSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3a4b',
    marginBottom: 12,
  },
  supportOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(79,140,255,0.2)',
  },
  supportButtonText: {
    color: '#4f8cff',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 6,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  securityText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});