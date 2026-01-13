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

const init = () => {
  const workouts = loadWorkouts();
  updateMetrics(workouts);
  renderWorkouts(workouts);
  updateRecommendations();
  renderSchedule();
};

init();
