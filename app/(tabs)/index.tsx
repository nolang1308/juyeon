import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import TopBar from '@/components/TopBar';
import PatientCard from '@/components/PatientCard';
import BenefitItem from '@/components/BenefitItem';
import NotificationCard from '@/components/NotificationCard';
import { AppColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { userData } = useUser();
  const [showNotification, setShowNotification] = useState(false);

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

  const benefits = [
    {
      id: '1',
      name: '장기요양보험 재가급여',
      description: '가정에서 요양 서비스를 받을 수 있는 혜택입니다. 방문요양, 방문목욕, 방문간호 등이 포함됩니다.',
      savings: '월 80만원',
      category: '요양급여',
    },
    {
      id: '2',
      name: '중증환자 의료비 지원',
      description: '뇌혈관질환 등 중증질환자를 위한 의료비 지원 제도입니다. 본인부담금을 크게 줄일 수 있습니다.',
      savings: '월 120만원',
      category: '의료비지원',
    },
    {
      id: '3',
      name: '장애인활동지원서비스',
      description: '일상생활 지원이 필요한 분을 위한 활동보조 서비스를 제공합니다.',
      savings: '월 60만원',
      category: '돌봄서비스',
    },
    {
      id: '4',
      name: '간병비 지원사업',
      description: '저소득층 환자의 간병비 부담을 덜어주는 지원사업입니다.',
      savings: '월 40만원',
      category: '간병지원',
    },
  ];

  const handleBenefitPress = (benefit: any) => {
    router.push({
      pathname: '/benefit-detail',
      params: { id: benefit.id },
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

        <View style={styles.benefitList}>
          {benefits.map((benefit) => (
            <BenefitItem
              key={benefit.id}
              benefit={benefit}
              onPress={() => handleBenefitPress(benefit)}
            />
          ))}
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
  benefitList: {
    paddingBottom: 20,
  },
});
