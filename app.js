const workoutForm = document.getElementById("workout-form");
const workoutLog = document.getElementById("workout-log");
const recommendationList = document.getElementById("recommendation-list");
const coachCues = document.getElementById("coach-cues");
const schedule = document.getElementById("schedule");
const goalSelect = document.getElementById("goal");
const focusSelect = document.getElementById("focus");
const startBtn = document.getElementById("start-btn");
const demoBtn = document.getElementById("demo-btn");
const todayBtn = document.getElementById("today-btn");
const planBtn = document.getElementById("plan-btn");
const nutritionForm = document.getElementById("nutrition-form");
const nutritionLog = document.getElementById("nutrition-log");
const meditationButton = document.getElementById("meditation-btn");
const meditationMinutes = document.getElementById("meditation-mins");
const quoteText = document.getElementById("quote-text");
const quoteButton = document.getElementById("quote-btn");
const settingsForm = document.getElementById("settings-form");
const settingsSummary = document.getElementById("settings-summary");
const readinessSection = document.querySelector(".hero-card");
const recommendationSection = document.getElementById("recommendations");

const metrics = {
  volume: document.getElementById("volume"),
  strengthPr: document.getElementById("strength-pr"),
  cardioMins: document.getElementById("cardio-mins"),
  avgRpe: document.getElementById("avg-rpe"),
};

const readiness = {
  recovery: document.getElementById("recovery-score"),
  energy: document.getElementById("energy-score"),
  stress: document.getElementById("stress-score"),
};

const storageKey = "fitty.workouts";
const nutritionKey = "fitty.nutrition";
const meditationKey = "fitty.meditation";
const settingsKey = "fitty.settings";

const recommendationBank = {
  strength: [
    "Compound strength focus: 5x5 back squats, 4x6 bench press.",
    "Accessory strength work: 3x10 Romanian deadlifts, 3x12 rows.",
    "Finish with core stability: 3x45s farmer carries.",
  ],
  endurance: [
    "Zone 2 cardio: 35-45 min steady pace run or cycle.",
    "Tempo intervals: 6x3 min at 80% effort with 90s rest.",
    "Mobility flow: 12 min hips and ankles post-run.",
  ],
  "fat-loss": [
    "Metabolic circuit: 4 rounds of kettlebell swings, pushups, lunges.",
    "Conditioning finisher: 12 min EMOM (bike sprint + plank).",
    "Protein target: 1.6g/kg bodyweight for recovery.",
  ],
  mobility: [
    "Full-body mobility: 20 min yoga flow + thoracic rotations.",
    "Activation: glute bridges, banded walks, scapular pushups.",
    "Breathing reset: 5 min nasal breathing cooldown.",
  ],
};

const focusCues = {
  "full-body": ["Prioritize big lifts first", "Balance push & pull volume"],
  upper: ["Warm up shoulders thoroughly", "Mix vertical and horizontal presses"],
  lower: ["Prime hips with activation", "Keep tempo controlled on squats"],
  conditioning: ["Monitor heart rate zones", "Maintain nasal breathing on recovery"],
};

const scheduleTemplate = [
  { day: "Mon", focus: "Strength + Power", detail: "Lower body + plyometrics" },
  { day: "Tue", focus: "Conditioning", detail: "Intervals + core" },
  { day: "Wed", focus: "Upper Strength", detail: "Press & pull supersets" },
  { day: "Thu", focus: "Recovery", detail: "Mobility + light cardio" },
  { day: "Fri", focus: "Full Body", detail: "Strength + metabolic finisher" },
  { day: "Sat", focus: "Endurance", detail: "Long steady cardio" },
  { day: "Sun", focus: "Reset", detail: "Stretching + breathwork" },
];

const motivationalQuotes = [
  "Small steps every day create huge change.",
  "Discipline beats motivation when motivation fades.",
  "You are one workout away from a better mood.",
  "Strong habits build strong bodies.",
  "Consistency is the real personal trainer.",
];

const motivationPools = {
  uplifting: [
    "Small steps every day create huge change.",
    "You are one workout away from a better mood.",
    "Strong habits build strong bodies.",
  ],
  discipline: [
    "Discipline beats motivation when motivation fades.",
    "Consistency is the real personal trainer.",
    "Earn the next rep with focus.",
  ],
  mindful: [
    "Breathe in calm, breathe out doubt.",
    "Progress is a practice, not a sprint.",
    "Reset your focus and return stronger.",
  ],
};

const loadWorkouts = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (error) {
    return [];
  }
};

const saveWorkouts = (workouts) => {
  localStorage.setItem(storageKey, JSON.stringify(workouts));
};

const loadNutrition = () => {
  try {
    return JSON.parse(localStorage.getItem(nutritionKey)) || [];
  } catch (error) {
    return [];
  }
};

const saveNutrition = (entries) => {
  localStorage.setItem(nutritionKey, JSON.stringify(entries));
};

