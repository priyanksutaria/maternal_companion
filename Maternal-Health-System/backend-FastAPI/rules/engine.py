from typing import Dict, List, Tuple

CONFIG = {
    # Anemia
    "hb_1st_3rd": 11,
    "hb_2nd": 10.5,
    "ferritin_severe": 15,
    "ferritin_mild": 30,
    "tsat": 20,
    # Hypertension and Preeclampsia
    "htn_sbp": 140,
    "htn_dbp": 90,
    # GDM
    "gdm_ogtt_f": 92,  # mg/dL
    "gdm_ogtt_1h": 180,  # mg/dL
    "gdm_ogtt_2h": 153,  # mg/dL
    # Preeclampsia
    "pree_proteinuria": 300,  # mg/24h
    # Thyroid
    "tsh_first_tri": 2.5,
    "tsh_second_third": 3.0,
}


def rule_anemia(p: Dict) -> Tuple[List[str], List[str], List[str]]:
    rec, alert, diet = [], [], []

    # Priority 1: Ferritin / Tsat (more definitive)
    ferritin = p.get("ferritin")  # in µg/L
    tsat = p.get("tsat")  # transferrin saturation %, as float

    if ferritin is not None:
        if ferritin < CONFIG["ferritin_severe"]:
            alert.append(f"Severe iron deficiency: Ferritin {ferritin} µg/L")
            rec.append("Parenteral iron therapy is often beneficial in such cases. ")
            rec.append(
                "Iron sucrose (100 mg IV on alternate days) or ferric carboxymaltose (based on weight and Hb) may be used. "
            )
            rec.append(
                "It may be helpful to avoid delaying treatment due to poor oral iron response or late gestation."
            )
            diet.append(
                "Iron-rich foods such as leafy greens (spinach, methi), lentils, dates, jaggery, and red meat (if not vegetarian) may help. "
            )
            diet.append(
                "Vitamin C-rich foods like oranges or amla juice taken with meals may enhance iron absorption. "
            )
            diet.append(
                "Avoid consuming tea/coffee with iron-rich meals as it may inhibit absorption."
            )

            return rec, alert, diet

        elif ferritin < CONFIG["ferritin_mild"]:
            alert.append(f"Iron deficiency: Ferritin {ferritin} µg/L")
            rec.append(
                "Oral iron therapy may be started—ferrous sulfate 100–200 mg elemental iron daily is typically suggested. "
            )
            rec.append("Vitamin C may be co-administered to improve absorption. ")
            rec.append(
                "Parenteral iron may still be considered if oral is poorly tolerated or patient is in late 2nd/3rd trimester."
            )
            diet.append(
                "Iron-rich foods such as leafy greens (spinach, methi), lentils, dates, jaggery, and red meat (if not vegetarian) may help. "
            )
            diet.append(
                "Vitamin C-rich foods like oranges or amla juice taken with meals may enhance iron absorption. "
            )
            diet.append(
                "Avoid consuming tea/coffee with iron-rich meals as it may inhibit absorption."
            )

            return rec, alert, diet

    if tsat is not None and tsat < CONFIG["tsat"]:
        alert.append(f"Iron deficiency: Transferrin saturation {tsat}%")
        rec.append(
            "Suggest initiating oral iron (e.g., IFA 100 mg elemental iron daily). Monitor ferritin after 4–6 weeks if symptoms persist or inadequate response."
        )
        diet.append(
            "Iron-rich foods such as leafy greens (spinach, methi), lentils, dates, jaggery, and red meat (if not vegetarian) may help. "
        )
        diet.append(
            "Vitamin C-rich foods like oranges or amla juice taken with meals may enhance iron absorption. "
        )
        diet.append(
            "Avoid consuming tea/coffee with iron-rich meals as it may inhibit absorption."
        )

        return rec, alert, diet

    # Priority 2: Hb by trimester if ferritin/tsat not available
    trimester_hb = {
        "1st": p.get("hb_1st"),
        "2nd": p.get("hb_2nd"),
        "3rd": p.get("hb_3rd"),
    }

    anemia_found = False
    for tri, hb in trimester_hb.items():
        if hb is None:
            continue
        if (tri == "2nd" and hb < 10.5) or (tri in ("1st", "3rd") and hb < 11):
            anemia_found = True
            alert.append(f"Anemia detected: Hb {hb} g/dL in {tri} trimester")

    if anemia_found:
        rec.append(
            "Oral iron supplementation (e.g., ferrous sulfate 100–200 mg daily) could be initiated based on tolerance. "
        )
        rec.append(
            "Severe anemia (Hb < 7 g/dL) may require IV iron or blood transfusion. Monitoring ferritin may guide response to treatment."
        )
        diet.append(
            "Iron-rich foods such as leafy greens (spinach, methi), lentils, dates, jaggery, and red meat (if not vegetarian) may help. "
        )
        diet.append(
            "Vitamin C-rich foods like oranges or amla juice taken with meals may enhance iron absorption. "
        )
        diet.append(
            "Avoid consuming tea/coffee with iron-rich meals as it may inhibit absorption."
        )

    return rec, alert, diet


