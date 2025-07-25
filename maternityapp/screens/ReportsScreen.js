import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const typeIcon = {
  ANC: { icon: 'calendar-check', color: '#4f8cff', bg: '#e3f0ff' },
  Lab: { icon: 'flask-outline', color: '#81c784', bg: '#e8f5e8' },
  Rx: { icon: 'pill', color: '#e57373', bg: '#ffeaea' },
  Ultrasound: { icon: 'monitor-heart', color: '#ba68c8', bg: '#f3e5f5' },
  Report: { icon: 'file-document-outline', color: '#ff9800', bg: '#fff3e0' },
};

const statusColors = {
  completed: '#4caf50',
  active: '#2196f3',
  reviewed: '#ff9800',
  pending: '#f44336',
  scheduled: '#9e9e9e',
};

export default function ReportsScreen({ route }) {
  const { pregnancyId } = route.params;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`http://192.168.29.28:3000/report/byPregnancy/${pregnancyId}`);
        if (response.ok) {
          const data = await response.json();
          setReports(data.reports);
        } else {
          setError('Failed to fetch reports.');
        }
      } catch (error) {
        setError('An error occurred while fetching reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [pregnancyId]);

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
        <View style={[styles.reportIconWrap, { backgroundColor: typeIcon['Report']?.bg }]}>
          <MaterialCommunityIcons
            name={typeIcon['Report']?.icon || 'file-document-outline'}
            size={28}
            color={typeIcon['Report']?.color || '#4f8cff'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reportTitle}>Report</Text>
          <Text style={styles.reportWeek}>{item.data.analyzeForm.gestational_age_weeks} weeks</Text>
          <Text style={styles.reportMeta}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColors['completed'] }]}>
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.summaryText}>
          {item.data.analysis.alerts.join(', ')}
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
              <Text style={styles.detailValue}>{new Date(selectedReport?.createdAt).toLocaleDateString()} • {selectedReport?.data.analyzeForm.gestational_age_weeks} weeks</Text>
            </View>

            {selectedReport?.data.analysis.alerts && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Alerts</Text>
                {selectedReport.data.analysis.alerts.map((alert, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="alert-circle" size={16} color="#f44336" />
                    <Text style={styles.recommendationText}>{alert}</Text>
                  </View>
                ))}
              </View>
            )}

            {selectedReport?.data.analysis.dietary_recommendations && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Dietary Recommendations</Text>
                {selectedReport.data.analysis.dietary_recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="restaurant-outline" size={16} color="#4caf50" />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}

            {selectedReport?.data.analysis.supplement_recommendations && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Supplement Recommendations</Text>
                {selectedReport.data.analysis.supplement_recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="medkit-outline" size={16} color="#2196f3" />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#4f8cff" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (error) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error}</Text></View>;
  }

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
              {reports.length}
            </Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              0
            </Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
        </View>

        <FlatList
          data={reports}
          keyExtractor={item => item._id}
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