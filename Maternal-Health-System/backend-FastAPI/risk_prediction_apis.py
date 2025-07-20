from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from collections import Counter
import pandas as pd

model_rf = joblib.load("rfm.pkl")
model_xgb = joblib.load("xgb.pkl")
model_mlp = joblib.load("mlp.pkl") 

fetal_mlp = joblib.load('mlp_fetal.pkl')
fetal_xgb = joblib.load('xgb_fetal.pkl')
fetal_rf  = joblib.load('rfm_fetal.pkl')

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Predictor is running."}

class RiskInputData(BaseModel):
    age: float
    systolic: float
    diastolic: float
    bs: float
    bmi: float
    heart_rate: float
    body_temp: float
    previous_complications: float
    
class FetalHealthInput(BaseModel):
    baseline_value: float
    accelerations: float
    fetal_movement: float
    uterine_contractions: float
    light_decelerations: float
    severe_decelerations: float
    prolongued_decelerations: float
    abnormal_short_term_variability: float
    mean_value_of_short_term_variability: float
    percentage_of_time_with_abnormal_long_term_variability: float
    mean_value_of_long_term_variability: float
    histogram_width: float
    histogram_min: float
    histogram_max: float
    histogram_number_of_peaks: float
    histogram_number_of_zeroes: float
    histogram_mode: float
    histogram_mean: float
    histogram_median: float
    histogram_variance: float
    histogram_tendency: float
    
##### HARD VOTING 
# def majority_vote(preds: list[int]) -> int:
#     vote_count = Counter(preds)
#     return vote_count.most_common(1)[0][0]

# @app.post("/predict/")
# def predict(data: InputData):
#     # Reconstruct input as a DataFrame with feature names
#     input_dict = {
#         "age": data.age,
#         "systolic": data.systolic,
#         "diastolic": data.diastolic,
#         "bs": data.bs,
#         "bmi": data.bmi,
#         "heart_rate": data.heart_rate,
#         "body_temp": data.body_temp,
#         "previous_complications": data.previous_complications
#     }

#     X = pd.DataFrame([input_dict])

#     pred_rf = model_rf.predict(X)[0]
#     pred_xgb = model_xgb.predict(X)[0]
#     pred_mlp = model_mlp.predict(X)[0]

#     final_prediction = majority_vote([pred_rf, pred_xgb, pred_mlp])

#     return {
#         "RandomForest": int(pred_rf),
#         "XGBoost": int(pred_xgb),
#         "MLPClassifier": int(pred_mlp),
#         "EnsemblePrediction": int(final_prediction)
#     }


### SOFT VOTING
@app.post("/predict_preg")
# 0 - Low risk, 1- Mid Risk, 2-High Risk Pregnancy
def predict_preg(data: RiskInputData):
    # Create DataFrame with correct feature names
    input_dict = {
        "age": data.age,
        "systolic": data.systolic,
        "diastolic": data.diastolic,
        "bs": data.bs,
        "bmi": data.bmi,
        "heart_rate": data.heart_rate,
        "body_temp": data.body_temp,
        "previous_complications": data.previous_complications
    }
    X = pd.DataFrame([input_dict])

    # Get predicted probabilities from each model
    proba_rf = model_rf.predict_proba(X)
    proba_xgb = model_xgb.predict_proba(X)
    proba_mlp = model_mlp.predict_proba(X)

    # Average the class probabilities (soft voting)
    avg_proba = (proba_rf + proba_xgb + proba_mlp) / 3

    # Final predicted class = class with highest average probability
    final_prediction = int(np.argmax(avg_proba, axis=1)[0])

    return {
        "Probabilities": {
            f"Class_{i}": round(prob, 4) for i, prob in enumerate(avg_proba[0])
        },
        "EnsemblePrediction": final_prediction
    }
    
@app.post("/predict_fetal")
# Class 0: Normal
# Class 1: Suspect
# Class 2: Pathological
# Classes are the for the type of CTG Result... Normal CTG, Suspect CTG, Pathological CTG
def predict_fetal(input_data: FetalHealthInput):
    input_dict = input_data.dict()
    X = pd.DataFrame([input_dict])

    proba_rf = fetal_rf.predict_proba(X)
    proba_xgb = fetal_xgb.predict_proba(X)
    proba_mlp = fetal_mlp.predict_proba(X)
    
    avg_proba = (proba_rf + proba_xgb + proba_mlp) / 3
    
    final_prediction = int(np.argmax(avg_proba, axis=1)[0])

    return {
        "Probabilities": {
            f"Class_{i}": round(prob, 4) for i, prob in enumerate(avg_proba[0])
        },
        "EnsemblePrediction": final_prediction
    }