def rule_hypertension(p: Dict) -> Tuple[List[str], List[str], List[str]]:
    rec, alert, diet = [], [], []
    sbp, dbp = p.get("sbp"), p.get("dbp")
    if sbp is None or dbp is None:
        return rec, alert, diet
    if sbp >= CONFIG["htn_sbp"] or dbp >= CONFIG["htn_dbp"]:
        alert.append(f"Elevated BP {sbp}/{dbp} – evaluate for pre‑eclampsia")
        rec.append(
            "Elevated blood pressure after 20 weeks gestation without proteinuria may suggest gestational hypertension. "
        )
        rec.append(
            "Monitoring BP, fetal growth, and signs of preeclampsia (e.g., headaches, vision changes) may be important. "
        )
        rec.append(
            "Antihypertensives like labetalol or nifedipine may be considered based on clinical judgment."
        )
        diet.append(
            "A low-sodium diet with fresh fruits, vegetables, whole grains, and lean proteins may support blood pressure control. "
        )
        diet.append(
            "Reducing pickles, papads, processed snacks, and salty packaged foods might help. "
        )
        diet.append(
            "Potassium-rich foods such as bananas, coconut water, and spinach could be beneficial."
        )

    return rec, alert, diet


def rule_gdm(p: Dict) -> Tuple[List[str], List[str], List[str]]:
    rec, alert, diet = [], [], []
    ogtt_f = p.get("ogtt_f")
    ogtt_1h = p.get("ogtt_1h")
    ogtt_2h = p.get("ogtt_2h")

    if (
        (ogtt_f and ogtt_f >= CONFIG["gdm_ogtt_f"])
        or (ogtt_1h and ogtt_1h >= CONFIG["gdm_ogtt_1h"])
        or (ogtt_2h and ogtt_2h >= CONFIG["gdm_ogtt_2h"])
    ):
        alert.append("Possible GDM – schedule OGTT confirmation & endocrinology review")
        rec.append("Elevated OGTT values suggest gestational diabetes. ")
        rec.append(
            "Medical Nutrition Therapy and physical activity may be the first line of management. "
        )
        rec.append(
            "If glucose remains uncontrolled, insulin therapy could be indicated. "
        )
        rec.append("Regular monitoring of fasting and postprandial glucose is advised.")
        diet.append(
            "A diet focused on complex carbohydrates (whole wheat, oats), fiber (salads, fruits), and lean proteins is recommended. "
        )
        diet.append("Meals should be small and frequent to stabilize blood sugar. ")
        diet.append("Limit sugary items, juices, white rice, and bakery products. ")
        diet.append(
            "Include fenugreek seeds, soaked overnight, which may help regulate glucose."
        )

    return rec, alert, diet


def rule_preeclampsia(p: Dict) -> Tuple[List[str], List[str], List[str]]:
    rec, alert, diet = [], [], []
    sbp, dbp = p.get("sbp"), p.get("dbp")
    proteinuria = p.get("proteinuria")  # in mg/24h

    if sbp and dbp and (sbp >= CONFIG["htn_sbp"] or dbp >= CONFIG["htn_dbp"]):
        if (
            proteinuria is not None and proteinuria > CONFIG["pree_proteinuria"]
        ):  # in mg/24h
            alert.append("BP + Proteinuria/Edema – Likely Preeclampsia")
            rec.append(
                "Hypertension with proteinuria or signs of end-organ damage after 20 weeks may indicate preeclampsia. "
            )
            rec.append(
                "Frequent BP monitoring, urine dipstick or 24-hour protein analysis, and fetal assessments are essential. "
            )
            rec.append(
                "Magnesium sulfate for seizure prophylaxis and planning for timely delivery may be considered."
            )
            diet.append(
                "A diet rich in antioxidants (e.g., berries, broccoli), moderate salt intake, and adequate hydration may be considered. "
            )
            diet.append(
                "Including foods with omega-3s (e.g., flaxseeds, walnuts) may help reduce inflammation. "
            )
            diet.append(
                "Avoid processed foods and trans fats, which could contribute to oxidative stress and worsen endothelial dysfunction."
            )
        else:
            alert.append("Isolated high BP – Monitor for preeclampsia evolution")
    return rec, alert, diet


