import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Enhanced mock data with more details
const reports = [
  {
    id: '1',
    title: 'ANC Visit 1',
    type: 'ANC',
    date: '2025-05-10',
    week: '12 weeks',
    doctor: 'Dr. Priya Sharma',
    location: 'Gandhi PHC Center',
    status: 'completed',
    nextVisit: '2025-06-07',
    summary: 'Normal development, baby heartbeat detected',
    tests: ['Blood Pressure', 'Weight Check', 'Urine Test'],
    recommendations: ['Continue folic acid', 'Drink plenty of water', 'Light exercise']
  },
  {
    id: '2',
    title: 'Lab Report - Blood Work',
    type: 'Lab',
    date: '2025-06-15',
    week: '17 weeks',
    doctor: 'Dr. Amit Patel',
    location: 'City Lab Center',
    status: 'reviewed',
    results: {
      hemoglobin: '11.2 g/dL (Normal)',
      bloodSugar: '95 mg/dL (Normal)',
      ironLevel: 'Slightly Low'
    },
    recommendations: ['Iron supplements prescribed', 'Iron-rich foods recommended']
  },
  {
    id: '3',
    title: 'Prescription - Iron & Vitamins',
    type: 'Rx',
    date: '2025-07-01',
    week: '20 weeks',
    doctor: 'Dr. Priya Sharma',
    location: 'Gandhi PHC Center',
    status: 'active',
    medicines: [
      { name: 'Iron Tablet', dosage: '1 tablet daily after meals', duration: '30 days' },
      { name: 'Folic Acid', dosage: '1 tablet daily', duration: '30 days' },
      { name: 'Calcium', dosage: '1 tablet at bedtime', duration: '30 days' }
    ]
  },
  {
    id: '4',
    title: 'Ultrasound Report',
    type: 'Ultrasound',
    date: '2025-07-10',
    week: '21 weeks',
    doctor: 'Dr. Meera Joshi',
    location: 'Radiology Center',
    status: 'completed',
    findings: 'Baby developing normally, estimated weight 350g',
    gender: 'Available on request',
    nextScan: '2025-09-05'
  }
];

const typeIcon = {
  ANC: { icon: 'calendar-check', color: '#4f8cff', bg: '#e3f0ff' },
  Lab: { icon: 'flask-outline', color: '#81c784', bg: '#e8f5e8' },
  Rx: { icon: 'pill', color: '#e57373', bg: '#ffeaea' },
  Ultrasound: { icon: 'monitor-heart', color: '#ba68c8', bg: '#f3e5f5' },
};

const statusColors = {
  completed: '#4caf50',
  active: '#2196f3',
  reviewed: '#ff9800',
  pending: '#f44336'
};

export default function ReportsScreen() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openReportDetail = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const renderReportCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.reportCard}
      onPress={() => openReportDetail(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.reportIconWrap, { backgroundColor: typeIcon[item.type]?.bg }]}>
          <MaterialCommunityIcons
            name={typeIcon[item.type]?.icon || 'file-document-outline'}
            size={28}
            color={typeIcon[item.type]?.color || '#4f8cff'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reportTitle}>{item.title}</Text>
          <Text style={styles.reportWeek}>{item.week}</Text>
          <Text style={styles.reportMeta}>{item.date} • {item.doctor}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.summaryText}>
          {item.summary || item.findings || `${item.medicines?.length || 0} medicines prescribed`}
        </Text>
        
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.viewBtn}>
            <Ionicons name="eye-outline" size={16} color="#4f8cff" />
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.downloadBtn}>
            <Ionicons name="cloud-download-outline" size={16} color="#fff" />
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReportDetail = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedReport?.title}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color="#4f8cff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Date & Week</Text>
              <Text style={styles.detailValue}>{selectedReport?.date} • {selectedReport?.week}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Doctor</Text>
              <Text style={styles.detailValue}>{selectedReport?.doctor}</Text>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{selectedReport?.location}</Text>
            </View>
            
            {selectedReport?.summary && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Summary</Text>
                <Text style={styles.detailValue}>{selectedReport.summary}</Text>
              </View>
            )}
            
            {selectedReport?.results && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Test Results</Text>
                {Object.entries(selectedReport.results).map(([key, value]) => (
                  <View key={key} style={styles.resultRow}>
                    <Text style={styles.resultKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <Text style={styles.resultValue}>{value}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {selectedReport?.medicines && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Prescribed Medicines</Text>
                {selectedReport.medicines.map((med, index) => (
                  <View key={index} style={styles.medicineCard}>
                    <Text style={styles.medicineName}>{med.name}</Text>
                    <Text style={styles.medicineDosage}>{med.dosage}</Text>
                    <Text style={styles.medicineDuration}>Duration: {med.duration}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {selectedReport?.recommendations && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Recommendations</Text>
                {selectedReport.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {selectedReport?.nextVisit && (
              <View style={styles.nextVisitCard}>
                <Ionicons name="calendar-outline" size={20} color="#4f8cff" />
                <Text style={styles.nextVisitText}>Next Visit: {selectedReport.nextVisit}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient colors={['#4f8cff', '#6dd5ed', '#fff']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Health Reports</Text>
          <Text style={styles.subtitle}>Track your pregnancy journey</Text>
        </View>
        
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{reports.length}</Text>
            <Text style={styles.summaryLabel}>Total Reports</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {reports.filter(r => r.status === 'completed').length}
            </Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {reports.filter(r => r.status === 'active').length}
            </Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
        </View>
        
        <FlatList
          data={reports}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={renderReportCard}
          showsVerticalScrollIndicator={false}
        />
        
        <TouchableOpacity style={styles.fab} onPress={() => {}}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {renderReportDetail()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20, marginTop: 30 },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.5 
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4f8cff',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  reportCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2d3a4b',
    marginBottom: 2,
  },
  reportWeek: {
    fontSize: 14,
    color: '#4f8cff',
    fontWeight: '600',
    marginBottom: 2,
  },
  reportMeta: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f0ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewBtnText: {
    color: '#4f8cff',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f8cff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  downloadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    backgroundColor: '#4f8cff',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f8cff',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3a4b',
  },
  modalContent: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f8cff',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#2d3a4b',
    lineHeight: 22,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultKey: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3a4b',
  },
  medicineCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3a4b',
    marginBottom: 4,
  },
  medicineDosage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  medicineDuration: {
    fontSize: 12,
    color: '#4f8cff',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2d3a4b',
    marginLeft: 8,
    flex: 1,
  },
  nextVisitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f0ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  nextVisitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f8cff',
    marginLeft: 8,
  },
});