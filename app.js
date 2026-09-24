/* ==========================================================================
   CUFE Mechanical Engineering — Batch 30 Application Logic Engine
   ========================================================================== */

// --- تنظيف الكاش القديم فوراً لمنع تعليق النسخ السابقة ---
if (typeof caches !== 'undefined') {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
  });
}

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

// استخدام جايد مادة الكهربية فقط
let WEEKLY_GUIDE_DATA = typeof DEFAULT_WEEKLY_GUIDES !== 'undefined' ? [...DEFAULT_WEEKLY_GUIDES] : [];
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

// دالة جلب الحصص المعتمدة (الجدول الكامل الرسمي دائماً - لا يوجد أي كود لإلغاء أي سكشن)
function getActiveEffectiveSessions() {
  let baseSessions = SESSIONS.filter(s => s.group === "ALL" || s.group === activeGroup);
  if (selectedDynamicsSlot && MONDAY_DYNAMICS_SLOTS[selectedDynamicsSlot]) {
    baseSessions.push(MONDAY_DYNAMICS_SLOTS[selectedDynamicsSlot]);
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
  const showBanner = ((activeView === 'week') || (activeView === 'day' && activeDay === 'Monday'));
  banner.style.display = showBanner ? 'flex' : 'none';

  ['1', '2', '3'].forEach(k => {
    const btn = document.getElementById(`dynSlot${k}Btn`);
    if (btn) btn.className = `dyn-pill-btn ${selectedDynamicsSlot === k ? 'active' : ''}`;
  });
}

let toastTimer;
function showRoomDetails(roomCode) {
  triggerHaptic("heavy");
  const roomMeta = ROOM_INFO[roomCode];
  const box = document.getElementById("toastBox");
  
  if (roomMeta) {
    document.getElementById("toastRoomTitle").textContent = roomCode;
    document.getElementById("toastFloorPill").textContent = roomMeta.floor.toUpperCase();
    document.getElementById("toastRoomBody").textContent = `${roomMeta.name} — ${roomMeta.hall}`;
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
    <div style="font-size:12px;color:var(--text-muted);line-height:1.5;direction:rtl;text-align:right;">
      الخريطة الزمنية الرسمية لمقرر الديناميكا المستوية (EMC G101) مقسمة أسبوع بأسبوع، بالتسليمات ومواعيد الامتحانات.
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;background:var(--surface-alt);padding:8px 12px;border-radius:10px;border:1px solid var(--border);margin-top:4px;">
      <span style="font-size:11px;font-weight:700;color:var(--text-muted);">الأسبوع الأكاديمي الحالي:</span>
      <span style="font-family:'JetBrains Mono';font-size:11.5px;font-weight:800;color:#8b5cf6;">Week ${currentAcademicWk}</span>
    </div>

    <div class="roadmap-timeline">
      ${DYNAMICS_ROADMAP_STEPS.map(step => {
        const isPast = step.week < currentAcademicWk;
        const isCurrent = step.week === currentAcademicWk;
        const stateClass = isPast ? 'is-done' : (isCurrent ? 'is-current' : '');

        return `
          <div class="roadmap-step ${stateClass}" style="--step-color: #8b5cf6; --step-glow: #a78bfa;">
            <div class="roadmap-step-indicator">
              <div class="roadmap-step-circle">${isPast ? '✓' : step.week}</div>
              <div class="roadmap-step-line"></div>
            </div>
            <div class="roadmap-step-card">
              <div class="roadmap-step-head">
                <span class="roadmap-week-tag">WEEK ${step.week} ${isCurrent ? '• 📍 أنت هنا' : ''}</span>
                <span class="roadmap-date-tag">${step.date}</span>
              </div>
              <div class="roadmap-topic-title">${step.title}</div>
              ${step.the !== '—' ? `<span class="roadmap-the-badge">⚡ ${step.the}</span>` : ''}
            </div>
          </div>
        `;
      }).join("")}
    </div>

    <a href="https://docs.google.com/spreadsheets/d/${DYNAMICS_MASTER_SHEET_ID}/edit#gid=807310814" target="_blank" rel="noopener noreferrer" class="capsule-link-btn dyn-theme" style="margin-top:6px;">
      <span>📊 فتح شيت جدول المحاضرات المباشر لجوجل</span>
      <span>↗</span>
    </a>
  `;

  modal.classList.add("open");
}

function closeRoadmapModal() { document.getElementById("roadmapModal").classList.remove("open"); }
document.getElementById("roadmapModal").addEventListener("click", e => { if (e.target.id === "roadmapModal") closeRoadmapModal(); });

function openMaterialsRoadmapModal() {
  triggerHaptic("heavy");
  const modal = document.getElementById("materialsRoadmapModal");
  const body = document.getElementById("materialsRoadmapModalBody");
  const currentAcademicWk = calculateActualAcademicWeek();

  body.innerHTML = `
    <div style="font-size:12px;color:var(--text-muted);line-height:1.5;direction:rtl;text-align:right;">
      الخريطة الرسمية لمقرر علم المواد (MDP G121) متضمنة المحاضرات والسكاشن وتجارب المعمل (Lab) والميدتيرم أسبوع بأسبوع.
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;background:var(--surface-alt);padding:8px 12px;border-radius:10px;border:1px solid var(--border);margin-top:4px;">
      <span style="font-size:11px;font-weight:700;color:var(--text-muted);">الأسبوع الأكاديمي الحالي:</span>
      <span style="font-family:'JetBrains Mono';font-size:11.5px;font-weight:800;color:#f59e0b;">Week ${currentAcademicWk}</span>
    </div>

    <div class="roadmap-timeline">
      ${MATERIALS_ROADMAP_STEPS.map(step => {
        const isPast = step.week < currentAcademicWk;
        const isCurrent = step.week === currentAcademicWk;
        const stateClass = isPast ? 'is-done' : (isCurrent ? 'is-current' : '');

        return `
          <div class="roadmap-step ${stateClass}" style="--step-color: #f59e0b; --step-glow: #fbbf24;">
            <div class="roadmap-step-indicator">
              <div class="roadmap-step-circle">${isPast ? '✓' : step.week}</div>
              <div class="roadmap-step-line"></div>
            </div>
            <div class="roadmap-step-card" style="${step.isMidterm ? 'border-color:#ea580c;background:rgba(234,88,12,0.06);' : ''}">
              <div class="roadmap-step-head">
                <span class="roadmap-week-tag" style="${step.isMidterm ? 'color:#ea580c;' : ''}">WEEK ${step.week} ${isCurrent ? '• 📍 أنت هنا' : ''}</span>
                <span class="roadmap-date-tag">${step.date}</span>
              </div>
              <div class="roadmap-topic-title" style="${step.isMidterm ? 'color:#ea580c;font-weight:800;' : ''}">${step.lecture}</div>
              
              <div class="roadmap-sub-row">
                <div class="roadmap-sub-item">
                  <span class="roadmap-sub-badge">Tutorial</span>
                  <span>${step.tut}</span>
                </div>
                ${step.lab ? `
                  <div class="roadmap-sub-item" style="color:#059669;font-weight:700;">
                    <span class="roadmap-sub-badge" style="border-color:#10b981;background:rgba(16,185,129,0.1);color:#059669;">Lab</span>
                    <span>🔬 ${step.lab}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;

  modal.classList.add("open");
}

function closeMaterialsRoadmapModal() { document.getElementById("materialsRoadmapModal").classList.remove("open"); }
document.getElementById("materialsRoadmapModal").addEventListener("click", e => { if (e.target.id === "materialsRoadmapModal") closeMaterialsRoadmapModal(); });

function openCourseLinksModal(code) {
  triggerHaptic("heavy");
  const modal = document.getElementById("linksModal");
  const title = document.getElementById("linksModalTitle");
  const body = document.getElementById("linksModalBody");

  const data = COURSE_CUSTOM_LINKS[code];
  if (!data) return;

  title.innerHTML = `<span>🔗</span> <span>${data.title}</span>`;
  body.innerHTML = `
    <div style="font-size:12px;color:var(--text-muted);line-height:1.5;direction:rtl;text-align:right;">
      ${data.desc}
    </div>

    <div style="margin-top:2px;">
      <button class="action-btn" style="width:100%;justify-content:center;background:rgba(99, 102, 241, 0.12);color:#6366f1;border-color:#6366f1;" onclick="closeLinksModal();openDynamicsRoadmapModal();">
        <span>🗺️ فتح خريطة المنهج أسبوع بأسبوع (Roadmap)</span>
      </button>
    </div>

    <div class="capsule-box" style="border-left: 4px solid #8b5cf6;">
      <div class="capsule-box-head" style="color:#8b5cf6;">
        <span>📊</span><span>شيتات المتابعة وأعمال السنة والفورمز</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px;">
        ${data.sheets.map(s => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="capsule-link-btn dyn-theme">
            <span>${s.title}</span>
            <span>↗</span>
          </a>
        `).join("")}
      </div>
    </div>

    <div class="capsule-box" style="border-left: 4px solid #2563eb;">
      <div class="capsule-box-head" style="color:#2563eb;">
        <span>👥</span><span>مجتمع المادة وجروبات التواصل</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px;">
        ${data.social.map(s => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="capsule-link-btn">
            <span>${s.title}</span>
            <span>↗</span>
          </a>
        `).join("")}
      </div>
    </div>

    <div class="capsule-box" style="border-left: 4px solid #ef4444;">
      <div class="capsule-box-head" style="color:#ef4444;">
        <span>🎬</span><span>فيديوهات الشرح وقوائم السكاشن</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px;">
        ${data.videos.map(v => `
          <a href="${v.url}" target="_blank" rel="noopener noreferrer" class="capsule-link-btn" style="border-left:3px solid #ef4444;">
            <span style="color:var(--text-main);">${v.title}</span>
            <span style="color:#ef4444;">▶</span>
          </a>
        `).join("")}
      </div>
    </div>
  `;

  modal.classList.add("open");
}

function closeLinksModal() { document.getElementById("linksModal").classList.remove("open"); }
document.getElementById("linksModal").addEventListener("click", e => { if (e.target.id === "linksModal") closeLinksModal(); });

function openCourseCapsule(code) {
  triggerHaptic("heavy");
  const modal = document.getElementById("capsuleModal");
  const modalTitle = document.getElementById("capsuleModalTitle");
  const modalBody = document.getElementById("capsuleModalBody");

  const course = COURSES[code] || { name: code, color: "var(--accent)" };
  const cap = COURSE_CAPSULES[code];

  modalTitle.innerHTML = `<span style="color:${course.color};font-family:'JetBrains Mono';font-size:16px;">${code}</span> — Course Capsule`;

  if (!cap) {
    modalBody.innerHTML = `
      <div style="text-align:center;padding:36px 16px;color:var(--text-muted);display:flex;flex-direction:column;align-items:center;gap:10px;">
        <span style="font-size:36px">⏳</span>
        <b style="color:var(--text-main);font-size:14px;">قريباً جداً...</b>
        <p style="font-size:12px;line-height:1.5;">جاري تجهيز دليل النجاة وتقسيمة درجات مادة ${course.name} من أوائل الدفعة.</p>
      </div>
    `;
  } else {
    modalBody.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid var(--border);">
        <span style="font-size:13px;font-weight:800;color:var(--text-main);">${cap.name}</span>
        <span style="font-size:10px;font-weight:800;padding:2px 7px;border-radius:6px;background:var(--accent-glow);color:var(--accent);border:1px solid var(--accent);">${cap.hours}</span>
      </div>

      <div class="capsule-box" style="border-left: 4px solid var(--accent);">
        <div class="capsule-box-head" style="color:var(--accent);">
          <span>📊</span><span>تقسيمة الدرجات والميدتيرم</span>
        </div>
        <div class="capsule-text">${cap.grading}</div>
      </div>

      <div class="capsule-box" style="border-left: 4px solid #f97316;">
        <div class="capsule-box-head" style="color:#f97316;">
          <span>💡</span><span>خلاصة المادة وسر الـ A+ (نصيحة الدفعة)</span>
        </div>
        <div class="capsule-text">${cap.tips}</div>
      </div>

      ${cap.links && cap.links.length > 0 ? `
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px;">
          <span style="font-size:11px;font-weight:700;color:var(--text-muted);">المصادر والكتب المباشرة:</span>
          ${cap.links.map(l => `
            <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="capsule-link-btn">
              <span>${l.title}</span>
              <span>↗</span>
            </a>
          `).join("")}
        </div>
      ` : ''}
    `;
  }

  modal.classList.add("open");
}

function closeCapsuleModal() { document.getElementById("capsuleModal").classList.remove("open"); }
document.getElementById("capsuleModal").addEventListener("click", e => { if (e.target.id === "capsuleModal") closeCapsuleModal(); });

// --- Google Sheets Sync Engine ---
function parseCSV(text) {
  const lines = text.trim().split(/\r\n|\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.replace(/^"(.*)"$/, '$1').trim());
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
    const row = {};
    headers.forEach((h, i) => {
      let val = values[i] || '';
      val = val.replace(/^"(.*)"$/, '$1').replace(/""/g, '"').trim();
      row[h] = val;
    });
    return row;
  });
}

async function syncFromGoogleSheets() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const [qRes, aRes, bRes, dynRes] = await Promise.all([
      fetch(QUIZZES_CSV_URL, { signal: controller.signal }).catch(() => null),
      fetch(ALERTS_CSV_URL, { signal: controller.signal }).catch(() => null),
      fetch(BUILDINGS_CSV_URL, { signal: controller.signal }).catch(() => null),
      fetch(DYNAMICS_SCHEDULE_CSV_URL, { signal: controller.signal }).catch(() => null)
    ]);
    clearTimeout(timeoutId);

    if (qRes && qRes.ok) {
      const qText = await qRes.text();
      const parsed = parseCSV(qText);
      if (parsed.length > 0) ASSESSMENTS = parsed;
    }
    if (aRes && aRes.ok) {
      const aText = await aRes.text();
      const parsed = parseCSV(aText);
      if (parsed.length > 0) NOTIFICATIONS = parsed;
    }
    if (bRes && bRes.ok) {
      const bText = await bRes.text();
      const parsed = parseCSV(bText);
      parsed.forEach(row => {
        const num = parseInt(row.bldg || row.building);
        if (num && (row.url || row.maps_link || row.link)) {
          BUILDING_MAP_URLS[num] = row.url || row.maps_link || row.link;
        }
      });
    }
    if (dynRes && dynRes.ok) {
      const dynText = await dynRes.text();
      const parsed = parseCSV(dynText);
      if (parsed.length > 3) {
        const liveSteps = parsed.filter(r => r.Week || r.week).map((r, i) => ({
          week: parseInt(r.Week || r.week) || (i + 1),
          title: r.Topic || r.topic || r.Title || r.title || `Lecture ${i+1}`,
          date: r.Date || r.date || '',
          the: r.THE || r.the || '—'
        }));
        if (liveSteps.length > 0) DYNAMICS_ROADMAP_STEPS = liveSteps;
      }
    }
  } catch (e) {
    console.warn("Using offline fallback data.", e);
  } finally {
    initNotifications();
    updateTaskBadge();
    renderDaysBar();
    if (activeView === 'week') renderWeekMatrix();
    else if (activeView === 'day') renderDailyAgenda();
    else if (activeView === 'guide') renderGuideScreen();
    else if (activeView === 'tasks') renderTasksScreen();
  }
}

function getDisplayedDateForDay(dayName) {
  const dayObj = DAYS.find(d => d.full === dayName);
  if (!dayObj) return null;
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - currentDayOfWeek);
  const targetDate = new Date(sunday);
  targetDate.setDate(sunday.getDate() + dayObj.dayIdx);
  return targetDate;
}

function getParsedDateObj(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    const now = new Date();
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
      const parsed = new Date(`${dateStr} ${now.getFullYear()}`);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  } catch (e) {}
  return null;
}

function isAssessmentUpcoming(dateStr) {
  if (!dateStr) return true;
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = getParsedDateObj(dateStr);
    if (!targetDate) return true;
    targetDate.setHours(23, 59, 59, 999);
    return targetDate >= todayStart;
  } catch (e) { return true; }
}

function isAssessmentInCurrentWeek(aDateStr, dayName) {
  if (!aDateStr) return false;
  const displayedDate = getDisplayedDateForDay(dayName);
  if (!displayedDate) return false;
  const targetDate = getParsedDateObj(aDateStr);
  if (!targetDate) return false;
  return targetDate.getDate() === displayedDate.getDate() && targetDate.getMonth() === displayedDate.getMonth();
}

function getActiveSectionAssessments() {
  return ASSESSMENTS.filter(a => (a.group === "ALL" || a.group === activeGroup) && isAssessmentUpcoming(a.date));
}

function getDayAssessments(dayName) {
  return getActiveSectionAssessments().filter(a => a.day === dayName && isAssessmentInCurrentWeek(a.date, dayName));
}

function getExactCountdown(deadlineStr) {
  const target = new Date(deadlineStr);
  if (isNaN(target.getTime())) return { text: "محدد", isUrgent: false, isPassed: false, diff: 0 };
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { text: "انتهى الديدلاين ❌", isUrgent: true, isPassed: true, diff };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  let text = "";
  if (days > 0) text += `${days}d `;
  text += `${hours}h ${minutes}m remaining`;

  const isUrgent = days === 0 || diff <= 48 * 3600 * 1000;
  return { text, isUrgent, isPassed: false, diff };
}

function updateTaskBadge() {
  const badge = document.getElementById("navTaskBadge");
  const activeList = getActiveSectionAssessments();
  const staticCount = (typeof COURSE_STATIC_ASSIGNMENTS !== 'undefined') ? COURSE_STATIC_ASSIGNMENTS.length : 0;
  const totalCount = activeList.length + DYNAMICS_THE_EXAMS.length + staticCount;
  if (totalCount > 0) {
    badge.textContent = totalCount;
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }
}

function getAllEventsForCalendar() {
  const allEvents = [];
  DYNAMICS_THE_EXAMS.forEach(ex => {
    const d = getParsedDateObj(ex.deadline);
    if (d) allEvents.push({ date: d, code: "EMC G101", title: `THE ${ex.no} Deadline (7:00 PM)`, type: "Exam Deadline", color: "#8b5cf6" });
  });
  if (typeof COURSE_STATIC_ASSIGNMENTS !== 'undefined') {
    COURSE_STATIC_ASSIGNMENTS.forEach(asgn => {
      const deadline = asgn.deadlinesByGroup[activeGroup] || asgn.deadlinesByGroup["ME1-01"];
      const d = getParsedDateObj(deadline);
      if (d) allEvents.push({ date: d, code: asgn.code, title: asgn.title, type: "Assignment", color: COURSES[asgn.code]?.hex || '#0284c7' });
    });
  }
  getActiveSectionAssessments().forEach(a => {
    const d = getParsedDateObj(a.date);
    if (d) allEvents.push({ date: d, code: a.code, title: a.title, type: a.type || 'Task', color: COURSES[a.code]?.hex || '#ea580c' });
  });
  return allEvents;
}

// ==========================================================================
// Tasks Hub Controller
// ==========================================================================
function getAllCombinedTasks() {
  const list = [];
  
  if (typeof COURSE_STATIC_ASSIGNMENTS !== 'undefined') {
    COURSE_STATIC_ASSIGNMENTS.forEach(asgn => {
      const deadline = asgn.deadlinesByGroup[activeGroup] || asgn.deadlinesByGroup["ME1-01"];
      const cd = getExactCountdown(deadline);
      const isDone = completedTasks.includes(asgn.id);

      let priority = "scheduled";
      if (isDone) priority = "done";
      else if (cd.isUrgent) priority = "due-soon";
      else if (cd.diff <= 7 * 24 * 3600 * 1000) priority = "upcoming";

      list.push({
        id: asgn.id,
        code: asgn.code,
        title: asgn.title,
        type: asgn.type,
        deadline: deadline,
        start: asgn.start,
        countdown: cd,
        priority: priority,
        desc: asgn.desc,
        note: asgn.note,
        files: [
          { name: "MTH_G102_Linear_Assignment_1.pdf", url: asgn.folderUrl, size: "Drive Folder" }
        ],
        submissionUrl: asgn.folderUrl,
        bonusPolicy: "تسليم ورقي مع بداية السكشن للمعيد.",
        isDone: isDone
      });
    });
  }

  DYNAMICS_THE_EXAMS.forEach(ex => {
    const cd = getExactCountdown(ex.deadline);
    const id = `the-${ex.no}`;
    const isDone = completedTasks.includes(id);
    
    let priority = "scheduled";
    if (isDone) priority = "done";
    else if (cd.isUrgent) priority = "due-soon";
    else if (cd.diff <= 7 * 24 * 3600 * 1000) priority = "upcoming";

    list.push({
      id: id,
      code: "EMC G101",
      title: `Take-Home Exam ${ex.no} — Model (${ex.name})`,
      type: "Take-Home Exam",
      deadline: ex.deadline,
      start: ex.start,
      countdown: cd,
      priority: priority,
      desc: ex.desc || "حل المسائل بدقة وبخطوات واضحة على ورقة النموذج الرسمية.",
      note: ex.note || "Submit as PDF on Google Form before deadline.",
      files: [
        { name: `Model_${ex.name}_Problems.pdf`, url: ex.examSheet, size: "1.2 MB" },
        { name: "Dynamics_Formula_Sheet.pdf", url: "https://drive.google.com/drive/folders/1fbGTWzv6phQayo0PzQAxfRg7v1kyk5_Y", size: "856 KB" }
      ],
      submissionUrl: "https://sites.google.com/eng.cu.edu.eg/planedynamics100",
      bonusPolicy: "• تسليم في أول 12 ساعة ⬅️ +10% بونص\n• أول 48 ساعة ⬅️ +5% بونص\n• تأخير عن الديدلاين ⬅️ خصم 10% لكل أسبوع تأخير.",
      isDone: isDone
    });
  });

  getActiveSectionAssessments().forEach((a, idx) => {
    const cd = getExactCountdown(a.date);
    const id = `sheet-task-${idx}`;
    const isDone = completedTasks.includes(id);

    let priority = "scheduled";
    if (isDone) priority = "done";
    else if (cd.isUrgent) priority = "due-soon";
    else if (cd.diff <= 7 * 24 * 3600 * 1000) priority = "upcoming";

    list.push({
      id: id,
      code: a.code || "GENERAL",
      title: a.title || "Academic Assignment",
      type: a.type || "Assignment",
      deadline: a.date,
      start: a.date,
      countdown: cd,
      priority: priority,
      desc: a.desc || "تسليم الواجب المطلوب في موعده المحدد.",
      note: "Note: Follow instructor submission instructions.",
      files: [],
      submissionUrl: MAIN_SEMESTER_DRIVE,
      bonusPolicy: "حسب تعليمات معيد ومحاضر المادة.",
      isDone: isDone
    });
  });

  return list;
}

function renderTasksScreen() {
  const container = document.getElementById("viewContainer");
  const allTasks = getAllCombinedTasks();

  const totalTasks = allTasks.length;
  const dueSoonTasks = allTasks.filter(t => !t.isDone && t.priority === 'due-soon').length;
  const thisWeekTasks = allTasks.filter(t => !t.isDone && (t.priority === 'due-soon' || t.priority === 'upcoming')).length;

  let filtered = allTasks;

  if (tasksSearchQuery.trim()) {
    const q = tasksSearchQuery.toLowerCase();
    filtered = filtered.filter(t => 
      t.code.toLowerCase().includes(q) || 
      t.title.toLowerCase().includes(q) || 
      t.desc.toLowerCase().includes(q) ||
      t.note.toLowerCase().includes(q)
    );
  }

  if (activeTaskFilter === 'due-soon') {
    filtered = filtered.filter(t => !t.isDone && t.priority === 'due-soon');
  } else if (activeTaskFilter === 'this-week') {
    filtered = filtered.filter(t => !t.isDone && (t.priority === 'due-soon' || t.priority === 'upcoming'));
  } else if (activeTaskFilter === 'completed') {
    filtered = filtered.filter(t => t.isDone);
  }

  if (isFocusModeActive) {
    filtered = filtered.filter(t => !t.isDone).sort((a, b) => {
      const da = new Date(a.deadline).getTime() || 0;
      const db = new Date(b.deadline).getTime() || 0;
      return da - db;
    }).slice(0, 3);
  }

  const dueSoonList = filtered.filter(t => !t.isDone && t.priority === 'due-soon');
  const upcomingList = filtered.filter(t => !t.isDone && (t.priority === 'upcoming' || t.priority === 'scheduled'));
  const completedList = filtered.filter(t => t.isDone);

  container.innerHTML = `
    <div class="tasks-hub-container">
      <div class="view-back-bar">
        <button class="view-back-btn" onclick="setView('week')">
          <span>◀</span><span>الرجوع للجدول</span>
        </button>
        <span style="font-size:12px;font-weight:800;color:var(--text-muted);">TASKS & DEADLINES</span>
      </div>

      <div class="tasks-main-header">
        <div class="tasks-header-left">
          <div class="tasks-icon-box">📋</div>
          <div>
            <div class="tasks-header-title">Tasks & Deadlines</div>
            <div class="tasks-header-subtitle">Stay on track, build your future 🎯</div>
          </div>
        </div>
        <button class="focus-mode-btn ${isFocusModeActive ? 'active' : ''}" onclick="toggleFocusMode()">
          <span>⚡</span>
          <span>Focus Mode</span>
        </button>
      </div>

      <div class="tasks-summary-bar">
        <div class="summary-stat-chip">
          <span class="summary-stat-icon">📑</span>
          <div class="summary-stat-info">
            <span class="summary-stat-num">${totalTasks}</span>
            <span class="summary-stat-txt">Total Tasks</span>
          </div>
        </div>

        <div class="summary-stat-chip">
          <span class="summary-stat-icon">📅</span>
          <div class="summary-stat-info">
            <span class="summary-stat-num" style="color:#f59e0b;">${thisWeekTasks}</span>
            <span class="summary-stat-txt">Due This Week</span>
          </div>
        </div>

        <div class="summary-stat-chip">
          <span class="summary-stat-icon">⏳</span>
          <div class="summary-stat-info">
            <span class="summary-stat-num" style="color:#ef4444;">${dueSoonTasks}</span>
            <span class="summary-stat-txt">Due Soon</span>
          </div>
        </div>
      </div>

      <div class="tasks-search-row">
        <div class="tasks-search-input-box">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" placeholder="Search tasks, subjects, or notes..." value="${tasksSearchQuery}" oninput="handleTasksSearch(this.value)">
        </div>
        <button class="tasks-cal-trigger-btn" onclick="openMonthCalendarModal()" title="Open Interactive Calendar">
          📅
        </button>
      </div>

      <div class="subject-pill-filters">
        <button class="sub-filter-pill ${activeTaskFilter === 'all' ? 'active' : ''}" onclick="setTaskFilterTab('all')">All</button>
        <button class="sub-filter-pill ${activeTaskFilter === 'due-soon' ? 'active' : ''}" onclick="setTaskFilterTab('due-soon')">🔴 Due Soon</button>
        <button class="sub-filter-pill ${activeTaskFilter === 'this-week' ? 'active' : ''}" onclick="setTaskFilterTab('this-week')">📅 This Week</button>
        <button class="sub-filter-pill ${activeTaskFilter === 'completed' ? 'active' : ''}" onclick="setTaskFilterTab('completed')">🟢 Completed</button>
      </div>

      <div class="tasks-stream">
        ${dueSoonList.length > 0 ? `
          <div>
            <div class="task-section-head">
              <div class="task-section-title-wrap" style="color:#ef4444;">
                <span>🔴</span><span>Due Soon</span>
              </div>
              <span class="task-section-count">${dueSoonList.length} tasks</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${dueSoonList.map(task => renderCompactTaskCardHtml(task)).join("")}
            </div>
          </div>
        ` : ''}

        ${upcomingList.length > 0 ? `
          <div>
            <div class="task-section-head">
              <div class="task-section-title-wrap" style="color:#f97316;">
                <span>🟠</span><span>Upcoming</span>
              </div>
              <span class="task-section-count">${upcomingList.length} tasks</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${upcomingList.map(task => renderCompactTaskCardHtml(task)).join("")}
            </div>
          </div>
        ` : ''}

        ${completedList.length > 0 ? `
          <div>
            <div class="task-section-head">
              <div class="task-section-title-wrap" style="color:#10b981;">
                <span>🟢</span><span>Completed</span>
              </div>
              <span class="task-section-count">${completedList.length} tasks</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;opacity:0.8;">
              ${completedList.map(task => renderCompactTaskCardHtml(task)).join("")}
            </div>
          </div>
        ` : ''}

        ${filtered.length === 0 ? `
          <div style="text-align:center;padding:40px 16px;background:var(--surface);border-radius:18px;border:1px dashed var(--border);color:var(--text-muted);font-size:12.5px;">
            ✨ لا توجد مهام مطابقة للبحث أو الفلتر حالياً
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderCompactTaskCardHtml(task) {
  const course = COURSES[task.code] || { name: task.code, color: "var(--accent)", hex: "#0284c7" };
  
  const sObj = new Date(task.start);
  const formattedStart = !isNaN(sObj.getTime()) 
    ? `${sObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${sObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
    : '';

  const dObj = new Date(task.deadline);
  const formattedEnd = !isNaN(dObj.getTime()) 
    ? `${dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${dObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
    : task.deadline;

  return `
    <div class="compact-task-card" style="--c: ${course.color};" onclick="openTaskDetails('${task.id}')">
      <div class="compact-task-top">
        <span class="compact-sub-pill">${task.code}</span>
        <span class="compact-priority-badge ${task.priority}">
          ${task.isDone ? '✓ Completed' : (task.priority === 'due-soon' ? '🔴 Due Soon' : (task.priority === 'upcoming' ? '🟠 Upcoming' : '🔵 Scheduled'))}
        </span>
      </div>

      <div class="compact-task-title">${task.title}</div>

      <div class="compact-task-meta" style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px;">
        <div style="display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono', monospace;font-size:11px;background:var(--surface-alt);padding:4px 8px;border-radius:8px;border:1px solid var(--border);">
          ${formattedStart ? `
            <span style="color:#10b981;font-weight:700;">${formattedStart}</span>
            <span style="color:var(--text-subtle);font-weight:800;">→</span>
          ` : ''}
          <span style="color:var(--text-main);font-weight:700;">${formattedEnd}</span>
        </div>

        <span style="font-family:'JetBrains Mono', monospace;font-size:11px;font-weight:800;color:${task.countdown.isUrgent ? '#ef4444' : 'var(--accent)'};">
          ⏳ ${task.countdown.text}
        </span>
      </div>

      ${task.note ? `
        <div class="compact-task-note" style="margin-top:2px;">
          <span class="txt">📝 ${task.note}</span>
          <span style="font-size:10px;color:var(--accent);font-weight:800;flex-shrink:0;">تفاصيل ↗</span>
        </div>
      ` : ''}
    </div>
  `;
}

function handleTasksSearch(val) { tasksSearchQuery = val; renderTasksScreen(); }
function setTaskFilterTab(tab) { triggerHaptic("light"); activeTaskFilter = tab; renderTasksScreen(); }
function toggleFocusMode() { triggerHaptic("heavy"); isFocusModeActive = !isFocusModeActive; renderTasksScreen(); }

function openTaskDetails(taskId) {
  triggerHaptic("heavy");
  const allTasks = getAllCombinedTasks();
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return;

  currentDetailedTask = task;
  const overlay = document.getElementById("taskDetailsOverlay");
  const content = document.getElementById("taskDetailsContent");
  const course = COURSES[task.code] || { name: task.code, color: "var(--accent)", instructor: "CUFE Faculty" };

  const dObj = new Date(task.deadline);
  const formattedDate = !isNaN(dObj.getTime()) ? dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : task.deadline;
  const formattedTime = !isNaN(dObj.getTime()) ? dObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

  const sObj = new Date(task.start);
  const formattedStartDate = !isNaN(sObj.getTime()) ? sObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const formattedStartTime = !isNaN(sObj.getTime()) ? sObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

  content.innerHTML = `
    <div class="details-card-hero" style="--c: ${course.color};">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="compact-sub-pill" style="font-size:11px;">${task.code}</span>
        <span class="compact-priority-badge ${task.priority}" style="font-size:10.5px;">
          ${task.isDone ? '✓ Completed' : (task.priority === 'due-soon' ? '🔴 Due Soon' : 'Upcoming')}
        </span>
      </div>

      <div style="font-size:17px;font-weight:800;color:var(--text-main);line-height:1.35;">${task.title}</div>
      <div style="font-size:12px;color:var(--text-muted);font-weight:600;">${course.name}</div>

      <div class="details-time-strip" style="flex-direction:column;gap:6px;align-items:flex-start;">
        ${formattedStartDate ? `
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:10.5px;font-weight:700;color:#10b981;">🟢 وقت النزول والبدء:</span>
            <b style="font-size:11.5px;color:var(--text-main);">${formattedStartDate} • ${formattedStartTime}</b>
          </div>
        ` : ''}
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:10.5px;font-weight:700;color:#ef4444;">🔴 الديدلاين النهائي:</span>
          <b style="font-size:11.5px;color:var(--text-main);">${formattedDate} • ${formattedTime}</b>
        </div>
        <div style="font-size:12px;font-weight:800;color:#ef4444;margin-top:2px;">⏳ ${task.countdown.text}</div>
      </div>

      <div class="details-blocks-grid">
        <div class="details-meta-block">
          <span style="color:var(--text-muted);font-weight:700;">Subject</span>
          <b style="color:var(--text-main);">${task.code}</b>
        </div>
        <div class="details-meta-block">
          <span style="color:var(--text-muted);font-weight:700;">Instructor</span>
          <b style="color:var(--text-main);">${course.instructor || 'Staff'}</b>
        </div>
        <div class="details-meta-block">
          <span style="color:var(--text-muted);font-weight:700;">Type</span>
          <b style="color:var(--accent);">${task.type}</b>
        </div>
      </div>
    </div>

    <div class="details-section-box">
      <div class="details-section-title"><span>📋</span><span>Task Instructions & Notes</span></div>
      <div style="line-height:1.55;color:var(--text-main);">${task.desc}</div>
      ${task.note ? `<div style="background:var(--surface-alt);padding:8px 12px;border-radius:10px;border-left:3.5px solid var(--accent);margin-top:4px;"><b>Note:</b> ${task.note}</div>` : ''}
    </div>

    <div class="details-section-box" style="border-left:4px solid #10b981;">
      <div class="details-section-title" style="color:#10b981;"><span>💡</span><span>Bonus & Submission Policy</span></div>
      <div style="line-height:1.5;color:var(--text-main);white-space:pre-line;direction:rtl;text-align:right;">${task.bonusPolicy}</div>
    </div>

    ${task.files && task.files.length > 0 ? `
      <div class="details-section-box">
        <div class="details-section-title"><span>📎</span><span>Files & Resources (${task.files.length})</span></div>
        <div class="details-files-list">
          ${task.files.map(f => `
            <a href="${f.url}" target="_blank" rel="noopener noreferrer" class="details-file-item">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:16px;">📄</span>
                <div>
                  <div>${f.name}</div>
                  <span style="font-size:9.5px;color:var(--text-muted);">${f.size}</span>
                </div>
              </div>
              <span style="color:var(--accent);font-size:12px;">تحميل ↗</span>
            </a>
          `).join("")}
        </div>
      </div>
    ` : ''}

    <div class="details-section-box">
      <div class="details-section-title"><span>🔗</span><span>Submission Portal</span></div>
      <a href="${task.submissionUrl}" target="_blank" rel="noopener noreferrer" class="action-btn" style="width:100%;justify-content:center;height:38px;color:#8b5cf6;border-color:#8b5cf6;background:var(--surface-alt);">
        <span>فتح رابط تسليم النموذج (Google Form / Blackboard)</span>
        <span>↗</span>
      </a>
    </div>

    <button class="mark-done-btn" onclick="toggleTaskCompleted('${task.id}')">
      <span>${task.isDone ? '↩ إلغاء الإكمال والتفعيل' : '✓ Mark as Done (تم إكمال المهمة)'}</span>
    </button>
  `;

  overlay.classList.add("open");
}

function closeTaskDetails() {
  triggerHaptic("light");
  document.getElementById("taskDetailsOverlay").classList.remove("open");
}

function toggleTaskCompleted(taskId) {
  triggerHaptic("heavy");
  if (completedTasks.includes(taskId)) {
    completedTasks = completedTasks.filter(id => id !== taskId);
  } else {
    completedTasks.push(taskId);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  }
  localStorage.setItem("cufe_completed_tasks", JSON.stringify(completedTasks));
  closeTaskDetails();
  renderTasksScreen();
}

// Full Month Calendar
function openMonthCalendarModal() {
  triggerHaptic("heavy");
  document.getElementById("fullMonthCalendarModal").classList.add("open");
  renderCalendarMonthGrid();
}

function closeMonthCalendarModal() {
  document.getElementById("fullMonthCalendarModal").classList.remove("open");
}
document.getElementById("fullMonthCalendarModal").addEventListener("click", e => {
  if (e.target.id === "fullMonthCalendarModal") closeMonthCalendarModal();
});

function changeCalendarMonth(delta) {
  triggerHaptic("light");
  calViewDate.setMonth(calViewDate.getMonth() + delta);
  renderCalendarMonthGrid();
}

function renderCalendarMonthGrid() {
  const monthNameElem = document.getElementById("calCurrentMonthName");
  const grid = document.getElementById("fullCalendarGrid");
  const detailsBox = document.getElementById("calDayEventDetails");
  detailsBox.style.display = "none";

  const year = calViewDate.getFullYear();
  const month = calViewDate.getMonth();
  monthNameElem.textContent = calViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const now = new Date();
  const isThisMonth = (now.getFullYear() === year && now.getMonth() === month);

  let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="cal-day-name">${d}</div>`).join("");
  const allEvents = getAllEventsForCalendar();

  for (let i = firstDay - 1; i >= 0; i--) {
    const pDay = daysInPrevMonth - i;
    html += `<div class="cal-day-cell other-month"><span class="cal-day-num">${pDay}</span></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const dayEvents = allEvents.filter(ev => ev.date.getFullYear() === year && ev.date.getMonth() === month && ev.date.getDate() === d);
    const isToday = isThisMonth && (now.getDate() === d);
    const hasEv = dayEvents.length > 0;

    html += `
      <div class="cal-day-cell ${isToday ? 'today' : ''} ${hasEv ? 'has-event' : ''}" onclick="showCalendarDayDetails('${cellDate.toISOString()}')">
        <span class="cal-day-num">${d}</span>
        <div class="cal-dots-row">
          ${dayEvents.map(ev => `<span class="cal-event-dot" style="background:${ev.color};" title="${ev.code}: ${ev.title}"></span>`).join("")}
        </div>
      </div>
    `;
  }

  grid.innerHTML = html;
}

function showCalendarDayDetails(dateIso) {
  triggerHaptic("light");
  const detailsBox = document.getElementById("calDayEventDetails");
  const targetDate = new Date(dateIso);
  const formatted = targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const y = targetDate.getFullYear();
  const m = targetDate.getMonth();
  const d = targetDate.getDate();

  const events = getAllEventsForCalendar().filter(ev => {
    return ev.date.getFullYear() === y && ev.date.getMonth() === m && ev.date.getDate() === d;
  });

  if (!events || events.length === 0) {
    detailsBox.innerHTML = `
      <div style="font-size:12px;color:var(--text-muted);display:flex;justify-content:space-between;align-items:center;">
        <span>📅 ${formatted}</span>
        <span>لا توجد تسليمات في هذا اليوم</span>
      </div>
    `;
  } else {
    detailsBox.innerHTML = `
      <div style="font-size:12px;font-weight:800;color:var(--text-main);margin-bottom:6px;">
        📅 ${formatted} (${events.length} Events)
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${events.map(ev => `
          <div style="background:var(--surface);border:1px solid var(--border);border-left:3.5px solid ${ev.color};padding:6px 10px;border-radius:8px;font-size:11.5px;">
            <b style="color:${ev.color};font-family:'JetBrains Mono';">${ev.code}</b> — <span>${ev.title}</span>
            <span style="font-size:9.5px;color:var(--text-muted);display:block;margin-top:2px;">Type: ${ev.type}</span>
          </div>
        `).join("")}
      </div>
    `;
  }
  detailsBox.style.display = "block";
}

function initNotifications() {
  const dot = document.getElementById("navNotifDot");
  const readIds = JSON.parse(localStorage.getItem("cufe_read_notifs") || "[]");
  const hasUnread = NOTIFICATIONS.some(n => !readIds.includes(n.id));
  dot.style.display = hasUnread ? "block" : "none";

  const list = document.getElementById("notifList");
  list.innerHTML = NOTIFICATIONS.map(n => `
    <div class="modal-item">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:9.5px;font-weight:800;color:var(--accent)">${n.tag || 'Notice'}</span>
        <span style="font-family:'JetBrains Mono';font-size:10px;color:var(--text-muted)">${n.date || ''}</span>
      </div>
      <div style="font-size:13px;font-weight:700;color:var(--text-main)">${n.title || ''}</div>
      <div style="font-size:11.5px;color:var(--text-muted)">${n.body || ''}</div>
    </div>
  `).join("");
}

function openNotifModal() {
  triggerHaptic("heavy");
  document.getElementById("notifModal").classList.add("open");
  const allIds = NOTIFICATIONS.map(n => n.id);
  localStorage.setItem("cufe_read_notifs", JSON.stringify(allIds));
  document.getElementById("navNotifDot").style.display = "none";
}

function closeNotifModal() { document.getElementById("notifModal").classList.remove("open"); }
document.getElementById("notifModal").addEventListener("click", e => { if (e.target.id === "notifModal") closeNotifModal(); });

function updateAcademicCalendarInfo() {
  const now = new Date();
  document.getElementById("fullDateDisplay").textContent = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const badge = document.getElementById("academicWeekBadge");
  badge.textContent = `Academic Week ${currentDisplayWeek}`;
  selectedGuideWeek = `Week ${currentDisplayWeek}`;
}

function updateDayProgressBar() {
  const progressBox = document.getElementById("dayProgressContainer");
  const barFill = document.getElementById("dayProgressBar");
  const label = document.getElementById("dayProgressLabel");
  const remaining = document.getElementById("dayProgressRemaining");
  
  if (activeView === "drive" || activeView === "guide" || activeView === "tasks") {
    if (progressBox) progressBox.style.display = "none";
    return;
  }
  if (progressBox) progressBox.style.display = "flex";

  const now = new Date();
  const dayIndex = now.getDay();
  if (dayIndex === 5 || dayIndex === 6) {
    label.textContent = "Weekend Chill";
    remaining.textContent = "Enjoy your weekend! ☕";
    barFill.style.width = "100%";
    return;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startDayMin = 8 * 60;
  const endDayMin = 17 * 60;
  
  let percentage = 0;
  if (currentMinutes <= startDayMin) {
    percentage = 0;
    label.textContent = "Day Progress: 0%";
    remaining.textContent = "Classes start at 8:00 AM ☀️";
  } else if (currentMinutes >= endDayMin) {
    percentage = 100;
    label.textContent = "Day Completed: 100%";
    remaining.textContent = "Great work today! 👏";
  } else {
    percentage = Math.round(((currentMinutes - startDayMin) / (endDayMin - startDayMin)) * 100);
    label.textContent = `Day Progress: ${percentage}%`;
    const effSessions = getActiveEffectiveSessions().filter(s => s.day === DAYS[dayIndex].full);
    const leftCount = effSessions.filter(s => parseMinutes(TIME_ENDS[s.start + s.span - 1]) > currentMinutes).length;
    remaining.textContent = leftCount > 0 ? `${leftCount} class${leftCount > 1 ? 'es' : ''} left today` : "Classes finished for today 🎉";
  }
  barFill.style.width = `${percentage}%`;
}

function updateLiveTracker() {
  const now = new Date();
  document.getElementById("liveClock").textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const dot = document.getElementById("liveDot");
  const text = document.getElementById("liveText");

  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startZero = new Date(ACADEMIC_YEAR_START.getFullYear(), ACADEMIC_YEAR_START.getMonth(), ACADEMIC_YEAR_START.getDate());
  const diffDays = Math.round((startZero - todayZero) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    dot.className = "live-indicator idle";
    text.innerHTML = `Summer Vacation · <strong>Starts in ${diffDays}d (19 Sep 2026)</strong>`;
    updateDayProgressBar();
    return;
  }

  const dayIndex = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (dayIndex === 5 || dayIndex === 6) {
    dot.className = "live-indicator idle";
    text.innerHTML = "Weekend · <strong>No classes scheduled today</strong>";
    updateDayProgressBar();
    return;
  }

  const todayName = DAYS[dayIndex].full;
  const effectiveSessions = getActiveEffectiveSessions();
  const todaySessions = effectiveSessions.filter(s => s.day === todayName).sort((a, b) => a.start - b.start);

  if (todaySessions.length === 0) {
    dot.className = "live-indicator idle";
    text.innerHTML = `No classes scheduled today (${todayName})`;
    updateDayProgressBar();
    return;
  }

  let activeSession = null;
  let nextSession = null;

  for (const s of todaySessions) {
    const startMin = parseMinutes(TIME_STARTS[s.start]);
    const endMin = parseMinutes(TIME_ENDS[s.start + s.span - 1]);

    if (currentMinutes >= startMin && currentMinutes < endMin) {
      activeSession = { ...s, remaining: endMin - currentMinutes };
      break;
    } else if (currentMinutes < startMin) {
      if (!nextSession) nextSession = { ...s, wait: startMin - currentMinutes };
    }
  }

  if (activeSession) {
    dot.className = "live-indicator";
    text.innerHTML = `Now: <strong>${activeSession.code}</strong> (${activeSession.remaining}m left)`;
  } else if (nextSession) {
    dot.className = "live-indicator idle";
    text.innerHTML = `Next: <strong>${nextSession.code}</strong> in ${nextSession.wait}m`;
  } else {
    dot.className = "live-indicator idle";
    text.innerHTML = `Classes finished for ${todayName}`;
  }
  
  updateDayProgressBar();
}

function exportToCalendar() {
  triggerHaptic("heavy");
  const effectiveSessions = getActiveEffectiveSessions();
  let ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Cairo University//ME1 Schedule//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    `X-WR-CALNAME:CUFE ME1 (${activeGroup})`,"X-WR-TIMEZONE:Africa/Cairo"
  ];
  const rruleDays = { "Sunday": "SU", "Monday": "MO", "Tuesday": "TU", "Wednesday": "WE", "Thursday": "TH" };
  const dayOffsets = { "Sunday": 1, "Monday": 2, "Tuesday": 3, "Wednesday": 4, "Thursday": 5 };

  effectiveSessions.forEach((s, idx) => {
    const sTime = TIME_STARTS[s.start].replace(":", "") + "00";
    const eTime = TIME_ENDS[s.start + s.span - 1].replace(":", "") + "00";
    ics.push("BEGIN:VEVENT");
    ics.push(`UID:cufe-me1-${activeGroup}-${idx}@eng.cu.edu.eg`);
    ics.push(`DTSTART;TZID=Africa/Cairo:202609${19 + dayOffsets[s.day]}T${sTime}`);
    ics.push(`DTEND;TZID=Africa/Cairo:202609${19 + dayOffsets[s.day]}T${eTime}`);
    ics.push(`RRULE:FREQ=WEEKLY;BYDAY=${rruleDays[s.day]}`);
    ics.push(`SUMMARY:${s.code} - ${s.type}`);
    ics.push(`LOCATION:${s.room}`);
    ics.push("END:VEVENT");
  });
  ics.push("END:VCALENDAR");

  const blob = new Blob([ics.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `CUFE_ME1_${activeGroup}_Schedule.ics`;
  a.click();
}

function renderDailyAgenda() {
  const container = document.getElementById("viewContainer");
  const effectiveSessions = getActiveEffectiveSessions();
  const daySessions = effectiveSessions.filter(s => s.day === activeDay).sort((a, b) => a.start - b.start);

  const dayTasks = getDayAssessments(activeDay);
  let html = '';

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isSelectedDayToday = (activeDay === todayDayName);

  let liveSession = null;
  let upcomingSession = null;

  if (isSelectedDayToday) {
    for (const s of daySessions) {
      const sStartMin = parseMinutes(TIME_STARTS[s.start]);
      const sEndMin = parseMinutes(TIME_ENDS[s.start + s.span - 1]);
      if (currentMinutes >= sStartMin && currentMinutes < sEndMin) {
        liveSession = { ...s, remaining: sEndMin - currentMinutes };
        break;
      } else if (currentMinutes < sStartMin && !upcomingSession) {
        upcomingSession = { ...s, wait: sStartMin - currentMinutes };
      }
    }
  }

  let targetHeroSession = liveSession || upcomingSession;
  if (!targetHeroSession && daySessions.length > 0) {
    targetHeroSession = daySessions[0];
  }

  if (targetHeroSession) {
    const heroCourse = COURSES[targetHeroSession.code] || { name: targetHeroSession.code, color: "var(--accent)", hex: "#0284c7" };
    const isLive = !!liveSession;
    const heroGlowColor = heroCourse.hex || "#0284c7";
    html += `
      <div class="up-next-hero" style="background: linear-gradient(135deg, ${heroGlowColor}18 0%, var(--surface) 100%); border: 1.5px solid ${heroGlowColor}50; box-shadow: 0 10px 28px ${heroGlowColor}22;">
        <div class="up-next-top">
          <span class="up-next-badge ${isLive ? 'is-live' : 'is-upcoming'}">
            ${isLive ? '🔴 LIVE NOW' : '⚡ UP NEXT'}
          </span>
          <span class="up-next-time-range">${TIME_STARTS[targetHeroSession.start]} – ${TIME_ENDS[targetHeroSession.start + targetHeroSession.span - 1]}</span>
        </div>
        <div class="up-next-title">${targetHeroSession.code} — ${heroCourse.name}</div>
        <div class="up-next-bottom">
          <div class="up-next-room-pill" onclick="showRoomDetails('${targetHeroSession.room}')">📍 ${targetHeroSession.room} ↗</div>
          <span class="up-next-type-tag">${targetHeroSession.isDynSec ? 'Tutorial' : targetHeroSession.type}</span>
          <span style="margin-right:auto;font-family:'JetBrains Mono';font-size:11px;font-weight:700;color:${isLive ? '#ef4444' : 'var(--accent)'}">
            ${isLive ? `${liveSession.remaining}m left` : (upcomingSession ? `starts in ${upcomingSession.wait}m` : 'Next Class')}
          </span>
        </div>
      </div>
    `;
  }

  html += `<div class="timeline-wrap" id="swipeArea">`;

  if (daySessions.length === 0) {
    html += `<div style="background:var(--surface);border:1px dashed var(--border);border-radius:16px;padding:36px;text-align:center;color:var(--text-muted)"><h3>No classes scheduled for ${activeDay}</h3></div></div>`;
    container.innerHTML = html;
    return;
  }

  let maxEndSoFar = 0;
  let laserRendered = false;

  for (let i = 0; i < daySessions.length; i++) {
    const s = daySessions[i];
    const sStartMin = parseMinutes(TIME_STARTS[s.start]);
    const sEndMin = parseMinutes(TIME_ENDS[s.start + s.span - 1]);
    const course = COURSES[s.code] || { name: s.code, color: "var(--c-mth)", hex: "#0284c7" };
    const isShared = s.group === "ALL";
    const isDynamics = (s.code === "EMC G101");
    const isMaterials = (s.code === "MDP G121");
    const hasCustomLinks = !!COURSE_CUSTOM_LINKS[s.code];

    if (isSelectedDayToday && !laserRendered && currentMinutes < sStartMin) {
      const nowStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      html += `
        <div class="realtime-laser-row">
          <span class="realtime-laser-badge">${nowStr} NOW</span>
          <div class="realtime-laser-line"></div>
        </div>
      `;
      laserRendered = true;
    }

    if (i > 0 && s.start > maxEndSoFar) {
      const gapMins = (s.start - maxEndSoFar) * 50;
      html += `
        <div class="break-item cascade-item" style="animation-delay:${i * 0.04}s">
          <div class="break-spacer"></div>
          <div class="break-card-widget">
            <span>☕ Free Break Period</span>
            <span style="font-family:'JetBrains Mono';font-size:10.5px;color:var(--accent);">${gapMins} mins</span>
          </div>
        </div>`;
    }
    maxEndSoFar = Math.max(maxEndSoFar, s.start + s.span);

    const isCurrentActive = isSelectedDayToday && (currentMinutes >= sStartMin && currentMinutes < sEndMin);
    const isDimmed = highlightedCourse && highlightedCourse !== s.code;
    const isHighlighted = highlightedCourse === s.code;
    const hasTask = dayTasks.some(t => t.code === s.code);

    html += `
      <div class="timeline-item cascade-item" style="animation-delay:${i * 0.05}s">
        <div class="time-col">
          <div class="time-start">${TIME_STARTS[s.start]}</div>
          <div class="time-end">${TIME_ENDS[s.start + s.span - 1]}</div>
          <span class="time-dur">${s.span * 50}m</span>
        </div>
        <div class="rail"><div class="rail-dot" style="--c: ${isCurrentActive ? '#ef4444' : course.color}"></div><div class="rail-line"></div></div>
        <div class="timeline-card ${isCurrentActive ? 'is-live-card' : ''} ${s.attendance ? 'has-attendance-check' : ''} ${isDimmed ? 'dimmed' : ''} ${isHighlighted ? 'highlighted' : ''}" style="--c: ${course.color}; border-left: 4.5px solid ${isCurrentActive ? '#ef4444' : course.color}">
          
          <div class="card-top">
            <span style="font-family:'JetBrains Mono';font-size:13px;font-weight:800;color:${isCurrentActive ? '#ef4444' : course.color}">${s.code}</span>
            <div class="badges-group">
              ${isCurrentActive ? '<span class="badge-live-now">🔴 LIVE NOW</span>' : ''}
              ${hasTask ? `<span class="badge" style="background:var(--quiz-color);color:#fff;font-weight:800;cursor:pointer" onclick="setView('tasks')">⚡ QUIZ</span>` : ''}
              ${s.attendance ? '<span class="badge-attendance">⚠️ ATTENDANCE</span>' : ''}
              <span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:5px;background:var(--surface-alt);color:var(--text-muted)">${s.isDynSec ? 'SEC' : (isShared ? 'LEC' : 'SEC')}</span>
            </div>
          </div>

          <div class="card-title">${course.name}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-top:6px;">
            <div class="card-room-pill" onclick="showRoomDetails('${s.room}')">📍 ${s.room} ↗</div>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              ${isDynamics ? `<button class="capsule-pill-btn roadmap-pill" onclick="openDynamicsRoadmapModal()">🗺️ Roadmap</button>` : ''}
              ${isMaterials ? `<button class="capsule-pill-btn mat-roadmap-pill" onclick="openMaterialsRoadmapModal()">🗺️ Roadmap</button>` : ''}
              ${hasCustomLinks ? `<button class="capsule-pill-btn links-pill" onclick="openCourseLinksModal('${s.code}')">🔗 Links</button>` : ''}
              <button class="capsule-pill-btn guide-pill" onclick="openCourseCapsule('${s.code}')">💡 Guide</button>
            </div>
          </div>
        </div>
      </div>`;
  }
  html += `</div>`;
  container.innerHTML = html;
  attachSwipeListeners();
}

function renderWeekMatrix() {
  const container = document.getElementById("viewContainer");
  container.innerHTML = `
    <div class="matrix-wrapper cascade-item">
      <div class="matrix-scroll">
        <div class="matrix-grid" id="matrixGrid"></div>
      </div>
    </div>`;

  const grid = document.getElementById("matrixGrid");
  
  const corner = document.createElement("div");
  corner.className = "matrix-head corner";
  corner.style.gridColumn = "1";
  corner.style.gridRow = "1";
  corner.textContent = "TIME";
  grid.appendChild(corner);

  DAYS.forEach((d, i) => {
    const isToday = (d.full === todayDayName);
    const dayTasks = getActiveSectionAssessments().filter(a => a.day === d.full);
    const hasQuiz = dayTasks.length > 0;

    const head = document.createElement("div");
    head.className = "matrix-head" + (isToday ? " is-today" : "") + (hasQuiz ? " has-quiz-day" : "");
    head.style.gridColumn = `${i + 2}`;
    head.style.gridRow = "1";
    head.innerHTML = `
      <span>${d.full}</span> 
      <div style="display:flex;gap:3px">
        ${hasQuiz ? `<span class="quiz-pill" onclick="setView('tasks')" style="cursor:pointer;" title="Click for Tasks Hub">⚡ QUIZ</span>` : ''}
        ${isToday ? '<span class="today-pill">TODAY</span>' : ''}
      </div>
    `;
    grid.appendChild(head);
  });

  SLOTS.forEach((slot, s) => {
    const timeCell = document.createElement("div");
    timeCell.className = "matrix-time";
    timeCell.style.gridColumn = "1";
    timeCell.style.gridRow = `${s + 2}`;
    timeCell.textContent = slot;
    grid.appendChild(timeCell);
  });

  for (let c = 2; c <= 6; c++) {
    for (let r = 2; r <= 10; r++) {
      const emptyBg = document.createElement("div");
      emptyBg.className = "matrix-cell-empty";
      emptyBg.style.gridColumn = `${c}`;
      emptyBg.style.gridRow = `${r}`;
      emptyBg.innerHTML = "—";
      grid.appendChild(emptyBg);
    }
  }

  const effectiveSessions = getActiveEffectiveSessions();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  DAYS.forEach((d, dIdx) => {
    const col = dIdx + 2;
    const isDayToday = (d.full === todayDayName);
    const daySessions = effectiveSessions.filter(s => s.day === d.full);
    const dayTasks = getActiveSectionAssessments().filter(a => a.day === d.full);

    daySessions.forEach(sess => {
      const sStartMin = parseMinutes(TIME_STARTS[sess.start]);
      const sEndMin = parseMinutes(TIME_ENDS[sess.start + sess.span - 1]);
      const isLiveNow = isDayToday && (currentMinutes >= sStartMin && currentMinutes < sEndMin);
      const isDynamics = (sess.code === "EMC G101");
      const isMaterials = (sess.code === "MDP G121");
      const hasCustomLinks = !!COURSE_CUSTOM_LINKS[sess.code];

      const hasConflict = daySessions.some(other => 
        other !== sess &&
        sess.start < (other.start + other.span) &&
        (sess.start + sess.span) > other.start
      );

      let widthStyle = "width: 100%;";
      let leftStyle = "left: 0;";

      if (hasConflict) {
        widthStyle = "width: calc(50% - 3px);";
        if (sess.isDynSec) {
          leftStyle = "left: calc(50% + 3px);";
        } else {
          leftStyle = "left: 0;";
        }
      }

      const course = COURSES[sess.code] || { name: sess.code, color: "var(--c-mth)" };
      const isDimmed = highlightedCourse && highlightedCourse !== sess.code;
      const isHighlighted = highlightedCourse === sess.code;
      const hasTask = dayTasks.some(t => t.code === sess.code);

      const posWrap = document.createElement("div");
      posWrap.className = "grid-card-positioned";
      posWrap.style.gridColumn = `${col}`;
      posWrap.style.gridRow = `${sess.start + 2} / span ${sess.span}`;
      posWrap.style.position = "relative";
      posWrap.style.height = "100%";
      posWrap.style.zIndex = isLiveNow ? "10" : "5";

      posWrap.innerHTML = `
        <div class="grid-card ${isLiveNow ? 'is-live-card' : ''} ${sess.isDynSec ? 'is-dynamics-card' : ''} ${sess.attendance ? 'has-attendance-check' : ''} ${isDimmed ? 'dimmed' : ''} ${isHighlighted ? 'highlighted' : ''}" 
             style="--c: ${isLiveNow ? '#ef4444' : course.color}; position: absolute; top: 2px; bottom: 2px; ${leftStyle} ${widthStyle}">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span class="code" style="${isLiveNow ? 'color:#ef4444' : ''}">${sess.code}</span>
            <div style="display:flex;gap:3px;align-items:center;">
              ${isLiveNow ? '<span class="badge-live-now">🔴 LIVE</span>' : ''}
              ${hasTask ? `<span class="type" style="background:var(--quiz-color);color:#fff;cursor:pointer" onclick="setView('tasks')">⚡ QUIZ</span>` : ''}
              ${sess.attendance ? '<span class="badge-attendance">⚠️ ATTENDANCE</span>' : ''}
              <span class="type">${sess.isDynSec ? 'SEC' : (sess.group === "ALL" ? 'LEC' : 'SEC')}</span>
            </div>
          </div>
          <div class="title">${course.name}</div>
          <div class="footer">
            <div style="display:flex;gap:4px;align-items:center;">
              ${isDynamics ? `<span class="matrix-roadmap-btn" style="color:#6366f1;" onclick="openDynamicsRoadmapModal()">🗺️ Map</span>` : ''}
              ${isMaterials ? `<span class="matrix-roadmap-btn" style="color:#f59e0b;" onclick="openMaterialsRoadmapModal()">🗺️ Map</span>` : ''}
              ${hasCustomLinks ? `<span class="matrix-links-btn" onclick="openCourseLinksModal('${sess.code}')">🔗 Links</span>` : ''}
              <span class="matrix-guide-btn" onclick="openCourseCapsule('${sess.code}')">💡 Guide</span>
            </div>
            <div style="display:flex;gap:4px;align-items:center;">
              <span class="room-badge" onclick="showRoomDetails('${sess.room}')">${sess.room} ↗</span>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(posWrap);
    });
  });
}

function renderDaysBar() {
  const bar = document.getElementById("daysBar");
  if (activeView !== "day") {
    bar.style.display = "none";
    return;
  }
  bar.style.display = "grid";

  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());

  bar.innerHTML = DAYS.map((d, idx) => {
    const dayDate = new Date(sunday);
    dayDate.setDate(sunday.getDate() + idx);
    const dateNum = dayDate.getDate();
    const isToday = (d.full === todayDayName);
    const dayTasks = getDayAssessments(d.full);
    const hasQuiz = dayTasks.length > 0;

    return `
      <button class="day-btn ${d.full === activeDay ? 'active' : ''} ${hasQuiz ? 'has-quiz' : ''}" onclick="selectDay('${d.full}')">
        <span class="day-name">${d.short}</span>
        <span class="day-num">${dateNum}</span>
        ${hasQuiz ? '<span class="quiz-badge-dot">⚡ QUIZ</span>' : (isToday ? '<span class="today-tag">TODAY</span>' : '')}
      </button>`;
  }).join("");
}

let touchStartX = 0;
let touchEndX = 0;
function attachSwipeListeners() {
  const swipeArea = document.getElementById("swipeArea");
  if (!swipeArea) return;
  swipeArea.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  swipeArea.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) < 45) return;
    const currentIndex = DAYS.findIndex(d => d.full === activeDay);
    if (diff < 0 && currentIndex < DAYS.length - 1) selectDay(DAYS[currentIndex + 1].full);
    else if (diff > 0 && currentIndex > 0) selectDay(DAYS[currentIndex - 1].full);
  }, { passive: true });
}