def rule_thyroid(p: Dict) -> Tuple[List[str], List[str], List[str]]:
    rec, alert, diet = [], [], []
    tsh_values = {"1st": p.get("tsh_1"), "2nd": p.get("tsh_2"), "3rd": p.get("tsh_3")}

    ft4 = p.get("ft4")  # Free T4 (ng/dL)
    tpo_ab = p.get("tpo_ab")  # True if positive

    # Screening using trimester-specific TSH
    flagged = False
    for tri, val in tsh_values.items():
        if val is None:
            continue
        if tri == "1st" and val > CONFIG["tsh_first_tri"]:
            alert.append(f"TSH elevated in 1st trimester: {val} mIU/L")
            flagged = True
        elif tri in ("2nd", "3rd") and val > CONFIG["tsh_second_third"]:
            alert.append(f"TSH elevated in {tri} trimester: {val} mIU/L")
            flagged = True

    # Confirmatory logic if TSH was high in any trimester
    if flagged:
        if ft4 is not None and ft4 < 0.8:
            alert.append("FT4 low – Overt hypothyroidism")
            rec.append(
                "Overt hypothyroidism is confirmed by elevated TSH and low FT4. "
            )
            rec.append(
                "Start Levothyroxine under medical supervision. Dosage adjustments may be required during pregnancy."
            )
            diet.append(
                "Include iodine-rich foods such as iodized salt, dairy products, and eggs. "
            )
            diet.append(
                "Ensure adequate selenium and zinc intake. Avoid soy-based products as they can interfere with hormone absorption."
            )

        elif ft4 is not None and ft4 >= 0.8 and tpo_ab is True:
            alert.append(
                "FT4 normal but TPO-Ab positive – Subclinical autoimmune hypothyroidism"
            )
            rec.append(
                "TSH is elevated with normal FT4 and positive TPO antibodies, indicating subclinical autoimmune hypothyroidism. "
            )
            rec.append(
                "Specialist consultation is recommended. Levothyroxine may be initiated depending on clinical judgement."
            )
            diet.append(
                "Consume iodine-rich foods in moderation. Include selenium-rich foods like Brazil nuts and fish. "
            )
            diet.append("Avoid raw cruciferous vegetables and soy products.")

        elif ft4 is None:
            rec.append(
                "TSH levels are elevated but FT4 is not available. Order FT4 and TPO-Ab tests to confirm diagnosis. "
            )
            rec.append(
                "Treatment decisions should be made after full thyroid panel results."
            )
            diet.append(
                "Maintain a balanced diet with adequate iodine from dietary sources (e.g., dairy, eggs, seafood). "
            )
            diet.append("Avoid excessive soy intake until diagnosis is confirmed.")

    return rec, alert, diet


