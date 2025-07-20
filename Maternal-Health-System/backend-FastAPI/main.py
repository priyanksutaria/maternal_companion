from fastapi import FastAPI, HTTPException
from models.report import ReportInput
from rules.engine import get_recommendations
from fastapi import APIRouter
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'ML'))
from risk_prediction_apis import RiskInputData, FetalHealthInput, predict_preg, predict_fetal

app = FastAPI()


@app.post("/analyze")
def analyze_report(report: ReportInput):
    try:
        patient_data = report.data.dict()
        result = get_recommendations(patient_data)
        anemia = any("anemia" in s.lower() for s in result["alerts"])
        gdm = any(
            "gdm" in s.lower() or "gestational diabetes" in s.lower()
            for s in result["alerts"]
        )
        thyroid = any(
            "tsh" in s.lower() or "thyroid" in s.lower() for s in result["alerts"]
        )
        result.update(
            {
                "anemia": anemia,
                "gdm": gdm,
                "thyroid": thyroid,
                "report_id": getattr(report, "id", None),  # or report.id if present
            }
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Pregnancy risk prediction endpoint
@app.post("/predict_preg")
def predict_preg_route(data: RiskInputData):
    return predict_preg(data)

# Fetal risk prediction endpoint
@app.post("/predict_fetal")
def predict_fetal_route(data: FetalHealthInput):
    return predict_fetal(data)
