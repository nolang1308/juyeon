import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GuardianInfo {
  phoneNumber: string;
  password: string;
  guardianName: string;
  guardianPhone: string;
  relationship: string;
  region: string;
}

interface PatientInfo {
  patientName: string;
  birthDate: string;
  patientRelationship: string;
  patientRegion: string;
  diseases: string;
  age: number;
}

interface AppliedBenefit {
  id: string;
  name: string;
  category: string;
  savings: string;
  appliedDate: string;
  status: 'applied' | 'approved' | 'rejected';
}

interface PrescriptionRecord {
  id: string;
  hospitalName: string;
  date: string;
  imageUri: string;
  addedDate: string;
}

interface UserData {
  guardian: GuardianInfo | null;
  patient: PatientInfo | null;
  isLoggedIn: boolean;
  appliedBenefits: AppliedBenefit[];
  prescriptions: PrescriptionRecord[];
}

interface UserContextType {
  userData: UserData;
  setGuardianInfo: (info: GuardianInfo) => void;
  setPatientInfo: (info: Omit<PatientInfo, 'age'> & { birthDate: string }) => void;
  login: (phoneNumber: string, password: string) => boolean;
  logout: () => void;
  calculateAge: (birthDate: string) => number;
  applyBenefit: (benefit: { id: string; name: string; category: string; savings: string }) => void;
  addPrescription: (prescription: { hospitalName: string; date: string; imageUri: string }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    guardian: null,
    patient: null,
    isLoggedIn: false,
    appliedBenefits: [],
    prescriptions: [],
  });

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const setGuardianInfo = (info: GuardianInfo) => {
    setUserData(prev => ({
      ...prev,
      guardian: info,
    }));
  };

  const setPatientInfo = (info: Omit<PatientInfo, 'age'> & { birthDate: string }) => {
    const age = calculateAge(info.birthDate);
    setUserData(prev => ({
      ...prev,
      patient: {
        ...info,
        age,
      },
    }));
  };

  const login = (phoneNumber: string, password: string): boolean => {
    if (userData.guardian && 
        userData.guardian.phoneNumber.replace(/\D/g, '') === phoneNumber.replace(/\D/g, '') && 
        userData.guardian.password === password) {
      setUserData(prev => ({
        ...prev,
        isLoggedIn: true,
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserData(prev => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const applyBenefit = (benefit: { id: string; name: string; category: string; savings: string }) => {
    const newAppliedBenefit: AppliedBenefit = {
      ...benefit,
      appliedDate: new Date().toISOString(),
      status: 'applied',
    };

    setUserData(prev => ({
      ...prev,
      appliedBenefits: [...prev.appliedBenefits, newAppliedBenefit],
    }));
  };

  const addPrescription = (prescription: { hospitalName: string; date: string; imageUri: string }) => {
    const newPrescription: PrescriptionRecord = {
      id: Date.now().toString(),
      ...prescription,
      addedDate: new Date().toISOString(),
    };

    setUserData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, newPrescription],
    }));
  };

  return (
    <UserContext.Provider value={{
      userData,
      setGuardianInfo,
      setPatientInfo,
      login,
      logout,
      calculateAge,
      applyBenefit,
      addPrescription,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}