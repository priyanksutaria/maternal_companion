import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, setUser, language, setLanguage } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [mobile, setMobile] = useState(user?.mobile || '9876543210');
  const [email, setEmail] = useState(user?.email || 'priya.sharma@example.com');
  const [age, setAge] = useState(user?.age || '28');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '9876543211');
  const [emergencyName, setEmergencyName] = useState(user?.emergencyName || 'Rahul Sharma');
  const [address, setAddress] = useState(user?.address || 'Pune, Maharashtra');
  const [ancCenter, setAncCenter] = useState(user?.ancCenter || 'Sassoon Hospital');
  const [doctorName, setDoctorName] = useState(user?.doctorName || 'Dr. Sunita Patil');
  const [notif, setNotif] = useState(true);
  const [reminderTime, setReminderTime] = useState(user?.reminderTime || '09:00');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setUser({ 
      ...user, 
      name, 
      mobile, 
      email, 
      age, 
      bloodGroup, 
      emergencyContact, 
      emergencyName, 
      address, 
      ancCenter, 
      doctorName, 
      reminderTime 
    });
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!", [{ text: "OK" }]);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setUser(null);
    setShowLogoutModal(false);
  };

  const getText = (key) => {
    const texts = {
      en: {
        title: 'My Profile',
        edit: 'Edit Profile',
        save: 'Save Changes',
        cancel: 'Cancel',
        logout: 'Logout',
        personalInfo: 'Personal Information',
        medicalInfo: 'Medical Information',
        preferences: 'Preferences',
        emergency: 'Emergency Contact',
        language: 'Language',
        notifications: 'Notifications',
        medicineReminder: 'Medicine Reminder Time',
        logoutConfirm: 'Are you sure you want to logout?',
        yes: 'Yes',
        no: 'No',
        name: 'Full Name',
        mobile: 'Mobile Number',
        email: 'Email Address',
        age: 'Age',
        bloodGroup: 'Blood Group',
        address: 'Address',
        ancCenter: 'ANC Center',
        doctorName: 'Doctor Name',
        emergencyContactName: 'Emergency Contact Name',
        emergencyContactNumber: 'Emergency Contact Number'
      },
      mr: {
        title: 'माझे प्रोफाइल',
        edit: 'प्रोफाइल संपादित करा',
        save: 'बदल जतन करा',
        cancel: 'रद्द करा',
        logout: 'बाहेर पडा',
        personalInfo: 'वैयक्तिक माहिती',
        medicalInfo: 'वैद्यकीय माहिती',
        preferences: 'प्राधान्ये',
        emergency: 'आपत्कालीन संपर्क',
        language: 'भाषा',
        notifications: 'सूचना',
        medicineReminder: 'औषध स्मरणपत्र वेळ',
        logoutConfirm: 'तुम्हाला खात्री आहे की तुम्ही बाहेर पडू इच्छिता?',
        yes: 'होय',
        no: 'नाही',
        name: 'पूर्ण नाव',
        mobile: 'मोबाइल नंबर',
        email: 'ईमेल पत्ता',
        age: 'वय',
        bloodGroup: 'रक्तगट',
        address: 'पत्ता',
        ancCenter: 'ANC केंद्र',
        doctorName: 'डॉक्टरचे नाव',
        emergencyContactName: 'आपत्कालीन संपर्क नाव',
        emergencyContactNumber: 'आपत्कालीन संपर्क नंबर'
      }
    };
    return texts[language]?.[key] || texts.en[key];
  };

  const InfoCard = ({ title, children, icon }) => (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color="#4f8cff" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const InputField = ({ label, value, onChangeText, placeholder, keyboardType, icon, maxLength, editable = true }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputRow, !editable && styles.inputRowDisabled]}>
        <Ionicons name={icon} size={18} color="#4f8cff" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#b0c4de"
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable && isEditing}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#4f8cff', '#6dd5ed', '#fff']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.card}>
              {/* Header with Avatar */}
              <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image source={require('../assets/Logo.png')} style={styles.avatarLogo} />
                  <View style={styles.pregnancyBadge}>
                    <MaterialCommunityIcons name="baby" size={16} color="#fff" />
                  </View>
                </View>
                <Text style={styles.welcomeText}>Welcome, {name.split(' ')[0]}!</Text>
                <Text style={styles.pregnancyWeek}>Week 18 • 2nd Trimester</Text>
                
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Ionicons 
                    name={isEditing ? "close" : "create-outline"} 
                    size={16} 
                    color="#4f8cff" 
                  />
                  <Text style={styles.editButtonText}>
                    {isEditing ? getText('cancel') : getText('edit')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Personal Information */}
              <InfoCard title={getText('personalInfo')} icon="person-outline">
                <InputField
                  label={getText('name')}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  icon="person-outline"
                />
                <InputField
                  label={getText('mobile')}
                  value={mobile}
                  onChangeText={setMobile}
                  placeholder="Enter mobile number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  icon="call-outline"
                />
                <InputField
                  label={getText('email')}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  icon="mail-outline"
                />
                <InputField
                  label={getText('age')}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Enter your age"
                  keyboardType="numeric"
                  maxLength={2}
                  icon="calendar-outline"
                />
                <InputField
                  label={getText('address')}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  icon="location-outline"
                />
              </InfoCard>

              {/* Medical Information */}
              <InfoCard title={getText('medicalInfo')} icon="medical-outline">
                <InputField
                  label={getText('bloodGroup')}
                  value={bloodGroup}
                  onChangeText={setBloodGroup}
                  placeholder="Enter blood group"
                  icon="water-outline"
                />
                <InputField
                  label={getText('ancCenter')}
                  value={ancCenter}
                  onChangeText={setAncCenter}
                  placeholder="Enter ANC center name"
                  icon="business-outline"
                />
                <InputField
                  label={getText('doctorName')}
                  value={doctorName}
                  onChangeText={setDoctorName}
                  placeholder="Enter doctor's name"
                  icon="person-add-outline"
                />
              </InfoCard>

              {/* Emergency Contact */}
              <InfoCard title={getText('emergency')} icon="call-outline">
                <InputField
                  label={getText('emergencyContactName')}
                  value={emergencyName}
                  onChangeText={setEmergencyName}
                  placeholder="Enter emergency contact name"
                  icon="person-outline"
                />
                <InputField
                  label={getText('emergencyContactNumber')}
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  placeholder="Enter emergency contact number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  icon="call-outline"
                />
              </InfoCard>

              {/* Preferences */}
              <InfoCard title={getText('preferences')} icon="settings-outline">
                <View style={styles.prefRow}>
                  <Text style={styles.prefLabel}>{getText('language')}:</Text>
                  <View style={styles.langContainer}>
                    <TouchableOpacity
                      style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                      onPress={() => setLanguage('en')}
                    >
                      <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.langBtn, language === 'mr' && styles.langBtnActive]}
                      onPress={() => setLanguage('mr')}
                    >
                      <Text style={[styles.langText, language === 'mr' && styles.langTextActive]}>मर</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.prefRow}>
                  <Text style={styles.prefLabel}>{getText('notifications')}:</Text>
                  <TouchableOpacity 
                    style={styles.toggleButton}
                    onPress={() => setNotif(!notif)}
                  >
                    <View style={[styles.toggleTrack, notif && styles.toggleTrackActive]}>
                      <View style={[styles.toggleThumb, notif && styles.toggleThumbActive]} />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.prefRow}>
                  <Text style={styles.prefLabel}>{getText('medicineReminder')}:</Text>
                  <TouchableOpacity style={styles.timeButton}>
                    <Ionicons name="time-outline" size={16} color="#4f8cff" />
                    <Text style={styles.timeText}>{reminderTime}</Text>
                  </TouchableOpacity>
                </View>
              </InfoCard>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {isEditing && (
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.saveText}>{getText('save')}</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                  <MaterialCommunityIcons name="logout" size={20} color="#4f8cff" style={{ marginRight: 8 }} />
                  <Text style={styles.logoutText}>{getText('logout')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Logout Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLogoutModal}
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <MaterialCommunityIcons name="logout" size={48} color="#4f8cff" style={styles.modalIcon} />
              <Text style={styles.modalTitle}>{getText('logout')}</Text>
              <Text style={styles.modalMessage}>{getText('logoutConfirm')}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => setShowLogoutModal(false)}>
                  <Text style={styles.modalBtnText}>{getText('no')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={confirmLogout}>
                  <Text style={[styles.modalBtnText, styles.modalBtnTextPrimary]}>{getText('yes')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { 
    flex: 1 
  },
  scrollContainer: { 
    flexGrow: 1,
    paddingVertical: 20,
    marginTop: 20
  },
  container: { 
    flex: 1, 
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f2ff',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff9a9e',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff9a9e',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    resizeMode: 'contain',
  },
  pregnancyBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#4f8cff',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3a4b',
    textAlign: 'center',
    marginBottom: 4,
  },
  pregnancyWeek: {
    fontSize: 16,
    color: '#4f8cff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e8f2ff',
    borderRadius: 20,
    marginTop: 8,
  },
  editButtonText: {
    color: '#4f8cff',
    fontWeight: '600',
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: '#f8fbff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8f2ff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2d3a4b',
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8f2ff',
  },
  inputRowDisabled: {
    backgroundColor: '#f0f0f0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2d3a4b',
  },
  inputDisabled: {
    color: '#888',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  prefLabel: {
    fontSize: 16,
    color: '#2d3a4b',
    fontWeight: '600',
  },
  langContainer: {
    flexDirection: 'row',
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8f2ff',
  },
  langBtnActive: {
    backgroundColor: '#4f8cff',
    borderColor: '#4f8cff',
  },
  langText: {
    color: '#4f8cff',
    fontWeight: '600',
    fontSize: 14,
  },
  langTextActive: {
    color: '#fff',
  },
  toggleButton: {
    padding: 4,
  },
  toggleTrack: {
    width: 50,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackActive: {
    backgroundColor: '#4f8cff',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8f2ff',
  },
  timeText: {
    marginLeft: 6,
    color: '#2d3a4b',
    fontWeight: '600',
  },
  actionButtons: {
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f8cff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4f8cff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  logoutText: {
    color: '#4f8cff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 6,
    alignItems: 'center',
  },
  modalBtnPrimary: {
    backgroundColor: '#4f8cff',
    borderColor: '#4f8cff',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalBtnTextPrimary: {
    color: '#fff',
  },
});