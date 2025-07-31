import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator, 
  ScrollView,
  StatusBar,
  Animated,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
];

const FEATURES = [
  {
    icon: 'medical-bag',
    title: 'ANC Reminders',
    description: 'Never miss your checkups',
    color: '#ff6b6b'
  },
  {
    icon: 'pills',
    title: 'Medicine Tracker',
    description: 'Track your daily supplements',
    color: '#4ecdc4'
  },
  {
    icon: 'baby',
    title: 'Baby Growth',
    description: 'Monitor your baby\'s development',
    color: '#45b7d1'
  },
  {
    icon: 'heart',
    title: 'Health Tips',
    description: 'Expert advice for healthy pregnancy',
    color: '#96ceb4'
  }
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'This app helped me throughout my pregnancy journey. The reminders were so helpful!',
    rating: 5
  },
  {
    name: 'Anita Patel',
    location: 'Pune',
    text: 'The AI health bot answered all my questions. I felt supported every day.',
    rating: 5
  }
];

export default function WelcomeScreen({ navigation }) {
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Testimonial rotation
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);

    return () => clearInterval(testimonialInterval);
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Login');
    }, 1000);
  };

  const renderStars = (rating) => {
    return Array(rating).fill(0).map((_, i) => (
      <Ionicons key={i} name="star" size={14} color="#ffd700" />
    ));
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4caf50" />
      <LinearGradient
        colors={['#fff8b0', '#e6f781', '#d0f0c0']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header Card */}
            <View style={styles.headerCard}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/Logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              
              <Text style={styles.title}>मातृ स्वास्थ्य</Text>
              <Text style={styles.titleEng}>Maternal Health</Text>
              <Text style={styles.tagline}>Your Pregnancy Companion 💝</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50K+</Text>
                  <Text style={styles.statLabel}>Happy Mothers</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1M+</Text>
                  <Text style={styles.statLabel}>Healthy Babies</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>24/7</Text>
                  <Text style={styles.statLabel}>Support</Text>
                </View>
              </View>
            </View>

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <Image
                source={require('../assets/ANC2.png')}
                style={styles.illustration}
                resizeMode="cover"
              />
              <View style={styles.illustrationOverlay}>
                <Text style={styles.overlayText}>Safe • Secure • Supported</Text>
              </View>
            </View>

            {/* Features Grid */}
            <View style={styles.featuresCard}>
              <Text style={styles.sectionTitle}>What We Offer</Text>
              <View style={styles.featuresGrid}>
                {FEATURES.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                      <FontAwesome5 name={feature.icon} size={20} color="#fff" />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDesc}>{feature.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Testimonials */}
            <View style={styles.testimonialCard}>
              <Text style={styles.sectionTitle}>What Mothers Say</Text>
              <View style={styles.testimonialContainer}>
                <View style={styles.testimonialContent}>
                  <View style={styles.quoteIcon}>
                    <Ionicons name="chatbubble-outline" size={24} color="#4caf50" />
                  </View>
                  <Text style={styles.testimonialText}>
                    "{TESTIMONIALS[currentTestimonial].text}"
                  </Text>
                  <View style={styles.testimonialAuthor}>
                    <Text style={styles.authorName}>
                      {TESTIMONIALS[currentTestimonial].name}
                    </Text>
                    <Text style={styles.authorLocation}>
                      {TESTIMONIALS[currentTestimonial].location}
                    </Text>
                    <View style={styles.rating}>
                      {renderStars(TESTIMONIALS[currentTestimonial].rating)}
                    </View>
                  </View>
                </View>
                <View style={styles.testimonialDots}>
                  {TESTIMONIALS.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        currentTestimonial === index && styles.activeDot
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* Language Selection */}
            <View style={styles.langCard}>
              <View style={styles.langHeader}>
                <Ionicons name="language" size={20} color="#4caf50" />
                <Text style={styles.langTitle}>Choose Your Language</Text>
              </View>
              <View style={styles.langRow}>
                {LANGUAGES.map(l => (
                  <TouchableOpacity
                    key={l.code}
                    style={[
                      styles.langBtn,
                      lang === l.code && styles.langBtnActive,
                    ]}
                    onPress={() => setLang(l.code)}
                  >
                    <Text style={styles.langFlag}>{l.flag}</Text>
                    <Text style={[
                      styles.langText,
                      lang === l.code && styles.langTextActive,
                    ]}>{l.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionCard}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={[ '#4caf50', '#4caf50']}
                  style={styles.gradientButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="log-in-outline" size={22} color="#fff" />
                      <Text style={styles.primaryButtonText}>
                        {loading ? 'Loading...' : 'Login to Continue'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('NotRegistered')}
              >
                <Ionicons name="person-add-outline" size={22} color="#4caf50" />
                <Text style={styles.secondaryButtonText}>New User? Register Now</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.helpButton}>
                <Ionicons name="help-circle-outline" size={18} color="#666" />
                <Text style={styles.helpButtonText}>Need Help?</Text>
              </TouchableOpacity>
            </View>

            {/* Emergency Banner */}
            <View style={styles.emergencyBanner}>
              <Ionicons name="call" size={20} color="#ff4757" />
              <Text style={styles.emergencyText}>
                Emergency? Call 108 or 104 immediately
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Maternal Health Mission
          </Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ for expecting mothers
          </Text>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: { 
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  headerCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#4caf50',
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginBottom: 4,
  },
  titleEng: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4caf50',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  illustration: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  illustrationOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 12,
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  aboutCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginLeft: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  supportedBy: {
    alignItems: 'center',
  },
  supportedText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  govLogos: {
    flexDirection: 'row',
    gap: 8,
  },
  govBadge: {
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  govBadgeText: {
    fontSize: 10,
    color: '#4caf50',
    fontWeight: '600',
  },
  featuresCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3a4b',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  testimonialCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  testimonialContainer: {
    alignItems: 'center',
  },
  testimonialContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  quoteIcon: {
    marginBottom: 12,
  },
  testimonialText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3a4b',
  },
  authorLocation: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialDots: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  activeDot: {
    backgroundColor: '#4caf50',
  },
  langCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  langTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3a4b',
    marginLeft: 8,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  langBtnActive: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  langFlag: {
    fontSize: 16,
    marginRight: 8,
  },
  langText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  langTextActive: {
    color: '#fff',
  },
  actionCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  primaryButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#888',
    fontSize: 14,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4caf50',
    marginBottom: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#4caf50',
    fontSize: 16,
    fontWeight: '600',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  helpButtonText: {
    color: '#666',
    fontSize: 14,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  emergencyText: {
    color: '#ff4757',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
});