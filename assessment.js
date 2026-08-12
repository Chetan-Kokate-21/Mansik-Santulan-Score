/* =========================================
   MINDPULSE ASSESSMENT
   ========================================= */


/*
   YOUR DEPLOYED FASTAPI BACKEND
*/

const API_BASE =
    "https://mansik-santulan-score-1-41u3.onrender.com";


/* =========================================
   STATE
   ========================================= */

let currentStep = 1;

const totalSteps = 4;


/* =========================================
   ELEMENTS
   ========================================= */

const form =
    document.getElementById("assessmentForm");

const steps =
    document.querySelectorAll(".form-step");

const nextButton =
    document.getElementById("nextButton");

const backButton =
    document.getElementById("backButton");

const stepLabel =
    document.getElementById("stepLabel");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const validationMessage =
    document.getElementById("validationMessage");

const resultLoading =
    document.getElementById("resultLoading");

const resultView =
    document.getElementById("resultView");

const apiError =
    document.getElementById("apiError");

const retryButton =
    document.getElementById("retryButton");

const againButton =
    document.getElementById("againButton");


/* =========================================
   STEP MANAGEMENT
   ========================================= */

function updateStep() {

    steps.forEach(step => {

        const stepNumber =
            Number(step.dataset.step);

        step.classList.toggle(
            "active",
            stepNumber === currentStep
        );

    });


    const percentage =
        (currentStep / totalSteps) * 100;


    stepLabel.textContent =
        `Step ${currentStep} of ${totalSteps}`;


    progressPercent.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;


    backButton.disabled =
        currentStep === 1;


    if (currentStep === totalSteps) {

        nextButton.innerHTML =
            `Generate my score <span>✦</span>`;

    } else {

        nextButton.innerHTML =
            `Continue <span>→</span>`;

    }


    validationMessage.textContent = "";
}


/* =========================================
   VALIDATION
   ========================================= */

function validateCurrentStep() {

    validationMessage.textContent = "";


    if (currentStep === 1) {

        const age =
            document.getElementById("age").value;

        const gender =
            document.getElementById("gender").value;

        const country =
            document.getElementById("country").value.trim();

        const academic =
            document.getElementById("academic_level").value;


        if (!age) {

            showValidation("Please enter your age.");
            return false;

        }


        if (Number(age) < 10 || Number(age) > 100) {

            showValidation("Age must be between 10 and 100.");
            return false;

        }


        if (!gender) {

            showValidation("Please select your gender.");
            return false;

        }


        if (!country) {

            showValidation("Please enter your country.");
            return false;

        }


        if (!academic) {

            showValidation("Please select your academic level.");
            return false;

        }

    }


    if (currentStep === 2) {

        const platform =
            document.getElementById("most_used_platform").value;

        const purpose =
            document.getElementById("purpose_of_use").value;

        const unlocks =
            document.getElementById("daily_unlocks").value;


        if (!platform) {

            showValidation("Please select your most-used platform.");
            return false;

        }


        if (!purpose) {

            showValidation("Please select your primary purpose.");
            return false;

        }


        if (!unlocks) {

            showValidation("Please enter your daily unlock count.");
            return false;

        }


        if (Number(unlocks) < 0) {

            showValidation("Unlock count cannot be negative.");
            return false;

        }

    }


    if (currentStep === 3) {

        const study =
            document.getElementById("study_hours").value;

        const activity =
            document.getElementById("physical_activity_hours").value;

        const sleep =
            document.getElementById("sleep_hours_per_night").value;


        if (
            study === "" ||
            activity === "" ||
            sleep === ""
        ) {

            showValidation("Please complete your routine information.");
            return false;

        }

    }


    if (currentStep === 4) {

        const stress =
            document.getElementById("stress_level").value;


        if (!stress) {

            showValidation("Please select your stress level.");
            return false;

        }

    }


    return true;
}


function showValidation(message) {

    validationMessage.textContent =
        message;

}


/* =========================================
   NEXT BUTTON
   ========================================= */