function renderLegend() {
  const legend = document.getElementById("legend");
  if (!legend) return;
  if (activeView === "drive" || activeView === "guide" || activeView === "tasks") {
    legend.style.display = "none";
    return;
  }
  legend.style.display = "flex";
  legend.innerHTML = `
    <span class="legend-hint">Filter Subject:</span>
    ${Object.entries(COURSES).map(([code, c]) => `
      <div class="legend-item ${highlightedCourse === code ? 'active' : ''}" onclick="toggleHighlight('${code}')">
        <span class="legend-dot" style="background:${c.color}"></span>
        <b>${code}</b> <span style="font-size:11px">${c.name}</span>
      </div>
    `).join("")}
  `;
}

function toggleHighlight(code) {
  triggerHaptic("light");
  highlightedCourse = (highlightedCourse === code) ? null : code;
  renderLegend();
  if (activeView === "week") renderWeekMatrix();
  else if (activeView === "day") renderDailyAgenda();
}

// عرض شاشة الجايد المتطابقة 100% مع الصورة الأصلية (لمادة الكهربية فقط)
function renderGuideScreen() {
  const container = document.getElementById("viewContainer");
  const availableWeeks = [...new Set(WEEKLY_GUIDE_DATA.map(d => d.week || "Week 1"))];
  if (!availableWeeks.includes(selectedGuideWeek) && availableWeeks.length > 0) {
    selectedGuideWeek = availableWeeks[0];
  }

  const weekItems = WEEKLY_GUIDE_DATA.filter(d => d.week === selectedGuideWeek);

  container.innerHTML = `
    <div class="guide-container">
      <div class="view-back-bar">
        <button class="view-back-btn" onclick="setView('week')">
          <span>◀</span><span>الرجوع للجدول</span>
        </button>
        <span style="font-size:12px;font-weight:800;color:var(--text-muted);">ACADEMIC GUIDE</span>
      </div>

      <div class="guide-hero">
        <div class="guide-hero-top">
          <div class="guide-title"><span>📖</span><span>Weekly Academic Guide</span></div>
          <span style="font-size:11px;font-family:'JetBrains Mono';color:var(--accent)">BATCH 30</span>
        </div>
        <div class="week-tabs-scroll">
          ${(availableWeeks.length > 0 ? availableWeeks : ["Week 1"]).map(w => `
            <button class="week-tab-btn ${w === selectedGuideWeek ? 'active' : ''}" onclick="selectGuideWeek('${w}')">${w}</button>
          `).join("")}
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:14px">
        ${weekItems.length === 0 ? `
          <div style="text-align:center;padding:36px;color:var(--text-muted);background:var(--surface);border-radius:16px;border:1px dashed var(--border)">
            No guides uploaded yet for ${selectedGuideWeek}.
          </div>
        ` : weekItems.map((item, idx) => {
          const course = COURSES[item.code] || { name: item.code, color: "var(--accent)" };

          return `
            <div class="guide-clean-card cascade-item" style="--c: ${course.color}; animation-delay:${idx * 0.05}s">
              <div class="guide-clean-head">
                <div class="guide-clean-code">${item.code}</div>
                <div class="guide-clean-name">${course.name}</div>
              </div>

              <!-- بوكس 1: المحاضرات والسلايدات -->
              ${item.lectures ? `
                <div class="guide-clean-row">
                  <div class="guide-row-top">
                    <span class="guide-row-pill">📑 Lectures:</span>
                    <span class="guide-row-text">${item.lectures}</span>
                  </div>
                  ${item.slides_url ? `
                    <div class="guide-links-shelf">
                      <a href="${item.slides_url}" target="_blank" rel="noopener noreferrer" class="guide-chip-link">
                        <span>📥 سلايدات المحاضرة (Slides)</span> ↗
                      </a>
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <!-- بوكس 2: السكاشن والشيت والحل -->
              ${item.sheet ? `
                <div class="guide-clean-row">
                  <div class="guide-row-top">
                    <span class="guide-row-pill">📝 Tutorials:</span>
                    <span class="guide-row-text">${item.sheet}</span>
                  </div>
                  <div class="guide-links-shelf">
                    ${item.sheet_url ? `
                      <a href="${item.sheet_url}" target="_blank" rel="noopener noreferrer" class="guide-chip-link">
                        <span>📄 ملف الشيت (Sheet)</span> ↗
                      </a>
                    ` : ''}
                    ${item.solution_url ? `
                      <a href="${item.solution_url}" target="_blank" rel="noopener noreferrer" class="guide-chip-link sol-chip">
                        <span>✓ إجابات وحل الشيت</span> ↗
                      </a>
                    ` : ''}
                  </div>
                </div>
              ` : ''}

              <!-- بوكس 3: التمارين وفيديوهات الشرح -->
              ${(item.practice || (item.playlists && item.playlists.length > 0)) ? `
                <div class="guide-clean-row">
                  <div class="guide-row-top">
                    <span class="guide-row-pill">🎯 Practice:</span>
                    <span class="guide-row-text">${item.practice || 'حل مسائل شيت 1 ومتابعة الفيديوهات'}</span>
                  </div>
                  ${item.playlists && item.playlists.length > 0 ? `
                    <div class="guide-links-shelf">
                      ${item.playlists.map(pl => `
                        <a href="${pl.url}" target="_blank" rel="noopener noreferrer" class="guide-chip-link yt-chip">
                          <span>🎬 ${pl.title}</span> ▶
                        </a>
                      `).join("")}
                    </div>
                  ` : ''}
                </div>
              ` : ''}

              <!-- زرار الملخص الأصفر العريض المتطابق مع الصورة -->
              ${item.summary_url ? `
                <a href="${item.summary_url}" target="_blank" rel="noopener noreferrer" class="guide-summary-full-btn">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:16px;">💡</span>
                    <span style="font-weight:700;">${item.summary_title || 'ملخص المحاضرة الأولى (Electrical Summary)'}</span>
                  </div>
                  <span style="font-size:14px;color:var(--accent);">↗</span>
                </a>
              ` : ''}
            </div>`;
        }).join("")}
      </div>
    </div>`;
}

function selectGuideWeek(week) { triggerHaptic("light"); selectedGuideWeek = week; renderGuideScreen(); }

function renderDriveScreen() {
  const container = document.getElementById("viewContainer");
  const searchQuery = window._driveSearchQuery || "";
  const filteredCourses = Object.entries(COURSES).filter(([code, c]) => code.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  container.innerHTML = `
    <div class="vault-container">
      <div class="view-back-bar">
        <button class="view-back-btn" onclick="setView('week')">
          <span>◀</span><span>الرجوع للجدول</span>
        </button>
        <span style="font-size:12px;font-weight:800;color:var(--text-muted);">ACADEMIC VAULT</span>
      </div>

      <div class="vault-hero">
        <div class="vault-hero-top">
          <div class="vault-title"><span>📂</span><span>Academic Vault</span></div>
          <span style="font-size:11px;font-family:'JetBrains Mono';color:var(--accent)">BATCH 30</span>
        </div>
        <div class="vault-search-box">
          <svg style="width:16px;height:16px;fill:var(--text-muted)" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" id="driveSearchInput" placeholder="Search subject code or name..." value="${searchQuery}" oninput="handleDriveSearch(this.value)">
        </div>
        <div class="vault-main-links">
          <div class="vault-btn-primary" onclick="openSafeDriveLink('${MAIN_SEMESTER_DRIVE}')"><span>📁 Batch 30 Drive</span><span>↗</span></div>
          <div class="vault-btn-archive" onclick="openSafeDriveLink('${ARCHIVE_BATCH29_DRIVE}')"><span>🗄️ Batch 29 Archive</span><span>↗</span></div>
        </div>
      </div>
      <div class="courses-grid">
        ${filteredCourses.map(([code, c]) => {
          const d = DRIVE_DATA[code] || { folder: MAIN_SEMESTER_DRIVE, lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE };
          const isDynamics = (code === "EMC G101");
          const isMaterials = (code === "MDP G121");
          const hasCustomLinks = !!COURSE_CUSTOM_LINKS[code];

          return `
            <div class="course-card" style="--c: ${c.color}">
              <div style="font-family:'JetBrains Mono';font-size:14px;font-weight:800;color:${c.color}">${code}</div>
              <div style="font-size:12px;color:var(--text-muted);font-weight:700">${c.name}</div>
              <div class="category-icons-grid">
                <div class="cat-icon-btn" onclick="openSafeDriveLink('${d.lectures || MAIN_SEMESTER_DRIVE}')"><span>📑</span><span>Slides</span></div>
                <div class="cat-icon-btn" onclick="openSafeDriveLink('${d.sheets || MAIN_SEMESTER_DRIVE}')"><span>📝</span><span>Sheets</span></div>
                <div class="cat-icon-btn" onclick="openSafeDriveLink('${d.exams || MAIN_SEMESTER_DRIVE}')"><span>🎯</span><span>Exams</span></div>
                <div class="cat-icon-btn" onclick="openSafeDriveLink('${d.folder || MAIN_SEMESTER_DRIVE}')"><span>📂</span><span>Folder</span></div>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;margin-top:auto;">
                ${isDynamics ? `
                  <div class="capsule-roadmap-open-btn" onclick="openDynamicsRoadmapModal()">
                    <span>🗺️ Dynamics Roadmap</span><span>↗</span>
                  </div>
                ` : ''}
                ${isMaterials ? `
                  <div class="capsule-mat-roadmap-open-btn" onclick="openMaterialsRoadmapModal()">
                    <span>🗺️ Materials Science Roadmap</span><span>↗</span>
                  </div>
                ` : ''}
                ${hasCustomLinks ? `
                  <div class="capsule-links-open-btn" onclick="openCourseLinksModal('${code}')">
                    <span>🔗 Course Links & Hub</span><span>↗</span>
                  </div>
                ` : ''}
                <div class="capsule-open-btn" onclick="openCourseCapsule('${code}')">
                  <span>💡 Survival Capsule & Tips</span><span>↗</span>
                </div>
              </div>
            </div>`;
        }).join("")}
      </div>
    </div>`;
}

function handleDriveSearch(val) { window._driveSearchQuery = val; renderDriveScreen(); }

function render() {
  updateTaskBadge();
  renderLegend();
  updateDynamicsBannerUI();

  const controlBar = document.getElementById("scheduleControlBar");
  const liveBox = document.getElementById("liveStatusBox");
  const mainHeader = document.getElementById("mainHeader");
  const daysBar = document.getElementById("daysBar");
  const dynBanner = document.getElementById("dynamicsSwitcherBanner");
  const legend = document.getElementById("legend");
  const progressBox = document.getElementById("dayProgressContainer");

  document.getElementById("navWeekBtn").classList.remove("active");
  document.getElementById("navDayBtn").classList.remove("active");
  document.getElementById("navDriveBtn").classList.remove("active");
  document.getElementById("navGuideBtn").classList.remove("active");
  document.getElementById("navTaskBtn").classList.remove("active");

  if (activeView === "drive" || activeView === "guide" || activeView === "tasks") {
    if (controlBar) controlBar.style.display = "none";
    if (liveBox) liveBox.style.display = "none";
    if (mainHeader) mainHeader.style.display = "none";
    if (daysBar) daysBar.style.display = "none";
    if (dynBanner) dynBanner.style.display = "none";
    if (legend) legend.style.display = "none";
    if (progressBox) progressBox.style.display = "none";

    if (activeView === "drive") {
      document.getElementById("navDriveBtn").classList.add("active");
      renderDriveScreen();
    } else if (activeView === "guide") {
      document.getElementById("navGuideBtn").classList.add("active");
      renderGuideScreen();
    } else if (activeView === "tasks") {
      document.getElementById("navTaskBtn").classList.add("active");
      renderTasksScreen();
    }
  } else {
    if (controlBar) controlBar.style.display = "flex";
    if (liveBox) liveBox.style.display = "flex";
    if (mainHeader) mainHeader.style.display = "flex";
    if (legend) legend.style.display = "flex";
    if (progressBox) progressBox.style.display = "flex";

    if (activeView === "week") {
      document.getElementById("navWeekBtn").classList.add("active");
      if (daysBar) daysBar.style.display = "none";
      renderWeekMatrix();
    } else {
      document.getElementById("navDayBtn").classList.add("active");
      if (daysBar) daysBar.style.display = "grid";
      renderDaysBar();
      renderDailyAgenda();
    }
  }

  updateLiveTracker();
  updateAcademicCalendarInfo();
}

function setView(mode) { 
  triggerHaptic("light"); 
  activeView = mode; 
  render(); 
}

function selectDay(day) { 
  triggerHaptic("light"); 
  activeDay = day; 
  renderDaysBar(); 
  renderDailyAgenda(); 
  updateDynamicsBannerUI(); 
}

// Controls Listeners
document.getElementById("sectionSelect").value = activeGroup;
document.getElementById("sectionSelect").addEventListener("change", e => {
  triggerHaptic("heavy");
  activeGroup = e.target.value;
  localStorage.setItem("cufe_active_group", activeGroup);
  render();
});

function initDeviceMode() { setDeviceMode(localStorage.getItem("cufe_device_mode") || "mobile"); }
function setDeviceMode(mode) {
  const container = document.getElementById("mainContainer");
  const btn = document.getElementById("deviceModeBtn");
  const icon = document.getElementById("deviceModeIcon");
  const text = document.getElementById("deviceModeText");

  if (mode === "pc") {
    container.classList.add("pc-mode");
    btn.classList.add("active-mode");
    icon.textContent = "📱";
    text.textContent = "Mobile View";
    localStorage.setItem("cufe_device_mode", "pc");
  } else {
    container.classList.remove("pc-mode");
    btn.classList.remove("active-mode");
    icon.textContent = "💻";
    text.textContent = "PC View";
    localStorage.setItem("cufe_device_mode", "mobile");
  }
}

document.getElementById("deviceModeBtn").addEventListener("click", () => {
  triggerHaptic("light");
  const isPc = document.getElementById("mainContainer").classList.contains("pc-mode");
  setDeviceMode(isPc ? "mobile" : "pc");
});

function updateStatusBarColor(theme) {
  const meta = document.getElementById("themeColorMeta");
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#070b12" : "#f8fafc");
  }
}

function initTheme() {
  const saved = localStorage.getItem("cufe_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  updateStatusBarColor(saved);
}

document.getElementById("themeBtn").addEventListener("click", () => {
  triggerHaptic("light");
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = (current === "dark") ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("cufe_theme", next);
  updateStatusBarColor(next);
});

document.getElementById("printBtn").addEventListener("click", () => {
  triggerHaptic("heavy");
  if (activeView !== "week") {
    setView("week");
  }
  setTimeout(() => {
    try {
      window.print();
    } catch (e) {
      window.open(window.location.href, '_blank');
    }
  }, 150);
});

document.getElementById("calendarBtn").addEventListener("click", exportToCalendar);

// Carousel Loop (3 Banners)
let currentBannerIdx = 0;
const bannerTrack = document.getElementById('bannerTrack');
const totalCarouselBanners = 3;

function goToBanner(index) {
  if (!bannerTrack) return;
  currentBannerIdx = index;
  const width = bannerTrack.clientWidth;
  bannerTrack.scrollTo({ left: width * index, behavior: 'smooth' });
  updateBannerDots(index);
}

function updateBannerDots(index) {
  const dots = document.querySelectorAll('#carouselDots .dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

if (bannerTrack) {
  bannerTrack.addEventListener('scroll', () => {
    const width = bannerTrack.clientWidth;
    const index = Math.round(bannerTrack.scrollLeft / width);
    if (index !== currentBannerIdx && index >= 0 && index < totalCarouselBanners) {
      currentBannerIdx = index;
      updateBannerDots(index);
    }
  }, { passive: true });

  setInterval(() => {
    currentBannerIdx = (currentBannerIdx + 1) % totalCarouselBanners;
    goToBanner(currentBannerIdx);
  }, 5500);
}

// Initial Boot Sequence
initDeviceMode();
initTheme();
render();
syncFromGoogleSheets();
setInterval(updateLiveTracker, 60000);
