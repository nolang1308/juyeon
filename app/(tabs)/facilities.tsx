import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import TopBar from '@/components/TopBar';
import { AppColors } from '@/constants/theme';

interface Facility {
  id: string;
  category: string;
  name: string;
  address: string;
  phone: string;
}

type FacilityCategory = '전체' | '병원' | '요양원' | '주간보호센터' | '행정복지센터';

export default function FacilitiesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory>('전체');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const facilityData: Facility[] = [
    // 병원 4개
    {
      id: '1',
      category: '병원',
      name: '마산 종합병원',
      address: '경상남도 창원시 마산합포구 3·15대로 240',
      phone: '055-249-1000',
    },
    {
      id: '2', 
      category: '병원',
      name: '창원 삼성병원',
      address: '경상남도 창원시 마산회원구 팔용로 158',
      phone: '055-290-6000',
    },
    {
      id: '3',
      category: '병원', 
      name: '경상대학교병원',
      address: '경상남도 진주시 강남로 79',
      phone: '055-750-8000',
    },
    {
      id: '4',
      category: '병원',
      name: '부산대학교병원',
      address: '부산광역시 서구 구덕로 179',
      phone: '051-240-7000',
    },
    // 요양원 3개
    {
      id: '5',
      category: '요양원',
      name: '마산 실버타운',
      address: '경상남도 창원시 마산합포구 월영로 126',
      phone: '055-246-7777',
    },
    {
      id: '6',
      category: '요양원',
      name: '창원 효도마을',
      address: '경상남도 창원시 의창구 원이대로 750',
      phone: '055-266-8888',
    },
    {
      id: '7',
      category: '요양원',
      name: '진주 사랑의집',
      address: '경상남도 진주시 진주대로 500',
      phone: '055-761-9999',
    },
    // 주간보호센터 2개
    {
      id: '8',
      category: '주간보호센터',
      name: '마산 주간보호센터',
      address: '경상남도 창원시 마산합포구 오동동로 45',
      phone: '055-241-5555',
    },
    {
      id: '9',
      category: '주간보호센터', 
      name: '창원 데이케어센터',
      address: '경상남도 창원시 성산구 원이대로 400',
      phone: '055-285-6666',
    },
    // 행정복지센터 2개
    {
      id: '10',
      category: '행정복지센터',
      name: '마산합포구 행정복지센터',
      address: '경상남도 창원시 마산합포구 3·15대로 213',
      phone: '055-225-2000',
    },
    {
      id: '11',
      category: '행정복지센터',
      name: '창원시청 복지정책과',
      address: '경상남도 창원시 의창구 중앙대로 151',
      phone: '055-225-3000',
    },
  ];

  const facilityTypes = [
    { title: '병원', description: '주변 병원을 찾아보세요.' },
    { title: '요양원', description: '주변 요양시설을 \n찾아보세요.' },
    { title: '주간보호센터', description: '주변 주간보호센터를 \n찾아보세요.' },
    { title: '행정복지센터', description: '주변 행정복지센터를 \n찾아보세요.' },
  ];

  const gyeongnamFacilities = facilityData.filter(facility => 
    facility.address.includes('경상남도')
  );

  const filteredFacilities = selectedCategory === '전체' 
    ? gyeongnamFacilities 
    : facilityData.filter(facility => facility.category === selectedCategory);

  const handleCategorySelect = (category: FacilityCategory) => {
    setSelectedCategory(category);
  };

  const handleFacilityPress = (facility: Facility) => {
    setSelectedFacility(facility);
    setModalVisible(true);
  };

  const renderFacilityItem = ({ item }: { item: Facility }) => (
    <TouchableOpacity 
      style={styles.facilityItemCard}
      onPress={() => handleFacilityPress(item)}
    >
      <View style={styles.facilityItemHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.facilityItemName}>{item.name}</Text>
      <Text style={styles.facilityItemAddress} numberOfLines={2}>{item.address}</Text>
      <Text style={styles.facilityItemPhone}>{item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>근처 의료/복지 기관</Text>
        
        <View style={styles.facilityGrid}>
          {facilityTypes.map((facility, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.facilityCard}
              onPress={() => handleCategorySelect(facility.title as FacilityCategory)}
            >
              <Text style={styles.facilityTitle}>{facility.title}</Text>
              <Text style={styles.facilityDescription}>{facility.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.searchSection}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => handleCategorySelect('전체')}
          >
            <Text style={styles.searchButtonText}>내 지역 기관 찾기</Text>
          </TouchableOpacity>
        </View>

        {/* 선택된 카테고리 표시 */}
        {selectedCategory !== '전체' && (
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{selectedCategory} 목록</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => setSelectedCategory('전체')}
            >
              <Text style={styles.resetButtonText}>전체보기</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 기관 목록 */}
        <View style={styles.facilitiesContainer}>
          <FlatList
            data={filteredFacilities}
            renderItem={renderFacilityItem}
            numColumns={3}
            key={selectedCategory}
            scrollEnabled={false}
            columnWrapperStyle={styles.facilityRow}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* 기관 상세 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedFacility && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalCategoryBadge}>
                      <Text style={styles.modalCategoryText}>{selectedFacility.category}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.modalTitle}>{selectedFacility.name}</Text>
                  
                  <View style={styles.modalInfo}>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>📍 주소</Text>
                      <Text style={styles.modalInfoValue}>{selectedFacility.address}</Text>
                    </View>
                    
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>📞 전화번호</Text>
                      <Text style={styles.modalInfoValue}>{selectedFacility.phone}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.contactButtonText}>전화걸기</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
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
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 20,
  },
  facilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  facilityCard: {
    width: '48%',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  facilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 8,
  },
  facilityDescription: {
    fontSize: 12,
    color: AppColors.darkGray,
    lineHeight: 16,
  },
  searchSection: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 15,
  },
  searchButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  searchButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.secondary,
  },
  resetButton: {
    backgroundColor: AppColors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 12,
    color: AppColors.darkGray,
    fontWeight: '600',
  },
  facilitiesContainer: {
    marginTop: 10,
  },
  facilityRow: {
    justifyContent: 'space-between',
  },
  facilityItemCard: {
    width: '32%',
    backgroundColor: AppColors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  facilityItemHeader: {
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 10,
    color: AppColors.white,
    fontWeight: '600',
  },
  facilityItemName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 4,
  },
  facilityItemAddress: {
    fontSize: 10,
    color: AppColors.darkGray,
    marginBottom: 4,
    lineHeight: 14,
  },
  facilityItemPhone: {
    fontSize: 10,
    color: AppColors.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalCategoryBadge: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalCategoryText: {
    fontSize: 12,
    color: AppColors.white,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: AppColors.darkGray,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInfo: {
    marginBottom: 25,
  },
  modalInfoRow: {
    marginBottom: 15,
  },
  modalInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 5,
  },
  modalInfoValue: {
    fontSize: 16,
    color: AppColors.darkGray,
    lineHeight: 22,
  },
  contactButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  contactButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});