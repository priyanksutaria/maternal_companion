from typing import Optional, List
from pydantic import BaseModel


class ReportData(BaseModel):
    hb_1st: Optional[float] = None
    hb_2nd: Optional[float] = None
    hb_3rd: Optional[float] = None
    ferritin: Optional[float] = None
    tsat: Optional[float] = None
    sbp: Optional[float] = None
    dbp: Optional[float] = None
    proteinuria: Optional[float] = None
    ogtt_f: Optional[float] = None
    ogtt_1h: Optional[float] = None
    ogtt_2h: Optional[float] = None
    tsh_1: Optional[float] = None
    tsh_2: Optional[float] = None
    tsh_3: Optional[float] = None
    ft4: Optional[float] = None
    tpo_ab: Optional[bool] = None
    gestational_age_weeks: Optional[float] = None
    bmi: Optional[float] = None
    pre_pregnancy_weight: Optional[float] = None
    current_weight: Optional[float] = None
    sysmptoms: Optional[List[str]] = None
    conditions: Optional[List[str]] = None


class ReportInput(BaseModel):
    data: ReportData
