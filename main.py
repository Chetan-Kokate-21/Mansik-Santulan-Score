import os
import joblib
import pandas as pd

from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware


# ============================================================
# Load ML Model
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(
    BASE_DIR,
    "Mental_Health_Model.pkl"
)

model = joblib.load(model_path)


# ============================================================
# Application Configuration
# ============================================================

top_countries = [
    "Other",
    "India",
    "USA",
    "Canada",
    "Australia",
    "UK",
    "Germany",
    "Mexico",
    "Turkey",
    "France"
]


app = FastAPI()


# ============================================================
# CORS Configuration
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Pydantic Input Model
# ============================================================

class StudentData(BaseModel):

    age: int = Field(
        ...,
        ge=10,
        le=100
    )

    gender: Literal[
        "Male",
        "Female"
    ]

    country: str

    academic_level: Literal[
        "Undergraduate",
        "Graduate",
        "High School"
    ]

    most_used_platform: Literal[
        "Facebook",
        "LinkedIn",
        "Instagram",
        "Snapchat",
        "Twitter",
        "YouTube",
        "TikTok",
        "LINE",
        "KakaoTalk",
        "VKontakte",
        "WhatsApp",
        "WeChat"
    ]

    purpose_of_use: Literal[
        "Networking",
        "Education",
        "Entertainment",
        "News"
    ]

    avg_daily_usage_hours: float = Field(
        ...,
        ge=0,
        le=24
    )

    daily_unlocks: int = Field(
        ...,
        ge=0
    )

    study_hours: float = Field(
        ...,
        ge=0,
        le=24
    )

    physical_activity_hours: float = Field(
        ...,
        ge=0,
        le=24
    )

    sleep_hours_per_night: float = Field(
        ...,
        ge=0,
        le=24
    )

    stress_level: Literal[
        "Medium",
        "Low",
        "Very High",
        "High"
    ]


# ============================================================
# Prediction Response Model
# ============================================================

class PredictionResponse(BaseModel):

    predicted_mental_health_score: float


# ============================================================
# Home Route
# ============================================================

@app.get("/")
def greet():

    return {
        "Welcome": "to Sheryians AI School Guys"
    }


# ============================================================
# Prediction Route
# ============================================================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: StudentData):

    # Group countries that are not in the top country list
    country_group = (
        data.country
        if data.country in top_countries
        else "Other"
    )

    # Create input DataFrame
    input_row = pd.DataFrame([
        {
            "Age": data.age,

            "Gender": data.gender,

            "Country": data.country,

            "Academic_Level": data.academic_level,

            "Most_Used_Platform": data.most_used_platform,

            "Purpose_Of_Use": data.purpose_of_use,

            "Avg_Daily_Usage_Hours":
                data.avg_daily_usage_hours,

            "Daily_Unlocks":
                data.daily_unlocks,

            "Study_Hours":
                data.study_hours,

            "Physical_Activity_Hours":
                data.physical_activity_hours,

            "Sleep_Hours_Per_Night":
                data.sleep_hours_per_night,

            "Stress_Level":
                data.stress_level,

            "Grouped_country":
                country_group
        }
    ])

    # Make prediction
    prediction = model.predict(input_row)[0]

    # Return prediction
    return PredictionResponse(
        predicted_mental_health_score=round(
            float(prediction),
            2
        )
    )