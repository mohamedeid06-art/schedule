/* ==========================================================================
   CUFE Mechanical Engineering — Batch 30 Application Logic Engine
   ========================================================================== */

// --- Global Application State ---
let activeView = "day";
let activeGroup = localStorage.getItem("cufe_active_group") || "ME1-01";
let highlightedCourse = null;
let selectedDynamicsSlot = null;

// Tasks Hub State
let activeTaskFilter = 'all';
let isFocusModeActive = false;
let tasksSearchQuery = '';
let completedTasks = JSON.parse(localStorage.getItem("cufe_completed_tasks") || "[]");
let currentDetailedTask = null;
let calViewDate = new Date(2026, 8, 1);

let WEEKLY_GUIDE_DATA = [];
let selectedGuideWeek = "Week 1";
let ASSESSMENTS = [];
let NOTIFICATIONS = [
  { 
    id: "ann-01", 
    date: "8 Sep 2026", 
    tag: "Batch 30", 
    title: "Welcome to Mechanical Engineering (Batch 30)", 
    body: "Fall Semester timetable is active. Lectures commence Saturday, 19 September 2026." 
  }
];

// Time tracking
let currentDisplayWeek = calculateActualAcademicWeek();
const jsDateNow = new Date();
const jsDay = jsDateNow.getDay();
let activeDay = (jsDay >= 0 && jsDay <= 4) ? DAYS[jsDay].full : "Sunday";
const todayDayName = (jsDay >= 0 && jsDay <= 4) ? DAYS[jsDay].full : null;

// Utility functions
function parseMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function triggerHaptic(type = "light") {
  if (!navigator.vibrate) return;
  if (type === "heavy") navigator.vibrate([15, 30, 20]);
  else navigator.vibrate(8);
}

function calculateActualAcademicWeek() {
  const now = new Date();
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startZero = new Date(ACADEMIC_YEAR_START.getFullYear(), ACADEMIC_YEAR_START.getMonth(), ACADEMIC_YEAR_START.getDate());
  const diffDays = Math.round((todayZero - startZero) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 1;
  return Math.floor(diffDays / 7) + 1;
}

function setManualWeekView(wk) {
  triggerHaptic("light");
  currentDisplayWeek = wk;
  const w1Btn = document.getElementById("viewWeek1Btn");
  const wRegBtn = document.getElementById("viewWeekRegularBtn");
  if (w1Btn && wRegBtn) {
    w1Btn.className = `week-prev-btn ${wk === 1 ? 'active' : ''}`;
    wRegBtn.className = `week-prev-btn ${wk !== 1 ? 'active' : ''}`;
  }
  render();
}

function getActiveEffectiveSessions() {
  const isWeek1 = (currentDisplayWeek === 1);
  let baseSessions = [];

  if (isWeek1) {
    baseSessions = SESSIONS.filter(s => {
      if (s.group !== "ALL" && s.group !== activeGroup) return false;
      if (s.day === "Sunday" && s.start === 2 && s.code === "EPE G113") return false;
      return true;
    }).map(s => {
      if (s.code === "MDP G111" && s.type.includes("Tutorial")) {
        return {
          day: "Sunday", start: 2, span: 3, group: "ALL",
          code: "MDP G111", type: "Tutorial / Lab", room: "15401-300",
          attendance: true, isSolidMain: true
        };
      }
      if (s.code === "MDP G111" && s.day === "Wednesday" && s.type.includes("Lecture")) {
        return { ...s, cancelled: true };
      }
      if (s.type.includes("Tutorial")) {
        return { ...s, cancelled: true };
      }
      return s;
    });

    const hasSolidSunday = baseSessions.some(s => s.code === "MDP G111" && s.day === "Sunday" && s.start === 2);
    if (!hasSolidSunday) {
      baseSessions.push({
        day: "Sunday", start: 2, span: 3, group: "ALL",
        code: "MDP G111", type: "Tutorial / Lab", room: "15401-300",
        attendance: true, isSolidMain: true
      });
    }

    baseSessions = baseSessions.filter(s => 
      !(s.code === "MDP G111" && s.day === "Monday" && s.type.includes("Tutorial"))
    );
  } else {
    baseSessions = SESSIONS.filter(s => s.group === "ALL" || s.group === activeGroup);
    if (selectedDynamicsSlot && MONDAY_DYNAMICS_SLOTS[selectedDynamicsSlot]) {
      baseSessions.push(MONDAY_DYNAMICS_SLOTS[selectedDynamicsSlot]);
    }
  }

  return baseSessions;
}

function toggleDynamicsSlot(slotKey) {
  triggerHaptic("light");
  selectedDynamicsSlot = (selectedDynamicsSlot === slotKey) ? null : slotKey;
  render();
}

function updateDynamicsBannerUI() {
  const banner = document.getElementById("dynamicsSwitcherBanner");
  if (!banner) return;
  const showBanner = (currentDisplayWeek > 1) && ((activeView === 'week') || (activeView === 'day' && activeDay === 'Monday'));
  banner.style.display = showBanner ? 'flex' : 'none';

  ['1', '2', '3'].forEach(k => {
    const btn = document.getElementById(`dynSlot${k}Btn`);
    if (btn) btn.className = `dyn-pill-btn ${selectedDynamicsSlot === k ? 'active' : ''}`;
  });
}

function updateFirstWeekBannerUI() {
  const banner = document.getElementById("firstWeekBanner");
  if (!banner) return;
  banner.style.display = (currentDisplayWeek === 1 && activeView !== "drive" && activeView !== "guide" && activeView !== "tasks") ? "block" : "none";
}

let toastTimer;
function showRoomDetails(roomCode) {
  triggerHaptic("heavy");
  const roomMeta = ROOM_INFO[roomCode];
  const box = document.getElementById("toastBox");
  
  if (roomMeta) {
    document.getElementById("toastRoomTitle").textContent = roomCode;
    document.getElementById("toastFloorPill").textContent = roomMeta.floor.toUpperCase();
    document.getElementById("toastRoomBody").textContent = `\({roomMeta.name} —\){roomMeta.hall}`;
    const mapLink = BUILDING_MAP_URLS[roomMeta.bldg] || "https://maps.google.com/?q=Faculty+of+Engineering+Cairo+University";
    document.getElementById("toastMapsLink").setAttribute("href", mapLink);
  } else {
    document.getElementById("toastRoomTitle").textContent = roomCode;
    document.getElementById("toastFloorPill").textContent = "FACULTY";
    document.getElementById("toastRoomBody").textContent = "Faculty of Engineering · Giza Campus";
    document.getElementById("toastMapsLink").setAttribute("href", "https://maps.google.com/?q=Faculty+of+Engineering+Cairo+University");
  }

  box.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove("show"), 6000);
}

// --- Roadmap & Modals Logic ---
function openDynamicsRoadmapModal() {
  triggerHaptic("heavy");
  const modal = document.getElementById("roadmapModal");
  const body = document.getElementById("roadmapModalBody");
  const currentAcademicWk = calculateActualAcademicWeek();

  body.innerHTML = `