const loadMeditation = () => {
  try {
    return JSON.parse(localStorage.getItem(meditationKey)) || { minutes: 0 };
  } catch (error) {
    return { minutes: 0 };
  }
};

const saveMeditation = (data) => {
  localStorage.setItem(meditationKey, JSON.stringify(data));
};

const loadSettings = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(settingsKey)) || {
        displayName: "",
        trainingDays: "4",
        targetCalories: "",
        targetProtein: "",
        targetSteps: "",
        targetMeditation: "",
        recoveryFocus: "balanced",
        motivationStyle: "uplifting",
        showReadiness: true,
        showRecommendations: true,
      }
    );
  } catch (error) {
    return {
      displayName: "",
      trainingDays: "4",
      targetCalories: "",
      targetProtein: "",
      targetSteps: "",
      targetMeditation: "",
      recoveryFocus: "balanced",
      motivationStyle: "uplifting",
      showReadiness: true,
      showRecommendations: true,
    };
  }
};

const saveSettings = (settings) => {
  localStorage.setItem(settingsKey, JSON.stringify(settings));
};

const updateMetrics = (workouts) => {
  metrics.volume.textContent = workouts.length;

  const cardioTotal = workouts.reduce((sum, workout) => sum + Number(workout.duration || 0), 0);
  metrics.cardioMins.textContent = cardioTotal;

  const rpeAverage = workouts.length
    ? (workouts.reduce((sum, workout) => sum + Number(workout.rpe || 0), 0) / workouts.length).toFixed(1)
    : "—";
  metrics.avgRpe.textContent = rpeAverage;

  const bestLift = workouts[0]?.pr || "—";
  metrics.strengthPr.textContent = bestLift;

  const latest = workouts[0];
  if (latest) {
    const recoveryScore = Math.max(60, 100 - Number(latest.rpe) * 4);
    readiness.recovery.textContent = `${recoveryScore}%`;
    readiness.energy.textContent = `${Math.min(95, 55 + Number(latest.rpe) * 3)}%`;
    readiness.stress.textContent = Number(latest.rpe) > 7 ? "Elevated" : "Low";
  }
};

const renderWorkouts = (workouts) => {
  workoutLog.innerHTML = workouts
    .slice(0, 4)
    .map(
      (workout) => `
        <div class="log-item">
          <strong>${workout.name}</strong>
          <p>${workout.pr}</p>
          <small>${workout.duration} min · RPE ${workout.rpe}</small>
          <p class="muted">${workout.notes || "No extra notes yet."}</p>
        </div>
      `,
    )
    .join("");
};

const updateRecommendations = () => {
  const goal = goalSelect.value;
  const focus = focusSelect.value;
  const baseRecommendations = recommendationBank[goal] || [];
  const focusTips = focusCues[focus] || [];

  recommendationList.innerHTML = baseRecommendations.map((item) => `<li>${item}</li>`).join("");
  coachCues.innerHTML = focusTips
    .map(
      (tip, index) => `
        <div class="coach-item">
          <span>${tip}</span>
          <strong>${index + 1}</strong>
        </div>
      `,
    )
    .join("");
};

const renderSchedule = () => {
  schedule.innerHTML = scheduleTemplate
    .map(
      (item) => `
        <div class="schedule-card">
          <span class="label">${item.day}</span>
          <h3>${item.focus}</h3>
          <p class="muted">${item.detail}</p>
        </div>
      `,
    )
    .join("");
};

const renderNutrition = (entries) => {
  nutritionLog.innerHTML = entries
    .slice(0, 3)
    .map(
      (entry) => `
        <div class="log-item">
          <strong>${entry.calories} kcal · P ${entry.protein}g / C ${entry.carbs}g / F ${entry.fats}g</strong>
          <p class="muted">Habits: ${entry.habits.join(", ") || "None logged"}</p>
          <small>${new Date(entry.date).toLocaleDateString()}</small>
        </div>
      `,
    )
    .join("");
};

const renderMeditation = (data) => {
  meditationMinutes.textContent = data.minutes;
};

const updateQuote = () => {
  const settings = loadSettings();
  const pool = motivationPools[settings.motivationStyle] || motivationalQuotes;
  const next = pool[Math.floor(Math.random() * pool.length)];
  quoteText.textContent = next;
};

const addWorkout = (event) => {
  event.preventDefault();
  const newWorkout = {
    name: document.getElementById("workout-name").value.trim(),
    duration: document.getElementById("workout-duration").value,
    rpe: document.getElementById("workout-rpe").value,
    pr: document.getElementById("workout-pr").value.trim(),
    notes: document.getElementById("workout-notes").value.trim(),
    date: new Date().toISOString(),
  };

  const workouts = [newWorkout, ...loadWorkouts()];
  saveWorkouts(workouts);
  updateMetrics(workouts);
  renderWorkouts(workouts);
  workoutForm.reset();
};

