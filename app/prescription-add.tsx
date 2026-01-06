import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { AppColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';

export default function PrescriptionAddScreen() {
  const { addPrescription } = useUser();
  const [hospitalName, setHospitalName] = useState('');
  const [date, setDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
    }
  };

  const handleCameraPicker = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('오류', '카메라 촬영 중 오류가 발생했습니다.');
    }
  };

  const handleSave = () => {
    if (!hospitalName.trim()) {
      Alert.alert('오류', '병원명을 입력해주세요.');
      return;
    }

    if (!date.trim()) {
      Alert.alert('오류', '날짜를 입력해주세요.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('오류', '처방전 이미지를 선택해주세요.');
      return;
    }

    addPrescription({
      hospitalName: hospitalName.trim(),
      date: date.trim(),
      imageUri: selectedImage,
    });

    Alert.alert(
      '등록 완료',
      '처방전이 성공적으로 등록되었습니다.',
      [
        {
          text: '확인',
          onPress: () => router.back(),
        },
      ]
    );
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
        <Text style={styles.headerTitle}>처방전 등록</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>병원명</Text>
            <TextInput
              style={styles.textInput}
              value={hospitalName}
              onChangeText={setHospitalName}
              placeholder="병원명을 입력하세요"
              placeholderTextColor="#000000"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>진료 날짜</Text>
            <TextInput
              style={styles.textInput}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD 형식으로 입력하세요"
              placeholderTextColor="#000000"
            />
          </View>

          <View style={styles.imageSection}>
            <Text style={styles.inputLabel}>처방전 이미지</Text>
            
            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Text style={styles.changeImageText}>이미지 변경</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>📋</Text>
                <Text style={styles.imagePlaceholderLabel}>처방전 이미지를 선택하세요</Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={handleCameraPicker}>
                <Text style={styles.imageButtonText}>📷 카메라 촬영</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
                <Text style={styles.imageButtonText}>🖼️ 갤러리 선택</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>처방전 등록</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    width: 50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: AppColors.text,
  },
  imageSection: {
    marginBottom: 30,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
  },
  changeImageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  changeImageText: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: AppColors.gray,
    borderRadius: 8,
    marginBottom: 20,
  },
  imagePlaceholderText: {
    fontSize: 40,
    marginBottom: 10,
  },
  imagePlaceholderLabel: {
    fontSize: 14,
    color: AppColors.darkGray,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  imageButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});