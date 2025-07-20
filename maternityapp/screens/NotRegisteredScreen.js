import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function NotRegisteredScreen({ navigation }) {
  return (
    <LinearGradient colors={['#4f8cff', '#6dd5ed', '#fff']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoLarge}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Not Registered Yet?</Text>
          <Text style={styles.message}>
            To register, visit your nearest health center or use our official website. Registration is quick and ensures you get all the benefits and care you deserve!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL('https://maternal-health.netlify.app/')}
          >
            <Ionicons name="globe-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Go to Website</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={() => navigation.navigate('Welcome')}
          >
            <Ionicons name="arrow-back-outline" size={22} color="#4f8cff" style={{ marginRight: 8 }} />
            <Text style={[styles.buttonText, { color: '#4f8cff' }]}>Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#4f8cff',
    shadowOpacity: 0.13,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(79,140,255,0.13)',
    marginBottom: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e3f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 10,
    alignSelf: 'center',
    shadowColor: '#4f8cff',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logoLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    opacity: 0.98,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4f8cff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    color: '#2d3a4b',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 22,
    fontWeight: '400',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f8cff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 14,
    marginTop: 2,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonOutline: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4f8cff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});