(() => {

    "use strict";


    /* =====================================================
       BACKEND URL
    ====================================================== */

    const API_BASE =
        "https://mansik-santulan-score-1-41u3.onrender.com";


    /* =====================================================
       DOM ELEMENTS
    ====================================================== */

    const form =
        document.getElementById("predict-form");

    const submitBtn =
        document.getElementById("submit-btn");

    const resetBtn =
        document.getElementById("reset-btn");

    const retryBtn =
        document.getElementById("error-retry-btn");


    /* Result states */

    const idleState =
        document.getElementById("state-idle");

    const loadingState =
        document.getElementById("state-loading");

    const resultState =
        document.getElementById("state-result");

    const errorState =
        document.getElementById("state-error");


    /* Result elements */

    const scoreNumber =
        document.getElementById("score-number");

    const scoreBand =
        document.getElementById("score-band");

    const resultTitle =
        document.getElementById("result-title");

    const scoreContext =
        document.getElementById("score-context");

    const scaleFill =
        document.getElementById("scale-fill");


    /* Error elements */

    const errorLabel =
        document.getElementById("error-label");

    const errorCopy =
        document.getElementById("error-copy");


    /* Progress */

    const progressBar =
        document.querySelector(
            ".progress-bar span"
        );


    /* Stress */

    const stressGroup =
        document.getElementById(
            "stress_level_group"
        );

    const stressInput =
        document.getElementById(
            "stress_level"
        );



    /* =====================================================
       STATE MANAGEMENT
    ====================================================== */

    function showState(stateName) {

        const states = {

            idle: idleState,

            loading: loadingState,

            result: resultState,

            error: errorState

        };


        Object.values(states).forEach(
            element => {
                element.hidden = true;
            }
        );


        states[stateName].hidden = false;
    }



    /* =====================================================
       ERROR HELPERS
    ====================================================== */

    function clearFieldError(input) {

        if (!input) {
            return;
        }


        const field =
            input.closest(".field");


        if (!field) {
            return;
        }


        field.classList.remove(
            "field-error"
        );


        const message =
            field.querySelector(
                ".error-message"
            );


        if (message) {

            message.textContent = "";

        }
    }



    function setFieldError(
        input,
        message
    ) {

        if (!input) {
            return;
        }


        const field =
            input.closest(".field");


        if (!field) {
            return;
        }


        field.classList.add(
            "field-error"
        );


        const errorElement =
            field.querySelector(
                ".error-message"
            );


        if (errorElement) {

            errorElement.textContent =
                message;

        }
    }



    function clearAllErrors() {

        form
            .querySelectorAll(".field")
            .forEach(field => {

                field.classList.remove(
                    "field-error"
                );

            });


        form
            .querySelectorAll(
                ".error-message"
            )
            .forEach(message => {

                message.textContent = "";

            });
    }



    /* =====================================================
       STRESS SELECTOR
    ====================================================== */

    stressGroup
        .querySelectorAll("button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    stressGroup
                        .querySelectorAll(
                            "button"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    stressInput.value =
                        button.dataset.value;


                    clearFieldError(
                        stressInput
                    );


                    progressBar.style.width =
                        "100%";
                }
            );

        });



    /* =====================================================
       COLLECT FORM DATA
    ====================================================== */

    function collectPayload() {

        const formData =
            new FormData(form);


        return {

            age:
                formData.get("age") === ""
                    ? NaN
                    : parseInt(
                        formData.get("age"),
                        10
                    ),


            gender:
                formData.get("gender")
                || "",


            country:
                (
                    formData.get("country")
                    || ""
                ).trim(),


            academic_level:
                formData.get(
                    "academic_level"
                )
                || "",


            most_used_platform:
                formData.get(
                    "most_used_platform"
                )
                || "",


            purpose_of_use:
                formData.get(
                    "purpose_of_use"
                )
                || "",


            avg_daily_usage_hours:
                formData.get(
                    "avg_daily_usage_hours"
                ) === ""
                    ? NaN
                    : parseFloat(
                        formData.get(
                            "avg_daily_usage_hours"
                        )
                    ),


            daily_unlocks:
                formData.get(
                    "daily_unlocks"
                ) === ""
                    ? NaN
                    : parseInt(
                        formData.get(
                            "daily_unlocks"
                        ),
                        10
                    ),


            study_hours:
                formData.get(
                    "study_hours"
                ) === ""
                    ? NaN
                    : parseFloat(
                        formData.get(
                            "study_hours"
                        )
                    ),


            physical_activity_hours:
                formData.get(
                    "physical_activity_hours"
                ) === ""
                    ? NaN
                    : parseFloat(
                        formData.get(
                            "physical_activity_hours"
                        )
                    ),


            sleep_hours_per_night:
                formData.get(
                    "sleep_hours_per_night"
                ) === ""
                    ? NaN
                    : parseFloat(
                        formData.get(
                            "sleep_hours_per_night"
                        )
                    ),


            stress_level:
                formData.get(
                    "stress_level"
                )
                || ""

        };

    }



    /* =====================================================
       VALIDATION
    ====================================================== */

    function validate(payload) {

        const errors = [];


        const numericFields = [

            [
                "age",
                10,
                100
            ],

            [
                "avg_daily_usage_hours",
                0,
                24
            ],

            [
                "daily_unlocks",
                0,
                Infinity
            ],

            [
                "study_hours",
                0,
                24
            ],

            [
                "physical_activity_hours",
                0,
                24
            ],

            [
                "sleep_hours_per_night",
                0,
                24
            ]

        ];


        numericFields.forEach(
            ([key, min, max]) => {

                const input =
                    document.getElementById(
                        key
                    );


                const value =
                    payload[key];


                if (
                    value === "" ||
                    value === null ||
                    Number.isNaN(value)
                ) {

                    errors.push([
                        input,
                        "This field is required."
                    ]);

                }


                else if (
                    value < min ||
                    value > max
                ) {

                    errors.push([
                        input,
                        `Must be between ${min} and ${
                            max === Infinity
                                ? "0+"
                                : max
                        }.`
                    ]);

                }

            }
        );



        const requiredTextFields = [

            "gender",

            "country",

            "academic_level",

            "most_used_platform",

            "purpose_of_use"

        ];


        requiredTextFields.forEach(
            key => {

                const input =
                    document.getElementById(
                        key
                    );


                if (
                    !payload[key] ||
                    String(
                        payload[key]
                    ).trim() === ""
                ) {

                    errors.push([
                        input,
                        "This field is required."
                    ]);

                }

            }
        );



        if (!payload.stress_level) {

            errors.push([
                stressInput,
                "Pick a stress level."
            ]);

        }


        return errors;
    }



    /* =====================================================
       SCORE BAND
    ====================================================== */

    function getScoreBand(score) {


        if (score < 4) {

            return {

                label:
                    "STRAINED SIGNAL",

                title:
                    "Your routine may need more recovery",

                context:
                    "Your responses suggest elevated strain right now. Small shifts in sleep, activity or screen time may help support a healthier rhythm."

            };

        }



        if (score < 7) {

            return {

                label:
                    "BALANCED SIGNAL",

                title:
                    "Your rhythm looks fairly steady",

                context:
                    "Your routine looks reasonably balanced, with some room to recover and reset across sleep, activity and digital habits."

            };

        }



        return {

            label:
                "STRONG SIGNAL",

            title:
                "Your routine shows a strong baseline",

            context:
                "Your habits point to a well-supported baseline. Keep protecting the routines that help you feel rested, active and focused."

        };

    }



    /* =====================================================
       RENDER RESULT
    ====================================================== */

    function renderResult(score) {


        const safeScore =
            Math.max(
                0,
                Math.min(
                    10,
                    Number(score)
                )
            );


        const band =
            getScoreBand(
                safeScore
            );


        scoreNumber.textContent =
            safeScore.toFixed(2);


        scoreBand.textContent =
            band.label;


        resultTitle.textContent =
            band.title;


        scoreContext.textContent =
            band.context;


        requestAnimationFrame(
            () => {

                scaleFill.style.width =
                    `${safeScore * 10}%`;

            }
        );


        showState("result");
    }



    /* =====================================================
       ERROR STATE
    ====================================================== */

    function renderError(
        label,
        message
    ) {

        errorLabel.textContent =
            label;

        errorCopy.textContent =
            message;

        showState("error");
    }



    /* =====================================================
       SUBMIT BUTTON
    ====================================================== */

    function setSubmitting(
        isSubmitting
    ) {

        submitBtn.disabled =
            isSubmitting;


        submitBtn.classList.toggle(
            "loading",
            isSubmitting
        );

    }



    /* =====================================================
       SERVER VALIDATION ERRORS
    ====================================================== */

    function applyServerErrors(
        details
    ) {

        if (
            !Array.isArray(details)
        ) {

            return false;

        }


        let matched = false;


        details.forEach(
            error => {

                const fieldName =
                    Array.isArray(
                        error.loc
                    )
                        ? error.loc[
                            error.loc.length - 1
                        ]
                        : null;


                const input =
                    fieldName ===
                    "stress_level"

                        ? stressInput

                        : document.getElementById(
                            fieldName
                        );


                if (input) {

                    setFieldError(
                        input,
                        error.msg ||
                            "Invalid value."
                    );


                    matched = true;

                }

            }
        );


        return matched;
    }



    /* =====================================================
       LIVE ERROR CLEARING + PROGRESS
    ====================================================== */

    form.addEventListener(
        "input",
        event => {

            if (
                event.target.matches(
                    "input, select"
                )
            ) {

                clearFieldError(
                    event.target
                );

            }


            const requiredFields =
                form.querySelectorAll(
                    "input[required], select[required]"
                );


            const completed =
                [...requiredFields]
                    .filter(
                        element =>
                            element.type !==
                            "hidden" &&
                            element.value.trim() !== ""
                    )
                    .length;


            const total =
                requiredFields.length - 1;


            const percentage =
                Math.max(
                    10,
                    Math.min(
                        100,
                        (
                            completed /
                            total
                        ) * 100
                    )
                );


            progressBar.style.width =
                `${percentage}%`;

        }
    );



    /* =====================================================
       FORM SUBMIT
    ====================================================== */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            clearAllErrors();


            const payload =
                collectPayload();


            const errors =
                validate(payload);


            /* Client validation */

            if (errors.length > 0) {

                errors.forEach(
                    ([input, message]) => {

                        setFieldError(
                            input,
                            message
                        );

                    }
                );


                if (
                    errors[0][0] &&
                    typeof
                    errors[0][0].focus ===
                    "function"
                ) {

                    errors[0][0].focus();

                }


                return;
            }



            /* Start loading */

            setSubmitting(true);

            showState("loading");



            try {

                const response =
                    await fetch(
                        `${API_BASE}/predict`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    payload
                                )

                        }
                    );



                /* 422 */

                if (
                    response.status ===
                    422
                ) {

                    const body =
                        await response
                            .json()
                            .catch(
                                () => null
                            );


                    const matched =
                        body &&
                        applyServerErrors(
                            body.detail
                        );


                    renderError(

                        "CHECK YOUR INPUTS",

                        matched

                            ? "The API rejected a few fields. Review the highlighted values."

                            : "The API rejected this submission. Please review your inputs."

                    );


                    return;
                }



                /* Other server errors */

                if (!response.ok) {

                    const body =
                        await response
                            .json()
                            .catch(
                                () => null
                            );


                    renderError(

                        "PREDICTION FAILED",

                        body?.detail ||
                        `Prediction service returned status ${response.status}.`

                    );


                    return;
                }



                /* Successful response */

                const data =
                    await response.json();


                if (
                    typeof
                    data.predicted_mental_health_score
                    !== "number"
                ) {

                    renderError(

                        "UNEXPECTED RESPONSE",

                        "The server responded, but the predicted score was missing."

                    );


                    return;
                }



                renderResult(
                    data.predicted_mental_health_score
                );


            }


            catch (error) {

                console.error(
                    "Prediction error:",
                    error
                );


                renderError(

                    "SERVER UNAVAILABLE",

                    "We couldn't reach the prediction service. Check that your Render backend is live and try again."

                );

            }


            finally {

                setSubmitting(false);

            }

        }
    );



    /* =====================================================
       RESET
    ====================================================== */

    resetBtn.addEventListener(
        "click",
        () => {

            form.reset();


            stressInput.value =
                "";


            stressGroup
                .querySelectorAll(
                    "button"
                )
                .forEach(
                    button => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


            clearAllErrors();


            scaleFill.style.width =
                "0%";


            progressBar.style.width =
                "33%";


            showState("idle");


            window.scrollTo({

                top:
                    document.querySelector(
                        ".workspace"
                    ).offsetTop - 25,

                behavior:
                    "smooth"

            });

        }
    );



    /* =====================================================
       ERROR RETRY
    ====================================================== */

    retry.addEventListener(
        "click",
        () => {

            showState("idle");

        }
    );

})();