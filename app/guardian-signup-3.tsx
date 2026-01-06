import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppColors } from '@/constants/theme';

export default function GuardianSignup3Screen() {
  const params = useLocalSearchParams();
  
  const [patientName, setPatientName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [patientRelationship, setPatientRelationship] = useState('');
  const [patientRegion, setPatientRegion] = useState('');
  const [diseases, setDiseases] = useState('');
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);

  const relationships = ['부모', '자녀', '배우자', '형제/자매', '기타'];
  const regions = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'];

  const handleNext = () => {
    if (!patientName || !birthDate || !patientRelationship || !patientRegion || !diseases) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthDateRegex.test(birthDate)) {
      Alert.alert('오류', '생년월일을 YYYY-MM-DD 형식으로 입력해주세요.');
      return;
    }

    router.push({
      pathname: '/guardian-signup-4',
      params: {
        ...params,
        patientName,
        birthDate,
        patientRelationship,
        patientRegion,
        diseases,
      },
    });
  };

  const goBack = () => {
    router.back();
  };

  const formatBirthDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,2})(\d{0,2})$/);
    if (match) {
      if (match[1] && match[2] && match[3]) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      } else if (match[1] && match[2]) {
        return `${match[1]}-${match[2]}`;
      } else {
        return match[1];
      }
    }
    return text;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>보호자 회원가입</Text>
            <Text style={styles.subtitle}>3단계: 환자 정보</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressStep, styles.activeStep]} />
              <View style={[styles.progressStep, styles.activeStep]} />
              <View style={[styles.progressStep, styles.activeStep]} />
              <View style={styles.progressStep} />
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>환자 이름</Text>
              <TextInput
                style={styles.input}
                placeholder="환자 이름을 입력하세요"
                placeholderTextColor="#000000"
                value={patientName}
                onChangeText={setPatientName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>생년월일</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (예: 1990-01-01)"
                placeholderTextColor="#000000"
                value={birthDate}
                onChangeText={(text) => setBirthDate(formatBirthDate(text))}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>보호자와의 관계</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowRelationshipModal(true)}
              >
                <Text style={[styles.selectButtonText, !patientRelationship && styles.placeholder]}>
                  {patientRelationship || '관계를 선택하세요'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>거주지역</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowRegionModal(true)}
              >
                <Text style={[styles.selectButtonText, !patientRegion && styles.placeholder]}>
                  {patientRegion || '지역을 선택하세요'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>병명/질환</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="환자의 병명이나 질환을 입력하세요"
                placeholderTextColor="#000000"
                value={diseases}
                onChangeText={setDiseases}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 관계 선택 모달 */}
      <Modal
        visible={showRelationshipModal}
        transparent={true}
        animationType="slide"
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowRelationshipModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>보호자와의 관계</Text>
            <FlatList
              data={relationships}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setPatientRelationship(item);
                    setShowRelationshipModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowRelationshipModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 지역 선택 모달 */}
      <Modal
        visible={showRegionModal}
        transparent={true}
        animationType="slide"
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowRegionModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>거주지역</Text>
            <FlatList
              data={regions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setPatientRegion(item);
                    setShowRegionModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowRegionModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: AppColors.secondary,
    fontWeight: '600',
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.darkGray,
    marginBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
  },
  progressStep: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.lightGray,
  },
  activeStep: {
    backgroundColor: AppColors.primary,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: AppColors.white,
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    borderRadius: 8,
    padding: 15,
    backgroundColor: AppColors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: AppColors.text,
    flex: 1,
  },
  placeholder: {
    color: AppColors.darkGray,
  },
  dropdownArrow: {
    fontSize: 12,
    color: AppColors.darkGray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightGray,
  },
  modalItemText: {
    fontSize: 16,
    color: AppColors.text,
  },
  modalCloseButton: {
    backgroundColor: AppColors.secondary,
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});