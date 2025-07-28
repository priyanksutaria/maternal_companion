import React, { useState, useEffect } from 'react';
import { usePregnancy } from '../context/PregnancyContext';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, AntDesign, Entypo } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { pregnancyId } = usePregnancy();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplementsTaken, setSupplementsTaken] = useState({ 1: false, 2: true, 3: false });
  const [waterIntake, setWaterIntake] = useState(6);
  const [todayWeight, setTodayWeight] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        console.log('Fetching report for pregnancyId:', pregnancyId); // Debug log
        const response = await fetch(`http://192.168.29.28:3000/report/byPregnancy/${pregnancyId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.reports && data.reports.length > 0) {
            setReport(data.reports[0]); // Get the latest report
          } else {
            setError('No reports found.');
          }
        } else {
          setError('Failed to fetch report.');
        }
      } catch (error) {
        setError('An error occurred while fetching the report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [pregnancyId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#4f8cff" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error}</Text></View>;
  }

  // Enhanced mock data
  const name = report?.data.patientDetails.personal.name || 'Patient';
  const week = report?.data.analyzeForm.gestational_age_weeks || 0;
  const dueDate = report?.data.patientDetails.menstrualHistory.edd ? new Date(report.data.patientDetails.menstrualHistory.edd).toLocaleDateString() : 'N/A';
  const nextVisit = report?.data.visitDetails.scheduledDate ? new Date(report.data.visitDetails.scheduledDate).toLocaleDateString() : 'N/A';
  const lastVisitDate = report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A';
  const babySize = 'Sweet Potato'; // This is mock data
  const babySizeLength = '14 cm'; // This is mock data
  const babyWeight = '190 grams'; // This is mock data
  const currentWeight = `${report?.data.analyzeForm.current_weight} kg` || 'N/A';
  const weightGain = '+3.5 kg'; // This is mock data
  const bloodPressure = `${report?.data.analyzeForm.sbp}/${report?.data.analyzeForm.dbp} mmHg` || 'N/A';
  const ironLevel = report?.data.analysis.anemia ? 'Low' : 'Normal';
  const targetWaterIntake = 8;
  
  const weeklyMilestone = "Your baby's hearing is developing and they can hear your voice!"; // This is mock data
  const todayTip = "Walking for 30 minutes daily helps with circulation and prepares your body for labor."; // This is mock data
  
  const mealPlan = [
    {
      meal: 'Breakfast',
      icon: 'ios-sunny',
      color: '#ffe082',
      time: '7:00 AM',
      calories: '320 cal',
      foods: ['Oats porridge with nuts', 'Boiled egg', 'Banana', 'Milk (1 glass)'],
      benefits: 'Rich in protein & fiber'
    },
    {
      meal: 'Mid-Morning',
      icon: 'ios-cafe',
      color: '#c8e6c9',
      time: '10:00 AM',
      calories: '150 cal',
      foods: ['Fresh fruit salad', 'Coconut water'],
      benefits: 'Hydration & vitamins'
    },
    {
      meal: 'Lunch',
      icon: 'ios-restaurant',
      color: '#b2dfdb',
      time: '1:00 PM',
      calories: '450 cal',
      foods: ['Chapati (2)', 'Dal', 'Spinach sabzi', 'Rice', 'Curd', 'Salad'],
      benefits: 'Complete balanced meal'
    },
    {
      meal: 'Evening',
      icon: 'ios-nutrition',
      color: '#ffccbc',
      time: '4:00 PM',
      calories: '200 cal',
      foods: ['Buttermilk', 'Roasted chana', 'Dates (2-3)'],
      benefits: 'Energy & calcium'
    },
    {
      meal: 'Dinner',
      icon: 'ios-moon',
      color: '#b3c6f7',
      time: '7:30 PM',
      calories: '400 cal',
      foods: ['Khichdi', 'Mixed veg', 'Paneer curry', 'Apple'],
      benefits: 'Easy digestion'
    }
  ];

  const supplements = [
    { 
      id: 1, 
      name: 'Iron', 
      icon: 'medkit', 
      timing: 'After Lunch', 
      dosage: '100mg',
      when: 'after', 
      meal: 'Lunch', 
      color: '#e57373',
      importance: 'Prevents anemia',
      sideEffect: 'Take with vitamin C'
    },
    { 
      id: 2, 
      name: 'Folic Acid', 
      icon: 'leaf', 
      timing: 'Before Breakfast', 
      dosage: '5mg',
      when: 'before', 
      meal: 'Breakfast', 
      color: '#81c784',
      importance: 'Brain development',
      sideEffect: 'Take on empty stomach'
    },
    { 
      id: 3, 
      name: 'Calcium', 
      icon: 'bone', 
      timing: 'After Dinner', 
      dosage: '500mg',
      when: 'after', 
      meal: 'Dinner', 
      color: '#64b5f6',
      importance: 'Bone health',
      sideEffect: 'Avoid with iron'
    }
  ];

  const advice = 'Continue taking supplements regularly. Your weight gain is perfect. Include more green vegetables in your diet.';
  const reminders = [
    'Next ANC visit: 25 July (7 days)',
    'Iron supplement after lunch',
    'Ultrasound scan due next week',
    'Tetanus vaccination due'
  ];

  const vitals = [
    { label: 'Weight', value: currentWeight, icon: 'scale-outline', color: '#4f8cff', change: weightGain },
    { label: 'BP', value: bloodPressure, icon: 'heart-outline', color: '#e57373', status: 'Normal' },
    { label: 'Iron', value: ironLevel, icon: 'fitness-outline', color: '#81c784', status: 'Good' },
    { label: 'Water', value: `${waterIntake}/${targetWaterIntake}`, icon: 'water-outline', color: '#29b6f6', status: 'Track' }
  ];

  const toggleSupplement = (id) => {
    setSupplementsTaken(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const addWaterGlass = () => {
    if (waterIntake < targetWaterIntake) {
      setWaterIntake(prev => prev + 1);
    }
  };

  const emergencyCall = (number) => {
    Alert.alert(
      'Emergency Call',
      `Are you sure you want to call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log(`Calling ${number}`) }
      ]
    );
  };

  return (
    <LinearGradient colors={['#4f8cff', '#6dd5ed', '#fff']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Enhanced Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.headerRow}>
            <View style={styles.profileSection}>
              <Image source={require('../assets/Logo.png')} style={styles.avatar} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.greeting}>Good Morning, {name}!</Text>
                <Text style={styles.weekText}>Week {week} of Pregnancy</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationBadge}>
              <Ionicons name="notifications" size={20} color="#fff" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dueDateRow}>
            <Text style={styles.dueDate}>Due Date: <Text style={styles.dueDateValue}>{dueDate}</Text></Text>
            <Text style={styles.daysLeft}>89 days to go</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBar, { width: `${week/40*100}%` }]} />
            </View>
            <Text style={styles.progressText}>{week}/40 weeks</Text>
          </View>

          {/* Baby Development Card */}
          <View style={styles.babyCard}>
            <View style={styles.babyHeader}>
              <MaterialCommunityIcons name="baby-face-outline" size={24} color="#ff6b9d" />
              <Text style={styles.babyTitle}>Your Baby This Week</Text>
            </View>
            <View style={styles.babyStats}>
              <View style={styles.babyStat}>
                <Text style={styles.babyStatLabel}>Size</Text>
                <Text style={styles.babyStatValue}>{babySize}</Text>
              </View>
              <View style={styles.babyStat}>
                <Text style={styles.babyStatLabel}>Length</Text>
                <Text style={styles.babyStatValue}>{babySizeLength}</Text>
              </View>
              <View style={styles.babyStat}>
                <Text style={styles.babyStatLabel}>Weight</Text>
                <Text style={styles.babyStatValue}>{babyWeight}</Text>
              </View>
            </View>
            <Text style={styles.milestone}>{weeklyMilestone}</Text>
          </View>
        </View>

        {/* Health Vitals Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Vitals</Text>
            <Text style={styles.lastUpdated}>Last visit: {lastVisitDate}</Text>
          </View>
          <View style={styles.vitalsGrid}>
            {vitals.map((vital, idx) => (
              <TouchableOpacity key={idx} style={styles.vitalCard}>
                <View style={[styles.vitalIcon, { backgroundColor: vital.color }]}>
                  <Ionicons name={vital.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.vitalLabel}>{vital.label}</Text>
                <Text style={styles.vitalValue}>{vital.value}</Text>
                <Text style={[styles.vitalStatus, { color: vital.color }]}>
                  {vital.change || vital.status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Water Intake Tracker */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Water Intake Today</Text>
            <TouchableOpacity onPress={addWaterGlass} style={styles.addWaterBtn}>
              <Ionicons name="add" size={20} color="#29b6f6" />
            </TouchableOpacity>
          </View>
          <View style={styles.waterTracker}>
            <View style={styles.waterGlasses}>
              {Array.from({ length: targetWaterIntake }, (_, i) => (
                <View key={i} style={styles.waterGlass}>
                  <Ionicons 
                    name="water" 
                    size={24} 
                    color={i < waterIntake ? '#29b6f6' : '#e0e0e0'} 
                  />
                </View>
              ))}
            </View>
            <Text style={styles.waterText}>
              {waterIntake}/{targetWaterIntake} glasses • {((waterIntake/targetWaterIntake)*100).toFixed(0)}% completed
            </Text>
          </View>
        </View>

        {/* Enhanced Meal Plan */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Today's Meal Plan</Text>
          <Text style={styles.tipText}>💡 {todayTip}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealScroll}>
            {mealPlan.map((meal, idx) => (
              <View key={meal.meal} style={[styles.mealCard, { backgroundColor: meal.color }]}>
                <View style={styles.mealHeader}>
                  <Ionicons name={meal.icon} size={28} color="#4f8cff" />
                  <Text style={styles.mealTime}>{meal.time}</Text>
                </View>
                <Text style={styles.mealName}>{meal.meal}</Text>
                <Text style={styles.mealCalories}>{meal.calories}</Text>
                <View style={styles.mealFoods}>
                  {meal.foods.map((food, i) => (
                    <Text key={i} style={styles.mealFood}>• {food}</Text>
                  ))}
                </View>
                <Text style={styles.mealBenefit}>{meal.benefits}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Supplements */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Daily Supplements</Text>
          <View style={styles.supplementsList}>
            {supplements.map(s => (
              <TouchableOpacity 
                key={s.id} 
                style={[styles.supplementCard, supplementsTaken[s.id] && styles.supplementTaken]}
                onPress={() => toggleSupplement(s.id)}
              >
                <View style={styles.supplementLeft}>
                  <View style={[styles.supplementIcon, { backgroundColor: s.color }]}>
                    <Ionicons name={s.icon} size={20} color="#fff" />
                  </View>
                  <View style={styles.supplementInfo}>
                    <Text style={styles.supplementName}>{s.name}</Text>
                    <Text style={styles.supplementDosage}>{s.dosage} • {s.timing}</Text>
                    <Text style={styles.supplementImportance}>{s.importance}</Text>
                  </View>
                </View>
                <View style={styles.supplementRight}>
                  <View style={[styles.checkbox, supplementsTaken[s.id] && styles.checkboxChecked]}>
                    {supplementsTaken[s.id] && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Advice & Reminders */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Doctor's Advice</Text>
          <View style={styles.adviceCard}>
            <FontAwesome5 name="user-md" size={20} color="#4f8cff" />
            <Text style={styles.adviceText}>{advice}</Text>
          </View>
          
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Upcoming Reminders</Text>
          {reminders.map((reminder, i) => (
            <View key={i} style={styles.reminderCard}>
              <View style={styles.reminderIcon}>
                <Ionicons name="notifications-outline" size={18} color="#4f8cff" />
              </View>
              <Text style={styles.reminderText}>{reminder}</Text>
              {i === 0 && <Text style={styles.urgentBadge}>Soon</Text>}
            </View>
          ))}
        </View>

        {/* Enhanced Quick Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('AI Health Bot')}>
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.quickGradient}>
                <Ionicons name="chatbubbles-outline" size={26} color="#fff" />
                <Text style={styles.quickText}>Ask AI</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickCard} onPress={() => emergencyCall('108')}>
              <LinearGradient colors={['#ff6b6b', '#ee5a24']} style={styles.quickGradient}>
                <Ionicons name="call" size={26} color="#fff" />
                <Text style={styles.quickText}>Emergency</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Reports', { pregnancyId })}>
              <LinearGradient colors={['#4ecdc4', '#44bd87']} style={styles.quickGradient}>
                <Ionicons name="document-text-outline" size={26} color="#fff" />
                <Text style={styles.quickText}>Reports</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.motivationCard}>
          <Entypo name="quote" size={24} color="#ff6b9d" />
          <Text style={styles.motivationText}>
            "Every day you're pregnant is a day closer to meeting your little miracle. You're doing amazing!"
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 , marginTop: 50},
  
  // Enhanced Overview Card
  overviewCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.13,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e3f0ff',
    borderWidth: 2,
    borderColor: '#4f8cff',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4f8cff',
  },
  weekText: {
    fontSize: 15,
    color: '#2d3a4b',
    fontWeight: '500',
    marginTop: 2,
  },
  notificationBadge: {
    backgroundColor: '#4f8cff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dueDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dueDate: {
    fontSize: 15,
    color: '#2d3a4b',
    fontWeight: '500',
  },
  dueDateValue: {
    color: '#4f8cff',
    fontWeight: 'bold',
  },
  daysLeft: {
    fontSize: 13,
    color: '#ff6b9d',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#e3f0ff',
    borderRadius: 5,
    marginBottom: 6,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#4f8cff',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  // Baby Development Card
  babyCard: {
    backgroundColor: '#fff5f8',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffebf0',
  },
  babyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  babyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b9d',
    marginLeft: 8,
  },
  babyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  babyStat: {
    alignItems: 'center',
  },
  babyStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  babyStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3a4b',
  },
  milestone: {
    fontSize: 13,
    color: '#ff6b9d',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
  
  // Section Cards
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4f8cff',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  
  // Health Vitals
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalCard: {
    width: '48%',
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  vitalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginBottom: 4,
  },
  vitalStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Water Tracker
  addWaterBtn: {
    backgroundColor: '#e3f7ff',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterTracker: {
    alignItems: 'center',
  },
  waterGlasses: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  waterGlass: {
    marginHorizontal: 6,
  },
  waterText: {
    fontSize: 14,
    color: '#2d3a4b',
    fontWeight: '500',
  },
  
  // Enhanced Meal Plan
  mealScroll: {
    marginTop: 10,
  },
  mealCard: {
    width: 180,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTime: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  mealName: {
    fontWeight: 'bold',
    color: '#4f8cff',
    fontSize: 15,
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  mealFoods: {
    marginBottom: 8,
  },
  mealFood: {
    color: '#2d3a4b',
    fontSize: 12,
    marginBottom: 2,
  },
  mealBenefit: {
    fontSize: 11,
    color: '#4f8cff',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  
  // Enhanced Supplements
  supplementsList: {
    marginTop: 8,
  },
  supplementCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  supplementTaken: {
    backgroundColor: '#e8f5e8',
    borderColor: '#81c784',
    borderWidth: 1,
  },
  supplementLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  supplementIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginBottom: 2,
  },
  supplementDosage: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  supplementImportance: {
    fontSize: 11,
    color: '#4f8cff',
    fontStyle: 'italic',
  },
  supplementRight: {
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4f8cff',
    borderColor: '#4f8cff',
  },
  
  // Advice & Reminders
  adviceCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  adviceText: {
    fontSize: 14,
    color: '#2d3a4b',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  reminderIcon: {
    marginRight: 10,
  },
  reminderText: {
    fontSize: 14,
    color: '#2d3a4b',
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  
  // Enhanced Quick Actions
  quickActionsCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4f8cff',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  quickGradient: {
    alignItems: 'center',
    padding: 16,
  },
  quickText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 6,
  },
  
  // Motivational Quote
  motivationCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#ff6b9d',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  motivationText: {
    fontSize: 16,
    color: '#2d3a4b',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 14
  }
})