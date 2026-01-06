import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import TopBar from '@/components/TopBar';
import PrescriptionCard from '@/components/PrescriptionCard';
import { AppColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';

export default function HistoryScreen() {
  const { userData } = useUser();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'applied': return '신청완료';
      case 'approved': return '승인됨';
      case 'rejected': return '거절됨';
      default: return '처리중';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return AppColors.primary;
      case 'approved': return '#28a745';
      case 'rejected': return AppColors.error;
      default: return AppColors.darkGray;
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>혜택 신청 이력</Text>
          {userData.appliedBenefits.length === 0 ? (
            <Text style={styles.emptyText}>아직 신청한 혜택이 없습니다.</Text>
          ) : (
            userData.appliedBenefits.map((benefit, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.benefitItem}
                onPress={() => router.push(`/benefit-detail?id=${benefit.id}`)}
              >
                <View style={styles.benefitHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{benefit.category}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(benefit.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(benefit.status)}</Text>
                  </View>
                </View>
                
                <Text style={styles.benefitName}>{benefit.name}</Text>
                
                <View style={styles.benefitFooter}>
                  <Text style={styles.savingsText}>{benefit.savings} 절감</Text>
                  <Text style={styles.dateText}>{formatDate(benefit.appliedDate)}</Text>
                </View>
                
                <View style={styles.detailIndicator}>
                  <Text style={styles.detailText}>상세보기 →</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>처방전 이력</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/prescription-add')}
            >
              <Text style={styles.addButtonText}>+ 추가</Text>
            </TouchableOpacity>
          </View>
          
          {userData.prescriptions.length === 0 ? (
            <Text style={styles.emptyText}>처방전이 없습니다.</Text>
          ) : (
            userData.prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                onPress={() => {
                  // 처방전 상세보기 (향후 구현)
                }}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  addButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addButtonText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.darkGray,
    textAlign: 'center',
    paddingVertical: 30,
  },
  benefitItem: {
    backgroundColor: AppColors.gray,
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  benefitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.white,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.white,
  },
  benefitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 10,
  },
  benefitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.secondary,
  },
  dateText: {
    fontSize: 12,
    color: AppColors.darkGray,
  },
  detailIndicator: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  detailText: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '600',
  },
});