const addNutrition = (event) => {
  event.preventDefault();
  const habits = [];
  if (document.getElementById("habit-water").checked) habits.push("Hydration");
  if (document.getElementById("habit-steps").checked) habits.push("Steps");
  if (document.getElementById("habit-sleep").checked) habits.push("Sleep");
  if (document.getElementById("habit-mobility").checked) habits.push("Mobility");

  const entry = {
    calories: document.getElementById("calories").value,
    protein: document.getElementById("protein").value,
    carbs: document.getElementById("carbs").value,
    fats: document.getElementById("fats").value,
    habits,
    date: new Date().toISOString(),
  };

  const entries = [entry, ...loadNutrition()];
  saveNutrition(entries);
  renderNutrition(entries);
  nutritionForm.reset();
};

const addMeditation = () => {
  const data = loadMeditation();
  const updated = { minutes: data.minutes + 10 };
  saveMeditation(updated);
  renderMeditation(updated);
};

const updateSettingsSummary = (settings) => {
  const nameLabel = settings.displayName ? `Welcome, ${settings.displayName}.` : "Welcome back.";
  settingsSummary.innerHTML = `
    <strong>${nameLabel}</strong>
    <span class="muted">Training days: ${settings.trainingDays} · Recovery focus: ${settings.recoveryFocus}</span>
    <span class="muted">Targets: ${settings.targetCalories || "—"} kcal · ${
      settings.targetProtein || "—"
    }g protein · ${settings.targetSteps || "—"} steps</span>
    <span class="muted">Meditation goal: ${settings.targetMeditation || "—"} min · Motivation: ${
      settings.motivationStyle
    }</span>
  `;
};

const applySettings = (settings) => {
  readinessSection.style.display = settings.showReadiness ? "block" : "none";
  recommendationSection.style.display = settings.showRecommendations ? "grid" : "none";
  updateSettingsSummary(settings);
};

const saveSettingsForm = (event) => {
  event.preventDefault();
  const settings = {
    displayName: document.getElementById("display-name").value.trim(),
    trainingDays: document.getElementById("training-days").value,
    targetCalories: document.getElementById("target-calories").value,
    targetProtein: document.getElementById("target-protein").value,
    targetSteps: document.getElementById("target-steps").value,
    targetMeditation: document.getElementById("target-meditation").value,
    recoveryFocus: document.getElementById("recovery-focus").value,
    motivationStyle: document.getElementById("motivation-style").value,
    showReadiness: document.getElementById("show-readiness").checked,
    showRecommendations: document.getElementById("show-recommendations").checked,
  };
  saveSettings(settings);
  applySettings(settings);
  updateQuote();
};

const hydrateSettingsForm = (settings) => {
  document.getElementById("display-name").value = settings.displayName;
  document.getElementById("training-days").value = settings.trainingDays;
  document.getElementById("target-calories").value = settings.targetCalories;
  document.getElementById("target-protein").value = settings.targetProtein;
  document.getElementById("target-steps").value = settings.targetSteps;
  document.getElementById("target-meditation").value = settings.targetMeditation;
  document.getElementById("recovery-focus").value = settings.recoveryFocus;
  document.getElementById("motivation-style").value = settings.motivationStyle;
  document.getElementById("show-readiness").checked = settings.showReadiness;
  document.getElementById("show-recommendations").checked = settings.showRecommendations;
};

const loadDemo = () => {
  const demo = [
    {
      name: "Power Lower",
      duration: 65,
      rpe: 8,
      pr: "Deadlift 110kg x 3",
      notes: "Solid pull, tighten lats and brace harder on set 2.",
    },
    {
      name: "Tempo Run",
      duration: 42,
      rpe: 7,
      pr: "5 km in 26:10",
      notes: "Stay tall, land under center of mass.",
    },
  ];
  saveWorkouts(demo);
  updateMetrics(demo);
  renderWorkouts(demo);
};

const scrollToSection = (id) => {
  const section = document.querySelector(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

workoutForm.addEventListener("submit", addWorkout);
goalSelect.addEventListener("change", updateRecommendations);
focusSelect.addEventListener("change", updateRecommendations);
startBtn.addEventListener("click", () => scrollToSection("#performance"));
demoBtn.addEventListener("click", loadDemo);
todayBtn.addEventListener("click", () => scrollToSection("#recommendations"));
planBtn.addEventListener("click", () => scrollToSection("#plan"));
nutritionForm.addEventListener("submit", addNutrition);
meditationButton.addEventListener("click", addMeditation);
quoteButton.addEventListener("click", updateQuote);
settingsForm.addEventListener("submit", saveSettingsForm);

const init = () => {
  const workouts = loadWorkouts();
  const settings = loadSettings();
  updateMetrics(workouts);
  renderWorkouts(workouts);
  updateRecommendations();
  renderSchedule();
  renderNutrition(loadNutrition());
  renderMeditation(loadMeditation());
  hydrateSettingsForm(settings);
  applySettings(settings);
  updateQuote();
};

init();