def rule_low_weight_gain(p: Dict) -> Tuple[List[str], List[str], List[str]]:
    rec, alert, diet = [], [], []

    gestational_age_weeks = p.get("gestational_age_weeks")
    current_weight = p.get("current_weight")
    pre_pregnancy_weight = p.get("pre_pregnancy_weight")
    bmi = p.get("bmi")
    if (
        current_weight is None
        or pre_pregnancy_weight is None
        or gestational_age_weeks is None
        or bmi is None
    ):
        return rec, alert, diet
    weight_gain = current_weight - pre_pregnancy_weight

    if 13 < gestational_age_weeks < 40:
        weeks = gestational_age_weeks - 13
        if weeks <= 0:
            return rec, alert, diet
        weekly_gain = (
            weight_gain / weeks
        )  # since we start recording from second trimester

        if bmi < 18.5 and weekly_gain < 0.5:
            alert.append(f"Low weight gain: {weekly_gain:.1f} kg")
            rec.append(
                "Frequent calorie-dense, nutrient-rich meals and addressing underlying issues (nausea, infections) may help. "
            )
            rec.append("Referral to a dietician or supplementation might be warranted.")
            diet.append(
                "High-protein, high-calorie foods like peanut butter, nuts, ghee, milkshakes, and eggs may help support healthy weight gain. "
            )
            diet.append(
                "Small, frequent meals and snacks (e.g., laddoos, dry fruits, paneer) can be useful. "
            )
            diet.append(
                "Ensure iron and folate intake is adequate. Avoid skipping meals."
            )
        elif 18.5 <= bmi < 25 and weekly_gain < 0.4:
            alert.append(f"Low weight gain: {weekly_gain:.1f} kg")
            rec.append(
                "Frequent calorie-dense, nutrient-rich meals and addressing underlying issues (nausea, infections) may help. "
            )
            rec.append("Referral to a dietician or supplementation might be warranted.")
            diet.append(
                "High-protein, high-calorie foods like peanut butter, nuts, ghee, milkshakes, and eggs may help support healthy weight gain. "
            )
            diet.append(
                "Small, frequent meals and snacks (e.g., laddoos, dry fruits, paneer) can be useful. "
            )
            diet.append(
                "Ensure iron and folate intake is adequate. Avoid skipping meals."
            )
        elif 25 <= bmi < 30 and weekly_gain < 0.3:
            alert.append(f"Low weight gain: {weekly_gain:.1f} kg")
            rec.append(
                "Frequent calorie-dense, nutrient-rich meals and addressing underlying issues (nausea, infections) may help. "
            )
            rec.append("Referral to a dietician or supplementation might be warranted.")
            diet.append(
                "High-protein, high-calorie foods like peanut butter, nuts, ghee, milkshakes, and eggs may help support healthy weight gain. "
            )
            diet.append(
                "Small, frequent meals and snacks (e.g., laddoos, dry fruits, paneer) can be useful. "
            )
            diet.append(
                "Ensure iron and folate intake is adequate. Avoid skipping meals."
            )
        elif bmi >= 30 and weekly_gain < 0.2:
            alert.append(f"Low weight gain: {weekly_gain:.1f} kg")
            rec.append(
                "Frequent calorie-dense, nutrient-rich meals and addressing underlying issues (nausea, infections) may help. "
            )
            rec.append("Referral to a dietician or supplementation might be warranted.")
            diet.append(
                "High-protein, high-calorie foods like peanut butter, nuts, ghee, milkshakes, and eggs may help support healthy weight gain. "
            )
            diet.append(
                "Small, frequent meals and snacks (e.g., laddoos, dry fruits, paneer) can be useful. "
            )
            diet.append(
                "Ensure iron and folate intake is adequate. Avoid skipping meals."
            )

    return rec, alert, diet


