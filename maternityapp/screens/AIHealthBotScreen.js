import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AIHealthBotScreen() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI pregnancy companion. I'm here to help you with any questions about your pregnancy, health, nutrition, or ANC care. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
      type: 'greeting'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);

  // Mock patient data - in real app, this would come from context/props
  const patientData = {
    name: "Anita",
    age: 28,
    pregnancyWeek: 4,
    dueDate: "7 Apr, 2026",
    lastANCVisit: "Jan 10, 2025",
    supplements: ["Iron", "Folic Acid", "Calcium"],
    riskFactors: ["First pregnancy", "Slightly low hemoglobin"]
  };

  // Quick question suggestions
  const quickQuestions = [
    "What should I eat this week?",
    "Are my supplements safe?",
    "When is my next ANC visit?",
    "What are danger signs?",
    "How is my baby developing?",
    "Exercise recommendations"
  ];

  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  function generateBotResponse(userQuestion) {
    const lowerQuestion = userQuestion.toLowerCase();
    
    if (lowerQuestion.includes('eat') || lowerQuestion.includes('food') || lowerQuestion.includes('diet')) {
      return {
        text: `At ${patientData.pregnancyWeek} weeks, focus on iron-rich foods like spinach, lean meats, and beans. Include calcium sources like dairy, almonds. Avoid raw fish, unpasteurized dairy. Small frequent meals help with nausea. Stay hydrated with 8-10 glasses of water daily.`,
        type: 'nutrition'
      };
    } else if (lowerQuestion.includes('supplement') || lowerQuestion.includes('medicine')) {
      return {
        text: `Your prescribed supplements (${patientData.supplements.join(', ')}) are safe and important. Take iron on empty stomach with vitamin C for better absorption. Calcium should be taken separately from iron. Never skip without consulting your doctor.`,
        type: 'medication'
      };
    } else if (lowerQuestion.includes('danger') || lowerQuestion.includes('warning') || lowerQuestion.includes('emergency')) {
      return {
        text: `⚠️ Contact your doctor immediately if you experience: Heavy bleeding, severe headache, vision changes, persistent vomiting, reduced baby movements, severe abdominal pain, or fever. Call 108 for emergencies.`,
        type: 'emergency'
      };
    } else if (lowerQuestion.includes('baby') || lowerQuestion.includes('develop')) {
      return {
        text: `At ${patientData.pregnancyWeek} weeks, your baby is about the size of a sweet potato! Their hearing is developing, and they can hear your voice. They're practicing breathing movements and their bones are hardening. You might start feeling more movement patterns.`,
        type: 'development'
      };
    } else if (lowerQuestion.includes('exercise') || lowerQuestion.includes('activity')) {
      return {
        text: `Safe exercises include walking, swimming, prenatal yoga, and light stretching. Aim for 30 minutes daily. Avoid contact sports, lying flat on back after 20 weeks, and heavy lifting. Listen to your body and stay hydrated.`,
        type: 'exercise'
      };
    } else if (lowerQuestion.includes('anc') || lowerQuestion.includes('visit') || lowerQuestion.includes('checkup')) {
      return {
        text: `Your last ANC visit was on ${patientData.lastANCVisit}. Next visit should be scheduled for late January 2025. Don't miss regular checkups - they monitor your and baby's health, track growth, and catch any issues early.`,
        type: 'anc'
      };
    } else {
      return {
        text: `I understand you're asking about "${userQuestion}". Based on your profile (${patientData.pregnancyWeek} weeks pregnant), I recommend discussing this with your doctor at your next ANC visit. In the meantime, focus on taking your supplements, eating well, and staying active. Is there anything specific about your pregnancy I can help with?`,
        type: 'general'
      };
    }
  }

  function handleSendMessage(text = question) {
    if (!text.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setShowQuickQuestions(false);
    setIsTyping(true);
    setLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        isBot: true,
        timestamp: new Date(),
        type: botResponse.type
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      setLoading(false);
    }, 1500);
  }

  function handleQuickQuestion(questionText) {
    handleSendMessage(questionText);
  }

  function getMessageIcon(type) {
    switch(type) {
      case 'greeting': return 'heart-outline';
      case 'nutrition': return 'restaurant-outline';
      case 'medication': return 'medical-outline';
      case 'emergency': return 'warning-outline';
      case 'development': return 'flower-outline';
      case 'exercise': return 'walk-outline';
      case 'anc': return 'calendar-outline';
      default: return 'chatbubble-outline';
    }
  }

  function getMessageColor(type) {
    switch(type) {
      case 'emergency': return '#ff6b6b';
      case 'nutrition': return '#51cf66';
      case 'medication': return '#4dabf7';
      case 'development': return '#ff8cc8';
      case 'exercise': return '#ffd43b';
      case 'anc': return '#9775fa';
      default: return '#4caf50';
    }
  }

  function clearChat() {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear the chat history?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          onPress: () => {
            setMessages([{
              id: 1,
              text: "Hello! I'm your AI pregnancy companion. I'm here to help you with any questions about your pregnancy, health, nutrition, or ANC care. How can I assist you today?",
              isBot: true,
              timestamp: new Date(),
              type: 'greeting'
            }]);
            setShowQuickQuestions(true);
          }
        }
      ]
    );
  }

  return (
    <LinearGradient colors={['#fff8b0', '#e6f781', '#d0f0c0']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="chatbubbles" size={28} color="#4caf50" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>AI Health Companion</Text>
              <Text style={styles.headerSubtitle}>Your pregnancy support assistant</Text>
            </View>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
            <Ionicons name="refresh-outline" size={24} color="#4caf50" />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View key={message.id} style={[
              styles.messageBubble,
              message.isBot ? styles.botMessage : styles.userMessage
            ]}>
              {message.isBot && (
                <View style={[styles.botIcon, { backgroundColor: getMessageColor(message.type) }]}>
                  <Ionicons name={getMessageIcon(message.type)} size={16} color="#fff" />
                </View>
              )}
              <View style={[
                styles.messageContent,
                message.isBot ? styles.botContent : styles.userContent
              ]}>
                <Text style={[
                  styles.messageText,
                  message.isBot ? styles.botText : styles.userText
                ]}>
                  {message.text}
                </Text>
                <Text style={[
                  styles.timestamp,
                  message.isBot ? styles.botTimestamp : styles.userTimestamp
                ]}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageBubble, styles.botMessage]}>
              <View style={[styles.botIcon, { backgroundColor: '#4caf50' }]}>
                <Ionicons name="chatbubble-outline" size={16} color="#fff" />
              </View>
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>AI is typing</Text>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}

          {/* Quick Questions */}
          {showQuickQuestions && (
            <View style={styles.quickQuestionsContainer}>
              <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
              <View style={styles.quickQuestionsGrid}>
                {quickQuestions.map((q, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickQuestionBtn}
                    onPress={() => handleQuickQuestion(q)}
                  >
                    <Text style={styles.quickQuestionText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={question}
              onChangeText={setQuestion}
              placeholder="Ask about your pregnancy, health, or baby..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
              editable={!loading}
              onSubmitEditing={() => handleSendMessage()}
              returnKeyType="send"
            />
            <TouchableOpacity 
              style={[styles.sendBtn, loading && styles.sendBtnDisabled]} 
              onPress={() => handleSendMessage()}
              disabled={loading || !question.trim()}
            >
              <Ionicons 
                name={loading ? 'hourglass-outline' : 'send'} 
                size={22} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHelper}>
            💡 Ask about nutrition, supplements, baby development, or any pregnancy concerns
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4caf50',
  },
  clearBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },

  // Chat
  chatContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  chatContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageContent: {
    maxWidth: width * 0.75,
    borderRadius: 18,
    padding: 12,
  },
  botContent: {
    backgroundColor: '#e3f0ff',
    borderBottomLeftRadius: 6,
  },
  userContent: {
    backgroundColor: '#4caf50',
    borderBottomRightRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botText: {
    color: '#2d3a4b',
  },
  userText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  botTimestamp: {
    color: '#8e9aaf',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.8)',
  },

  // Typing indicator
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    padding: 12,
    maxWidth: width * 0.4,
  },
  typingText: {
    fontSize: 14,
    color: '#4caf50',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4caf50',
    marginHorizontal: 2,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1 },

  // Quick Questions
  quickQuestionsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4caf50',
    marginBottom: 12,
  },
  quickQuestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickQuestionBtn: {
    backgroundColor: '#e3f0ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4caf50',
    marginBottom: 8,
  },
  quickQuestionText: {
    fontSize: 13,
    color: '#4caf50',
    fontWeight: '500',
  },

  // Input
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2d3a4b',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendBtn: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#ccc',
  },
  inputHelper: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});