nextButton.addEventListener("click", async () => {

    if (!validateCurrentStep()) {
        return;
    }


    if (currentStep < totalSteps) {

        currentStep++;

        updateStep();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } else {

        await generatePrediction();

    }

});


/* =========================================
   BACK BUTTON
   ========================================= */

backButton.addEventListener("click", () => {

    if (currentStep > 1) {

        currentStep--;

        updateStep();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

});


/* =========================================
   CHOICE BUTTONS
   ========================================= */

const choiceButtons =
    document.querySelectorAll(
        ".choice-button, .platform-button"
    );


choiceButtons.forEach(button => {

    button.addEventListener("click", () => {

        const field =
            button.dataset.field;

        const value =
            button.dataset.value;


        document
            .querySelectorAll(
                `[data-field="${field}"]`
            )
            .forEach(item => {

                item.classList.remove("active");

            });


        button.classList.add("active");


        const hiddenInput =
            document.getElementById(field);

        hiddenInput.value =
            value;

    });

});


/* =========================================
   STRESS BUTTONS
   ========================================= */

const stressCards =
    document.querySelectorAll(".stress-card");


stressCards.forEach(card => {

    card.addEventListener("click", () => {

        stressCards.forEach(item => {

            item.classList.remove("active");

        });


        card.classList.add("active");


        document.getElementById(
            "stress_level"
        ).value =
            card.dataset.value;

    });

});


/* =========================================
   RANGE INPUTS
   ========================================= */

const rangeInputs = [

    {
        id: "avg_daily_usage_hours",
        display: "screenTimeValue"
    },

    {
        id: "study_hours",
        display: "studyValue"
    },

    {
        id: "physical_activity_hours",
        display: "activityValue"
    },

    {
        id: "sleep_hours_per_night",
        display: "sleepValue"
    }

];


rangeInputs.forEach(item => {

    const input =
        document.getElementById(item.id);

    const display =
        document.getElementById(item.display);


    function updateRange() {

        const value =
            Number(input.value);

        const min =
            Number(input.min);

        const max =
            Number(input.max);


        display.textContent =
            value % 1 === 0
                ? value
                : value.toFixed(1);


        const percentage =
            ((value - min) / (max - min)) * 100;


        input.style.background =
            `linear-gradient(
                to right,
                var(--accent) 0%,
                var(--accent) ${percentage}%,
                rgba(184,245,214,0.1) ${percentage}%,
                rgba(184,245,214,0.1) 100%
            )`;

    }


    input.addEventListener(
        "input",
        updateRange
    );


    updateRange();

});


/* =========================================
   COLLECT DATA
   ========================================= */

function collectFormData() {

    return {

        age:
            Number(
                document.getElementById("age").value
            ),

        gender:
            document.getElementById("gender").value,

        country:
            document.getElementById("country").value.trim(),

        academic_level:
            document.getElementById("academic_level").value,

        most_used_platform:
            document.getElementById("most_used_platform").value,

        purpose_of_use:
            document.getElementById("purpose_of_use").value,

        avg_daily_usage_hours:
            Number(
                document.getElementById(
                    "avg_daily_usage_hours"
                ).value
            ),

        daily_unlocks:
            Number(
                document.getElementById(
                    "daily_unlocks"
                ).value
            ),

        study_hours:
            Number(
                document.getElementById(
                    "study_hours"
                ).value
            ),

        physical_activity_hours:
            Number(
                document.getElementById(
                    "physical_activity_hours"
                ).value
            ),

        sleep_hours_per_night:
            Number(
                document.getElementById(
                    "sleep_hours_per_night"
                ).value
            ),

        stress_level:
            document.getElementById(
                "stress_level"
            ).value

    };

}


/* =========================================
   GENERATE PREDICTION
   ========================================= */

async function generatePrediction() {

    const data =
        collectFormData();


    form.style.display = "none";

    resultLoading.classList.add("active");

    apiError.classList.remove("active");


    try {

        const response =
            await fetch(
                `${API_BASE}/predict`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)
                }
            );


        if (!response.ok) {

            let errorMessage =
                "The prediction service returned an error.";

            try {

                const errorData =
                    await response.json();

                if (errorData.detail) {

                    errorMessage =
                        Array.isArray(errorData.detail)
                            ? "Please check your information and try again."
                            : errorData.detail;

                }

            } catch (error) {
                // Ignore JSON parsing errors.
            }

            throw new Error(errorMessage);

        }


        const result =
            await response.json();


        const score =
            Number(
                result.predicted_mental_health_score
            );


        if (!Number.isFinite(score)) {

            throw new Error(
                "The API returned an invalid score."
            );

        }


        await delay(900);


        resultLoading.classList.remove("active");

        showResult(
            score,
            data
        );

    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        resultLoading.classList.remove("active");

        apiError.classList.add("active");


        document.getElementById(
            "errorText"
        ).textContent =
            error.message ||
            "We couldn't connect to the prediction service.";

    }

}