def rule_obesity(p: Dict) -> Tuple[List[str], List[str], List[str]]:
    rec, alert, diet = [], [], []
    bmi = p.get("bmi")
    gestational_age_weeks = p.get("gestational_age_weeks")
    current_weight = p.get("current_weight")
    pre_pregnancy_weight = p.get("pre_pregnancy_weight")
    if bmi is not None:
        if bmi >= 30:
            alert.append("Obese pregnancy – GDM/HTN risk ↑, monitor fetal size")
            rec.append(
                "BMI ≥ 30 suggests obesity, which may elevate the risk of gestational diabetes, hypertensive disorders, "
            )
            rec.append(
                "and delivery complications such as cesarean section. Regular fetal growth monitoring and maternal vitals "
            )
            rec.append(
                "could be considered. Suggest setting personalized weight gain goals with dietary and physical activity support."
            )
            diet.append(
                "Encourage structured meal timing, whole grains, seasonal fruits, and adequate protein intake. "
            )
            diet.append(
                "Avoid sugary or refined-carb-rich snacks. A food diary may help in identifying excess caloric intake. "
            )
            diet.append("Gentle physical activity may support weight management.")

        elif bmi >= 25:
            alert.append("Overweight – recommend diet + controlled weight gain")
            rec.append(
                "A structured meal plan and monitoring of weight gain trends could help maintain optimal maternal and fetal outcomes."
            )
            diet.append(
                "Encourage whole foods, fresh fruits, and vegetables; prefer grilled or boiled options over fried items. "
            )
            diet.append(
                "Incorporate balanced portions of complex carbs (e.g., millet, barley), proteins (dal, paneer), and healthy fats (nuts, seeds). "
            )
            diet.append(
                "Avoid added sugars and fast food. Moderate exercise, such as walking or prenatal stretching, can be beneficial."
            )

    if (
        gestational_age_weeks is not None
        and current_weight is not None
        and pre_pregnancy_weight is not None
        and bmi is not None
    ):
        weight_gain = current_weight - pre_pregnancy_weight
        if 13 < gestational_age_weeks < 40:
            weeks = gestational_age_weeks - 13
            if weeks <= 0:
                return rec, alert, diet
            weekly_gain = weight_gain / weeks

            if bmi < 25.0 and weekly_gain > 0.5:
                alert.append(f"Excessive weight gain: {weekly_gain:.1f} kg")
                rec.append(
                    "Observed weekly weight gain > 0.5 kg in a normal BMI pregnancy. Suggest reviewing nutrition, "
                )
                rec.append(
                    "activity pattern, and ensuring caloric intake is in line with trimester-specific needs."
                )
                diet.append(
                    "Encourage structured meal timing, whole grains, seasonal fruits, and adequate protein intake. "
                )
                diet.append(
                    "Avoid sugary or refined-carb-rich snacks. A food diary may help in identifying excess caloric intake. "
                )
                diet.append("Gentle physical activity may support weight management.")

            elif 25.0 <= bmi < 30.0 and weekly_gain > 0.4:
                alert.append(f"Excessive weight gain: {weekly_gain:.1f} kg")
                rec.append(
                    "Observed weekly weight gain > 0.4 kg in an overweight pregnancy. This may increase maternal-fetal risk. "
                )
                rec.append(
                    "A structured approach to nutrition and physical activity may help mitigate excessive gain."
                )
                diet.append(
                    "Advise meal planning with portion control, nutrient-dense foods (e.g., dals, lentils, non-starchy vegetables), "
                )
                diet.append(
                    "and avoiding high-fat, high-sugar snacks. Hydration and light exercise like walking are recommended."
                )

            elif bmi >= 30.0 and weekly_gain > 0.3:
                alert.append(f"Excessive weight gain: {weekly_gain:.1f} kg")
                rec.append(
                    "Observed weekly weight gain > 0.3 kg in an obese pregnancy. Suggest reviewing calorie intake and promoting physical activity, "
                )
                rec.append(
                    "as sustained excess weight gain may increase pregnancy and delivery-related complications."
                )
                diet.append(
                    "Recommend high-satiety, low-calorie meals with complex carbohydrates, proteins, and steamed vegetables. "
                )
                diet.append(
                    "Avoid late-night snacking, sugar-sweetened beverages, and processed snacks. "
                )
                diet.append("Supervised physical activity may support better outcomes.")

    return rec, alert, diet


