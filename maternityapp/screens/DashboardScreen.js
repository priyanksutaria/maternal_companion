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
  const [supplementsTaken, setSupplementsTaken] = useState({});
  const [waterIntake, setWaterIntake] = useState(6);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        console.log('Fetching report for pregnancyId:', pregnancyId);
        const response = await fetch(`https://maternity-backend-1.onrender.com/report/byPregnancy/${pregnancyId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Report data:', data);
          if (data.reports && data.reports.length > 0) {
            setReport(data.reports[0]); // Get the latest report
            // Initialize supplements taken state
            const initialSupplements = {};
            data.reports[0].data.analysis.supplement_recommendations.forEach((_, index) => {
              initialSupplements[index] = false;
            });
            setSupplementsTaken(initialSupplements);
          } else {
            setError('No reports found.');
          }
        } else {
          setError('Failed to fetch report.');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('An error occurred while fetching the report.');
      } finally {
        setLoading(false);
      }
    };

    if (pregnancyId) {
      fetchReport();
    }
  }, [pregnancyId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#4caf50" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error}</Text></View>;
  }

  if (!report) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>No report data available</Text></View>;
  }

  // Extract data from report
  const patientData = report.data.patientDetails;
  const analyzeData = report.data.analyzeForm;
  const analysisData = report.data.analysis;
  const visitData = report.data.visitDetails;

  // Personal Information
  const name = patientData?.personal?.name || 'Patient';
  const age = patientData?.personal?.age || analyzeData?.age || 'N/A';
  
  // Pregnancy Information
  // const week = parseInt(analyzeData?.gestational_age_weeks) || 0;
  const dueDate = patientData?.menstrualHistory?.edd ? 
    new Date(patientData.menstrualHistory.edd).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    }) : 'N/A';
  
  // Calculate days remaining
  const today = new Date();
  const dueDateObj = patientData?.menstrualHistory?.edd ? new Date(patientData.menstrualHistory.edd) : null;
  const daysLeft = dueDateObj ? Math.max(0, Math.ceil((dueDateObj - today) / (1000 * 60 * 60 * 24))) : 0;
  const week = Math.floor((280 - daysLeft) / 7);

  // Visit Information
  const nextVisit = visitData?.scheduledDate ? 
    new Date(visitData.scheduledDate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    }) : 'N/A';
  const lastVisitDate = report?.createdAt ? 
    new Date(report.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    }) : 'N/A';

  // Baby Development Data
  const getBabySize = (weeks) => {
    const sizes = {
      8: { size: 'Raspberry', length: '1.6 cm', weight: '1 gram' },
      12: { size: 'Lime', length: '5.4 cm', weight: '14 grams' },
      16: { size: 'Avocado', length: '11.6 cm', weight: '100 grams' },
      20: { size: 'Banana', length: '16.4 cm', weight: '300 grams' },
      24: { size: 'Corn', length: '21 cm', weight: '600 grams' },
      28: { size: 'Eggplant', length: '25 cm', weight: '1 kg' },
      32: { size: 'Squash', length: '28 cm', weight: '1.7 kg' },
      36: { size: 'Romaine Lettuce', length: '32 cm', weight: '2.6 kg' },
      40: { size: 'Watermelon', length: '36 cm', weight: '3.4 kg' }
    };
    
    // Find closest week
    const weekKeys = Object.keys(sizes).map(Number).sort((a, b) => a - b);
    const closestWeek = weekKeys.reduce((prev, curr) => 
      Math.abs(curr - weeks) < Math.abs(prev - weeks) ? curr : prev
    );
    
    return sizes[closestWeek] || { size: 'Growing Baby', length: 'N/A', weight: 'N/A' };
  };

  const babyInfo = getBabySize(week);
  
  // Weight Information
  const currentWeight = analyzeData?.current_weight ? `${analyzeData.current_weight} kg` : 'N/A';
  const prePregnancyWeight = analyzeData?.pre_pregnancy_weight || 0;
  const weightGain = analyzeData?.current_weight && prePregnancyWeight ? 
    `+${(analyzeData.current_weight - prePregnancyWeight).toFixed(1)} kg` : 'N/A';
  
  // Vital Signs
  const bloodPressure = (analyzeData?.sbp && analyzeData?.dbp) ? 
    `${analyzeData.sbp}/${analyzeData.dbp} mmHg` : 'N/A';
  const bmi = analyzeData?.bmi || 'N/A';
  
  // Lab Values
  const hemoglobin = analyzeData?.hb_3rd || analyzeData?.hb_2nd || analyzeData?.hb_1st || 'N/A';
  const ferritin = analyzeData?.ferritin || 'N/A';
  const ironLevel = ferritin !== 'N/A' ? (parseFloat(ferritin) < 15 ? 'Low' : 'Normal') : 'N/A';
  
  // Health Conditions
  const hasAnemia = analysisData?.anemia || false;
  const hasGDM = analysisData?.gdm || false;
  const hasThyroid = analysisData?.thyroid || false;
  
  // Symptoms and Conditions
  const symptoms = analyzeData?.symptoms?.filter(s => s !== 'aaa') || [];
  const conditions = analyzeData?.conditions?.filter(c => c !== 'bbb') || [];

  const targetWaterIntake = 8;
  
  // Weekly milestone based on gestational age
  const getWeeklyMilestone = (weeks) => {
    const milestones = {
      8: "Your baby's arms and legs are developing, and tiny fingers are forming!",
      12: "Your baby can now make a fist and has developed reflexes!",
      16: "Your baby's hearing is developing and they might hear your voice!",
      20: "Your baby is about halfway there and you might feel first movements!",
      24: "Your baby's brain is rapidly developing and they're gaining weight!",
      28: "Your baby's eyes can now open and close, and they're dreaming!",
      32: "Your baby's bones are hardening and they're practicing breathing!",
      36: "Your baby is considered full-term and ready to meet you soon!",
      40: "Your baby is fully developed and ready for birth!"
    };
    
    const weekKeys = Object.keys(milestones).map(Number).sort((a, b) => a - b);
    const closestWeek = weekKeys.reduce((prev, curr) => 
      Math.abs(curr - weeks) < Math.abs(prev - weeks) ? curr : prev
    );
    
    return milestones[closestWeek] || "Your baby is growing and developing beautifully!";
  };

  const weeklyMilestone = getWeeklyMilestone(week);
  
  // Enhanced meal plan based on conditions
  const getMealPlan = () => {
    const baseMealPlan = [
      {
        meal: 'Breakfast',
        icon: 'sunny-outline',
        color: '#ffe082',
        time: '7:00 AM',
        calories: '320 cal',
        foods: ['Oats porridge with nuts', 'Boiled egg', 'Banana', 'Milk (1 glass)'],
        benefits: 'Rich in protein & fiber'
      },
      {
        meal: 'Mid-Morning',
        icon: 'cafe-outline',
        color: '#c8e6c9',
        time: '10:00 AM',
        calories: '150 cal',
        foods: ['Fresh fruit salad', 'Coconut water'],
        benefits: 'Hydration & vitamins'
      },
      {
        meal: 'Lunch',
        icon: 'restaurant-outline',
        color: '#b2dfdb',
        time: '1:00 PM',
        calories: '450 cal',
        foods: ['Chapati (2)', 'Dal', 'Spinach sabzi', 'Rice', 'Curd', 'Salad'],
        benefits: 'Complete balanced meal'
      },
      {
        meal: 'Evening',
        icon: 'nutrition-outline',
        color: '#ffccbc',
        time: '4:00 PM',
        calories: '200 cal',
        foods: ['Buttermilk', 'Roasted chana', 'Dates (2-3)'],
        benefits: 'Energy & calcium'
      },
      {
        meal: 'Dinner',
        icon: 'moon-outline',
        color: '#b3c6f7',
        time: '7:30 PM',
        calories: '400 cal',
        foods: ['Khichdi', 'Mixed veg', 'Paneer curry', 'Apple'],
        benefits: 'Easy digestion'
      }
    ];

    // Modify meal plan based on conditions
    if (hasGDM) {
      baseMealPlan[0].foods = ['Steel-cut oats with almonds', 'Egg white omelette', 'Berries', 'Low-fat milk'];
      baseMealPlan[2].foods = ['Whole wheat chapati (1)', 'Dal', 'Bottle gourd sabzi', 'Brown rice (small portion)', 'Curd', 'Cucumber salad'];
    }

    if (hasAnemia || ironLevel === 'Low') {
      baseMealPlan[2].foods.push('Iron-rich leafy greens');
      baseMealPlan[3].foods = ['Pomegranate juice', 'Roasted chana', 'Dates with almonds'];
    }

    return baseMealPlan;
  };

  const mealPlan = getMealPlan();

  // Dynamic supplements based on analysis
  const getSupplements = () => {
    const supplements = [];
    
    // Always include basic supplements
    supplements.push({
      id: 0,
      name: 'Folic Acid',
      icon: 'leaf',
      timing: 'Before Breakfast',
      dosage: '5mg',
      when: 'before',
      meal: 'Breakfast',
      color: '#81c784',
      importance: 'Neural tube development',
      sideEffect: 'Take on empty stomach'
    });

    // Add iron if anemia or low ferritin
    if (hasAnemia || ironLevel === 'Low' || parseFloat(ferritin) < 15) {
      supplements.push({
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
      });
    }

    // Add calcium
    supplements.push({
      id: 2,
      name: 'Calcium',
      icon: 'bone',
      timing: 'After Dinner',
      dosage: '500mg',
      when: 'after',
      meal: 'Dinner',
      color: '#64b5f6',
      importance: 'Bone health',
      sideEffect: 'Avoid with iron'
    });

    // Add vitamin D if deficient
    if (patientData?.medicalHistory?.vitaminDeficiencies?.includes('Vitamin D')) {
      supplements.push({
        id: 3,
        name: 'Vitamin D',
        icon: 'sunny',
        timing: 'With Lunch',
        dosage: '1000 IU',
        when: 'with',
        meal: 'Lunch',
        color: '#ffb74d',
        importance: 'Bone & immune health',
        sideEffect: 'Take with food'
      });
    }

    return supplements;
  };

  const supplements = getSupplements();

  // Dynamic advice based on conditions and alerts
  const getDynamicAdvice = () => {
    let advice = [];
    
    if (analysisData?.alerts && analysisData.alerts.length > 0) {
      const alerts = analysisData.alerts.filter(alert => alert && alert.trim() !== '');
      if (alerts.length > 0) {
        advice.push("Monitor the highlighted health alerts closely.");
      }
    }
    
    if (hasAnemia || ironLevel === 'Low') {
      advice.push("Focus on iron-rich foods and take supplements regularly.");
    }
    
    if (hasGDM) {
      advice.push("Follow the diabetic meal plan and monitor blood sugar levels.");
    }
    
    if (parseFloat(analyzeData?.sbp) > 140 || parseFloat(analyzeData?.dbp) > 90) {
      advice.push("Monitor blood pressure regularly and follow low-sodium diet.");
    }
    
    if (advice.length === 0) {
      advice.push("Continue with regular prenatal care and healthy lifestyle.");
    }
    
    return advice.join(' ');
  };

  const advice = getDynamicAdvice();

  // Dynamic reminders
  const getReminders = () => {
    const reminders = [];
    
    if (nextVisit !== 'N/A') {
      const nextVisitDate = new Date(visitData.scheduledDate);
      const daysToVisit = Math.ceil((nextVisitDate - today) / (1000 * 60 * 60 * 24));
      reminders.push(`Next ANC visit: ${nextVisit} (${daysToVisit} days)`);
    }
    
    if (hasAnemia || ironLevel === 'Low') {
      reminders.push('Iron supplement after lunch');
    }
    
    // Add week-specific reminders
    if (week >= 18 && week <= 22) {
      reminders.push('Anatomy scan due - book ultrasound');
    }
    
    if (week >= 24 && week <= 28) {
      reminders.push('Glucose tolerance test due');
    }
    
    if (week >= 28) {
      reminders.push('Tetanus vaccination if not completed');
    }
    
    return reminders;
  };

  const reminders = getReminders();

  // Health vitals with dynamic data
  const vitals = [
    { 
      label: 'Weight', 
      value: currentWeight, 
      icon: 'scale-outline', 
      color: '#4caf50', 
      change: weightGain 
    },
    { 
      label: 'BP', 
      value: bloodPressure, 
      icon: 'heart-outline', 
      color: (parseFloat(analyzeData?.sbp) > 140 || parseFloat(analyzeData?.dbp) > 90) ? '#e57373' : '#81c784', 
      status: (parseFloat(analyzeData?.sbp) > 140 || parseFloat(analyzeData?.dbp) > 90) ? 'High' : 'Normal' 
    },
    { 
      label: 'Iron', 
      value: ironLevel, 
      icon: 'fitness-outline', 
      color: ironLevel === 'Low' ? '#e57373' : '#81c784', 
      status: ferritin !== 'N/A' ? `${ferritin} µg/L` : 'N/A' 
    },
    { 
      label: 'Water', 
      value: `${waterIntake}/${targetWaterIntake}`, 
      icon: 'water-outline', 
      color: '#29b6f6', 
      status: 'Track' 
    }
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
    <LinearGradient colors={['#fff8b0', '#e6f781', '#d0f0c0']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Enhanced Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.headerRow}>
            <View style={styles.profileSection}>
              <Image source={require('../assets/Logo.png')} style={styles.avatar} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.greeting}>Good Morning, {name}!</Text>
                <Text style={styles.weekText}>Week {week} of Pregnancy • Age {age}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationBadge}>
              <Ionicons name="notifications" size={20} color="#fff" />
              {analysisData?.alerts && analysisData.alerts.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{analysisData.alerts.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.dueDateRow}>
            <Text style={styles.dueDate}>Due Date: <Text style={styles.dueDateValue}>{dueDate}</Text></Text>
            <Text style={styles.daysLeft}>{daysLeft} days to go</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBar, { width: `${Math.min(week/40*100, 100)}%` }]} />
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
                <Text style={styles.babyStatValue}>{babyInfo.size}</Text>
              </View>
              <View style={styles.babyStat}>
                <Text style={styles.babyStatLabel}>Length</Text>
                <Text style={styles.babyStatValue}>{babyInfo.length}</Text>
              </View>
              <View style={styles.babyStat}>
                <Text style={styles.babyStatLabel}>Weight</Text>
                <Text style={styles.babyStatValue}>{babyInfo.weight}</Text>
              </View>
            </View>
            <Text style={styles.milestone}>{weeklyMilestone}</Text>
          </View>
        </View>

        {/* Health Alerts */}
        {analysisData?.alerts && analysisData.alerts.length > 0 && (
          <View style={styles.alertsCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.alertTitle}>⚠️ Health Alerts</Text>
            </View>
            {analysisData.alerts.map((alert, index) => (
              alert && alert.trim() !== '' && (
                <View key={index} style={styles.alertItem}>
                  <Ionicons name="warning" size={16} color="#ff6b6b" />
                  <Text style={styles.alertText}>{alert}</Text>
                </View>
              )
            ))}
          </View>
        )}

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

        {/* Current Symptoms & Conditions */}
        {(symptoms.length > 0 || conditions.length > 0) && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Current Health Status</Text>
            {symptoms.length > 0 && (
              <View style={styles.statusSection}>
                <Text style={styles.statusSubtitle}>Symptoms:</Text>
                <View style={styles.statusTags}>
                  {symptoms.map((symptom, index) => (
                    <View key={index} style={[styles.statusTag, { backgroundColor: '#fff3e0' }]}>
                      <Text style={[styles.statusTagText, { color: '#f57c00' }]}>{symptom}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {conditions.length > 0 && (
              <View style={styles.statusSection}>
                <Text style={styles.statusSubtitle}>Conditions:</Text>
                <View style={styles.statusTags}>
                  {conditions.map((condition, index) => (
                    <View key={index} style={[styles.statusTag, { backgroundColor: '#ffebee' }]}>
                      <Text style={[styles.statusTagText, { color: '#d32f2f' }]}>{condition}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

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
          <Text style={styles.sectionTitle}>Today's Personalized Meal Plan</Text>
          {(hasGDM || hasAnemia) && (
            <Text style={styles.tipText}>
              💡 Customized for your health conditions: {hasGDM ? 'Gestational Diabetes' : ''} {hasAnemia ? 'Anemia' : ''}
            </Text>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealScroll}>
            {mealPlan.map((meal, idx) => (
              <View key={meal.meal} style={[styles.mealCard, { backgroundColor: meal.color }]}>
                <View style={styles.mealHeader}>
                  <Ionicons name={meal.icon} size={28} color="#4caf50" />
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
          <Text style={styles.sectionTitle}>Prescribed Supplements</Text>
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

        {/* Dietary Recommendations */}
        {analysisData?.dietary_recommendations && analysisData.dietary_recommendations.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Dietary Recommendations</Text>
            {analysisData.dietary_recommendations.slice(0, 3).map((recommendation, index) => (
              recommendation && recommendation.trim() !== '' && (
                <View key={index} style={styles.recommendationCard}>
                  <Ionicons name="nutrition" size={16} color="#4caf50" />
                  <Text style={styles.recommendationText}>{recommendation.trim()}</Text>
                </View>
              )
            ))}
          </View>
        )}

        {/* Advice & Reminders */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Doctor's Advice</Text>
          <View style={styles.adviceCard}>
            <FontAwesome5 name="user-md" size={20} color="#4caf50" />
            <Text style={styles.adviceText}>{advice}</Text>
          </View>
          
          {reminders.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Upcoming Reminders</Text>
              {reminders.map((reminder, i) => (
                <View key={i} style={styles.reminderCard}>
                  <View style={styles.reminderIcon}>
                    <Ionicons name="notifications-outline" size={18} color="#4caf50" />
                  </View>
                  <Text style={styles.reminderText}>{reminder}</Text>
                  {i === 0 && <Text style={styles.urgentBadge}>Soon</Text>}
                </View>
              ))}
            </>
          )}
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
            "Every day you're pregnant is a day closer to meeting your little miracle. You're doing amazing, {name}!"
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40, marginTop: 50 },
  
  // Enhanced Overview Card
  overviewCard: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    shadowColor: '#4caf50',
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
    borderColor: '#4caf50',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  weekText: {
    fontSize: 15,
    color: '#2d3a4b',
    fontWeight: '500',
    marginTop: 2,
  },
  notificationBadge: {
    backgroundColor: '#4caf50',
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
    color: '#4caf50',
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
    backgroundColor: '#4caf50',
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
  
  // Health Alerts Card
  alertsCard: {
    backgroundColor: '#fff5f5',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#d32f2f',
    marginLeft: 8,
    flex: 1,
  },
  
  // Section Cards
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#4caf50',
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
    color: '#4caf50',
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
  
  // Health Status
  statusSection: {
    marginBottom: 12,
  },
  statusSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3a4b',
    marginBottom: 8,
  },
  statusTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '500',
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
    shadowColor: '#4caf50',
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
    color: '#4caf50',
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
    color: '#4caf50',
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
    color: '#4caf50',
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
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  
  // Recommendations
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  recommendationText: {
    fontSize: 13,
    color: '#2d3a4b',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
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
    shadowColor: '#4caf50',
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
    shadowColor: '#4caf50',
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
    fontSize: 14,
    color: '#2d3a4b',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
    marginTop: 8,
    lineHeight: 20,
  },
});