/* =========================================
   SHOW RESULT
   ========================================= */

function showResult(score, data) {

    resultView.classList.add("active");


    const safeScore =
        Math.max(
            0,
            Math.min(10, score)
        );


    document.getElementById(
        "resultSleep"
    ).textContent =
        `${data.sleep_hours_per_night}h`;


    document.getElementById(
        "resultScreen"
    ).textContent =
        `${data.avg_daily_usage_hours}h`;


    document.getElementById(
        "resultActivity"
    ).textContent =
        `${data.physical_activity_hours}h`;


    document.getElementById(
        "resultStress"
    ).textContent =
        data.stress_level;


    const status =
        getScoreStatus(safeScore);


    document.getElementById(
        "resultStatus"
    ).textContent =
        status.title;


    document.getElementById(
        "resultDescription"
    ).textContent =
        status.description;


    animateScore(
        safeScore
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   SCORE STATUS
   ========================================= */

function getScoreStatus(score) {

    if (score >= 8) {

        return {

            title: "Strong balance",

            description:
                "Your current behavioral pattern indicates a strong positive wellbeing signal based on the information provided."

        };

    }


    if (score >= 6) {

        return {

            title: "Positive balance",

            description:
                "Your current behavioral pattern indicates a relatively positive wellbeing signal."

        };

    }


    if (score >= 4) {

        return {

            title: "Room for balance",

            description:
                "Your current pattern suggests there may be some areas of your routine worth paying attention to."

        };

    }


    return {

        title: "Needs attention",

        description:
            "Your current behavioral pattern suggests several areas of your routine may benefit from attention and support."

    };

}


/* =========================================
   ANIMATE SCORE
   ========================================= */

function animateScore(score) {

    const numberElement =
        document.getElementById(
            "resultNumber"
        );


    const progress =
        document.getElementById(
            "scoreProgress"
        );


    const circumference =
        2 * Math.PI * 92;


    progress.style.strokeDasharray =
        circumference;


    progress.style.strokeDashoffset =
        circumference;


    requestAnimationFrame(() => {

        const targetOffset =
            circumference -
            (score / 10) * circumference;


        progress.style.strokeDashoffset =
            targetOffset;

    });


    let startTime = null;

    const duration = 1400;


    function animate(timestamp) {

        if (!startTime) {
            startTime = timestamp;
        }


        const elapsed =
            timestamp - startTime;


        const progressAmount =
            Math.min(
                elapsed / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progressAmount,
                3
            );


        const current =
            score * eased;


        numberElement.textContent =
            current.toFixed(2);


        if (progressAmount < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            numberElement.textContent =
                score.toFixed(2);

        }

    }


    requestAnimationFrame(
        animate
    );

}


/* =========================================
   RETRY
   ========================================= */

retryButton.addEventListener(
    "click",
    () => {

        apiError.classList.remove(
            "active"
        );

        form.style.display = "block";

        currentStep = 4;

        updateStep();

    }
);


/* =========================================
   TAKE AGAIN
   ========================================= */

againButton.addEventListener(
    "click",
    () => {

        window.location.reload();

    }
);


/* =========================================
   UTILITY
   ========================================= */

function delay(ms) {

    return new Promise(
        resolve => setTimeout(
            resolve,
            ms
        )
    );

}


/* =========================================
   INITIALIZE
   ========================================= */

updateStep();