import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { usePregnancy } from '../context/PregnancyContext';

const typeIcon = {
  ANC: { icon: 'calendar-check', color: '#4caf50', bg: '#e3f0ff' },
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
  const { pregnancyId } = usePregnancy();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const openReportDetail = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const fetchReports = async () => {
  try {
    setLoading(true);
    const response = await fetch(`https://maternity-backend-1.onrender.com/report/byPregnancy/${pregnancyId}`);
    if (response.ok) {
      const data = await response.json();
      setReports(data.reports || []);
    } else {
      const errorText = await response.text();
      setError('Failed to fetch reports.');
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    setError('An error occurred while fetching reports.');
  } finally {
    setLoading(false);
    setRefreshing(false); // Important
  }
};

useFocusEffect(
  useCallback(() => {
    if (pregnancyId) {
      console.log('📌 useFocusEffect triggered');
      fetchReports();
    } else {
      console.log('🚫 pregnancyId missing in useFocusEffect');
    }
  }, [pregnancyId])
);


  const onRefresh = () => {
  setRefreshing(true);
  fetchReports();
};

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getGestationalAge = (report) => {
    return report?.data?.analyzeForm?.gestational_age_weeks || 'N/A';
  };

  const getPatientName = (report) => {
    return report?.data?.patientDetails?.personal?.name || 'Unknown Patient';
  };

  const getVisitType = (report) => {
    return report?.data?.visitDetails?.visitNumber || 'General Report';
  };

  const getRiskLevel = (report) => {
    const pregRisk = report?.data?.pregRisk?.EnsemblePrediction;
    const fetalRisk = report?.data?.fetalRisk?.EnsemblePrediction;
    
    if (pregRisk === 2 || fetalRisk === 2) return { level: 'High', color: '#f44336' };
    if (pregRisk === 1 || fetalRisk === 1) return { level: 'Medium', color: '#ff9800' };
    return { level: 'Low', color: '#4caf50' };
  };

  const renderReportCard = ({ item }) => {
    const gestationalAge = getGestationalAge(item);
    const visitType = getVisitType(item);
    const riskLevel = getRiskLevel(item);
    const alertsCount = item?.data?.analysis?.alerts?.length || 0;

    return (
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
              color={typeIcon['Report']?.color || '#4caf50'}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.reportTitle}>{visitType}</Text>
            <Text style={styles.reportWeek}>{gestationalAge} weeks</Text>
            <Text style={styles.reportMeta}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.riskBadge, { backgroundColor: riskLevel.color }]}>
              <Text style={styles.statusText}>{riskLevel.level} Risk</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.summaryText}>
            {alertsCount > 0 
              ? `${alertsCount} alert${alertsCount > 1 ? 's' : ''} detected`
              : 'No alerts detected'
            }
          </Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.viewBtn}>
              <Ionicons name="eye-outline" size={16} color="#4caf50" />
              <Text style={styles.viewBtnText}>View Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.downloadBtn}
              onPress={() => Alert.alert('Download', 'Download functionality coming soon!')}
            >
              <Ionicons name="cloud-download-outline" size={16} color="#fff" />
              <Text style={styles.downloadText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailSection = (title, data, icon, color) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    return (
      <View style={styles.detailSection}>
        <Text style={styles.detailLabel}>{title}</Text>
        {Array.isArray(data) ? (
          data.map((item, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name={icon} size={16} color={color} />
              <Text style={styles.recommendationText}>{item}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.detailValue}>{data}</Text>
        )}
      </View>
    );
  };

  const renderVitalSigns = (report) => {
    const vitals = report?.data?.analyzeForm;
    if (!vitals) return null;

    return (
      <View style={styles.detailSection}>
        <Text style={styles.detailLabel}>Vital Signs & Lab Results</Text>
        <View style={styles.vitalsGrid}>
          {vitals.sbp && vitals.dbp && (
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
              <Text style={styles.vitalValue}>{vitals.sbp}/{vitals.dbp} mmHg</Text>
            </View>
          )}
          {vitals.bmi && (
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>BMI</Text>
              <Text style={styles.vitalValue}>{vitals.bmi}</Text>
            </View>
          )}
          {vitals.ferritin && (
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Ferritin</Text>
              <Text style={styles.vitalValue}>{vitals.ferritin} µg/L</Text>
            </View>
          )}
          {vitals.ogtt_f && (
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>OGTT (Fasting)</Text>
              <Text style={styles.vitalValue}>{vitals.ogtt_f} mg/dL</Text>
            </View>
          )}
          {vitals.current_weight && (
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>Current Weight</Text>
              <Text style={styles.vitalValue}>{vitals.current_weight} kg</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderRiskAssessment = (report) => {
    const pregRisk = report?.data?.pregRisk;
    const fetalRisk = report?.data?.fetalRisk;
    
    if (!pregRisk && !fetalRisk) return null;

    return (
      <View style={styles.detailSection}>
        <Text style={styles.detailLabel}>Risk Assessment</Text>
        {pregRisk && (
          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>Pregnancy Risk</Text>
            <Text style={styles.riskPrediction}>
              Level {pregRisk.EnsemblePrediction} 
              {pregRisk.EnsemblePrediction === 2 ? ' (High)' : 
               pregRisk.EnsemblePrediction === 1 ? ' (Medium)' : ' (Low)'}
            </Text>
            {pregRisk.Probabilities && (
              <View style={styles.probabilitiesContainer}>
                <Text style={styles.probabilityText}>
                  Low: {(pregRisk.Probabilities.Class_0 * 100).toFixed(1)}%
                </Text>
                <Text style={styles.probabilityText}>
                  Medium: {(pregRisk.Probabilities.Class_1 * 100).toFixed(1)}%
                </Text>
                <Text style={styles.probabilityText}>
                  High: {(pregRisk.Probabilities.Class_2 * 100).toFixed(1)}%
                </Text>
              </View>
            )}
          </View>
        )}
        {fetalRisk && (
          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>Fetal Risk</Text>
            <Text style={styles.riskPrediction}>
              Level {fetalRisk.EnsemblePrediction}
              {fetalRisk.EnsemblePrediction === 2 ? ' (High)' : 
               fetalRisk.EnsemblePrediction === 1 ? ' (Medium)' : ' (Low)'}
            </Text>
            {fetalRisk.Probabilities && (
              <View style={styles.probabilitiesContainer}>
                <Text style={styles.probabilityText}>
                  Low: {(fetalRisk.Probabilities.Class_0 * 100).toFixed(1)}%
                </Text>
                <Text style={styles.probabilityText}>
                  Medium: {(fetalRisk.Probabilities.Class_1 * 100).toFixed(1)}%
                </Text>
                <Text style={styles.probabilityText}>
                  High: {(fetalRisk.Probabilities.Class_2 * 100).toFixed(1)}%
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderReportDetail = () => {
    if (!selectedReport) return null;

    const patientName = getPatientName(selectedReport);
    const gestationalAge = getGestationalAge(selectedReport);
    const visitType = getVisitType(selectedReport);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{visitType} Report</Text>
                <Text style={styles.modalSubtitle}>{patientName}</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#4caf50" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Report Information</Text>
                <Text style={styles.detailValue}>
                  Date: {formatDate(selectedReport.createdAt)}
                </Text>
                <Text style={styles.detailValue}>
                  Gestational Age: {gestationalAge} weeks
                </Text>
                <Text style={styles.detailValue}>
                  Visit Type: {visitType}
                </Text>
              </View>

              {renderVitalSigns(selectedReport)}
              {renderRiskAssessment(selectedReport)}

              {renderDetailSection(
                'Critical Alerts', 
                selectedReport?.data?.analysis?.alerts || selectedReport?.data?.alerts,
                'alert-circle', 
                '#f44336'
              )}

              {renderDetailSection(
                'Medical Recommendations', 
                selectedReport?.data?.analysis?.supplement_recommendations || selectedReport?.data?.recommendations,
                'medkit-outline', 
                '#2196f3'
              )}

              {renderDetailSection(
                'Dietary Recommendations', 
                selectedReport?.data?.analysis?.dietary_recommendations || selectedReport?.data?.dietary_recommendations,
                'restaurant-outline', 
                '#4caf50'
              )}

              {selectedReport?.data?.analysis?.clinical_summary && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Clinical Summary</Text>
                  <Text style={styles.detailValue}>
                    {selectedReport.data.analysis.clinical_summary}
                  </Text>
                </View>
              )}

              {selectedReport?.data?.analysis?.llm_merged_summary && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>AI Generated Summary</Text>
                  <Text style={styles.detailValue}>
                    {selectedReport.data.analysis.llm_merged_summary}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#fff8b0', '#e6f781', '#d0f0c0']} style={styles.gradient}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#fff8b0', '#e6f781', '#d0f0c0']} style={styles.gradient}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#fff" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              // Trigger useEffect again
              setReports([]);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const completedReports = reports.length;
  const activeReports = 0; // You can add logic to count active reports
  const highRiskReports = reports.filter(report => getRiskLevel(report).level === 'High').length;

  return (
    <LinearGradient colors={['#fff8b0', '#e6f781', '#d0f0c0']} style={styles.gradient}>
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
            <Text style={styles.summaryNumber}>{completedReports}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{highRiskReports}</Text>
            <Text style={styles.summaryLabel}>High Risk</Text>
          </View>
        </View>

        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="rgba(255,255,255,0.5)" />
            <Text style={styles.emptyStateText}>No reports available</Text>
            <Text style={styles.emptyStateSubtext}>Your reports will appear here once generated</Text>
          </View>
        ) : (
          <FlatList
  data={reports}
  keyExtractor={item => item._id}
  contentContainerStyle={{ paddingBottom: 100 }}
  renderItem={renderReportCard}
  showsVerticalScrollIndicator={false}
  refreshing={refreshing}
  onRefresh={onRefresh}
/>
        )}
        
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => Alert.alert('Add Report', 'Add new report functionality coming soon!')}
        >
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
    color: '#4caf50', 
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.5 
  },
  subtitle: {
    fontSize: 16,
    color: '#4caf50',
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
    color: '#4caf50',
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
    shadowColor: '#4caf50',
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
    color: '#4caf50',
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
  riskBadge: {
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
    color: '#4caf50',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4caf50',
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
    backgroundColor: '#4caf50',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4caf50',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  
  // Loading and Error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#4caf50',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
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
    maxHeight: '85%',
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
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
    color: '#4caf50',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#2d3a4b',
    lineHeight: 22,
    marginBottom: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2d3a4b',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  vitalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3a4b',
  },
  riskCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3a4b',
    marginBottom: 4,
  },
  riskPrediction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4caf50',
    marginBottom: 8,
  },
  probabilitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  probabilityText: {
    fontSize: 12,
    color: '#666',
  },
});