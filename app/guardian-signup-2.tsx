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

export default function GuardianSignup2Screen() {
  const { phoneNumber, password } = useLocalSearchParams();
  
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState(phoneNumber as string || '');
  const [relationship, setRelationship] = useState('');
  const [region, setRegion] = useState('');
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);

  const relationships = ['부모', '자녀', '배우자', '형제/자매', '기타'];
  const regions = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'];

  const handleNext = () => {
    if (!guardianName || !guardianPhone || !relationship || !region) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    router.push({
      pathname: '/guardian-signup-3',
      params: {
        phoneNumber,
        password,
        guardianName,
        guardianPhone,
        relationship,
        region,
      },
    });
  };

  const goBack = () => {
    router.back();
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return !match[2] ? match[1] : `${match[1]}-${match[2]}${match[3] ? `-${match[3]}` : ''}`;
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
            <Text style={styles.subtitle}>2단계: 보호자 정보</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressStep, styles.activeStep]} />
              <View style={[styles.progressStep, styles.activeStep]} />
              <View style={styles.progressStep} />
              <View style={styles.progressStep} />
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>보호자 이름</Text>
              <TextInput
                style={styles.input}
                placeholder="이름을 입력하세요"
                placeholderTextColor="#000000"
                value={guardianName}
                onChangeText={setGuardianName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>전화번호</Text>
              <TextInput
                style={styles.input}
                placeholder="010-0000-0000"
                placeholderTextColor="#000000"
                value={guardianPhone}
                onChangeText={(text) => setGuardianPhone(formatPhoneNumber(text))}
                keyboardType="phone-pad"
                maxLength={13}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>환자와의 관계</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowRelationshipModal(true)}
              >
                <Text style={[styles.selectButtonText, !relationship && styles.placeholder]}>
                  {relationship || '관계를 선택하세요'}
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
                <Text style={[styles.selectButtonText, !region && styles.placeholder]}>
                  {region || '지역을 선택하세요'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
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
            <Text style={styles.modalTitle}>환자와의 관계</Text>
            <FlatList
              data={relationships}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setRelationship(item);
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
                    setRegion(item);
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