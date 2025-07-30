import React, { useState } from 'react';
import { User, Heart, Calendar, FileText, Users, AlertTriangle, Shield, Apple, Home, Cigarette, Baby, Pill, Lock } from 'lucide-react';
import { registerPregnancy, updateFcmToken } from '../api';
import { useTranslation } from 'react-i18next';

// Stub for FCM token retrieval (replace with actual implementation)
async function getFcmToken() {
  // TODO: Integrate with Firebase or your FCM provider
  return 'dummy-fcm-token';
}

export default function Register() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [completedTabs, setCompletedTabs] = useState<number[]>([0]);
  const [form, setForm] = useState({
    personal: {
      name: '', 
      age: '', 
      husbandName: '',
      religion: '',
      caste: '',
      socialCategory: '',
      address: '', 
      contact: '', 
      aadhaarNumber: '', 
      abhaNumber: '',
      bankAccount: '',
      education: '',
      husbandEducation: '',
      occupation: '',
      husbandOccupation: '',
      socioeconomicStatus: '',
      fatherAge: '',
      parentalConsanguinity: '',
      fcmToken: '',
      emergencyNumber: ''
    },
    obstetricHistory: {
      gravida: '',
      para: '',
      liveChildren: '',
      abortions: '',
      stillbirths: '',
      ectopicPregnancy: false,
      previousCesarean: false,
      complications: '',
      interPregnancyInterval: '',
      previousFetalAnomaly: '',
      previousPregnancyTerminationReason: ''
    },
    menstrualHistory: {
      ageAtMenarche: '',
      cycleRegularity: '',
      lmp: '',
      edd: '',
      disorders: ''
    },
    medicalHistory: {
      hypertension: false,
      diabetes: false,
      asthma: false,
      epilepsy: false,
      thyroid: false,
      tuberculosis: false,
      heartDisease: false,
      hiv: false,
      hepatitis: false,
      anemia: false,
      otherChronicIllness: '',
      previousTransfusions: false,
      pastHospitalizations: '',
      highRiskMedications: '',
      uncontrolledDiabetesOrObesity: false,
      vitaminDeficiencies: ''
    },
    familyHistory: {
      geneticDisorders: '',
      twinPregnancies: false,
      familyDiabetes: false,
      familyHypertension: false,
      familyCardiacDisease: false,
      familyMentalIllness: false,
      consanguineousMarriage: false,
      repeatedMiscarriages: false,
      inheritedConditions: '',
      familyCleftOrDefect: ''
    },
    obstetricRiskFactors: {
      pretermLabor: false,
      iugr: false,
      eclampsia: false,
      hemorrhage: false,
      prolongedLabor: false,
      lowBirthWeight: false,
      neonatalDeath: false,
      congenitalAnomalies: false,
      rhIncompatibility: false,
      priorPrenatalTests: '',
      priorBabyDisorder: ''
    },
    immunizationHistory: {
      ttStatus: '',
      ifaIntake: false,
      deworming: false,
      covidVaccine: false,
      otherVaccines: '',
      rubellaCMVScreening: ''
    },
    dietAndNutrition: {
      vegetarian: false,
      mealsPerDay: '',
      fruitsAndVegetables: false,
      ironCalciumFoods: false,
      teaCoffee: false,
      tobaccoAlcohol: false,
      preconceptionFolicAcid: false,
      awarenessOfTeratogens: false
    },
    lifestyle: {
      tobaccoUse: false,
      alcoholUse: false,
      narcotics: false,
      physicalActivity: '',
      domesticViolence: false,
      occupationalExposure: ''
    },
    environment: {
      housingType: '',
      toiletFacility: '',
      drinkingWaterSource: '',
      cookingFuel: '',
      mosquitoBreeding: false,
      proximityToWaste: false,
      borewellOrContaminatedWater: false
    },
    contraceptiveHistory: {
      previousUse: false,
      failureOrComplications: '',
      intentionToUsePostDelivery: false,
      emergencyContraception: false
    },
    other: {
      bloodGroup: '',
      rhType: '',
      drugOrFoodAllergies: '',
      maritalAge: '',
      institutionalDeliveryIntent: false,
      awarenessOfSchemes: false
    },
    abhaId: '',
    jsyEligibility: {
      bplStatus: false,
      caste: '',
      parity: '',
      eligible: false
    },
    optionalInvestigations: {
      hemoglobin: '',
      urineRoutine: '',
      bloodGroup: '',
      rhTyping: '',
      rbs: ''
    }
  });
  const [personalDetailsTouched, setPersonalDetailsTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const tabs = [
    { id: 0, name: t('register.tabPersonal'), icon: <User size={16} /> },
    { id: 1, name: t('register.tabObstetric'), icon: <Baby size={16} /> },
    { id: 2, name: t('register.tabMenstrual'), icon: <Calendar size={16} /> },
    { id: 3, name: t('register.tabMedical'), icon: <Heart size={16} /> },
    { id: 4, name: t('register.tabFamily'), icon: <Users size={16} /> },
    { id: 5, name: t('register.tabRisk'), icon: <AlertTriangle size={16} /> },
    { id: 6, name: t('register.tabImmunization'), icon: <Shield size={16} /> },
    { id: 7, name: t('register.tabDiet'), icon: <Apple size={16} /> },
    { id: 8, name: t('register.tabLifestyle'), icon: <Cigarette size={16} /> },
    { id: 9, name: t('register.tabEnvironment'), icon: <Home size={16} /> },
    { id: 10, name: t('register.tabContraceptive'), icon: <Pill size={16} /> },
    { id: 11, name: t('register.tabOther'), icon: <FileText size={16} /> }
  ];

  // Validation for required fields in Personal Details
  const isPersonalDetailsValid = () => {
    const { name, age, aadhaarNumber, contact, address } = form.personal;
    return (
      name.trim() &&
      age.toString().trim() &&
      aadhaarNumber.trim() &&
      contact.trim() &&
      address.trim()
    );
  };

  // Validation for Obstetric History
  const isObstetricHistoryValid = () => {
    const { gravida, para, liveChildren } = form.obstetricHistory;
    return gravida.trim() && para.trim() && liveChildren.trim();
  };

  // Validation for Menstrual History
  const isMenstrualHistoryValid = () => {
    const { lmp, edd } = form.menstrualHistory;
    return lmp.trim() && edd.trim();
  };

  // Validation for Medical History (at least one field should be filled)
  const isMedicalHistoryValid = () => {
    const { hypertension, diabetes, asthma, epilepsy, thyroid, tuberculosis, heartDisease, hiv, hepatitis, anemia } = form.medicalHistory;
    return hypertension || diabetes || asthma || epilepsy || thyroid || tuberculosis || heartDisease || hiv || hepatitis || anemia;
  };

  // Validation for Family History (at least one field should be filled)
  const isFamilyHistoryValid = () => {
    const { geneticDisorders, twinPregnancies, familyDiabetes, familyHypertension, familyCardiacDisease, familyMentalIllness, consanguineousMarriage, repeatedMiscarriages } = form.familyHistory;
    return geneticDisorders.trim() || twinPregnancies || familyDiabetes || familyHypertension || familyCardiacDisease || familyMentalIllness || consanguineousMarriage || repeatedMiscarriages;
  };

  // Validation for Obstetric Risk Factors (at least one field should be filled)
  const isObstetricRiskFactorsValid = () => {
    const { pretermLabor, iugr, eclampsia, hemorrhage, prolongedLabor, lowBirthWeight, neonatalDeath, congenitalAnomalies, rhIncompatibility } = form.obstetricRiskFactors;
    return pretermLabor || iugr || eclampsia || hemorrhage || prolongedLabor || lowBirthWeight || neonatalDeath || congenitalAnomalies || rhIncompatibility;
  };

  // Validation for Immunization History
  const isImmunizationHistoryValid = () => {
    const { ttStatus, ifaIntake, deworming, covidVaccine } = form.immunizationHistory;
    return ttStatus.trim() || ifaIntake || deworming || covidVaccine;
  };

  // Validation for Diet and Nutrition
  const isDietAndNutritionValid = () => {
    const { vegetarian, mealsPerDay, fruitsAndVegetables, ironCalciumFoods, teaCoffee, tobaccoAlcohol, preconceptionFolicAcid, awarenessOfTeratogens } = form.dietAndNutrition;
    return mealsPerDay.trim() || vegetarian || fruitsAndVegetables || ironCalciumFoods || teaCoffee || tobaccoAlcohol || preconceptionFolicAcid || awarenessOfTeratogens;
  };

  // Validation for Lifestyle
  const isLifestyleValid = () => {
    const { tobaccoUse, alcoholUse, narcotics, physicalActivity, domesticViolence, occupationalExposure } = form.lifestyle;
    return physicalActivity.trim() || occupationalExposure.trim() || tobaccoUse || alcoholUse || narcotics || domesticViolence;
  };

  // Validation for Environment
  const isEnvironmentValid = () => {
    const { housingType, toiletFacility, drinkingWaterSource, cookingFuel } = form.environment;
    return housingType.trim() || toiletFacility.trim() || drinkingWaterSource.trim() || cookingFuel.trim();
  };

  // Validation for Contraceptive History
  const isContraceptiveHistoryValid = () => {
    const { previousUse, failureOrComplications, intentionToUsePostDelivery, emergencyContraception } = form.contraceptiveHistory;
    return failureOrComplications.trim() || previousUse || intentionToUsePostDelivery || emergencyContraception;
  };

  // Validation for Other
  const isOtherValid = () => {
    const { bloodGroup, rhType, drugOrFoodAllergies, maritalAge, institutionalDeliveryIntent, awarenessOfSchemes } = form.other;
    return bloodGroup.trim() || rhType.trim() || drugOrFoodAllergies.trim() || maritalAge.trim() || institutionalDeliveryIntent || awarenessOfSchemes;
  };

  // Get validation function for a specific tab
  const getTabValidation = (tabId: number) => {
    switch (tabId) {
      case 0: return isPersonalDetailsValid;
      case 1: return isObstetricHistoryValid;
      case 2: return isMenstrualHistoryValid;
      case 3: return isMedicalHistoryValid;
      case 4: return isFamilyHistoryValid;
      case 5: return isObstetricRiskFactorsValid;
      case 6: return isImmunizationHistoryValid;
      case 7: return isDietAndNutritionValid;
      case 8: return isLifestyleValid;
      case 9: return isEnvironmentValid;
      case 10: return isContraceptiveHistoryValid;
      case 11: return isOtherValid;
      default: return () => false;
    }
  };

  // Handle navigation and completion
  const handleTabClick = (tabId: number) => {
    if (tabId === 0 || completedTabs.includes(tabId) || completedTabs.includes(tabId - 1)) {
      setActiveTab(tabId);
    }
  };

  // Check and update completed tabs based on form data
  React.useEffect(() => {
    const newCompletedTabs = [0]; // Personal Details is always accessible
    
    // Check each tab for completion
    for (let i = 1; i < tabs.length; i++) {
      const isValid = getTabValidation(i)();
      if (isValid) {
        newCompletedTabs.push(i);
      }
    }
    
    setCompletedTabs(newCompletedTabs);
  }, [form]); // This will run whenever any form data changes



  // Example: Gather all tab data here (for demo, only personalDetails is used)
  const handleSubmit = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      // Format data according to backend schema
      const registrationData = {
        ...form,
        personal: {
          ...form.personal,
          age: Number(form.personal.age),
          fatherAge: form.personal.fatherAge ? Number(form.personal.fatherAge) : undefined,
          emergencyNumber: form.personal.emergencyNumber ? Number(form.personal.emergencyNumber) : undefined,
        },
        obstetricHistory: {
          ...form.obstetricHistory,
          gravida: form.obstetricHistory.gravida ? Number(form.obstetricHistory.gravida) : undefined,
          para: form.obstetricHistory.para ? Number(form.obstetricHistory.para) : undefined,
          liveChildren: form.obstetricHistory.liveChildren ? Number(form.obstetricHistory.liveChildren) : undefined,
          abortions: form.obstetricHistory.abortions ? Number(form.obstetricHistory.abortions) : undefined,
          stillbirths: form.obstetricHistory.stillbirths ? Number(form.obstetricHistory.stillbirths) : undefined,
        },
        menstrualHistory: {
          ...form.menstrualHistory,
          ageAtMenarche: form.menstrualHistory.ageAtMenarche ? Number(form.menstrualHistory.ageAtMenarche) : undefined,
          lmp: form.menstrualHistory.lmp ? new Date(form.menstrualHistory.lmp) : undefined,
          edd: form.menstrualHistory.edd ? new Date(form.menstrualHistory.edd) : undefined,
        },
        dietAndNutrition: {
          ...form.dietAndNutrition,
          mealsPerDay: form.dietAndNutrition.mealsPerDay ? Number(form.dietAndNutrition.mealsPerDay) : undefined,
        },
        other: {
          ...form.other,
          maritalAge: form.other.maritalAge ? Number(form.other.maritalAge) : undefined,
        },
        jsyEligibility: {
          ...form.jsyEligibility,
          parity: form.jsyEligibility.parity ? Number(form.jsyEligibility.parity) : undefined,
        },
        optionalInvestigations: {
          ...form.optionalInvestigations,
          hemoglobin: form.optionalInvestigations.hemoglobin ? Number(form.optionalInvestigations.hemoglobin) : undefined,
          rbs: form.optionalInvestigations.rbs ? Number(form.optionalInvestigations.rbs) : undefined,
        },
      };
      const res = await registerPregnancy(registrationData);
      setSuccess('Registration successful!');
      // --- FCM Token update ---
      try {
        const fcmToken = await getFcmToken();
        if (res.pregnancyId && fcmToken) {
          await updateFcmToken(res.pregnancyId, fcmToken);
        }
      } catch (fcmErr) {
        setError('Registration succeeded, but failed to update FCM token.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Render tab content (only showing Personal Details for brevity)
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input type="text" value={form.personal.name} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, name: e.target.value } }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
              <input type="number" value={form.personal.age} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, age: e.target.value } }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Husband's Name
              </label>
              <input type="text" value={form.personal.husbandName} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, husbandName: e.target.value } }))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <input type="text" value={form.personal.religion} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, religion: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
              <input type="text" value={form.personal.caste} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, caste: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Category</label>
              <select value={form.personal.socialCategory} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, socialCategory: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Category</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <textarea rows={3} value={form.personal.address} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, address: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
              <input type="tel" value={form.personal.contact} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, contact: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number *</label>
              <input type="text" value={form.personal.aadhaarNumber} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, aadhaarNumber: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ABHA Number</label>
              <input type="text" value={form.personal.abhaNumber} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, abhaNumber: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
              <input type="text" value={form.personal.bankAccount} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, bankAccount: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
              <input type="text" value={form.personal.education} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, education: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Husband's Education</label>
              <input type="text" value={form.personal.husbandEducation} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, husbandEducation: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
              <input type="text" value={form.personal.occupation} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, occupation: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Husband's Occupation</label>
              <input type="text" value={form.personal.husbandOccupation} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, husbandOccupation: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Socioeconomic Status</label>
              <select value={form.personal.socioeconomicStatus} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, socioeconomicStatus: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Status</option>
                <option value="BPL">BPL</option>
                <option value="APL">APL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Father's Age</label>
              <input type="number" value={form.personal.fatherAge} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, fatherAge: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parental Consanguinity</label>
              <input type="text" value={form.personal.parentalConsanguinity} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, parentalConsanguinity: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Number</label>
              <input type="tel" value={form.personal.emergencyNumber} onChange={e => setForm(f => ({ ...f, personal: { ...f.personal, emergencyNumber: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gravida</label>
              <input type="number" value={form.obstetricHistory.gravida} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, gravida: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Para</label>
              <input type="number" value={form.obstetricHistory.para} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, para: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Live Children</label>
              <input type="number" value={form.obstetricHistory.liveChildren} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, liveChildren: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Abortions</label>
              <input type="number" value={form.obstetricHistory.abortions} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, abortions: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stillbirths</label>
              <input type="number" value={form.obstetricHistory.stillbirths} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, stillbirths: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ectopic Pregnancy</label>
              <select value={form.obstetricHistory.ectopicPregnancy.toString()} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, ectopicPregnancy: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Cesarean</label>
              <select value={form.obstetricHistory.previousCesarean.toString()} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, previousCesarean: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Complications</label>
              <textarea rows={3} value={form.obstetricHistory.complications} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, complications: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inter Pregnancy Interval</label>
              <input type="text" value={form.obstetricHistory.interPregnancyInterval} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, interPregnancyInterval: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Fetal Anomaly</label>
              <input type="text" value={form.obstetricHistory.previousFetalAnomaly} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, previousFetalAnomaly: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Pregnancy Termination Reason</label>
              <input type="text" value={form.obstetricHistory.previousPregnancyTerminationReason} onChange={e => setForm(f => ({ ...f, obstetricHistory: { ...f.obstetricHistory, previousPregnancyTerminationReason: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age at Menarche</label>
              <input type="number" value={form.menstrualHistory.ageAtMenarche} onChange={e => setForm(f => ({ ...f, menstrualHistory: { ...f.menstrualHistory, ageAtMenarche: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cycle Regularity</label>
              <select value={form.menstrualHistory.cycleRegularity} onChange={e => setForm(f => ({ ...f, menstrualHistory: { ...f.menstrualHistory, cycleRegularity: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Regularity</option>
                <option value="regular">Regular</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Menstrual Period (LMP)</label>
              <input type="date" value={form.menstrualHistory.lmp} onChange={e => setForm(f => ({ ...f, menstrualHistory: { ...f.menstrualHistory, lmp: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Due Date (EDD)</label>
              <input type="date" value={form.menstrualHistory.edd} onChange={e => setForm(f => ({ ...f, menstrualHistory: { ...f.menstrualHistory, edd: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Menstrual Disorders</label>
              <textarea rows={3} value={form.menstrualHistory.disorders} onChange={e => setForm(f => ({ ...f, menstrualHistory: { ...f.menstrualHistory, disorders: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hypertension</label>
              <select value={form.medicalHistory.hypertension.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, hypertension: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diabetes</label>
              <select value={form.medicalHistory.diabetes.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, diabetes: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asthma</label>
              <select value={form.medicalHistory.asthma.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, asthma: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Epilepsy</label>
              <select value={form.medicalHistory.epilepsy.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, epilepsy: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thyroid Disorder</label>
              <select value={form.medicalHistory.thyroid.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, thyroid: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tuberculosis</label>
              <select value={form.medicalHistory.tuberculosis.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, tuberculosis: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heart Disease</label>
              <select value={form.medicalHistory.heartDisease.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, heartDisease: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HIV</label>
              <select value={form.medicalHistory.hiv.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, hiv: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hepatitis</label>
              <select value={form.medicalHistory.hepatitis.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, hepatitis: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anemia</label>
              <select value={form.medicalHistory.anemia.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, anemia: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Chronic Illness</label>
              <input type="text" value={form.medicalHistory.otherChronicIllness} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, otherChronicIllness: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Transfusions</label>
              <select value={form.medicalHistory.previousTransfusions.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, previousTransfusions: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Past Hospitalizations</label>
              <input type="text" value={form.medicalHistory.pastHospitalizations} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, pastHospitalizations: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">High Risk Medications</label>
              <input type="text" value={form.medicalHistory.highRiskMedications} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, highRiskMedications: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Uncontrolled Diabetes or Obesity</label>
              <select value={form.medicalHistory.uncontrolledDiabetesOrObesity.toString()} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, uncontrolledDiabetesOrObesity: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vitamin Deficiencies</label>
              <input type="text" value={form.medicalHistory.vitaminDeficiencies} onChange={e => setForm(f => ({ ...f, medicalHistory: { ...f.medicalHistory, vitaminDeficiencies: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genetic Disorders</label>
              <input type="text" value={form.familyHistory.geneticDisorders} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, geneticDisorders: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twin Pregnancies</label>
              <select value={form.familyHistory.twinPregnancies.toString()} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, twinPregnancies: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Diabetes</label>
              <select value={form.familyHistory.familyDiabetes.toString()} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, familyDiabetes: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Hypertension</label>
              <select value={form.familyHistory.familyHypertension.toString()} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, familyHypertension: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Cardiac Disease</label>
              <select value={form.familyHistory.familyCardiacDisease.toString()} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, familyCardiacDisease: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Mental Illness</label>
              <select value={form.familyHistory.familyMentalIllness.toString()} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, familyMentalIllness: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consanguineous Marriage</label>
              <select value={form.familyHistory.consanguineousMarriage.toString()} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, consanguineousMarriage: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Repeated Miscarriages</label>
              <select value={form.familyHistory.repeatedMiscarriages.toString()} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, repeatedMiscarriages: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inherited Conditions</label>
              <input type="text" value={form.familyHistory.inheritedConditions} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, inheritedConditions: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Family Cleft or Defect</label>
              <input type="text" value={form.familyHistory.familyCleftOrDefect} onChange={e => setForm(f => ({ ...f, familyHistory: { ...f.familyHistory, familyCleftOrDefect: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preterm Labor</label>
              <select value={form.obstetricRiskFactors.pretermLabor.toString()} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, pretermLabor: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IUGR (Intrauterine Growth Restriction)</label>
              <select value={form.obstetricRiskFactors.iugr.toString()} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, iugr: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Eclampsia</label>
              <select value={form.obstetricRiskFactors.eclampsia.toString()} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, eclampsia: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hemorrhage</label>
              <select value={form.obstetricRiskFactors.hemorrhage.toString()} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, hemorrhage: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prolonged Labor</label>
              <select value={form.obstetricRiskFactors.prolongedLabor.toString()} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, prolongedLabor: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Low Birth Weight</label>
              <select value={form.obstetricRiskFactors.lowBirthWeight.toString()} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, lowBirthWeight: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Neonatal Death</label>
              <select value={form.obstetricRiskFactors.neonatalDeath.toString()} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, neonatalDeath: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Congenital Anomalies</label>
              <select value={form.obstetricRiskFactors.congenitalAnomalies.toString()} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, congenitalAnomalies: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RH Incompatibility</label>
              <select value={form.obstetricRiskFactors.rhIncompatibility.toString()} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, rhIncompatibility: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prior Prenatal Tests</label>
              <input type="text" value={form.obstetricRiskFactors.priorPrenatalTests} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, priorPrenatalTests: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prior Baby Disorder</label>
              <input type="text" value={form.obstetricRiskFactors.priorBabyDisorder} onChange={e => setForm(f => ({ ...f, obstetricRiskFactors: { ...f.obstetricRiskFactors, priorBabyDisorder: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">TT Status</label>
              <select value={form.immunizationHistory.ttStatus} onChange={e => setForm(f => ({ ...f, immunizationHistory: { ...f.immunizationHistory, ttStatus: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Status</option>
                <option value="not_received">Not Received</option>
                <option value="one_dose">One Dose</option>
                <option value="two_doses">Two Doses</option>
                <option value="booster">Booster</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IFA Intake</label>
              <select value={form.immunizationHistory.ifaIntake.toString()} onChange={e => setForm(f => ({ ...f, immunizationHistory: { ...f.immunizationHistory, ifaIntake: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deworming</label>
              <select value={form.immunizationHistory.deworming.toString()} onChange={e => setForm(f => ({ ...f, immunizationHistory: { ...f.immunizationHistory, deworming: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">COVID Vaccine</label>
              <select value={form.immunizationHistory.covidVaccine.toString()} onChange={e => setForm(f => ({ ...f, immunizationHistory: { ...f.immunizationHistory, covidVaccine: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Vaccines</label>
              <input type="text" value={form.immunizationHistory.otherVaccines} onChange={e => setForm(f => ({ ...f, immunizationHistory: { ...f.immunizationHistory, otherVaccines: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rubella/CMV Screening</label>
              <select value={form.immunizationHistory.rubellaCMVScreening} onChange={e => setForm(f => ({ ...f, immunizationHistory: { ...f.immunizationHistory, rubellaCMVScreening: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Status</option>
                <option value="not_done">Not Done</option>
                <option value="done">Done</option>
                <option value="immune">Immune</option>
                <option value="non_immune">Non-Immune</option>
              </select>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vegetarian</label>
              <select value={form.dietAndNutrition.vegetarian.toString()} onChange={e => setForm(f => ({ ...f, dietAndNutrition: { ...f.dietAndNutrition, vegetarian: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meals Per Day</label>
              <input type="number" value={form.dietAndNutrition.mealsPerDay} onChange={e => setForm(f => ({ ...f, dietAndNutrition: { ...f.dietAndNutrition, mealsPerDay: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fruits and Vegetables</label>
              <select value={form.dietAndNutrition.fruitsAndVegetables.toString()} onChange={e => setForm(f => ({ ...f, dietAndNutrition: { ...f.dietAndNutrition, fruitsAndVegetables: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Iron/Calcium Foods</label>
              <select value={form.dietAndNutrition.ironCalciumFoods.toString()} onChange={e => setForm(f => ({ ...f, dietAndNutrition: { ...f.dietAndNutrition, ironCalciumFoods: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tea/Coffee</label>
              <select value={form.dietAndNutrition.teaCoffee.toString()} onChange={e => setForm(f => ({ ...f, dietAndNutrition: { ...f.dietAndNutrition, teaCoffee: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tobacco/Alcohol</label>
              <select value={form.dietAndNutrition.tobaccoAlcohol.toString()} onChange={e => setForm(f => ({ ...f, dietAndNutrition: { ...f.dietAndNutrition, tobaccoAlcohol: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preconception Folic Acid</label>
              <select value={form.dietAndNutrition.preconceptionFolicAcid.toString()} onChange={e => setForm(f => ({ ...f, dietAndNutrition: { ...f.dietAndNutrition, preconceptionFolicAcid: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Awareness of Teratogens</label>
              <select value={form.dietAndNutrition.awarenessOfTeratogens.toString()} onChange={e => setForm(f => ({ ...f, dietAndNutrition: { ...f.dietAndNutrition, awarenessOfTeratogens: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tobacco Use</label>
              <select value={form.lifestyle.tobaccoUse.toString()} onChange={e => setForm(f => ({ ...f, lifestyle: { ...f.lifestyle, tobaccoUse: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol Use</label>
              <select value={form.lifestyle.alcoholUse.toString()} onChange={e => setForm(f => ({ ...f, lifestyle: { ...f.lifestyle, alcoholUse: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Narcotics</label>
              <select value={form.lifestyle.narcotics.toString()} onChange={e => setForm(f => ({ ...f, lifestyle: { ...f.lifestyle, narcotics: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Physical Activity</label>
              <input type="text" value={form.lifestyle.physicalActivity} onChange={e => setForm(f => ({ ...f, lifestyle: { ...f.lifestyle, physicalActivity: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domestic Violence</label>
              <select value={form.lifestyle.domesticViolence.toString()} onChange={e => setForm(f => ({ ...f, lifestyle: { ...f.lifestyle, domesticViolence: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupational Exposure</label>
              <input type="text" value={form.lifestyle.occupationalExposure} onChange={e => setForm(f => ({ ...f, lifestyle: { ...f.lifestyle, occupationalExposure: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Housing Type</label>
              <input type="text" value={form.environment.housingType} onChange={e => setForm(f => ({ ...f, environment: { ...f.environment, housingType: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Toilet Facility</label>
              <input type="text" value={form.environment.toiletFacility} onChange={e => setForm(f => ({ ...f, environment: { ...f.environment, toiletFacility: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Drinking Water Source</label>
              <input type="text" value={form.environment.drinkingWaterSource} onChange={e => setForm(f => ({ ...f, environment: { ...f.environment, drinkingWaterSource: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Fuel</label>
              <input type="text" value={form.environment.cookingFuel} onChange={e => setForm(f => ({ ...f, environment: { ...f.environment, cookingFuel: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mosquito Breeding</label>
              <select value={form.environment.mosquitoBreeding.toString()} onChange={e => setForm(f => ({ ...f, environment: { ...f.environment, mosquitoBreeding: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proximity to Waste</label>
              <select value={form.environment.proximityToWaste.toString()} onChange={e => setForm(f => ({ ...f, environment: { ...f.environment, proximityToWaste: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Borewell or Contaminated Water</label>
              <select value={form.environment.borewellOrContaminatedWater.toString()} onChange={e => setForm(f => ({ ...f, environment: { ...f.environment, borewellOrContaminatedWater: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Use</label>
              <select value={form.contraceptiveHistory.previousUse.toString()} onChange={e => setForm(f => ({ ...f, contraceptiveHistory: { ...f.contraceptiveHistory, previousUse: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Failure or Complications</label>
              <input type="text" value={form.contraceptiveHistory.failureOrComplications} onChange={e => setForm(f => ({ ...f, contraceptiveHistory: { ...f.contraceptiveHistory, failureOrComplications: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intention to Use Post Delivery</label>
              <select value={form.contraceptiveHistory.intentionToUsePostDelivery.toString()} onChange={e => setForm(f => ({ ...f, contraceptiveHistory: { ...f.contraceptiveHistory, intentionToUsePostDelivery: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contraception</label>
              <select value={form.contraceptiveHistory.emergencyContraception.toString()} onChange={e => setForm(f => ({ ...f, contraceptiveHistory: { ...f.contraceptiveHistory, emergencyContraception: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
              <input type="text" value={form.other.bloodGroup} onChange={e => setForm(f => ({ ...f, other: { ...f.other, bloodGroup: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RH Type</label>
              <input type="text" value={form.other.rhType} onChange={e => setForm(f => ({ ...f, other: { ...f.other, rhType: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Drug or Food Allergies</label>
              <input type="text" value={form.other.drugOrFoodAllergies} onChange={e => setForm(f => ({ ...f, other: { ...f.other, drugOrFoodAllergies: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Age</label>
              <input type="text" value={form.other.maritalAge} onChange={e => setForm(f => ({ ...f, other: { ...f.other, maritalAge: e.target.value } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institutional Delivery Intent</label>
              <select value={form.other.institutionalDeliveryIntent.toString()} onChange={e => setForm(f => ({ ...f, other: { ...f.other, institutionalDeliveryIntent: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Awareness of Schemes</label>
              <select value={form.other.awarenessOfSchemes.toString()} onChange={e => setForm(f => ({ ...f, other: { ...f.other, awarenessOfSchemes: e.target.value === 'true' } }))} className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm border border-yellow-200/50 rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="p-8 border-b border-yellow-200/50 bg-gradient-to-r from-yellow-600 to-green-600 text-white">
            <h1 className="text-3xl font-bold mb-2">{t('register.maternalHealthMonitoringRegistration')}</h1>
            <p className="text-yellow-100 text-lg">{t('register.completeRegistrationFormForComprehensiveMaternalHealthMonitoring')}</p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200/50 bg-gray-50/50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 p-4">
              {tabs.map((tab, idx) => {
                const isCompleted = completedTabs.includes(idx);
                const isLocked = idx > 0 && !isCompleted;
                const canAccess = idx === 0 || isCompleted || completedTabs.includes(idx - 1);
                return (
                <button
                  key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                  className={`flex flex-col items-center space-y-2 px-3 py-3 text-xs font-medium border-b-2 transition-all duration-300 rounded-lg ${
                    activeTab === tab.id
                      ? 'border-yellow-600 text-yellow-600 bg-white shadow-lg'
                        : isCompleted
                        ? 'border-green-500 text-green-600 hover:text-green-700 hover:border-green-400 bg-green-50'
                        : isLocked
                        ? 'border-transparent text-gray-400 cursor-not-allowed bg-gray-100'
                      : 'border-transparent text-gray-600 hover:text-yellow-600 hover:border-yellow-300 hover:bg-white/80'
                  }`}
                    disabled={!canAccess}
                >
                  <div className={`p-2 rounded-lg ${
                    activeTab === tab.id 
                      ? 'bg-yellow-100' 
                      : isCompleted 
                        ? 'bg-green-100' 
                        : 'bg-gray-100'
                  }`}>
                    {tab.icon}
                  </div>
                  <span className="text-center font-semibold leading-tight">{tab.name}</span>
                  {isCompleted && (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {isLocked && <Lock size={12} className="mt-1" />}
                </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-3 rounded-xl mr-4">
                  {tabs[activeTab].icon}
                </div>
                {tabs[activeTab].name}
              </h2>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${((activeTab + 1) / tabs.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-3 font-medium">{t('register.step', { step: activeTab + 1, total: tabs.length })}</p>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-200/50">
              {renderTabContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200/50">
              <button
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={activeTab === 0}
                className="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t('register.previous')}
              </button>
              
              {activeTab === tabs.length - 1 ? (
                <button
                  className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-green-600 text-white rounded-xl hover:from-yellow-700 hover:to-green-700 transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? t('register.submitting') : t('register.submitRegistration')}
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab(Math.min(tabs.length - 1, activeTab + 1))}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-green-600 text-white rounded-xl hover:from-yellow-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {t('register.next')}
                </button>
              )}
            </div>
            {success && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl text-green-800 font-semibold flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {success}
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl text-red-800 font-semibold flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full mr-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}