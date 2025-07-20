import Joi from "joi";

// Define the validation schema for the registration input
export function validateRegistrationInput(data, isUpdate = false, req) {
  const t = req?.t || ((key) => key); // Fallback if translation function not available
  const baseString = isUpdate
    ? Joi.string()
    : Joi.string()
        .required()
        .messages({
          "string.empty": t("errors.required"),
          "any.required": t("errors.required"),
        });
  const baseNumber = isUpdate ? Joi.number() : Joi.number().required();

  // This schema should match your Registration model fields as per your context
  const schema = Joi.object({
    personal: Joi.object({
      name: baseString,
      age: baseNumber,
      husbandName: Joi.string().allow(""),
      religion: Joi.string().allow(""),
      caste: Joi.string().allow(""),
      socialCategory: Joi.string()
        .valid("SC", "ST", "OBC", "General")
        .allow(""),
      address: Joi.string().allow(""),
      contact: Joi.string().allow(""),
      aadhaarNumber: Joi.string().allow(""),
      abhaNumber: Joi.string().allow(""),
      bankAccount: Joi.string().allow(""),
      education: Joi.string().allow(""),
      husbandEducation: Joi.string().allow(""),
      occupation: Joi.string().allow(""),
      husbandOccupation: Joi.string().allow(""),
      socioeconomicStatus: Joi.string().valid("BPL", "APL").allow(""),
      fatherAge: Joi.number().allow(null),
      parentalConsanguinity: Joi.string().allow(""),
      fcmToken: Joi.string().allow(""),
      emergencyNumber: Joi.number(),
    }).required(),

    obstetricHistory: Joi.object({
      gravida: Joi.number().allow(null),
      para: Joi.number().allow(null),
      liveChildren: Joi.number().allow(null),
      abortions: Joi.number().allow(null),
      stillbirths: Joi.number().allow(null),
      ectopicPregnancy: Joi.boolean().allow(null),
      previousCesarean: Joi.boolean().allow(null),
      complications: Joi.string().allow(""),
      interPregnancyInterval: Joi.string().allow(""),
      previousFetalAnomaly: Joi.string().allow(""),
      previousPregnancyTerminationReason: Joi.string().allow(""),
    }).allow(null),

    menstrualHistory: Joi.object({
      ageAtMenarche: Joi.number().allow(null),
      cycleRegularity: Joi.string().allow(""),
      lmp: Joi.date().allow(null),
      edd: Joi.date().allow(null),
      disorders: Joi.string().allow(""),
    }).allow(null),

    medicalHistory: Joi.object({
      hypertension: Joi.boolean().allow(null),
      diabetes: Joi.boolean().allow(null),
      asthma: Joi.boolean().allow(null),
      epilepsy: Joi.boolean().allow(null),
      thyroid: Joi.boolean().allow(null),
      tuberculosis: Joi.boolean().allow(null),
      heartDisease: Joi.boolean().allow(null),
      hiv: Joi.boolean().allow(null),
      hepatitis: Joi.boolean().allow(null),
      anemia: Joi.boolean().allow(null),
      otherChronicIllness: Joi.string().allow(""),
      previousTransfusions: Joi.boolean().allow(null),
      pastHospitalizations: Joi.string().allow(""),
      highRiskMedications: Joi.string().allow(""),
      uncontrolledDiabetesOrObesity: Joi.boolean().allow(null),
      vitaminDeficiencies: Joi.string().allow(""),
    }).allow(null),

    familyHistory: Joi.object({
      geneticDisorders: Joi.string().allow(""),
      twinPregnancies: Joi.boolean().allow(null),
      familyDiabetes: Joi.boolean().allow(null),
      familyHypertension: Joi.boolean().allow(null),
      familyCardiacDisease: Joi.boolean().allow(null),
      familyMentalIllness: Joi.boolean().allow(null),
      consanguineousMarriage: Joi.boolean().allow(null),
      repeatedMiscarriages: Joi.boolean().allow(null),
      inheritedConditions: Joi.string().allow(""),
      familyCleftOrDefect: Joi.string().allow(""),
    }).allow(null),

    obstetricRiskFactors: Joi.object({
      pretermLabor: Joi.boolean().allow(null),
      iugr: Joi.boolean().allow(null),
      eclampsia: Joi.boolean().allow(null),
      hemorrhage: Joi.boolean().allow(null),
      prolongedLabor: Joi.boolean().allow(null),
      lowBirthWeight: Joi.boolean().allow(null),
      neonatalDeath: Joi.boolean().allow(null),
      congenitalAnomalies: Joi.boolean().allow(null),
      rhIncompatibility: Joi.boolean().allow(null),
      priorPrenatalTests: Joi.string().allow(""),
      priorBabyDisorder: Joi.string().allow(""),
    }).allow(null),

    immunizationHistory: Joi.object({
      ttStatus: Joi.string().allow(""),
      ifaIntake: Joi.boolean().allow(null),
      deworming: Joi.boolean().allow(null),
      covidVaccine: Joi.boolean().allow(null),
      otherVaccines: Joi.string().allow(""),
      rubellaCMVScreening: Joi.string().allow(""),
    }).allow(null),

    dietAndNutrition: Joi.object({
      vegetarian: Joi.boolean().allow(null),
      mealsPerDay: Joi.number().allow(null),
      fruitsAndVegetables: Joi.boolean().allow(null),
      ironCalciumFoods: Joi.boolean().allow(null),
      teaCoffee: Joi.boolean().allow(null),
      tobaccoAlcohol: Joi.boolean().allow(null),
      preconceptionFolicAcid: Joi.boolean().allow(null),
      awarenessOfTeratogens: Joi.boolean().allow(null),
    }).allow(null),

    lifestyle: Joi.object({
      tobaccoUse: Joi.boolean().allow(null),
      alcoholUse: Joi.boolean().allow(null),
      narcotics: Joi.boolean().allow(null),
      physicalActivity: Joi.string().allow(""),
      domesticViolence: Joi.boolean().allow(null),
      occupationalExposure: Joi.string().allow(""),
    }).allow(null),

    environment: Joi.object({
      housingType: Joi.string().allow(""),
      toiletFacility: Joi.string().allow(""),
      drinkingWaterSource: Joi.string().allow(""),
      cookingFuel: Joi.string().allow(""),
      mosquitoBreeding: Joi.boolean().allow(null),
      proximityToWaste: Joi.boolean().allow(null),
      borewellOrContaminatedWater: Joi.boolean().allow(null),
    }).allow(null),

    contraceptiveHistory: Joi.object({
      previousUse: Joi.boolean().allow(null),
      failureOrComplications: Joi.string().allow(""),
      intentionToUsePostDelivery: Joi.boolean().allow(null),
      emergencyContraception: Joi.boolean().allow(null),
    }).allow(null),

    other: Joi.object({
      bloodGroup: Joi.string().allow(""),
      rhType: Joi.string().allow(""),
      drugOrFoodAllergies: Joi.string().allow(""),
      maritalAge: Joi.number().allow(null),
      institutionalDeliveryIntent: Joi.boolean().allow(null),
      awarenessOfSchemes: Joi.boolean().allow(null),
    }).allow(null),

    abhaId: Joi.string().allow(""),
    jsyEligibility: Joi.object({
      bplStatus: Joi.boolean().allow(null),
      caste: Joi.string().allow(""),
      parity: Joi.number().allow(null),
      eligible: Joi.boolean().allow(null),
    }).allow(null),

    optionalInvestigations: Joi.object({
      hemoglobin: Joi.number().allow(null),
      urineRoutine: Joi.string().allow(""),
      bloodGroup: Joi.string().allow(""),
      rhTyping: Joi.string().allow(""),
      rbs: Joi.number().allow(null),
    }).allow(null),

    pregnancyId: Joi.string().allow(""),
    qrCode: Joi.string().allow(""),
    registrationLog: Joi.object({
      timestamp: Joi.date().allow(null),
      enteredBy: Joi.string().allow(""),
      gps: Joi.object({
        lat: Joi.number().allow(null),
        lng: Joi.number().allow(null),
      }).allow(null),
    }).allow(null),
    syncStatus: Joi.string().valid("synced", "unsynced").allow(""),
  });

  return schema.validate(data, { abortEarly: false });
}
