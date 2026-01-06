import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import TopBar from '@/components/TopBar';
import PatientCard from '@/components/PatientCard';
import ExpenditureCard from '@/components/ExpenditureCard';
import BenefitItem from '@/components/BenefitItem';
import NotificationCard from '@/components/NotificationCard';
import { AppColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { router } from 'expo-router';
import { BENEFIT_DATA } from '@/constants/benefits';

const CATEGORIES = ['전체', '요양급여', '의료비지원', '돌봄서비스', '간병지원', '생활지원', '주거지원'];

export default function HomeScreen() {
  const { userData } = useUser();
  const [showNotification, setShowNotification] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 기본값 설정 (로그인하지 않은 경우나 데이터가 없는 경우)
  const patientInfo = userData.patient ? {
    name: userData.patient.patientName,
    relationship: userData.patient.patientRelationship,
    age: userData.patient.age,
    diagnosis: userData.patient.diseases,
    address: userData.patient.patientRegion,
  } : {
    name: '환자명',
    relationship: '관계',
    age: 0,
    diagnosis: '진단명 없음',
    address: '주소 없음',
  };

  const filteredBenefits = selectedCategory === '전체'
    ? BENEFIT_DATA
    : BENEFIT_DATA.filter(b => b.category === selectedCategory);

  const calculateTotalSavings = () => {
    return userData.appliedBenefits.reduce((acc, benefit) => {
      // "월 80만원" -> 800000
      const amountStr = benefit.savings.replace(/[^0-9]/g, '');
      // 만약 '만원' 단위가 없다면 1, 있다면 10000 곱하기 (데이터 형식에 따라 조정)
      // 여기서는 '80만원', '30만원' 형식이므로 숫자만 추출 후 10000 곱함
      const amount = parseInt(amountStr, 10) * 10000;
      return acc + amount;
    }, 0);
  };

  const totalSavings = calculateTotalSavings();
  const originalCost = 4500000; // 예상 간병비 (하드코딩된 예시 값)

  const handleBenefitPress = (benefit: any) => {
    router.push({
      pathname: '/benefit-detail',
      params: { id: benefit.id },
    });
  };

  const handleExpenditurePress = () => {
    router.push({
      pathname: '/expenditure-analysis',
      params: { 
        originalCost: originalCost.toString(),
        savings: totalSavings.toString()
      },
    });
  };

  const handleShowNotification = () => {
    setShowNotification(true);
  };

  return (
    <View style={styles.container}>
      <TopBar onNotificationPress={handleShowNotification} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PatientCard patient={patientInfo} />
        
        <ExpenditureCard 
          originalCost={originalCost}
          savings={totalSavings}
          onPress={handleExpenditurePress}
        />

        <NotificationCard 
          patientName={patientInfo.name}
          isVisible={showNotification}
          onClose={() => setShowNotification(false)}
        />
        
        <View style={styles.benefitSection}>
          <Text style={styles.benefitTitle}>환자에게 적합한 의료복지 처방전</Text>
          <Text style={styles.benefitSubtitle}>
            환자 정보를 바탕으로 추천된 혜택입니다
          </Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.chipScroll}
          contentContainerStyle={styles.chipContainer}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                selectedCategory === cat && styles.activeChip
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text 
                style={[
                  styles.chipText,
                  selectedCategory === cat && styles.activeChipText
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.benefitList}>
          {filteredBenefits.map((benefit) => (
            <BenefitItem
              key={benefit.id}
              benefit={benefit}
              isApplied={userData.appliedBenefits.some(b => b.id === benefit.id)}
              onPress={() => handleBenefitPress(benefit)}
            />
          ))}
          {filteredBenefits.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>해당 카테고리의 혜택이 없습니다.</Text>
            </View>
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
  },
  benefitSection: {
    marginTop:10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  benefitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 8,
  },
  benefitSubtitle: {
    fontSize: 14,
    color: AppColors.darkGray,
    lineHeight: 20,
  },
  chipScroll: {
    marginBottom: 10,
  },
  chipContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
  },
  activeChip: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  chipText: {
    fontSize: 14,
    color: AppColors.darkGray,
    fontWeight: '500',
  },
  activeChipText: {
    color: AppColors.white,
    fontWeight: 'bold',
  },
  benefitList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: AppColors.darkGray,
    fontSize: 14,
  },
});