def rule_liver_dysfunction(p: Dict) -> Tuple[List[str], List[str], List[str]]:
    rec, alert, diet = [], [], []

    # Extract values
    bile_acids = p.get("bile_acids")  # µmol/L
    ast = p.get("ast")  # U/L
    platelets = p.get("platelets")  # per mm³
    ldh = p.get("ldh")  # U/L
    bilirubin = p.get("bilirubin")  # mg/dL
    glucose = p.get("glucose")  # mg/dL

    lft_available = any(
        v is not None for v in [bile_acids, ast, platelets, ldh, bilirubin, glucose]
    )

    if not lft_available:
        # Only apply Step 1 if LFT values are missing
        symptoms = p.get("symptoms", []) or p.get("sysmptoms", [])
        conditions = p.get("conditions", [])

        if any(
            symptom in symptoms
            for symptom in ["pruritus", "severe itching", "ruq", "jaundice"]
        ) or any(
            cond in conditions for cond in ["preeclampsia", "hep B", "hellp history"]
        ):
            alert.append(
                "Liver-related symptoms or risk conditions present — recommend ordering LFT panel"
            )

        return rec, alert, diet

    # ICP
    if bile_acids is not None and bile_acids >= 19:
        alert.append(
            f"Bile acids elevated ({bile_acids} µmol/L) — Suggestive of Intrahepatic Cholestasis of Pregnancy (ICP)"
        )
        if bile_acids > 100:
            rec.append(
                "It may be helpful to consider initiating Ursodeoxycholic acid (UDCA) at 300 mg three times daily if symptoms persist or bile acid levels rise. "
            )
            rec.append(
                "Some guidelines indicate that if bile acids exceed 40 µmol/L, delivery around 37 weeks might be appropriate, "
            )
            rec.append(
                "and if bile acids exceed 100 µmol/L, earlier delivery could be considered. "
            )
            rec.append(
                "Close monitoring of fetal well-being and maternal liver function may be beneficial."
            )
        elif bile_acids > 40:
            rec.append(
                "Starting **UDCA 300 mg orally TID** may be beneficial. Delivery could be planned around **37 weeks gestation** to minimize risks."
            )
        else:
            rec.append(
                "It may be helpful to start **UDCA 300 mg orally TID**. Weekly monitoring of bile acid levels and maternal symptoms is advised."
            )
        diet.append(
            "A balanced liver-supportive diet rich in fruits (e.g., papaya, apple), vegetables (e.g., spinach, beetroot), and whole grains is suggested. Avoid spicy, oily, or fried foods. Drinking plenty of water may support bile clearance."
        )

    # HELLP Syndrome
    elif (
        ast is not None
        and ast >= 70
        and platelets is not None
        and platelets < 100000
        and ldh is not None
        and ldh >= 600
    ):
        alert.append(
            "LFT pattern consistent with HELLP Syndrome (AST↑, Platelets↓, LDH↑)"
        )
        rec.append(
            "Consider urgent hospitalization. Administer **Magnesium Sulfate (MgSO₄) 4 g IV over 20 minutes followed by 1 g/hr infusion** for seizure prophylaxis."
        )
        rec.append(
            "Stabilization and **planning for delivery regardless of gestational age** may be needed if maternal/fetal status is unstable."
        )
        diet.append(
            "During stabilization, the patient may be NPO (nothing by mouth). Once stable, a soft diet low in sodium and rich in antioxidants (e.g., vitamin C and E) may support recovery."
        )

    # AFLP (Acute Fatty Liver of Pregnancy)
    elif (
        ast is not None
        and ast > 300
        and bilirubin is not None
        and bilirubin > 5
        and glucose is not None
        and glucose < 60
    ):
        alert.append("Findings suggest Acute Fatty Liver of Pregnancy (AFLP)")
        rec.append(
            "Immediate **ICU admission** may be required. Consider **IV Dextrose 10–20% infusion** if hypoglycemia persists, and prepare for **urgent delivery**."
        )
        rec.append("Monitoring renal and coagulation parameters may also be necessary.")
        diet.append(
            "In AFLP, patients are usually NPO initially. Once oral intake is allowed, a bland, low-protein diet may help reduce liver load under medical supervision."
        )

    # Non-specific abnormal pattern
    elif any(v is not None for v in [ast, ldh, bilirubin, bile_acids]):
        alert.append("Abnormal liver enzymes without definitive diagnostic pattern")
        rec.append(
            "Further evaluation may include testing for **Hepatitis B/C, autoimmune markers (ANA, AMA), and gallbladder ultrasound**."
        )
        rec.append(
            "Referral to a hepatologist could be considered if abnormalities persist or worsen."
        )
        diet.append(
            "Suggest maintaining a liver-friendly diet with foods like oats, turmeric, berries, and avoiding alcohol, red meat, processed snacks, and high-fat meals."
        )

    return rec, alert, diet


# List of all rule functions
RULE_FUNCTIONS = [
    rule_anemia,
    rule_hypertension,
    rule_gdm,
    rule_preeclampsia,
    rule_thyroid,
    rule_low_weight_gain,
    rule_obesity,
    rule_liver_dysfunction,
]


def get_recommendations(patient: Dict) -> Dict:
    recommendations, alerts, diet = [], [], []
    for rule_fn in RULE_FUNCTIONS:
        rec, al, di = rule_fn(patient)
        recommendations.extend(rec)
        alerts.extend(al)
        diet.extend(di)

    # Deduplicate while preserving order
    recommendations = list(dict.fromkeys(recommendations))
    alerts = list(dict.fromkeys(alerts))
    diet = list(dict.fromkeys(diet))
    return {
        "supplement_recommendations": recommendations,
        "alerts": alerts,
        "dietary_recommendations": diet,
    }
