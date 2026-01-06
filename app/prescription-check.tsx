import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { AppColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';

interface PrescriptionItem {
  id: string;
  name: string;
  category: string;
  description: string;
  savings: string;
  eligibility: string;
}

export default function PrescriptionCheckScreen() {
  const { userData, applyBenefit } = useUser();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const prescriptions: PrescriptionItem[] = [
    {
      id: 'p1',
      name: '장기요양보험 재가급여',
      category: '요양급여',
      description: '가정 방문 요양서비스 (방문요양, 방문목욕, 방문간호)',
      savings: '월 80만원',
      eligibility: '장기요양 1-5등급'
    },
    {
      id: 'p2',
      name: '중증환자 의료비 지원',
      category: '의료비지원',
      description: '뇌혈관질환 관련 의료비 본인부담금 지원',
      savings: '월 120만원',
      eligibility: '중증질환 진단'
    },
    {
      id: 'p3',
      name: '간병비 지원사업',
      category: '간병지원',
      description: '입원 시 간병서비스 비용 지원',
      savings: '월 40만원',
      eligibility: '의료급여 수급권자'
    }
  ];

  const patientName = userData.patient?.patientName || '환자';

  const handleItemCheck = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const handleApplySelected = () => {
    if (checkedItems.length === 0) {
      Alert.alert('알림', '신청할 항목을 선택해주세요.');
      return;
    }
    
    router.push({
      pathname: '/prescription-loading',
      params: { 
        selectedItems: JSON.stringify(checkedItems),
        type: 'selected'
      }
    });
  };

  const handleApplyAll = () => {
    const allIds = prescriptions.map(p => p.id);
    router.push({
      pathname: '/prescription-loading',
      params: { 
        selectedItems: JSON.stringify(allIds),
        type: 'all'
      }
    });
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>복지 처방전</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <View style={styles.prescriptionImagePlaceholder}>
            <Text style={styles.prescriptionImageText}>📋</Text>
          </View>
          <Text style={styles.title}>🎯 {patientName}님 맞춤 복지 처방전</Text>
          <Text style={styles.subtitle}>
            진단 결과를 바탕으로 선별된 최적의 복지 혜택입니다
          </Text>
        </View>

        <View style={styles.prescriptionList}>
          {prescriptions.map((item, index) => (
            <View key={item.id} style={styles.prescriptionItem}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleItemCheck(item.id)}
              >
                <View style={[
                  styles.checkbox,
                  checkedItems.includes(item.id) && styles.checkedBox
                ]}>
                  {checkedItems.includes(item.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                  <Text style={styles.savingsText}>{item.savings}</Text>
                </View>

                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.eligibility}>대상: {item.eligibility}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.selectedApplyButton}
            onPress={handleApplySelected}
          >
            <Text style={styles.selectedApplyButtonText}>
              선택 항목 신청 ({checkedItems.length}개)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.allApplyButton}
            onPress={handleApplyAll}
          >
            <Text style={styles.allApplyButtonText}>복지 일괄신청</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.gray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: AppColors.secondary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleSection: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  prescriptionImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  prescriptionImageText: {
    fontSize: 40,
    color: AppColors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  prescriptionList: {
    marginBottom: 20,
  },
  prescriptionItem: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 16,
    paddingTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: AppColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  checkmark: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.white,
  },
  savingsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 14,
    color: AppColors.darkGray,
    lineHeight: 20,
    marginBottom: 4,
  },
  eligibility: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  selectedApplyButton: {
    backgroundColor: AppColors.white,
    borderWidth: 2,
    borderColor: AppColors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectedApplyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  allApplyButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  allApplyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
  },
});