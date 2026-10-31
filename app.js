/* ==========================================================================
   CUFE Mechanical Engineering — Batch 30 Application Logic Engine (Part 1 / 2)
   ========================================================================== */

if (typeof caches !== 'undefined') {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
  });
}

// Global Application State
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

// Subject-based Hub State (persisted)
let activeSubjectFilter = localStorage.getItem("cufe_tasks_subject") || "all";
if (activeSubjectFilter !== "all" && !(typeof COURSES !== 'undefined' && COURSES[activeSubjectFilter])) activeSubjectFilter = "all";
let quizChecklistState = JSON.parse(localStorage.getItem("cufe_quiz_checklists") || "{}");
let activeQuizGuideId = null;
let calViewDate = new Date(2026, 9, 1); // October 2026

// Weekly Guide State
let WEEKLY_GUIDE_DATA = typeof DEFAULT_WEEKLY_GUIDES !== 'undefined' ? [...DEFAULT_WEEKLY_GUIDES] : [];
let selectedGuideWeek = "Week 4";
let selectedGuideCourse = "EMC G101";

// خيار إظهار الأيام السابقة
let showPastDays = JSON.parse(localStorage.getItem("cufe_show_past_days") || "false");

let ASSESSMENTS = [];
let NOTIFICATIONS = (typeof DEFAULT_NOTIFICATIONS !== 'undefined' && Array.isArray(DEFAULT_NOTIFICATIONS))
  ? [...DEFAULT_NOTIFICATIONS]
  : [
      { 
        id: "ann-01", 
        date: "8 Sep 2026", 
        tag: "Batch 30", 
        title: "Welcome to Mechanical Engineering (Batch 30)", 
        body: "Fall Semester timetable is active. Lectures commence Saturday, 19 September 2026." 
      }
    ];

// حساب وتحديد اليوم الفعلي
const jsDateNow = new Date();
const jsDay = jsDateNow.getDay(); // 0: Sun .. 5: Fri, 6: Sat
let activeDay = (jsDay >= 0 && jsDay <= 4) ? DAYS[jsDay].full : "Sunday";
const todayDayName = (jsDay >= 0 && jsDay <= 4) ? DAYS[jsDay].full : null;

let currentDisplayWeek = calculateActualAcademicWeek();

function parseMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function triggerHaptic(type = "light") {
  if (!navigator.vibrate) return;
  if (type === "heavy") navigator.vibrate([15, 30, 20]);
  else navigator.vibrate(8);
}

function togglePastDaysVisibility() {
  triggerHaptic("heavy");
  showPastDays = !showPastDays;
  localStorage.setItem("cufe_show_past_days", JSON.stringify(showPastDays));
  render();
}

function isDayInPast(dayIdx) {
  if (jsDay < 0 || jsDay > 4) return false;
  return dayIdx < jsDay;
}

function openSafeDriveLink(url) {
  if (!url || url === "undefined" || url === "") {
    alert("الرابط غير متوفر حالياً، جاري تحديثه قريباً!");
    return;
  }
  triggerHaptic("light");
  window.open(url, '_blank', 'noopener,noreferrer');
}

function calculateActualAcademicWeek() {
  const now = new Date();
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startZero = new Date(ACADEMIC_YEAR_START.getFullYear(), ACADEMIC_YEAR_START.getMonth(), ACADEMIC_YEAR_START.getDate());
  const diffDays = Math.round((todayZero - startZero) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 1;
  return Math.floor(diffDays / 7) + 1;
}

function getActiveEffectiveSessions() {
  let baseSessions = SESSIONS.filter(s => s.group === "ALL" || s.group === activeGroup);
  // If there's an "ALL" quiz session at a specific day & start for a course,
  // it supersedes any section-specific session of the same course at that same day & slot.
  const quizSessions = baseSessions.filter(s => s.isQuiz);
  if (quizSessions.length > 0) {
    baseSessions = baseSessions.filter(s => {
      if (s.isQuiz) return true;
      const isOverriddenByQuiz = quizSessions.some(q => 
        q.code === s.code && q.day === s.day && q.start === s.start
      );
      return !isOverriddenByQuiz;
    });
  }
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

  ['1', '2'].forEach(k => {
    const btn = document.getElementById(`dynSlot${k}Btn`);
    if (btn) btn.className = `dyn-pill-btn ${selectedDynamicsSlot === k ? 'active' : ''}`;
  });

  const slot3Btn = document.getElementById("dynSlot3Btn");
  if (slot3Btn) slot3Btn.style.display = "none";
}

let toastTimer;
function showRoomDetails(roomCode) {
  triggerHaptic("heavy");
  const roomMeta = ROOM_INFO[roomCode];
  const box = document.getElementById("toastBox");
  if (!box) return;
  
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
        const isPast = step.status === 'completed' || step.week < currentAcademicWk;
        const isCurrent = step.status === 'active' || (step.week === currentAcademicWk && step.status !== 'completed');
        const stateClass = isPast ? 'is-done' : (isCurrent ? 'is-current' : '');

        return `
          <div class="roadmap-step ${stateClass}" style="--step-color: #8b5cf6; --step-glow: #a78bfa;">
            <div class="roadmap-step-indicator">
              <div class="roadmap-step-circle">${isPast ? '✓' : step.week}</div>
              <div class="roadmap-step-line"></div>
            </div>
            <div class="roadmap-step-card" style="${step.badge ? 'border-color:#ea580c;background:rgba(234,88,12,0.06);' : ''}">
              <div class="roadmap-step-head">
                <span class="roadmap-week-tag" style="${step.badge ? 'color:#ea580c;' : ''}">WEEK ${step.week} ${isCurrent ? '• 📍 أنت هنا' : ''}</span>
                <span class="roadmap-date-tag">${step.date}</span>
              </div>
              <div class="roadmap-topic-title" style="${step.badge ? 'color:#ea580c;font-weight:800;' : ''}">${step.title}</div>
              ${step.topic ? `<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.4;">${step.topic}</div>` : ''}
              ${(step.slides || step.badge || (step.the && step.the !== '—')) ? `
                <div class="roadmap-sub-row" style="margin-top:6px;">
                  ${step.slides && step.slides !== '-' ? `
                    <div class="roadmap-sub-item">
                      <span class="roadmap-sub-badge" style="color:#8b5cf6;border-color:rgba(139,92,246,0.3);">Slides</span>
                      <span>${step.slides}</span>
                    </div>
                  ` : ''}
                  ${step.badge ? `<span class="roadmap-the-badge" style="color:#ea580c;background:rgba(234,88,12,0.12);border:1px solid rgba(234,88,12,0.3);">🎯 ${step.badge}</span>` : ''}
                  ${step.the && step.the !== '—' ? `<span class="roadmap-the-badge">⚡ ${step.the}</span>` : ''}
                </div>
              ` : ''}
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
                <span class="roadmap-week-tag" style="${step.isMidterm ? 'color:#ea580c;' : ''}">WEEK ${step.week}${isCurrent ? '• 📍 أنت هنا' : ''}</span>
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

    ${code === "EMC G101" ? `
    <div style="margin-top:2px;">
      <button class="action-btn" style="width:100%;justify-content:center;background:rgba(99, 102, 241, 0.12);color:#6366f1;border-color:#6366f1;" onclick="closeLinksModal();openDynamicsRoadmapModal();">
        <span>🗺 فتح خريطة المنهج أسبوع بأسبوع (Roadmap)</span>
      </button>
    </div>
    ` : code === "MTH G102" ? `
    <div style="margin-top:2px;">
      <button class="action-btn" style="width:100%;justify-content:center;background:rgba(2, 132, 199, 0.12);color:#0284c7;border-color:#0284c7;" onclick="closeLinksModal();openGuideWeek('Week 5', 'MTH G102');">
        <span>📖 فتح جايد الأسابيع للماث (Week 1 — Week 5)</span>
      </button>
    </div>
    ` : ''}

    <div class="capsule-box" style="border-left: 4px solid #8b5cf6;">
      <div class="capsule-box-head" style="color:#8b5cf6;">
        <span>📊</span><span>${data.sheetsTitle || 'شيتات المتابعة وأعمال السنة والفورمز'}</span>
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

    ${data.social && data.social.length > 0 ? `
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
    ` : ''}

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
        <p style="font-size:12px;line-height:1.5;">جاري تجهيز دليل النجاة وتقسيمة درجات مادة ${course.name}.</p>
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

      ${cap.playlists && cap.playlists.length > 0 ? `
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">
          <span style="font-size:11px;font-weight:700;color:var(--text-muted);">قوائم يوتيوب المعتمدة للشرح:</span>
          ${cap.playlists.map(p => `
            <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="capsule-link-btn" style="border-left:3px solid #f43f5e;">
              <span style="color:var(--text-main);">${p.title}</span>
              <span style="color:#f43f5e;">▶</span>
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
      if (parsed.length > 0) {
        const defaultNotifs = (typeof DEFAULT_NOTIFICATIONS !== 'undefined') ? DEFAULT_NOTIFICATIONS : [];
        const seenIds = new Set(defaultNotifs.map(n => n.id));
        NOTIFICATIONS = [...defaultNotifs, ...parsed.filter(p => !seenIds.has(p.id))];
      }
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
      // Preserving official Dr. Samir dynamicsRoadmap from data.js
  } catch (e) {
    console.warn("Using offline fallback data.", e);
  } finally {
    initNotifications();
    updateTaskBadge();
    render();
  }
}

function getSundayOfActiveWeek() {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
  const sunday = new Date(today);
  
  if (currentDayOfWeek === 5) {
    sunday.setDate(today.getDate() + 2); // الجمعة -> الأحد القادم
  } else if (currentDayOfWeek === 6) {
    sunday.setDate(today.getDate() + 1); // السبت -> الأحد القادم
  } else {
    sunday.setDate(today.getDate() - currentDayOfWeek);
  }
  return sunday;
}

function getDisplayedDateForDay(dayName) {
  const dayObj = DAYS.find(d => d.full === dayName);
  if (!dayObj) return null;
  const sunday = getSundayOfActiveWeek();
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
  const dynamicList = ASSESSMENTS.filter(a => 
    (a.group === "ALL" || a.group === activeGroup) && 
    isAssessmentUpcoming(a.date) &&
    (a.type && a.type.toLowerCase().includes("quiz"))
  );
  
  const staticList = [];
  if (typeof COURSE_STATIC_ASSIGNMENTS !== 'undefined') {
    COURSE_STATIC_ASSIGNMENTS.forEach(asgn => {
      const deadline = asgn.deadlinesByGroup[activeGroup] || asgn.deadlinesByGroup["ME1-01"];
      if (isAssessmentUpcoming(deadline) && asgn.type && asgn.type.toLowerCase().includes("quiz")) {
        staticList.push({
          code: asgn.code,
          title: asgn.title,
          type: asgn.type,
          day: asgn.day || "Sunday",
          date: deadline,
          group: "ALL",
          desc: asgn.desc
        });
      }
    });
  }

  return [...staticList, ...dynamicList];
}

function getDayAssessments(dayName) {
  return getActiveSectionAssessments().filter(a => a.day === dayName && isAssessmentInCurrentWeek(a.date, dayName));
}

function getExactCountdown(deadlineInput) {
  const dueStr = (typeof deadlineInput === 'object' && deadlineInput !== null)
    ? (deadlineInput.dueDate || deadlineInput.deadline || deadlineInput.date || deadlineInput.start)
    : deadlineInput;

  if (!dueStr) return { text: "محدد", isUrgent: false, isPassed: false, diff: 0 };
  const target = new Date(dueStr);
  if (isNaN(target.getTime())) return { text: "محدد", isUrgent: false, isPassed: false, diff: 0 };

  const diff = new Date(dueStr) - new Date();

  if (diff <= 0) {
    return { text: "منتهي / Expired", isUrgent: false, isPassed: true, diff };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  let text = "";
  if (days > 0) text += `${days}d `;
  text += `${hours}h ${minutes}m`;

  const isUrgent = days === 0 || diff <= 48 * 3600 * 1000;
  return { text, isUrgent, isPassed: false, diff };
}


function updateTaskBadge() {
  const badge = document.getElementById("navTaskBadge");
  if (!badge) return;
  const allTasks = getAllCombinedTasks();
  const count = allTasks.filter(t => !t.isDone && !t.countdown?.isPassed).length;
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }
}

function getAllEventsForCalendar() {
  const allEvents = [];
  const addedIds = new Set();

  if (typeof MASTER_QUIZZES !== 'undefined') {
    MASTER_QUIZZES.forEach(q => {
      const d = getParsedDateObj(q.deadline || q.start);
      if (d) {
        allEvents.push({ date: d, code: q.code, title: q.title, type: q.type || "Official Exam", color: q.accent || '#8b5cf6' });
        addedIds.add(q.id);
      }
    });
  }

  if (typeof COURSE_STATIC_ASSIGNMENTS !== 'undefined') {
    COURSE_STATIC_ASSIGNMENTS.forEach(asgn => {
      if (addedIds.has(asgn.id)) return;
      const deadline = (asgn.deadlinesByGroup && (asgn.deadlinesByGroup[activeGroup] || asgn.deadlinesByGroup["ME1-01"])) || asgn.deadline;
      const d = getParsedDateObj(deadline);
      if (d) {
        allEvents.push({ date: d, code: asgn.code, title: asgn.title, type: asgn.type, color: COURSES[asgn.code]?.hex || '#0284c7' });
        addedIds.add(asgn.id);
      }
    });
  }

  ASSESSMENTS.filter(a => a.group === "ALL" || a.group === activeGroup).forEach(a => {
    if (addedIds.has(a.id)) return;
    const d = getParsedDateObj(a.date);
    if (d) allEvents.push({ date: d, code: a.code, title: a.title, type: a.type || 'Task', color: COURSES[a.code]?.hex || '#ea580c' });
  });
  return allEvents;
}

/* ==========================================================================
   Modern Neon Dashboard — Official Tasks, Details Modal & Quiz Guide Engine
   ========================================================================== */

function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

activeSubjectFilter = activeSubjectFilter || "all";
let activeSortOption = "due-date"; // "due-date" | "course" | "readiness"
if (!activeQuizGuideId) activeQuizGuideId = "gen-quiz-2";
currentDetailedTask = null;

function getAllCombinedTasks() {
  const list = [];
  const addedIds = new Set();

  // 1. Master Quizzes (Highest priority, full rich data)
  if (typeof MASTER_QUIZZES !== 'undefined') {
    MASTER_QUIZZES.forEach(q => {
      const dueDate = q.dueDate || q.deadline || q.date || q.start;
      const cd = getExactCountdown(dueDate);
      const isPassed = cd.isPassed;
      const isDone = q.isDone || completedTasks.includes(q.id);
      let priority = "scheduled";
      if (isDone || isPassed) priority = "done";
      else if (cd.isUrgent) priority = "due-soon";
      else if (cd.diff <= 7 * 24 * 3600 * 1000) priority = "upcoming";

      list.push({
        ...q,
        dueDate: dueDate,
        countdownBadge: isPassed ? "منتهي / Expired" : cd.text,
        isQuiz: q.isQuiz !== undefined ? q.isQuiz : !q.type?.toLowerCase().includes("assignment"),
        countdown: cd,
        priority: priority,
        isDone: isDone,
        isPassed: isPassed,
        desc: q.instructions ? q.instructions.join('\n') : "Official Exam",
        note: ""
      });
      addedIds.add(q.id);
    });
  }

  // 2. Static Assignments
  if (typeof COURSE_STATIC_ASSIGNMENTS !== 'undefined') {
    COURSE_STATIC_ASSIGNMENTS.forEach(asgn => {
      if (addedIds.has(asgn.id)) return;
      const deadline = (asgn.deadlinesByGroup && (asgn.deadlinesByGroup[activeGroup] || asgn.deadlinesByGroup["ME1-01"])) || asgn.deadline || "2026-10-15T09:00:00";
      const dueDate = asgn.dueDate || deadline;
      const cd = getExactCountdown(dueDate);
      const isPassed = cd.isPassed;
      const isDone = asgn.isDone || completedTasks.includes(asgn.id);
      let priority = "scheduled";
      if (isDone || isPassed) priority = "done";
      else if (cd.isUrgent) priority = "due-soon";
      else if (cd.diff <= 7 * 24 * 3600 * 1000) priority = "upcoming";

      const isQ = /quiz|exam/i.test(asgn.type || '');
      list.push({
        id: asgn.id,
        code: asgn.code,
        title: asgn.title,
        type: asgn.type || "Assignment",
        instructor: COURSES[asgn.code]?.instructor || "CUFE Staff",
        dateDisplay: new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        deadline: deadline,
        dueDate: dueDate,
        start: asgn.start,
        countdownBadge: isPassed ? "منتهي / Expired" : cd.text,
        countdown: cd,
        priority: priority,
        accent: COURSES[asgn.code]?.hex || '#38bdf8',
        accentName: "cyan",
        desc: asgn.desc,
        note: asgn.note,
        submissionUrl: asgn.folderUrl || MAIN_SEMESTER_DRIVE,
        instructions: asgn.desc ? asgn.desc.split('\n').filter(Boolean) : [
          "Make sure to read all instructions carefully.",
          "Use only the official submission form.",
          "Late submissions will not be accepted."
        ],
        isDone: isDone,
        isPassed: isPassed,
        isQuiz: isQ
      });
      addedIds.add(asgn.id);
    });
  }

  // Keep only official tasks: MASTER_QUIZZES (confirmed exams & quizzes) and COURSE_STATIC_ASSIGNMENTS
  return list;
}

function getCourseMeta(code) {
  return COURSES[code] || { name: code, color: "var(--accent)", hex: "#0284c7", instructor: "CUFE Staff" };
}

function isQuizTask(task) {
  return task.isQuiz || /quiz|exam|midterm/i.test(task.type || '');
}

function weekNum(w) {
  return parseInt(String(w || '').replace(/\D/g, ''), 10) || 0;
}

function getSubjectGuides(code) {
  return WEEKLY_GUIDE_DATA.filter(g => g.code === code).sort((a, b) => weekNum(a.week) - weekNum(b.week));
}

function sortByDeadline(a, b) {
  const pa = a.countdown?.isPassed ? 1 : 0;
  const pb = b.countdown?.isPassed ? 1 : 0;
  if (pa !== pb) return pa - pb; // non-expired (0) at top, expired (1) at bottom
  const da = (a.dueDate || a.deadline || a.date) ? new Date(a.dueDate || a.deadline || a.date).getTime() : 0;
  const db = (b.dueDate || b.deadline || b.date) ? new Date(b.dueDate || b.deadline || b.date).getTime() : 0;
  if (pa === 1) {
    // For expired items, show most recently expired first
    return (isNaN(db) ? 0 : db) - (isNaN(da) ? 0 : da);
  }
  return (isNaN(da) ? 0 : da) - (isNaN(db) ? 0 : db);
}

function isSessionBadgeVisible(s, badgeType) {
  if (!s) return false;
  const badgeText = (badgeType === 'quiz' ? s.quizBadge : s.assignmentBadge) || '';
  if (!badgeText) return false;

  const allTasks = getAllCombinedTasks();
  const courseTasks = allTasks.filter(t => t.code === s.code);
  if (!courseTasks.length) return true;

  // Direct check by quizTaskId / assignmentTaskId if provided
  if (badgeType === 'quiz' && s.quizTaskId) {
    const directTask = allTasks.find(t => t.id === s.quizTaskId);
    if (directTask) return !directTask.countdown?.isPassed;
  }
  if (badgeType === 'assignment' && s.assignmentTaskId) {
    const directTask = allTasks.find(t => t.id === s.assignmentTaskId);
    if (directTask) return !directTask.countdown?.isPassed;
  }

  const lowerBadge = badgeText.toLowerCase();
  let matchedTask = null;
  if (lowerBadge.includes('quiz 1') || lowerBadge.includes('كويز 1')) {
    matchedTask = courseTasks.find(t => (t.id || '').includes('quiz-1') || (t.title || '').includes('Quiz 1'));
  } else if (lowerBadge.includes('quiz 2') || lowerBadge.includes('كويز 2')) {
    matchedTask = courseTasks.find(t => (t.id || '').includes('quiz-2') || (t.title || '').includes('Quiz 2'));
  } else if (lowerBadge.includes('quiz 3') || lowerBadge.includes('كويز 3')) {
    matchedTask = courseTasks.find(t => (t.id || '').includes('quiz-3') || (t.title || '').includes('Quiz 3'));
  } else if (lowerBadge.includes('assignment 1') || lowerBadge.includes('assign 1') || lowerBadge.includes('أسينمنت 1')) {
    matchedTask = courseTasks.find(t => (t.id || '').includes('assign-1') || (t.title || '').includes('Assignment 1'));
  } else if (lowerBadge.includes('assignment 2') || lowerBadge.includes('assign 2') || lowerBadge.includes('أسينمنت 2')) {
    matchedTask = courseTasks.find(t => (t.id || '').includes('assign-2') || (t.title || '').includes('Assignment 2'));
  }

  if (matchedTask) {
    return !matchedTask.countdown?.isPassed;
  }

  if (badgeType === 'quiz') {
    const quizzes = courseTasks.filter(t => t.isQuiz);
    return quizzes.length ? quizzes.some(q => !q.countdown?.isPassed) : true;
  } else {
    const asgns = courseTasks.filter(t => !t.isQuiz);
    return asgns.length ? asgns.some(a => !a.countdown?.isPassed) : true;
  }
}

/* ---------- Checklist & Readiness Engine ---------- */

function buildQuizChecklist(task) {
  // If task has pre-structured categories (like from MASTER_QUIZZES), return them!
  if (task.lectures || task.sheets || task.practice || task.formula) {
    const categories = [];
    if (task.lectures && task.lectures.length) {
      categories.push({
        key: 'lectures',
        icon: '📘',
        label: 'Lectures',
        color: '#38bdf8',
        items: task.lectures.map(l => ({
          id: l.id,
          title: l.title,
          links: l.slides ? [{ label: 'Slides', icon: '📄', url: l.slides }] : []
        }))
      });
    }
    if (task.sheets && task.sheets.length) {
      categories.push({
        key: 'sheets',
        icon: '📝',
        label: task.type === 'Assignment' ? 'Assignment & Solution Files' : 'Sheets & Problems',
        color: '#f59e0b',
        items: task.sheets.map(s => {
          const links = [];
          if (s.pdf) links.push({ label: task.type === 'Assignment' ? 'Assignment File' : 'PDF', icon: '📄', url: s.pdf });
          if (s.sol) links.push({ label: task.type === 'Assignment' ? 'Solution File' : 'Sol', icon: '✅', url: s.sol });
          return { id: s.id, title: s.title, links: links };
        })
      });
    }
    if (task.practice && task.practice.length) {
      categories.push({
        key: 'practice',
        icon: '🎯',
        label: 'Practice & Videos',
        color: '#f43f5e',
        items: task.practice.map(p => {
          const isPdf = p.url && (p.url.includes("drive.google.com") || p.title.includes("مسائل") || p.title.includes("تطبيقات") || p.title.includes("PDF") || p.title.includes("Solved"));
          return {
            id: p.id,
            title: p.title,
            links: p.url ? [{ label: isPdf ? 'Open PDF' : 'Watch', icon: isPdf ? '📄' : '🎬', url: p.url }] : []
          };
        })
      });
    }
    if (task.formula && task.formula.length) {
      categories.push({
        key: 'formula',
        icon: '💡',
        label: 'Quick Formula & Tips',
        color: '#a855f7',
        items: task.formula.map(f => ({
          id: f.id,
          title: f.title,
          links: f.url ? [{ label: 'Guide', icon: '↗', url: f.url }] : []
        }))
      });
    }
    return categories;
  }

  // Fallback to weekly guide parser
  const groups = [
    { key: 'lectures', icon: '📘', label: 'Lectures', color: '#38bdf8', items: [] },
    { key: 'sheets',   icon: '📝', label: 'Sheets & Problems', color: '#f59e0b', items: [] },
    { key: 'practice', icon: '🎯', label: 'Practice & Videos', color: '#f43f5e', items: [] },
    { key: 'formula',  icon: '💡', label: 'Quick Formula & Tips', color: '#a855f7', items: [] }
  ];
  const [L, S, V, N] = groups;
  const pushUnique = (grp, item) => {
    if (grp.items.some(i => i.id === item.id)) return;
    grp.items.push(item);
  };

  const guides = getSubjectGuides(task.code);
  guides.forEach(g => {
    const wk = String(g.week || '').replace(/\s+/g, '');
    if (g.lectures) {
      pushUnique(L, {
        id: `lec-${wk}`,
        title: g.lectures,
        links: g.slides_url ? [{ label: 'Slides', icon: '📄', url: g.slides_url }] : []
      });
    }
    if (g.sheet) {
      const links = [];
      if (g.sheet_url) links.push({ label: 'PDF', icon: '📄', url: g.sheet_url });
      if (g.solution_url) links.push({ label: 'Sol', icon: '📄', url: g.solution_url });
      pushUnique(S, { id: `sht-${wk}`, title: g.sheet, links: links });
    }
    if (g.playlists && g.playlists.length) {
      g.playlists.forEach((p, idx) => {
        pushUnique(V, {
          id: `vid-${wk}-${idx}`,
          title: p.title,
          links: p.url ? [{ label: 'Watch', icon: '🎬', url: p.url }] : []
        });
      });
    }
    if (g.summary_url || g.summary_title) {
      pushUnique(N, {
        id: `sum-${wk}`,
        title: g.summary_title || 'Summary Notes & Formulas',
        links: g.summary_url ? [{ label: 'Guide', icon: '↗', url: g.summary_url }] : []
      });
    }
  });

  if (!L.items.length) {
    L.items.push({ id: `lec-def-${task.id}`, title: 'Review all assigned lectures and slides', links: [] });
  }
  if (!S.items.length) {
    S.items.push({ id: `sht-def-${task.id}`, title: 'Solve textbook and tutorial exercises', links: [] });
  }
  if (!V.items.length) {
    V.items.push({ id: `vid-def-${task.id}`, title: 'Watch explanation recordings and solved problems', links: [] });
  }
  if (!N.items.length) {
    N.items.push({ id: `sum-def-${task.id}`, title: 'Key exam formulas & checklist revision', links: [] });
  }

  return groups;
}

// Initial mockup defaults for official tasks (MTH Quiz 1, GEN Marketing, THE 1, MTH Assignment 1)
(function initDefaultQuizChecklist() {
  if (!localStorage.getItem("cufe_quiz_checklists")) {
    const defaultState = {
      "mth-quiz-1": {
        "mth-lec-1": 1,
        "mth-sht-1": 1
      },
      "the-1": {
        "emc-lec-1": 1,
        "emc-sht-1": 1
      },
      "mth-assign-1": {
        "mth-lec-1": 1,
        "mth-sht-1": 1
      }
    };
    quizChecklistState = defaultState;
    localStorage.setItem("cufe_quiz_checklists", JSON.stringify(defaultState));
  }
})();

function getQuizProgressById(taskId) {
  const allTasks = getAllCombinedTasks();
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return { done: 0, total: 0, pct: 0, categories: [], state: {} };
  const categories = buildQuizChecklist(task);
  const st = quizChecklistState[task.id] || {};
  const allItems = categories.flatMap(c => c.items);
  const doneCount = allItems.filter(i => !!st[i.id]).length;
  const totalCount = allItems.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  return {
    done: doneCount,
    total: totalCount,
    pct: pct,
    categories: categories,
    state: st
  };
}

function getOverallPreparednessPct() {
  const allTasks = getAllCombinedTasks();
  const quizTasks = allTasks.filter(isQuizTask);
  if (!quizTasks.length) return 70;

  let totalItems = 0;
  let totalDone = 0;
  quizTasks.forEach(task => {
    const p = getQuizProgressById(task.id);
    totalItems += p.total;
    totalDone += p.done;
  });

  if (!totalItems) return 70;
  return Math.round((totalDone / totalItems) * 100);
}

function renderCircularGaugeSvg(pct, size, strokeWidth, color, label) {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - Math.min(Math.max(pct, 0), 100) / 100);

  return `
    <div class="circular-gauge-box" style="width:${size}px; height:${size}px;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" class="gauge-circle-bg" stroke-width="${strokeWidth}" />
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" class="gauge-circle-fill" stroke-width="${strokeWidth}"
          stroke="${color}" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" />
      </svg>
      <div class="gauge-center-content">
        <span class="gauge-pct-val">${pct}%</span>
        ${label ? `<span class="gauge-sub-lbl">${label}</span>` : ''}
      </div>
    </div>
  `;
}

function getTimeBasedGreeting() {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning, Engineers 👋";
  if (hr < 18) return "Welcome back, Engineers 👋";
  return "Ready to crush your exams? 🚀";
}

/* ==========================================================================
   PAGE 1: Main Tasks View (Upcoming Tasks & Quizzes)
   ========================================================================== */

function renderTasksScreen() {
  const container = document.getElementById("viewContainer");
  if (!container) return;

  const greeting = getTimeBasedGreeting();
  const overallPct = getOverallPreparednessPct();

  container.innerHTML = `
    <div class="modern-tasks-dashboard">
      <!-- Top Header Row -->
      <header class="dash-top-header">
        <div class="dash-header-left">
          <div class="dash-greeting-line">${greeting}</div>
          <div class="dash-sub-line">Stay consistent. You got this!</div>
          <h1 class="dash-page-title">Upcoming Tasks & Quizzes</h1>
          <p class="dash-page-subtitle">Your next exams, quizzes and important deadlines</p>
        </div>

        <div class="dash-header-right">
          <!-- This Week Badge -->
          <div class="dash-week-badge-box">
            <span class="week-cal-icon">📅</span>
            <div class="week-text-col">
              <span class="week-title">This Week</span>
              <span class="week-range">Sep 22 - Sep 28</span>
            </div>
          </div>

          <!-- Circular Preparedness Gauge -->
          <div class="dash-prepared-box">
            ${renderCircularGaugeSvg(overallPct, 64, 5.5, "#06b6d4", "Prepared")}
          </div>
        </div>
      </header>

      <!-- Filter & Sort Bar -->
      <div class="dash-filter-sort-bar">
        <!-- Subject Pills -->
        <nav class="dash-subject-pills" role="tablist">
          <button class="subj-pill-btn ${activeSubjectFilter === 'all' ? 'active' : ''}" data-code="all" onclick="setSubjectFilterPill('all')">All</button>
          <button class="subj-pill-btn ${activeSubjectFilter === 'MTH G102' ? 'active' : ''}" data-code="MTH G102" onclick="setSubjectFilterPill('MTH G102')">MTH G102</button>
          <button class="subj-pill-btn ${activeSubjectFilter === 'EMC G101' ? 'active' : ''}" data-code="EMC G101" onclick="setSubjectFilterPill('EMC G101')">EMC G101</button>
          <button class="subj-pill-btn ${activeSubjectFilter === 'GEN G119' ? 'active' : ''}" data-code="GEN G119" onclick="setSubjectFilterPill('GEN G119')">GEN G119</button>
          <button class="subj-pill-btn ${activeSubjectFilter === 'MDP G111' ? 'active' : ''}" data-code="MDP G111" onclick="setSubjectFilterPill('MDP G111')">MDP G111</button>
          <button class="subj-pill-btn ${activeSubjectFilter === 'MDP G121' ? 'active' : ''}" data-code="MDP G121" onclick="setSubjectFilterPill('MDP G121')">MDP G121</button>
          <button class="subj-pill-btn ${activeSubjectFilter === 'EPE G113' ? 'active' : ''}" data-code="EPE G113" onclick="setSubjectFilterPill('EPE G113')">EPE G113</button>
        </nav>

        <!-- Sort Dropdown -->
        <div class="dash-sort-box">
          <span class="sort-lbl">Sort by</span>
          <select class="dash-sort-select" onchange="handleSortOptionChange(this.value)">
            <option value="due-date" ${activeSortOption === 'due-date' ? 'selected' : ''}>Due Date</option>
            <option value="course" ${activeSortOption === 'course' ? 'selected' : ''}>Course</option>
            <option value="readiness" ${activeSortOption === 'readiness' ? 'selected' : ''}>Readiness</option>
          </select>
        </div>
      </div>

      <!-- Bento Cards Grid (2-Columns on desktop, 1 on mobile) -->
      <div class="dash-bento-grid" id="tasksBentoGrid"></div>
    </div>
  `;

  renderTasksGridOnly();
}

function renderTasksGridOnly() {
  const grid = document.getElementById("tasksBentoGrid");
  if (!grid) return;

  const allTasks = getAllCombinedTasks();
  let list = allTasks;

  // Filter by subject
  if (activeSubjectFilter && activeSubjectFilter !== "all") {
    const f = activeSubjectFilter.trim().toUpperCase();
    list = list.filter(t => {
      if (!t.code) return false;
      const c = t.code.trim().toUpperCase();
      return c === f || c.replace(/\s+/g, '') === f.replace(/\s+/g, '') || c.startsWith(f.split(' ')[0]);
    });
  }

  // Sort
  if (typeof activeSortOption === 'undefined') activeSortOption = 'due-date';
  if (activeSortOption === "course") {
    list.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
  } else if (activeSortOption === "readiness") {
    list.sort((a, b) => getQuizProgressById(b.id).pct - getQuizProgressById(a.id).pct);
  } else {
    list.sort(sortByDeadline);
  }

  if (!list.length) {
    grid.innerHTML = `
      <div class="dash-empty-grid" style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; background: rgba(18, 26, 43, 0.6); border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px;">
        <div class="empty-icon" style="font-size: 32px; margin-bottom: 8px;">✨</div>
        <div class="empty-txt" style="color: var(--text-muted); font-size: 14px; font-weight: 600;">No tasks or quizzes found for this filter</div>
        <button onclick="setSubjectFilterPill('all')" style="margin-top: 14px; background: var(--accent-glow); color: var(--accent-light); border: 1px solid var(--accent); padding: 6px 16px; border-radius: 9999px; font-weight: 700; cursor: pointer;">Show All Tasks</button>
      </div>
    `;
    return;
  }

  const activeTasks = list.filter(t => !t.countdown?.isPassed);
  const expiredTasks = list.filter(t => !!t.countdown?.isPassed);

  let html = '';
  if (activeTasks.length > 0) {
    html += activeTasks.map(t => renderBentoTaskCard(t)).join('');
  }

  if (expiredTasks.length > 0) {
    html += `
      <div class="tasks-archive-divider" style="grid-column: 1 / -1; display:flex; align-items:center; gap:12px; margin: 24px 0 12px; padding: 12px 18px; background: rgba(18, 26, 43, 0.7); border: 1px dashed rgba(239,68,68,0.25); border-radius: 14px;">
        <span style="font-size:20px;">📦</span>
        <div style="flex:1;">
          <strong style="color:var(--text-main);font-size:13.5px;display:block;">أرشيف المهام والكويزات السابقة والمنتهية (Expired & Archived Tasks)</strong>
          <span style="color:var(--text-muted);font-size:11.5px;">المهام والكويزات التي انتهى موعدها الرسمي للأسبوع المنتهي</span>
        </div>
        <span style="font-size:11px;font-weight:800;padding:3px 10px;border-radius:9999px;background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.35);">${expiredTasks.length} منتهي</span>
      </div>
    `;
    html += expiredTasks.map(t => renderBentoTaskCard(t)).join('');
  }

  grid.innerHTML = html;
  updateCountdowns();
}

function renderBentoTaskCard(task) {
  const initial = (task.code || '').split(' ')[0] || task.code || 'TASK';
  const meta = getCourseMeta(task.code);
  const accentColor = task.accent || meta.hex || '#38bdf8';
  const accentName = task.accentName || 'cyan';

  const dueDate = task.dueDate || task.deadline;
  const dObj = new Date(dueDate);
  const formattedDate = task.dateDisplay || (!isNaN(dObj.getTime())
    ? dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : (dueDate || 'Scheduled'));

  const instructorName = task.instructor || (typeof COURSES !== 'undefined' && COURSES[task.code]?.instructor) || "CUFE Staff";
  const locationOrInstructor = task.room 
    ? (task.instructor ? `${task.instructor} • ${task.room}` : task.room)
    : instructorName;
  const locationIcon = task.room ? '📍' : '👤';

  const cd = getExactCountdown(task);
  const cdText = cd.text;
  const isUrgent = cd.isUrgent;
  const isExpired = cd.isPassed;
  const dueDateStr = dueDate || '';

  // Right Button Label & Action logic
  let rightBtnLabel = '⚡ Open Quiz Study Guide ↗';
  let rightBtnAction = `openQuizPreparationGuide('${task.id}')`;

  if (task.id === 'gen-quiz-3' || task.id === 'gen-quiz-2' || (task.code === 'GEN G119' && task.isQuiz)) {
    rightBtnLabel = '🎮 Open Quiz Simulator ↗';
    rightBtnAction = `openMarketingQuiz3Modal()`;
  } else if (task.type === 'Assignment' || task.type?.toLowerCase().includes('assignment') || task.id.includes('assign')) {
    rightBtnLabel = '📂 Open Assignment & Solution ↗';
    rightBtnAction = `openQuizPreparationGuide('${task.id}')`;
  }

  return `
    <article class="bento-task-card bento-${accentName} ${task.isDone ? 'is-completed' : ''} ${isExpired ? 'is-expired' : ''}" style="--bento-c: ${accentColor};" data-task-id="${task.id}" data-due="${escHtml(dueDateStr)}">
      <div class="bento-card-top">
        <div class="bento-subj-tag">
          <span class="bento-subj-initial">${initial}</span>
          <span class="bento-subj-code">${escHtml(task.code || '')}</span>
        </div>
        <span class="bento-type-pill">${escHtml(task.type || 'Quiz')}</span>
      </div>

      <h3 class="bento-card-title">${escHtml(task.title || '')}</h3>

      <div class="bento-card-inst">
        <span class="bento-inst-icon">${locationIcon}</span>
        <span>${escHtml(locationOrInstructor)}</span>
      </div>

      <div class="bento-card-meta-row">
        <div class="bento-card-date">
          <span class="cal-mini-icon">📅</span>
          <span>${escHtml(formattedDate)}</span>
        </div>
        <span class="bento-countdown-badge ${isExpired ? 'expired' : (isUrgent ? 'urgent' : '')}" data-due="${escHtml(dueDateStr)}" style="${isExpired ? 'border-color:#ef4444;color:#f87171;background:rgba(239,68,68,0.15);box-shadow:0 0 10px rgba(239,68,68,0.25);' : ''}">
          ${escHtml(isExpired ? 'منتهي / Expired' : cdText)}
        </span>
      </div>

      <div class="bento-card-actions">
        <button class="btn-official-details" onclick="openOfficialExamModal('${task.id}')">
          <span>Official Details & Files ℹ️</span>
        </button>
        <button class="btn-open-guide" onclick="${rightBtnAction}">
          <span>${escHtml(rightBtnLabel)}</span>
        </button>
      </div>
    </article>
  `;
}

function updateCountdowns() {
  const badges = document.querySelectorAll(".bento-countdown-badge");
  let anyPassedChanged = false;
  badges.forEach(badge => {
    const dueStr = badge.getAttribute("data-due") || badge.closest("[data-due]")?.getAttribute("data-due");
    if (!dueStr) return;
    const cd = getExactCountdown(dueStr);
    const card = badge.closest(".bento-task-card");
    if (cd.isPassed) {
      badge.textContent = "منتهي / Expired";
      badge.classList.add("expired");
      badge.classList.remove("urgent");
      badge.style.borderColor = "#ef4444";
      badge.style.color = "#f87171";
      badge.style.background = "rgba(239, 68, 68, 0.15)";
      badge.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.25)";
      if (card && !card.classList.contains("is-expired")) {
        card.classList.add("is-expired");
        anyPassedChanged = true;
      }
    } else {
      badge.textContent = cd.text;
      badge.classList.remove("expired");
      badge.classList.toggle("urgent", cd.isUrgent);
      badge.style.borderColor = "";
      badge.style.color = "";
      badge.style.background = "";
      badge.style.boxShadow = "";
      if (card) card.classList.remove("is-expired");
    }
  });
  if (anyPassedChanged) {
    updateTaskBadge();
  }
}
window.updateCountdowns = updateCountdowns;

function setSubjectFilterPill(code) {
  triggerHaptic("light");
  activeSubjectFilter = code;
  localStorage.setItem("cufe_tasks_subject", code);
  renderTasksGridOnly();

  document.querySelectorAll(".subj-pill-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.code === code);
  });
}

function handleSortOptionChange(val) {
  triggerHaptic("light");
  activeSortOption = val;
  renderTasksGridOnly();
}

/* ==========================================================================
   PAGE 2: Quiz Preparation Guide View
   ========================================================================== */

function openQuizPreparationGuide(taskId) {
  triggerHaptic("heavy");
  activeQuizGuideId = taskId;
  setView("quiz-guide");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openQuizGuide(taskId) {
  openQuizPreparationGuide(taskId || 'mth-quiz-1');
}

function openQuizPrepGuide(taskId) {
  openQuizPreparationGuide(taskId || 'mth-quiz-1');
}
window.openQuizPrepGuide = openQuizPrepGuide;

function backToTasksView() {
  triggerHaptic("light");
  setView("tasks");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuizPreparationGuideView(taskId) {
  const container = document.getElementById("viewContainer");
  if (!container) return;

  const allTasks = getAllCombinedTasks();
  let task = allTasks.find(t => t.id === taskId);
  if (!task) {
    task = allTasks.find(isQuizTask) || allTasks[0];
  }
  if (!task) {
    container.innerHTML = `
      <div class="qg-standalone-view">
        <button class="btn-back-tasks" onclick="backToTasksView()">← Back to Tasks</button>
        <div style="text-align:center;padding:40px;color:var(--text-muted);">Quiz data not found.</div>
      </div>
    `;
    return;
  }

  activeQuizGuideId = task.id;
  const p = getQuizProgressById(task.id);
  const initial = task.code.split(' ')[0] || task.code;
  const instructorName = task.instructor || COURSES[task.code]?.instructor || "CUFE Staff";

  const dObj = new Date(task.deadline);
  const formattedDate = task.dateDisplay || (!isNaN(dObj.getTime())
    ? dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : task.deadline);

  container.innerHTML = `
    <div class="qg-standalone-view" id="qgViewRoot">
      <!-- Back Navigation Button -->
      <div class="qg-top-bar">
        <button class="btn-back-tasks" onclick="backToTasksView()">
          <span class="back-arrow">←</span>
          <span>Back to Tasks</span>
        </button>
      </div>

      <!-- Hero Header Section -->
      <header class="qg-hero-header">
        <div class="qg-hero-left">
          <div class="qg-subj-pill-badge">${initial}</div>
          <div class="qg-hero-titles">
            <h1 class="qg-hero-title">${escHtml(task.title)}</h1>
            <div class="qg-hero-meta">
              <span>${task.code}</span>
              <span>•</span>
              <span>${escHtml(instructorName)}</span>
              <span>•</span>
              <span>📅 ${formattedDate}</span>
            </div>
          </div>
        </div>

        <div class="qg-hero-right">
          <div id="qgReadinessRingBox">
            ${renderCircularGaugeSvg(p.pct, 68, 6, "#38bdf8", "Readiness")}
          </div>
          <div class="qg-hero-encourage" id="qgHeroEncourage">
            <span class="encourage-main">${p.pct >= 100 ? 'Fully Prepared!' : (p.pct >= 50 ? 'Great progress!' : 'Keep going!')}</span>
            <span class="encourage-sub">${p.pct >= 100 ? 'You got this! 🎯' : 'Keep going 🚀'}</span>
          </div>
        </div>
      </header>

      <!-- Wide Glowing Progress Bar -->
      <div class="qg-glowing-bar-row">
        <div class="qg-glowing-bar-track">
          <div class="qg-glowing-bar-fill" id="qgProgressFill" style="width: ${p.pct}%;"></div>
        </div>
        <span class="qg-glowing-bar-pct" id="qgProgressPct">${p.pct}%</span>
      </div>

      <!-- 4 Bento Grid Cards (2x2 Grid) -->
      <div class="qg-bento-cards-grid">
        ${renderQuizGuideBentoGridHtml(task, p)}
      </div>
    </div>
  `;
}

function renderQuizGuideBentoGridHtml(task, p) {
  const driveInfo = DRIVE_DATA[task.code] || {};
  const driveUrl = driveInfo.folder || MAIN_SEMESTER_DRIVE;

  const categoriesToRender = p.categories.filter(cat => cat.items && cat.items.length > 0);
  if (!categoriesToRender.length) {
    return `<div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text-muted);">No additional files.</div>`;
  }

  return categoriesToRender.map(cat => {
    const isCompletedCount = cat.items.filter(i => !!p.state[i.id]).length;
    const totalCount = cat.items.length;

    let viewAllLabel = "View All →";
    let viewAllLink = driveUrl;
    if (cat.key === 'lectures') { viewAllLabel = "View All Lectures →"; viewAllLink = driveInfo.lectures || driveUrl; }
    else if (cat.key === 'sheets') { viewAllLabel = "View All Sheets →"; viewAllLink = driveInfo.sheets || driveUrl; }
    else if (cat.key === 'practice') { viewAllLabel = "View All Videos →"; viewAllLink = driveUrl; }
    else if (cat.key === 'formula') { viewAllLabel = "View Full Guide →"; viewAllLink = driveUrl; }

    return `
      <section class="qg-bento-card qg-bento-${cat.key}">
        <div class="qg-card-head">
          <div class="qg-card-title-group">
            <div class="qg-card-icon-squircle">${cat.icon}</div>
            <h2 class="qg-card-label">${escHtml(cat.label)}</h2>
          </div>
          <span class="qg-card-counter" id="qgCount-${cat.key}">${isCompletedCount}/${totalCount} completed</span>
        </div>

        <div class="qg-card-items-list">
          ${cat.items.map(item => {
            const isChecked = !!p.state[item.id];
            return `
              <div class="qg-checklist-row ${isChecked ? 'is-completed' : ''}" id="qgRow-${item.id}">
                <button class="qg-checkbox-circle ${isChecked ? 'checked' : ''}" id="qgCheck-${item.id}"
                  role="checkbox" aria-checked="${isChecked}"
                  onclick="toggleQuizChecklistItem('${task.id}', '${item.id}')">
                  ${isChecked ? '✓' : ''}
                </button>

                <div class="qg-item-title-box" onclick="toggleQuizChecklistItem('${task.id}', '${item.id}')">
                  <span class="qg-item-title-txt">${escHtml(item.title)}</span>
                </div>

                ${item.links && item.links.length ? `
                  <div class="qg-item-pills">
                    ${item.links.map(l => `
                      <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="qg-mini-pill-btn">
                        <span>${l.icon || '↗'}</span>
                        <span>${escHtml(l.label)}</span>
                      </a>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div class="qg-card-footer">
          <a href="${viewAllLink}" target="_blank" rel="noopener noreferrer" class="qg-view-all-link">
            ${viewAllLabel}
          </a>
        </div>
      </section>
    `;
  }).join('');
}

function toggleQuizChecklistItem(taskId, itemId) {
  triggerHaptic("light");
  if (!quizChecklistState[taskId]) {
    quizChecklistState[taskId] = {};
  }
  const beforePct = getQuizProgressById(taskId).pct;
  if (quizChecklistState[taskId][itemId]) {
    delete quizChecklistState[taskId][itemId];
  } else {
    quizChecklistState[taskId][itemId] = Date.now();
  }
  localStorage.setItem("cufe_quiz_checklists", JSON.stringify(quizChecklistState));

  const afterProgress = getQuizProgressById(taskId);
  const afterPct = afterProgress.pct;
  if (afterPct === 100 && beforePct < 100 && typeof confetti === 'function') {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 }, zIndex: 10050 });
  }

  // Update in-place if currently in Quiz Preparation Guide view
  if (activeView === "quiz-guide" && activeQuizGuideId === taskId) {
    const isChecked = !!quizChecklistState[taskId][itemId];
    const row = document.getElementById(`qgRow-${itemId}`);
    const checkBtn = document.getElementById(`qgCheck-${itemId}`);
    if (row) row.classList.toggle("is-completed", isChecked);
    if (checkBtn) {
      checkBtn.classList.toggle("checked", isChecked);
      checkBtn.innerHTML = isChecked ? '✓' : '';
      checkBtn.setAttribute("aria-checked", String(isChecked));
    }

    // Update category counters
    afterProgress.categories.forEach(cat => {
      const badge = document.getElementById(`qgCount-${cat.key}`);
      if (badge) {
        const doneInCat = cat.items.filter(i => !!afterProgress.state[i.id]).length;
        badge.textContent = `${doneInCat}/${cat.items.length} completed`;
      }
    });

    // Update wide progress bar
    const barFill = document.getElementById("qgProgressFill");
    const barPct = document.getElementById("qgProgressPct");
    if (barFill) barFill.style.width = `${afterPct}%`;
    if (barPct) barPct.textContent = `${afterPct}%`;

    // Update readiness ring
    const ringBox = document.getElementById("qgReadinessRingBox");
    if (ringBox) {
      ringBox.innerHTML = renderCircularGaugeSvg(afterPct, 68, 6, "#38bdf8", "Readiness");
    }

    // Update encouragement text
    const encourage = document.getElementById("qgHeroEncourage");
    if (encourage) {
      encourage.innerHTML = `
        <span class="encourage-main">${afterPct >= 100 ? 'Fully Prepared!' : (afterPct >= 50 ? 'Great progress!' : 'Keep going!')}</span>
        <span class="encourage-sub">${afterPct >= 100 ? 'You got this! 🎯' : 'Keep going 🚀'}</span>
      `;
    }
  }

  // If in tasks view, re-render
  if (activeView === "tasks") {
    renderTasksScreen();
  }
}

/* ==========================================================================
   PAGE 3: Official Exam Details Modal
   ========================================================================== */

function formatOfficialExamInstruction(rawText) {
  let text = String(rawText || '').replace(/^[•\-\*]\s*/, '').trim();
  const isAlert = /⚠️|تنبيه|تريكة|مهم/i.test(text);

  let label = '';
  let content = text;
  const colonMatch = text.match(/^([^:]{2,35}:)\s*(.*)$/);
  if (colonMatch) {
    label = colonMatch[1];
    content = colonMatch[2];
  }

  // Isolate English words/phrases, parentheses, signed percentages, URLs, and times
  const enRegex = /(\([A-Za-z0-9_\-./\s%+:]+\)|(?:https?:\/\/|www\.)[^\s<]+|[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-./]+|[+\-]?\d+(?:\.\d+)?%|\b\d{1,2}:\d{2}\b|[A-Za-z][A-Za-z0-9_\-/%+:]*(?:\s+[A-Za-z0-9_\-/%+:]+)*)/g;
  
  let escapedLabel = escHtml(label);
  let escapedContent = escHtml(content).replace(enRegex, match => `<span class="en-term" dir="ltr">${match}</span>`);

  return { isAlert, label: escapedLabel, content: escapedContent };
}

function openOfficialExamModal(taskId) {
  triggerHaptic("heavy");
  const allTasks = getAllCombinedTasks();
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return;

  const modal = document.getElementById("officialExamModal");
  const body = document.getElementById("officialExamModalBody");
  if (!modal || !body) return;

  const modalTitle = modal.querySelector(".exam-modal-title");
  const modalSub = modal.querySelector(".exam-modal-subtitle");
  if (modalTitle) modalTitle.textContent = task.title || "Official Details & Files";
  if (modalSub) modalSub.textContent = `${task.code || ''} • ${task.type || 'Official Exam Details'}`;

  const sObj = new Date(task.start);
  const formattedStart = !isNaN(sObj.getTime())
    ? `${sObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${sObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })})`
    : (task.start || task.dateDisplay || "Oct 2026");

  const dObj = new Date(task.dueDate || task.deadline);
  const formattedEnd = !isNaN(dObj.getTime())
    ? `${dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${dObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })})`
    : (task.deadline || task.dateDisplay || "Oct 2026");

  const instructorName = task.instructor || (typeof COURSES !== 'undefined' && COURSES[task.code]?.instructor) || "CUFE Staff";
  const instructionsList = task.instructions && task.instructions.length ? task.instructions : [
    "Make sure to read all instructions carefully.",
    "The exam is time-limited.",
    "Use only the official submission form.",
    "Late submissions will not be accepted."
  ];

  // Build full list of official files & links
  const filesList = [];
  if (Array.isArray(task.sheets)) {
    task.sheets.forEach(s => {
      if (s.pdf) {
        filesList.push({
          title: s.title || s.name || 'ملف الأسئلة / الشيت',
          url: s.pdf,
          icon: '📄',
          bg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
          shadow: '0 4px 14px rgba(56, 189, 248, 0.35)'
        });
      }
      if (s.sol && s.sol !== s.pdf) {
        filesList.push({
          title: s.solTitle || `حل ${s.title || s.name || 'النموذجي'}`,
          url: s.sol,
          icon: '✅',
          bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          shadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
        });
      }
    });
  }
  if (Array.isArray(task.lectures)) {
    task.lectures.forEach(l => {
      if (l.slides && !filesList.some(f => f.url === l.slides)) {
        filesList.push({
          title: l.title || 'سلايدات المحاضرة (Slides)',
          url: l.slides,
          icon: '📊',
          bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          shadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
        });
      }
    });
  }
  if (task.submissionUrl && !filesList.some(f => f.url === task.submissionUrl)) {
    filesList.push({
      title: task.type === 'Assignment' ? '📁 مجلد الأسينمنت والتسليم الرسمي' : '🚀 فورم / موقع التسليم الرسمي (Official Submission)',
      url: task.submissionUrl,
      icon: task.type === 'Assignment' ? '📁' : '🚀',
      bg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
      shadow: '0 4px 14px rgba(56, 189, 248, 0.35)'
    });
  }
  if (task.solutionUrl && !filesList.some(f => f.url === task.solutionUrl)) {
    filesList.push({
      title: '✅ فولدر / ملف الحلول النموذجية (Official Solution)',
      url: task.solutionUrl,
      icon: '✅',
      bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      shadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
    });
  }

  const isMarketing = task.id === 'gen-quiz-2' || (task.code === 'GEN G119' && task.isQuiz);

  body.innerHTML = `
    <div class="official-exam-grid">
      <!-- Left Column: Exam Details Meta -->
      <div class="exam-meta-column">
        <div class="exam-meta-item">
          <div class="meta-label"><span>📄</span><span>Exam / Task Title</span></div>
          <div class="meta-value highlight">${escHtml(task.title)}</div>
        </div>

        <div class="exam-meta-item">
          <div class="meta-label"><span>🎓</span><span>Course</span></div>
          <div class="meta-value">${escHtml(task.code)} — ${escHtml(COURSES[task.code]?.name || '')}</div>
        </div>

        <div class="exam-meta-item">
          <div class="meta-label"><span>👨‍🏫</span><span>Instructor / Staff</span></div>
          <div class="meta-value">${escHtml(instructorName)}</div>
        </div>

        ${task.room ? `
          <div class="exam-meta-item">
            <div class="meta-label"><span>📍</span><span>Location / المكان</span></div>
            <div class="meta-value highlight" style="color: #38bdf8;">${escHtml(task.room)}</div>
          </div>
        ` : ''}

        ${task.marks ? `
          <div class="exam-meta-item">
            <div class="meta-label"><span>🎯</span><span>Marks / الدرجة</span></div>
            <div class="meta-value">${escHtml(task.marks)}</div>
          </div>
        ` : ''}

        <div class="exam-meta-item">
          <div class="meta-label"><span>📅</span><span>Start Date</span></div>
          <div class="meta-value">${formattedStart}</div>
        </div>

        <div class="exam-meta-item">
          <div class="meta-label"><span>📅</span><span>Deadline / التسليم</span></div>
          <div class="meta-value">${formattedEnd}</div>
        </div>

        <div class="exam-meta-item">
          <div class="meta-label"><span>⏳</span><span>Status / الحالة</span></div>
          <div class="meta-value" style="${task.isPassed ? 'color:#f87171;font-weight:800;' : 'color:#38bdf8;font-weight:800;'}">
            ${task.isPassed ? 'منتهي / Expired' : 'قادم / Active Upcoming'}
          </div>
        </div>

        <!-- Files & Links Section -->
        <div class="exam-meta-item submission-item">
          <div class="meta-label"><span>📁</span><span>المستندات والروابط الرسمية (Official Files & Links)</span></div>
          <div style="display:flex;flex-direction:column;gap:8px;width:100%;">
            ${filesList.map(f => `
              <a href="${f.url}" target="_blank" rel="noopener noreferrer" class="exam-open-form-btn" style="background:${f.bg};box-shadow:${f.shadow};">
                <span>${f.icon} ${escHtml(f.title)}</span>
                <span class="btn-arrow">↗</span>
              </a>
            `).join('')}

            ${isMarketing ? `
              <button onclick="closeOfficialExamModal(); openMarketingQuiz3Modal();" class="exam-open-form-btn" style="background:linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);box-shadow:0 4px 14px rgba(6, 182, 212, 0.35);cursor:pointer;border:none;">
                <span>🎮 فتح محاكي الكويز والـ Test Bank التفاعلي (Quiz Simulator)</span>
                <span class="btn-arrow">↗</span>
              </button>
            ` : ''}

            <button onclick="closeOfficialExamModal(); openQuizPreparationGuide('${task.id}');" class="exam-open-form-btn" style="background:linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);box-shadow:0 4px 14px rgba(6, 182, 212, 0.35);cursor:pointer;border:none;">
              <span>⚡ فتح دليل المذاكرة الشامل (Open Study Guide)</span>
              <span class="btn-arrow">↗</span>
            </button>
          </div>
          <span class="meta-sub-hint">${task.type === 'Assignment' ? 'المسائل والتعليمات موضحة في القائمة المجاورة' : 'جميع الملفات والروابط معتمدة رسمياً'}</span>
        </div>
      </div>

      <!-- Right Column: Instructions List -->
      <div class="exam-instructions-column">
        <div class="instructions-box">
          <div class="instructions-header">
            <span class="instructions-header-icon">📋</span>
            <span>${task.type === 'Assignment' ? 'قائمة المسائل المطلوبة والتعليمات' : 'تعليمات وتنبيهات الامتحان (Official Instructions)'}</span>
          </div>

          <div class="instructions-list">
            ${instructionsList.map((inst, idx) => {
              const item = formatOfficialExamInstruction(inst);
              return `
                <div class="instruction-item ${item.isAlert ? 'is-alert' : ''}">
                  <span class="instruction-badge ${item.isAlert ? 'badge-alert' : ''}">${idx + 1}</span>
                  <div class="instruction-content">
                    <div class="instruction-text">
                      ${item.label ? `<strong class="instruction-label ${item.isAlert ? 'is-alert' : ''}">${item.label}</strong> ` : ''}${item.content}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Centered Footer Close Button -->
    <div class="official-exam-footer">
      <button class="btn-got-it" onclick="closeOfficialExamModal()">
        Got it, thanks!
      </button>
    </div>
  `;

  modal.classList.add("open");
}

function closeOfficialExamModal() {
  triggerHaptic("light");
  const modal = document.getElementById("officialExamModal");
  if (modal) modal.classList.remove("open");
}

// Close on overlay backdrop click
document.addEventListener("click", e => {
  const modal = document.getElementById("officialExamModal");
  if (modal && e.target === modal) {
    closeOfficialExamModal();
  }
});

function openTaskDetails(taskId) {
  openOfficialExamModal(taskId);
}

function closeTaskDetails() {
  const overlay = document.getElementById("taskDetailsOverlay");
  if (overlay) overlay.classList.remove("open");
  currentDetailedTask = null;
}

function toggleTaskCompleted(taskId) {
  triggerHaptic("heavy");
  const wasDone = completedTasks.includes(taskId);
  if (wasDone) {
    completedTasks = completedTasks.filter(id => id !== taskId);
  } else {
    completedTasks.push(taskId);
    if (typeof confetti === 'function') confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
  }
  localStorage.setItem("cufe_completed_tasks", JSON.stringify(completedTasks));

  if (activeView === "tasks") {
    renderTasksScreen();
  } else if (activeView === "quiz-guide") {
    renderQuizPreparationGuideView(taskId);
  }

  updateTaskBadge();
}

function refreshTasksHub() {
  updateTaskBadge();
  if (activeView === 'tasks') {
    renderTasksScreen();
  } else if (activeView === 'quiz-guide' && activeQuizGuideId) {
    renderQuizPreparationGuideView(activeQuizGuideId);
  }
}


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
          ${dayEvents.map(ev => `<span class="cal-event-dot" style="background:${ev.color};" title="${ev.code}:${ev.title}"></span>`).join("")}
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
/* ==========================================================================
   CUFE Mechanical Engineering — Batch 30 Application Logic Engine (Part 2 / 2)
   ========================================================================== */

function initNotifications() {
  const dot = document.getElementById("navNotifDot");
  if (!dot) return;
  const readIds = JSON.parse(localStorage.getItem("cufe_read_notifs") || "[]");
  const hasUnread = NOTIFICATIONS.some(n => !readIds.includes(n.id));
  dot.style.display = hasUnread ? "block" : "none";

  const list = document.getElementById("notifList");
  if (list) {
    list.innerHTML = NOTIFICATIONS.map(n => `
      <div class="modal-item">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:9.5px;font-weight:800;color:var(--accent)">${n.tag || 'Notice'}</span>
          <span style="font-family:'JetBrains Mono';font-size:10px;color:var(--text-muted)">${n.date || ''}</span>
        </div>
        <div style="font-size:13px;font-weight:700;color:var(--text-main);margin-top:2px;">${n.title || ''}</div>
        <div style="font-size:11.5px;color:var(--text-muted);margin-top:2px;line-height:1.5;">${n.body || ''}</div>
        ${n.actions && n.actions.length ? `
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
            ${n.actions.map(a => a.action ? `
              <button onclick="closeNotifModal(); ${a.action};" class="banner-action-link" style="background:#10b981;padding:4px 10px;font-size:11px;font-weight:800;cursor:pointer;color:#fff;">${a.label}</button>
            ` : `
              <a href="${a.url}" target="_blank" rel="noopener noreferrer" class="banner-action-link banner-official-btn" style="padding:4px 10px;font-size:11px;font-weight:600;">${a.label} ↗</a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `).join("");
  }
}

function openNotifModal() {
  triggerHaptic("heavy");
  document.getElementById("notifModal").classList.add("open");
  const allIds = NOTIFICATIONS.map(n => n.id);
  localStorage.setItem("cufe_read_notifs", JSON.stringify(allIds));
  const dot = document.getElementById("navNotifDot");
  if (dot) dot.style.display = "none";
}

function closeNotifModal() { document.getElementById("notifModal").classList.remove("open"); }
document.getElementById("notifModal").addEventListener("click", e => { if (e.target.id === "notifModal") closeNotifModal(); });

function updateAcademicCalendarInfo() {
  const now = new Date();
  const fElem = document.getElementById("fullDateDisplay");
  if (fElem) fElem.textContent = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const badge = document.getElementById("academicWeekBadge");
  if (badge) badge.textContent = `Academic Week ${currentDisplayWeek}`;
}

function updateDayProgressBar() {
  const progressBox = document.getElementById("dayProgressContainer");
  const barFill = document.getElementById("dayProgressBar");
  const label = document.getElementById("dayProgressLabel");
  const remaining = document.getElementById("dayProgressRemaining");
  
  if (!progressBox || !barFill || !label || !remaining) return;

  if (activeView === "drive" || activeView === "guide" || activeView === "tasks" || activeView === "cad" || activeView === "quiz-guide") {
    progressBox.style.display = "none";
    return;
  }
  progressBox.style.display = "flex";

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
  const clockEl = document.getElementById("liveClock");
  if (clockEl) clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Update week matrix live indicator in real-time
  if (typeof updateTimelineLiveIndicator === "function") {
    updateTimelineLiveIndicator();
  }

  const dot = document.getElementById("liveDot");
  const text = document.getElementById("liveText");
  if (!dot || !text) return;

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

  // Filter out cancelled sessions for the active hero banner if possible
  const validDaySessions = daySessions.filter(s => !s.cancelled);
  let targetHeroSession = (liveSession && !liveSession.cancelled) ? liveSession : (upcomingSession && !upcomingSession.cancelled ? upcomingSession : null);
  if (!targetHeroSession && validDaySessions.length > 0) {
    targetHeroSession = validDaySessions[0];
  } else if (!targetHeroSession && daySessions.length > 0) {
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
    const isSolidWorks = (s.code === "MDP G111");
    const isMarketing = (s.code === "GEN G119");
    const hasCustomLinks = !!COURSE_CUSTOM_LINKS[s.code];
    const isCancelled = !!s.cancelled;

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
        <div class="rail"><div class="rail-dot" style="--c: ${isCancelled ? '#ef4444' : (isCurrentActive ? '#ef4444' : course.color)}"></div><div class="rail-line"></div></div>
        <div class="timeline-card ${isCurrentActive && !isCancelled ? 'is-live-card' : ''} ${s.attendance && !isCancelled ? 'has-attendance-check' : ''} ${isDimmed ? 'dimmed' : ''} ${isHighlighted ? 'highlighted' : ''} ${isCancelled ? 'is-cancelled-card' : ''}" data-course="${s.code}" style="--c: ${isCancelled ? '#ef4444' : course.color}; border-left: 4.5px solid ${isCancelled ? '#ef4444' : (isCurrentActive ? '#ef4444' : course.color)}">
          
          <div class="card-top">
            <span style="font-family:'JetBrains Mono';font-size:13px;font-weight:800;color:${isCancelled ? '#ef4444' : (isCurrentActive ? '#ef4444' : course.color)}">${s.code}</span>
            <div class="badges-group">
              ${isCancelled ? '<span class="badge" style="background:#ef4444;color:#fff;font-weight:800;padding:2px 7px;border-radius:5px;box-shadow:0 0 10px rgba(239,68,68,0.4);">🚫 ملغية</span>' : ''}
              ${s.quizBadge && isSessionBadgeVisible(s, 'quiz') ? `<span class="badge-quiz-glow" onclick="${s.code === 'GEN G119' ? "openMarketingQuiz3Modal()" : (s.code === 'MDP G121' ? `openSessionNoticeModal('${s.day}', ${s.start}, '${s.code}')` : `openQuizPrepGuide('${s.quizTaskId || 'gen-quiz-3'}')`)}" style="cursor:pointer;" title="${escHtml(s.quizBadge)}">${escHtml(s.quizBadge)}</span>` : ''}
              ${s.assignmentBadge && isSessionBadgeVisible(s, 'assignment') ? `<span class="badge-assignment-glow" onclick="event.stopPropagation(); openSessionNoticeModal('${s.day}', ${s.start}, '${s.code}')" style="cursor:pointer;" title="${escHtml(s.assignmentBadge)}">${escHtml(s.assignmentBadge)}</span>` : ''}
              ${isCurrentActive && !isCancelled ? '<span class="badge-live-now">🔴 LIVE NOW</span>' : ''}
              ${hasTask ? `<span class="badge" style="background:var(--quiz-color);color:#fff;font-weight:800;cursor:pointer" onclick="setView('tasks')">⚡ QUIZ</span>` : ''}
              ${s.attendance && !isCancelled ? '<span class="badge-attendance" title="⚠️ ATTENDANCE: الحضور إلزامي ومحسوب">⚠️ ATTENDANCE</span>' : ''}
              ${(s.hasNotice || s.note) && !isCancelled ? `<span class="badge-notice-bell" data-day="${s.day}" data-start="${s.start}" data-code="${s.code}" title="📢 اضغط لعرض تفاصيل ومواعيد التسليم">🔔</span>` : ''}
              <span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:5px;background:var(--surface-alt);color:var(--text-muted)">${s.isDynSec ? 'SEC' : (isShared ? 'LEC' : 'SEC')}</span>
            </div>
          </div>

          <div class="card-title" style="${isCancelled ? 'text-decoration:line-through;opacity:0.75;' : ''}">${course.name}</div>
          
          ${isCancelled && s.cancelNotice ? `
            <div class="card-cancel-alert" style="margin-top:8px;padding:8px 12px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.35);border-radius:10px;color:#fca5a5;font-size:12.5px;font-weight:700;display:flex;align-items:center;gap:6px;">
              <span style="font-size:15px;">📢</span>
              <span>${escHtml(s.cancelNotice)}</span>
            </div>
          ` : ''}

          ${!isCancelled && s.note ? `
            <div class="card-note-alert" style="margin-top:8px;padding:8px 12px;background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.35);border-radius:10px;color:#fde047;font-size:11.5px;font-weight:600;display:flex;align-items:flex-start;gap:6px;line-height:1.55;white-space:pre-line;cursor:pointer;" dir="auto" onclick="openSessionNoticeModal('${s.day}', ${s.start}, '${s.code}')" title="اضغط لعرض كامل التفاصيل والروابط">
              <span style="font-size:14px;flex-shrink:0;">📢</span>
              <span>${escHtml(s.note)}</span>
            </div>
          ` : ''}

          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-top:6px;">
            <div class="card-room-pill" onclick="showRoomDetails('${s.room}')">📍 ${s.room} ↗</div>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              ${isSolidWorks ? `<button class="capsule-pill-btn cad-hub-pill" onclick="setView('cad')">⚡ CAD Hub</button>` : ''}
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

  // Attach direct listeners to bell badges in daily agenda
  container.querySelectorAll(".badge-notice-bell").forEach(bellEl => {
    const day = bellEl.getAttribute("data-day");
    const start = Number(bellEl.getAttribute("data-start"));
    const code = bellEl.getAttribute("data-code");
    bellEl.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      openSessionNoticeModal(day, start, code);
    });
    bellEl.addEventListener("mouseenter", (e) => {
      if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        showSessionNoticeTooltip(e, day, start, code);
      }
    });
    bellEl.addEventListener("mouseleave", () => {
      hideSessionNoticeTooltip();
    });
  });

  attachSwipeListeners();
}

// ==========================================================================
// Modern Proportional Dynamic Timeline Calendar Engine
// ==========================================================================

function getSessionNoticeData(dayIdxOrName, slotStart, code) {
  const effectiveSessions = getActiveEffectiveSessions();
  let dayName = typeof dayIdxOrName === 'number' && DAYS[dayIdxOrName] ? DAYS[dayIdxOrName].full : dayIdxOrName;
  const numStart = Number(slotStart);

  // 1. Exact match in effectiveSessions
  let session = effectiveSessions.find(s => s.day === dayName && s.code === code && (Number(s.start) === numStart || (s.start <= numStart && (s.start + s.span) > numStart)));
  
  // 2. Exact match in SESSIONS (bypassing group filter)
  if (!session) {
    session = SESSIONS.find(s => s.day === dayName && s.code === code && (Number(s.start) === numStart || (s.start <= numStart && (s.start + s.span) > numStart)));
  }

  // 3. Search in effectiveSessions / SESSIONS by day + code with noticeData or note
  if (!session || (!session.noticeData && !session.note)) {
    const noticeSession = effectiveSessions.find(s => s.day === dayName && s.code === code && (s.noticeData || s.note))
                       || SESSIONS.find(s => s.day === dayName && s.code === code && (s.noticeData || s.note));
    if (noticeSession) session = noticeSession;
  }

  // 4. Search in effectiveSessions / SESSIONS by code with noticeData or note
  if (!session || (!session.noticeData && !session.note)) {
    const noticeSession = effectiveSessions.find(s => s.code === code && (s.noticeData || s.note))
                       || SESSIONS.find(s => s.code === code && (s.noticeData || s.note));
    if (noticeSession) session = noticeSession;
  }

  // 5. Fallback
  if (!session) {
    session = effectiveSessions.find(s => s.code === code) || SESSIONS.find(s => s.code === code) || { code: code || "EPE G113", room: "14301", note: "" };
  }
  return session;
}

function showSessionNoticeTooltip(event, dayIdxOrName, slotStart, code) {
  // Mobile / touch devices check: never show floating coordinate tooltip on touch devices
  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  const session = getSessionNoticeData(dayIdxOrName, slotStart, code);
  if (!session) return;

  let tooltipEl = document.getElementById("sessionNoticeTooltip");
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "sessionNoticeTooltip";
    tooltipEl.className = "session-notice-tooltip";
    document.body.appendChild(tooltipEl);
  }

  let title = session.noticeData?.title || `تنبيه مادة ${session.code}`;
  let text = "";
  if (session.code === "EPE G113") {
    text = "⏰ فترتان للحضور: (12:30 و 2:00) بقاعة 14301\n📝 تسليم Assignment 2 على ورق A4 (الخميس 22 أكتوبر — 21 مسألة)";
  } else if (session.code === "MDP G121") {
    text = "⚡ كويز 1 الثلاثاء 20 أكتوبر بمدرج 7104 (5 درجات)\n🎯 مفيش نظري — التركيز على سلايدات السكشن وكويز وأسينمنت السنة اللي فاتت";
  } else if (session.code === "MTH G102" && (session.isQuiz || session.day === "Monday")) {
    text = "⏰ كويز 1 الإثنين: 11:00 ظهراً بمدرج 3002\n🎯 10 درجات MCQ على أول محاضرتين (التصحيح على التظليل فقط)";
  } else if (session.code === "GEN G119") {
    text = "⚡ كويز 3 الأحد 1 نوفمبر: 8:00 صباحاً بقاعة 3103-414\n🎯 5 دقائق فقط على Chapter 3 من بنك الأسئلة (20 سؤال)";
  } else {
    text = session.note || "ملاحظات هامة مسجلة لهذه المحاضرة.";
  }

  tooltipEl.innerHTML = `
    <div class="session-notice-tooltip-head">
      <span>🔔</span>
      <span>${session.code} • تنبيه وملاحظات</span>
    </div>
    <div class="session-notice-tooltip-body">${escHtml(text)}</div>
    <div class="session-notice-tooltip-hint">
      <span>👉 اضغط على الجرس لعرض الروابط والتفاصيل الكاملة</span>
    </div>
  `;

  const target = event.currentTarget || event.target;
  const rect = target.getBoundingClientRect();
  const tooltipWidth = 310;
  
  let left = rect.left + rect.width / 2 - tooltipWidth / 2;
  if (left < 10) left = 10;
  if (left + tooltipWidth > window.innerWidth - 10) {
    left = window.innerWidth - tooltipWidth - 10;
  }

  tooltipEl.style.left = `${left}px`;
  if (rect.top < 130) {
    tooltipEl.style.top = `${rect.bottom + 8}px`;
    tooltipEl.style.transform = "translateY(0)";
  } else {
    tooltipEl.style.top = `${rect.top - 8}px`;
    tooltipEl.style.transform = "translateY(-100%)";
  }

  tooltipEl.classList.add("active");
}

function hideSessionNoticeTooltip() {
  const tooltipEl = document.getElementById("sessionNoticeTooltip");
  if (tooltipEl) {
    tooltipEl.classList.remove("active");
  }
}

function openSessionNoticeModal(dayIdxOrName, slotStart, code) {
  triggerHaptic("light");
  hideSessionNoticeTooltip();
  
  let modal = document.getElementById("bell-note-modal") || document.getElementById("sessionNoticeModal");
  if (!modal) return;

  // 1. DOM Portal to document.body (prevents parent overflow/filter/clip on mobile)
  if (modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }

  // Bind backdrop click to safely close modal
  if (!modal._backdropBound) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeSessionNoticeModal();
      }
    });
    modal._backdropBound = true;
  }

  const titleEl = document.getElementById("sessionNoticeModalTitle");
  const subEl = document.getElementById("sessionNoticeModalSubtitle");
  const bodyEl = document.getElementById("sessionNoticeModalBody");
  if (!bodyEl) return;

  const session = getSessionNoticeData(dayIdxOrName, slotStart, code);
  const course = COURSES[session.code] || { name: session.code, hex: "#fb923c" };

  // Special Notice 1: EPE G113 Thursday Session Notice & Assignment 2 Submissions
  if (session.code === "EPE G113" || (session.noticeData && session.noticeData.assignmentUrl && session.code !== "MTH G102")) {
    const nd = session.noticeData || {
      title: "🚨 تسليم Assignment 2 (EPE G113) — الخميس 22 أكتوبر",
      slots: "الموعد والمكان: التسليم يوم الخميس القادم في السكشن (قاعة 14301 — فترة 12:30 أو فترة 2:00) على ورق A4 (الاسم، الكود، السكشن، القسم).",
      assignmentUrl: "https://drive.google.com/file/d/1sk39paE42hm7TO-I1t6XfnKKt4Bw50gl/view?usp=drivesdk",
      solutionUrl: "https://drive.google.com/file/d/1Fb-jlC3OuiCCUsUGG6oqd5cxZMuT_m1_/view?usp=drivesdk",
      driveUrl: "https://drive.google.com/drive/folders/1pk7PS5s3qRAOu6YTNvZoOaBziQoBhtVz?usp=drive_link"
    };

    if (titleEl) titleEl.textContent = nd.title || "🚨 تسليم Assignment 2 (EPE G113) — الخميس 22 أكتوبر";
    if (subEl) subEl.textContent = `${session.code} • ${course.name}`;

    bodyEl.innerHTML = `
      <!-- الموعد والمكان والتسليم -->
      <div class="notice-section-box">
        <div class="notice-section-header">
          <span>⏰</span>
          <span>الموعد والمكان والتسليم:</span>
        </div>
        <div class="notice-slot-pill">
          <strong>الفترة الأولى:</strong>
          <span>12:30 ظهراً – 2:00 ظهراً (قاعة 14301)</span>
        </div>
        <div class="notice-slot-pill">
          <strong>الفترة الثانية:</strong>
          <span>2:00 ظهراً – 3:30 عصراً (قاعة 14301)</span>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px;line-height:1.5;">
          📍 <strong>الموعد والمكان:</strong> التسليم يوم الخميس القادم في السكشن (قاعة 14301 — فترة 12:30 أو فترة 2:00) على ورق A4 (الاسم، الكود، السكشن، القسم).
        </div>
      </div>

      <!-- أرقام المسائل المطلوبة من Chapter 2 -->
      <div class="notice-section-box">
        <div class="notice-section-header">
          <span>📝</span>
          <span>أرقام المسائل المطلوبة من Chapter 2 (إجمالي 21 مسألة):</span>
        </div>
        <div class="notice-req-list">
          <div class="notice-req-item">
            <span style="color:#fb923c;font-weight:900;">•</span>
            <div>
              <strong>المجموعة الأولى (18 مسألة):</strong><br>
              <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:#fde047;direction:ltr;display:inline-block;margin-top:3px;">2.12, 2.13, 2.18, 2.23, 2.24, 2.25, 2.31, 2.32, 2.35, 2.36, 2.34, 2.44, 2.47, 2.59, 2.70, 2.71, 2.72, and 2.78</span>
            </div>
          </div>
          <div class="notice-req-item">
            <span style="color:#fb923c;font-weight:900;">•</span>
            <div>
              <strong>المجموعة الثانية (3 مسائل):</strong><br>
              <span style="font-family:'JetBrains Mono',monospace;font-size:11.5px;color:#fde047;direction:ltr;display:inline-block;margin-top:3px;">2.45, 2.53, 2.76</span>
            </div>
          </div>
          <div class="notice-req-item">
            <span style="color:#fb923c;font-weight:900;">•</span>
            <span>👥 مسموح للطالب تسليم الأسينمنت الخاص به وأسينمنت لزميل واحد فقط كحد أقصى.</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#fb923c;font-weight:900;">•</span>
            <span>🎥 السكشن هيتصور فيديو بجودة عالية وهينزل على يوتيوب للشرح والمراجعة.</span>
          </div>
        </div>
      </div>

      <!-- أزرار الروابط المباشرة للأسينمنت وحله -->
      <div class="notice-actions-row">
        <a href="${nd.assignmentUrl || 'https://drive.google.com/file/d/1sk39paE42hm7TO-I1t6XfnKKt4Bw50gl/view?usp=drivesdk'}" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-primary">
          <span>📄</span>
          <span>ملف الأسينمنت (Assignment 2) ↗</span>
        </a>
        <a href="${nd.solutionUrl || 'https://drive.google.com/file/d/1Fb-jlC3OuiCCUsUGG6oqd5cxZMuT_m1_/view?usp=drivesdk'}" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary" style="border-color:rgba(16,185,129,0.5);color:#34d399;">
          <span>✅</span>
          <span>الحل النموذجي (Solution) ↗</span>
        </a>
        <a href="${nd.driveUrl || 'https://drive.google.com/drive/folders/1pk7PS5s3qRAOu6YTNvZoOaBziQoBhtVz?usp=drive_link'}" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary" style="flex:1 1 100%;">
          <span>📁</span>
          <span>فولدر درايف المادة الشامل ↗</span>
        </a>
      </div>
    `;
  }
  // Special Notice 2: MTH G102 Monday Quiz 1 Notice & Prep Links
  else if (session.code === "MTH G102" && (session.isQuiz || session.noticeData?.quizPrepId || session.day === "Monday")) {
    const nd = session.noticeData || {
      title: "📢 تفاصيل وموعد كويز 1 لمادة MTH G102",
      slots: "الموعد والمكان: الإثنين 12 أكتوبر — 11:00 ظهراً (الحضور 11 إلا ربع) بمدرج 3002 مجمع للـ 4 سكاشن",
      requirements: "الامتحان 10 درجات (MCQ - 5 أسئلة) في 30-35 دقيقة على أول محاضرتين فقط (Double Integrals) • التصحيح على التظليل فقط، ممنوع الموبايل، والجلوس بمقعد فاضي بين كل طالب • الكود المكون من 7 أرقام يوضع قبله صفر على الشمال في التظليل",
      quizPrepId: "mth-quiz-1",
      sheetUrl: "https://drive.google.com/drive/folders/1z47GRFcIBjHRVF7DKk5eBq-aUIWJv3j0",
      solutionUrl: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N",
      driveUrl: "https://drive.google.com/drive/folders/1WCbR1VLo8sUZ_x58Of08lW71aq5Ht9z8"
    };

    if (titleEl) titleEl.textContent = nd.title || "📢 تفاصيل وموعد كويز 1 لمادة MTH G102";
    if (subEl) subEl.textContent = `${session.code} • ${course.name}`;

    bodyEl.innerHTML = `
      <!-- موعد ومكان الكويز -->
      <div class="notice-section-box">
        <div class="notice-section-header">
          <span>⏰</span>
          <span>موعد ومكان الكويز الرسمي (مدرج 3002):</span>
        </div>
        <div class="notice-slot-pill">
          <strong>الموعد:</strong>
          <span>الإثنين 12 أكتوبر — 11:00 ظهراً (الحضور 11 إلا ربع)</span>
        </div>
        <div class="notice-slot-pill">
          <strong>المكان والمدة:</strong>
          <span>مدرج 3002 مجمع للأربع سكاشن • المدة 30-35 دقيقة</span>
        </div>
      </div>

      <!-- تفاصيل وشروط الامتحان والتظليل -->
      <div class="notice-section-box">
        <div class="notice-section-header">
          <span>📝</span>
          <span>تفاصيل وتعليمات الكويز والتظليل:</span>
        </div>
        <div class="notice-req-list">
          <div class="notice-req-item">
            <span style="color:#fbbf24;font-weight:900;">•</span>
            <span>الدرجة ونوع الأسئلة: <strong>10 درجات (MCQ - 5 أسئلة)</strong> في 30-35 دقيقة.</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#fbbf24;font-weight:900;">•</span>
            <span>محتوى الامتحان: على <strong>أول محاضرتين فقط</strong> (Double Integrals) — المحاضرة الثالثة غير داخلة!</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#fbbf24;font-weight:900;">•</span>
            <span>تعليمات المدرج: <strong>التصحيح على التظليل فقط</strong>، ممنوع الموبايل، والجلوس بمقعد فاضي بين كل طالب.</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#fbbf24;font-weight:900;">•</span>
            <span>تنبيه التظليل: <strong>الكود المكون من 7 أرقام يوضع قبله صفر على الشمال</strong> في التظليل.</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#fbbf24;font-weight:900;">•</span>
            <span>💡 <strong>تريكة مهمة جداً:</strong> الأسئلة مش بتخرج عن أشكال الـ Graphs اللي بتشرحها الدكتورة في المحاضرات.</span>
          </div>
        </div>
      </div>

      <!-- أزرار الروابط المباشرة -->
      <div class="notice-actions-row">
        <button onclick="closeSessionNoticeModal(); openQuizPrepGuide('mth-quiz-1');" 
                class="notice-action-btn notice-action-primary" style="flex:1 1 100%;">
          <span>🎯</span>
          <span>افتح دليل واستعداد كويز الماث الشامل ↗</span>
        </button>
        <a href="${nd.sheetUrl || 'https://drive.google.com/drive/folders/1z47GRFcIBjHRVF7DKk5eBq-aUIWJv3j0'}" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary">
          <span>📄</span>
          <span>تحميل شيت 1 (PDF) ↗</span>
        </a>
        <a href="${nd.solutionUrl || 'https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N'}" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary">
          <span>⭐</span>
          <span>الحل النموذجي لشيت 1 ↗</span>
        </a>
        <a href="${nd.driveUrl || 'https://drive.google.com/drive/folders/1WCbR1VLo8sUZ_x58Of08lW71aq5Ht9z8'}" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary" style="flex:1 1 100%;">
          <span>📁</span>
          <span>فولدر درايف الكويز الرسمي ↗</span>
        </a>
      </div>
    `;
  }
  // Special Notice 3: GEN G119 Sunday Quiz 3 Marketing Details & Links
  else if (session.code === "GEN G119") {
    if (titleEl) titleEl.textContent = "⚡ تفاصيل ومصادر كويز 3 ماركتنج (Chapter 3)";
    if (subEl) subEl.textContent = "GEN G119 • Entrepreneurship & Marketing";

    bodyEl.innerHTML = `
      <!-- موعد ومكان وتفاصيل الكويز -->
      <div class="notice-section-box" style="border-left: 4px solid #06b6d4;">
        <div class="notice-section-header" style="color:#06b6d4;">
          <span>⏰</span>
          <span>موعد وتفاصيل الكويز الرسمي (Chapter 3):</span>
        </div>
        <div class="notice-req-list">
          <div class="notice-req-item">
            <span style="color:#06b6d4;font-weight:900;">•</span>
            <span>الموعد: <strong>الأحد 1 نوفمبر 2026 داخل المحاضرة (8:00 صباحاً - مدرج 3103-414).</strong></span>
          </div>
          <div class="notice-req-item">
            <span style="color:#06b6d4;font-weight:900;">•</span>
            <span>مدة الكويز: <strong>5 دقائق فقط</strong> (نفس نظام الكويزات السابقة).</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#06b6d4;font-weight:900;">•</span>
            <span>المحتوى المقرر: <strong>المحاضرة الثالثة (Chapter 3: Analyzing the Marketing Environment)</strong> كاملة من الـ Test Bank.</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#06b6d4;font-weight:900;">•</span>
            <span>الأسئلة: <strong>20 سؤال سريع (MCQ + صح وغلط)</strong> من الـ Test Bank مباشرة.</span>
          </div>
        </div>
      </div>

      <!-- أزرار الروابط المباشرة والمحاكي -->
      <div class="notice-actions-row">
        <button onclick="closeSessionNoticeModal(); openMarketingQuiz3Modal();" 
                class="notice-action-btn notice-action-primary" style="flex:1 1 100%; background:#06b6d4; border-color:#0891b2; font-weight:800; color:#08121e; box-shadow:0 0 12px rgba(6,182,212,0.35);">
          <span>🎮</span>
          <span>بدء محاكي كويز 3 والـ Test Bank (5 دقائق) 🎯</span>
        </button>
        <a href="https://drive.google.com/file/d/1EdZgdJuzTUOsbJ5hHuSyx5hq7hmnL_GO/view?usp=drivesdk" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary">
          <span>📝</span>
          <span>Test Bank CH 3 ↗</span>
        </a>
        <a href="https://drive.google.com/file/d/1UVTPYa8LbPdw9N145aCLuxIgsu6HpdMx/view?usp=drivesdk" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary">
          <span>📄</span>
          <span>Chapter 3 summary ↗</span>
        </a>
        <a href="https://drive.google.com/file/d/1LLXzLrGXyjHMc8UMxXnlA_soyr8-AY6l/view?usp=drivesdk" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary">
          <span>🌐</span>
          <span>Chapter 3 summary - translated ↗</span>
        </a>
        <a href="https://drive.google.com/file/d/1aSFxFFrrNP9L-v8YpoBlIA8tuurNxh_s/view?usp=drivesdk" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary" style="flex:1 1 100%;">
          <span>📘</span>
          <span>Lecture Slides 3 (سلايدات المحاضرة) ↗</span>
        </a>
      </div>
    `;
  }
  // Special Notice 4: MDP G121 Materials Science Quiz 1 Notice & Prep Links
  else if (session.code === "MDP G121" || session.noticeData?.isMaterialsQuiz) {
    if (titleEl) titleEl.textContent = "🔔 دليل وخلاصة كويز 1 ماتيريل (Crystal Structure — 5 درجات)";
    if (subEl) subEl.textContent = "MDP G121 • Materials Science & Technology";

    bodyEl.innerHTML = `
      <!-- موعد ومكان الكويز والدرجة -->
      <div class="notice-section-box" style="border-left: 4px solid #38bdf8;">
        <div class="notice-section-header" style="color:#38bdf8;">
          <span>⏰</span>
          <span>الموعد والمكان والدرجة:</span>
        </div>
        <div class="notice-slot-pill">
          <strong>الموعد والمكان:</strong>
          <span>الثلاثاء 20 أكتوبر 2026 — مدرج 7104</span>
        </div>
        <div class="notice-slot-pill">
          <strong>الدرجة والمحتوى:</strong>
          <span>5 درجات (5 Marks) • موضوع Crystal Structure</span>
        </div>
      </div>

      <!-- توجيهات المعيد الهامة ونظام الامتحان -->
      <div class="notice-section-box" style="border-left: 4px solid #f59e0b;">
        <div class="notice-section-header" style="color:#f59e0b;">
          <span>🎯</span>
          <span>توجيهات المعيد الهامة ونظام الامتحان:</span>
        </div>
        <div class="notice-req-list">
          <div class="notice-req-item">
            <span style="color:#10b981;font-weight:900;">✔</span>
            <span><strong>مفيش أسئلة نظري إن شاء الله</strong> — الأسئلة مسائل وتطبيقات شبه اللي اتحلت في السكشن بالظبط.</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#f87171;font-weight:900;">⚠️</span>
            <span><strong>الشيت فيه حاجات مش بتيجي في الامتحان</strong>، فالمذاكرة الأساسية تكون من سلايدات السكشن مع حل الأسئلة اللي فيها + كويز وأسينمنت السنة اللي فاتت.</span>
          </div>
        </div>
      </div>

      <!-- خطة المذاكرة بالترتيب -->
      <div class="notice-section-box" style="border-left: 4px solid #a855f7;">
        <div class="notice-section-header" style="color:#c084fc;">
          <span>📋</span>
          <span>خطة المذاكرة بالترتيب (3 خطوات):</span>
        </div>
        <div class="notice-req-list">
          <div class="notice-req-item">
            <span style="color:#38bdf8;font-weight:900;">1.</span>
            <span><strong>مذاكرة سلايدات السكشن</strong> وحل الأسئلة اللي جواها (هي الأساس).</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#38bdf8;font-weight:900;">2.</span>
            <span><strong>حل كويز السنة اللي فاتت 2025/2026</strong> (محلول ديجيتال وخط إيد).</span>
          </div>
          <div class="notice-req-item">
            <span style="color:#38bdf8;font-weight:900;">3.</span>
            <span><strong>للتدريب الزيادة:</strong> حل أسينمنت السنة اللي فاتت (شبه الأسئلة اللي معانا جداً).</span>
          </div>
        </div>
      </div>

      <!-- أزرار الروابط المباشرة -->
      <div class="notice-actions-row">
        <a href="https://drive.google.com/file/d/1Y5_Qf5AIDxCfrk-3xMhINI9qyEO-IDTc/view?usp=drivesdk" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-primary" style="flex:1 1 100%; background:linear-gradient(135deg, #0284c7, #0369a1); border-color:#38bdf8; color:#fff; font-weight:800; box-shadow:0 0 14px rgba(2,132,199,0.35);">
          <span>📘</span>
          <span>1. Tutorial Slides (سلايدات السكشن - أساسي) ↗</span>
        </a>
        <a href="https://drive.google.com/drive/folders/1-yeXybwOFT1tQPo8-oVQXAfYAlcpnprr" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary" style="flex:1 1 calc(50% - 6px);">
          <span>📝</span>
          <span>2. Quiz 2025/2026 + الحلول ↗</span>
        </a>
        <a href="https://drive.google.com/drive/folders/1qmlZ4WhUtwsi6PkgXexuX_5jPVpy0UkP" 
           target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-secondary" style="flex:1 1 calc(50% - 6px);">
          <span>📂</span>
          <span>3. Assignment 2025/2026 + الحلول ↗</span>
        </a>
      </div>
    `;
  }
  // Case 3: Other sessions with notice or note
  else {
    if (titleEl) titleEl.textContent = session.noticeData?.title || `📢 تنبيه مادة ${session.code}`;
    if (subEl) subEl.textContent = `${session.code} • ${course.name}`;

    const driveInfo = DRIVE_DATA[session.code] || {};
    const driveUrl = driveInfo.folder || MAIN_SEMESTER_DRIVE;
    const noteText = session.noticeData?.requirements || session.note || "لا توجد ملاحظات استثنائية مسجلة لهذه المحاضرة.";

    bodyEl.innerHTML = `
      <div class="notice-section-box">
        <div class="notice-section-header">
          <span>📢</span>
          <span>تفاصيل التنبيه:</span>
        </div>
        <div style="font-size:13px;line-height:1.7;color:#f1f5f9;white-space:pre-line;">
          ${escHtml(noteText)}
        </div>
      </div>

      <div class="notice-actions-row">
        <a href="${driveUrl}" target="_blank" rel="noopener noreferrer" class="notice-action-btn notice-action-primary">
          <span>📁</span>
          <span>فتح درايف المادة ↗</span>
        </a>
        <button onclick="closeSessionNoticeModal(); openCourseCapsule('${session.code}');" class="notice-action-btn notice-action-secondary">
          <span>💡</span>
          <span>دليل المادة وكبسولة المذاكرة</span>
        </button>
      </div>
    `;
  }

  // 2. Make modal visible
  modal.classList.add("open");
  modal.classList.add("active");

  // 3. Safe scroll lock: only lock body when modal is confirmed active & visible
  requestAnimationFrame(() => {
    if (modal.classList.contains("open") || modal.classList.contains("active")) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
  });
}

function closeSessionNoticeModal() {
  const modal = document.getElementById("bell-note-modal") || document.getElementById("sessionNoticeModal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.remove("active");
  }
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  document.body.classList.remove('modal-open');
}

// Global safety listeners for keyboard Escape and mobile browser back button
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSessionNoticeModal();
  }
});
window.addEventListener("popstate", () => {
  closeSessionNoticeModal();
});

window.getSessionNoticeData = getSessionNoticeData;
window.showSessionNoticeTooltip = showSessionNoticeTooltip;
window.hideSessionNoticeTooltip = hideSessionNoticeTooltip;
window.openSessionNoticeModal = openSessionNoticeModal;
window.closeSessionNoticeModal = closeSessionNoticeModal;

function updateTimelineLiveIndicator() {
  if (activeView !== "week") return;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const jsDayIdx = now.getDay();
  const isWeekday = (jsDayIdx >= 0 && jsDayIdx <= 4);

  const badge = document.getElementById("timelineLiveTimeBadge");
  const lineWrap = document.getElementById("timelineLiveLineWrap");

  if (isWeekday && currentMinutes >= 480 && currentMinutes <= 1020) {
    const relTopPx = ((currentMinutes - 480) / 60) * 76;
    const hours12 = now.getHours() > 12 ? (now.getHours() - 12) : (now.getHours() === 0 ? 12 : now.getHours());
    const timeStr = `${hours12}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (badge) {
      badge.style.top = `${relTopPx}px`;
      badge.textContent = timeStr;
    }
    if (lineWrap) {
      lineWrap.style.top = `${relTopPx}px`;
    }
  }

  // Update LIVE card highlights
  const effectiveSessions = getActiveEffectiveSessions();
  const todayName = isWeekday ? DAYS[jsDayIdx].full : null;

  document.querySelectorAll(".grid-card").forEach(card => {
    const sessId = card.getAttribute("data-sess-id");
    if (!sessId) return;
    const parts = sessId.split("-");
    const day = parts[0];
    const sStart = Number(parts[1]);
    const code = parts.slice(2).join("-");
    const session = effectiveSessions.find(s => s.day === day && s.start === sStart && s.code === code);
    if (!session) return;

    const sStartMin = parseMinutes(TIME_STARTS[session.start]);
    const sEndMin = parseMinutes(TIME_ENDS[session.start + session.span - 1]);
    const isNowLive = (day === todayName) && (currentMinutes >= sStartMin && currentMinutes < sEndMin);

    if (isNowLive) {
      if (!card.classList.contains("is-live-card")) {
        card.classList.add("is-live-card");
        const badgesContainer = card.querySelector(".card-badges");
        if (badgesContainer && !badgesContainer.querySelector(".badge-live-now")) {
          const liveBadge = document.createElement("span");
          liveBadge.className = "badge-live-now";
          liveBadge.textContent = "🔴 LIVE";
          badgesContainer.prepend(liveBadge);
        }
      }
    } else {
      if (card.classList.contains("is-live-card")) {
        card.classList.remove("is-live-card");
        const liveBadge = card.querySelector(".badge-live-now");
        if (liveBadge) liveBadge.remove();
      }
    }
  });
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
  
  // 1. Top-Left Corner Header
  const corner = document.createElement("div");
  corner.className = "matrix-head corner";
  corner.style.gridColumn = "1";
  corner.style.gridRow = "1";
  corner.textContent = "TIME";
  grid.appendChild(corner);

  const activeAssessments = getActiveSectionAssessments();

  // 2. Days Columns Header (Sun • Mon • Tue • Wed • Thu)
  DAYS.forEach((d, i) => {
    const isToday = (d.full === todayDayName);
    const isPast = isDayInPast(d.dayIdx);
    const dayTasks = activeAssessments.filter(a => a.day === d.full && isAssessmentInCurrentWeek(a.date, d.full));
    const hasQuiz = dayTasks.length > 0;

    const head = document.createElement("div");
    head.className = "matrix-head" + 
      (isToday ? " is-today" : "") + 
      (hasQuiz ? " has-quiz-day" : "") + 
      (isPast && !showPastDays ? " is-past" : "");
    head.style.gridColumn = `${i + 2}`;
    head.style.gridRow = "1";
    head.innerHTML = `
      <span class="matrix-day-name">${d.short}</span> 
      <div style="display:flex;gap:5px;align-items:center;">
        ${hasQuiz ? `<span class="quiz-pill" onclick="setView('tasks')" style="cursor:pointer;" title="Click for Tasks Hub">⚡ QUIZ</span>` : ''}
        ${isToday ? '<span class="today-pill">Today</span>' : ''}
      </div>
    `;
    grid.appendChild(head);
  });

  // 3. Vertical Time Axis (8:00, 9:00, 10:00, 11:00, 12:00, 1:00, 2:00, 3:00, 4:00)
  const hoursList = (typeof TIMELINE_HOURS !== 'undefined' && TIMELINE_HOURS.length)
    ? TIMELINE_HOURS
    : ["8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00"];

  hoursList.forEach((hourLabel, s) => {
    const timeCell = document.createElement("div");
    timeCell.className = "matrix-time";
    timeCell.style.gridColumn = "1";
    timeCell.style.gridRow = `${s + 2}`;
    timeCell.textContent = hourLabel;
    grid.appendChild(timeCell);
  });

  // 4. Subtle Calendar Grid Lines (No dashes)
  for (let c = 2; c <= 6; c++) {
    const colDayIdx = c - 2;
    const isColToday = (DAYS[colDayIdx] && DAYS[colDayIdx].full === todayDayName);
    for (let r = 2; r <= 10; r++) {
      const emptyBg = document.createElement("div");
      emptyBg.className = "matrix-cell-empty" + (isColToday ? " is-today-col" : "");
      emptyBg.style.gridColumn = `${c}`;
      emptyBg.style.gridRow = `${r}`;
      // Clean subtle calendar grid - completely empty without any dashes
      grid.appendChild(emptyBg);
    }
  }

  // 5. Real-Time Live Indicator (Line & Badge)
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const jsDayIdx = now.getDay();
  const isWeekday = (jsDayIdx >= 0 && jsDayIdx <= 4);

  if (isWeekday && currentMinutes >= 480 && currentMinutes <= 1020) {
    const todayCol = jsDayIdx + 2;
    const relTopPx = ((currentMinutes - 480) / 60) * 76;
    const hours12 = now.getHours() > 12 ? (now.getHours() - 12) : (now.getHours() === 0 ? 12 : now.getHours());
    const timeStr = `${hours12}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Floating Badge on Time Axis
    const timeBadgeWrap = document.createElement("div");
    timeBadgeWrap.style.gridColumn = "1";
    timeBadgeWrap.style.gridRow = "2 / span 9";
    timeBadgeWrap.style.position = "relative";
    timeBadgeWrap.style.pointerEvents = "none";
    timeBadgeWrap.style.zIndex = "35";
    timeBadgeWrap.innerHTML = `
      <div class="timeline-live-time-badge" id="timelineLiveTimeBadge" style="top: ${relTopPx}px;">
        ${timeStr}
      </div>
    `;
    grid.appendChild(timeBadgeWrap);

    // Horizontal Line Spanning Today's Column
    const lineWrap = document.createElement("div");
    lineWrap.style.gridColumn = `${todayCol}`;
    lineWrap.style.gridRow = "2 / span 9";
    lineWrap.style.position = "relative";
    lineWrap.style.pointerEvents = "none";
    lineWrap.style.zIndex = "25";
    lineWrap.innerHTML = `
      <div class="timeline-live-line-wrap" id="timelineLiveLineWrap" style="top: ${relTopPx}px;">
        <div class="timeline-live-line">
          <span class="timeline-live-dot"></span>
        </div>
      </div>
    `;
    grid.appendChild(lineWrap);
  }

  // 6. Proportional Schedule Cards Generation
  const effectiveSessions = getActiveEffectiveSessions();

  DAYS.forEach((d, dIdx) => {
    const col = dIdx + 2;
    const isDayToday = (d.full === todayDayName);
    const isPast = isDayInPast(d.dayIdx);
    const daySessions = effectiveSessions.filter(s => s.day === d.full);
    const dayTasks = activeAssessments.filter(a => a.day === d.full && isAssessmentInCurrentWeek(a.date, d.full));

    daySessions.forEach(sess => {
      const sStartMin = parseMinutes(TIME_STARTS[sess.start]);
      const sEndMin = parseMinutes(TIME_ENDS[sess.start + sess.span - 1]);
      const isLiveNow = isDayToday && (currentMinutes >= sStartMin && currentMinutes < sEndMin);
      const isDynamics = (sess.code === "EMC G101");
      const isMaterials = (sess.code === "MDP G121");
      const isSolidWorks = (sess.code === "MDP G111");
      const hasCustomLinks = !!COURSE_CUSTOM_LINKS[sess.code];

      const hasConflict = daySessions.some(other => 
        other !== sess &&
        sess.start < (other.start + other.span) &&
        (sess.start + sess.span) > other.start &&
        (sess.isDynSec || other.isDynSec)
      );

      let widthStyle = "width: calc(100% - 6px);";
      let leftStyle = "left: 3px;";

      if (hasConflict) {
        widthStyle = "width: calc(50% - 5px);";
        if (sess.isDynSec) {
          leftStyle = "left: calc(50% + 2px);";
        } else {
          leftStyle = "left: 3px;";
        }
      }

      const course = COURSES[sess.code] || { name: sess.code, color: "var(--c-mth)", hex: "#38bdf8" };
      const isDimmed = (highlightedCourse && highlightedCourse !== sess.code) || (isPast && !showPastDays);
      const isHighlighted = highlightedCourse === sess.code;
      const hasTask = dayTasks.some(t => t.code === sess.code);
      const isCancelled = !!sess.cancelled;

      // Determine session type badge: LEC, SEC, LAB
      let typeBadge = sess.isDynSec ? 'SEC' : (sess.group === "ALL" ? 'LEC' : 'SEC');
      if (sess.type && sess.type.toLowerCase().includes('lab')) {
        typeBadge = 'LAB';
      }

      // Clean Room display for pin badge
      const cleanRoom = sess.room || "";
      const hasNoticeOrNote = !!(sess.hasNotice || sess.note);

      const posWrap = document.createElement("div");
      posWrap.className = `grid-card-positioned ${isPast && !showPastDays ? 'matrix-col-past' : ''}`;
      posWrap.style.gridColumn = `${col}`;
      posWrap.style.gridRow = `${sess.start + 2} / span ${sess.span}`;
      posWrap.style.position = "relative";
      posWrap.style.height = "100%";
      posWrap.style.zIndex = isLiveNow ? "15" : "5";

      posWrap.innerHTML = `
        <div class="grid-card ${isLiveNow && !isCancelled ? 'is-live-card' : ''} ${sess.isDynSec ? 'is-dynamics-card' : ''} ${sess.attendance && !isCancelled ? 'has-attendance-check' : ''} ${isDimmed ? 'dimmed' : ''} ${isHighlighted ? 'highlighted' : ''} ${isCancelled ? 'is-cancelled-card' : ''}" 
             data-course="${sess.code}"
             data-sess-id="${sess.day}-${sess.start}-${sess.code}"
             style="--c: ${isCancelled ? '#ef4444' : course.hex}; position: absolute; top: 3px; bottom: 3px; ${leftStyle} ${widthStyle}">
          
          <!-- Card Header: Course Code (Left) + Badges (Right) -->
          <div class="card-head-row">
            <span class="code" style="${isCancelled ? 'color:#ef4444;' : `color:${course.hex};`}">${sess.code}</span>
            <div class="card-badges">
              ${isCancelled ? '<span class="type" style="background:#ef4444;color:#fff;font-weight:800;">🚫 ملغية</span>' : ''}
              ${sess.quizBadge && isSessionBadgeVisible(sess, 'quiz') ? `<span class="badge-quiz-glow matrix-quiz-badge" onclick="event.stopPropagation(); ${sess.code === 'GEN G119' ? "openMarketingQuiz3Modal()" : (sess.code === 'MDP G121' ? `openSessionNoticeModal(${dIdx}, ${sess.start}, '${sess.code}')` : `openQuizPrepGuide('${sess.quizTaskId || 'gen-quiz-3'}')`)}" style="cursor:pointer;" title="${escHtml(sess.quizBadge)}">${escHtml(sess.quizBadge)}</span>` : ''}
              ${sess.assignmentBadge && isSessionBadgeVisible(sess, 'assignment') ? `<span class="badge-assignment-glow matrix-assignment-badge" onclick="event.stopPropagation(); openSessionNoticeModal(${dIdx}, ${sess.start}, '${sess.code}')" style="cursor:pointer;" title="${escHtml(sess.assignmentBadge)}">${escHtml(sess.assignmentBadge)}</span>` : ''}
              ${sess.attendance && !isCancelled ? '<span class="badge-attendance" title="⚠️ ATTENDANCE: الحضور إلزامي ومحسوب">⚠️ ATTENDANCE</span>' : ''}
              ${isLiveNow && !isCancelled ? '<span class="badge-live-now">🔴 LIVE</span>' : ''}
              ${hasNoticeOrNote && !isCancelled ? `<span class="badge-notice-bell" data-day="${dIdx}" data-start="${sess.start}" data-code="${sess.code}" title="📢 اضغط لعرض تفاصيل ومواعيد التسليم">🔔</span>` : ''}
              ${hasTask ? `<span class="type" style="background:var(--quiz-color);color:#fff;cursor:pointer;font-weight:800;" onclick="event.stopPropagation(); setView('tasks')">⚡ QUIZ</span>` : ''}
              <span class="type">${typeBadge}</span>
            </div>
          </div>

          <!-- Card Body: Full Course Title -->
          <div class="title" style="${isCancelled ? 'text-decoration:line-through;opacity:0.75;' : ''}" title="${escHtml(course.name)}">
            ${course.name}
          </div>

          ${isCancelled && sess.cancelNotice ? `<div style="font-size:9.5px;color:#fca5a5;font-weight:700;line-height:1.2;margin-top:2px;">📢 ${escHtml(sess.cancelNotice)}</div>` : ''}

          <!-- Card Footer: Polished Location Pin -->
          <div class="footer">
            <div class="room-pin-badge" title="عرض تفاصيل وموقع القاعة: ${escHtml(sess.room)}" onclick="event.stopPropagation(); showRoomDetails('${sess.room}')">
              <span class="pin-icon">📍</span>
              <span>${escHtml(cleanRoom)}</span>
            </div>

            <div class="card-action-chips">
              ${isSolidWorks ? `<span class="card-chip-btn" style="color:#10b981;" onclick="event.stopPropagation(); setView('cad')" title="CAD Studio">⚡ CAD</span>` : ''}
              ${isDynamics ? `<span class="card-chip-btn" style="color:#a78bfa;" onclick="event.stopPropagation(); openDynamicsRoadmapModal()" title="خريطة المنهج">🗺️ Map</span>` : ''}
              ${isMaterials ? `<span class="card-chip-btn" style="color:#f59e0b;" onclick="event.stopPropagation(); openMaterialsRoadmapModal()" title="خريطة المنهج">🗺️ Map</span>` : ''}
              ${hasCustomLinks ? `<span class="card-chip-btn" onclick="event.stopPropagation(); openCourseLinksModal('${sess.code}')" title="روابط المادة">🔗 Links</span>` : ''}
              <span class="card-chip-btn" onclick="event.stopPropagation(); openCourseCapsule('${sess.code}')" title="دليل المادة">💡 Guide</span>
            </div>
          </div>

        </div>
      `;

      // Direct Event Listener on bell icon with stopPropagation & touch support
      const bellEl = posWrap.querySelector(".badge-notice-bell");
      if (bellEl) {
        bellEl.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          openSessionNoticeModal(dIdx, sess.start, sess.code);
        });
        bellEl.addEventListener("mouseenter", (e) => {
          if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            showSessionNoticeTooltip(e, dIdx, sess.start, sess.code);
          }
        });
        bellEl.addEventListener("mouseleave", () => {
          hideSessionNoticeTooltip();
        });
      }

      // Interaction on card click
      const cardEl = posWrap.querySelector(".grid-card");
      if (cardEl) {
        cardEl.addEventListener("click", () => {
          if (hasNoticeOrNote) {
            openSessionNoticeModal(dIdx, sess.start, sess.code);
          } else {
            openCourseCapsule(sess.code);
          }
        });
      }

      grid.appendChild(posWrap);
    });
  });
}

function renderDaysBar() {
  const bar = document.getElementById("daysBar");
  if (!bar) return;
  if (activeView !== "day") {
    bar.style.display = "none";
    return;
  }
  bar.style.display = "flex";

  const sunday = getSundayOfActiveWeek();

  let visibleDays = DAYS;
  if (!showPastDays && (jsDay >= 0 && jsDay <= 4)) {
    visibleDays = DAYS.filter(d => d.dayIdx >= jsDay);
  }

  if (!visibleDays.some(d => d.full === activeDay)) {
    if (visibleDays.length > 0) {
      activeDay = visibleDays[0].full;
    } else {
      activeDay = "Sunday";
    }
  }

  const activeAssessments = getActiveSectionAssessments();

  bar.innerHTML = visibleDays.map((d) => {
    const dayDate = new Date(sunday);
    dayDate.setDate(sunday.getDate() + d.dayIdx);
    const dateNum = dayDate.getDate();
    const isToday = (d.full === todayDayName);
    const isPast = isDayInPast(d.dayIdx);
    const dayTasks = activeAssessments.filter(a => a.day === d.full && isAssessmentInCurrentWeek(a.date, d.full));
    const hasQuiz = dayTasks.length > 0;

    return `
      <button class="day-btn ${d.full === activeDay ? 'active' : ''} ${hasQuiz ? 'has-quiz' : ''} ${isPast ? 'is-past-day' : ''}" onclick="selectDay('${d.full}')">
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
    
    let visibleDays = DAYS;
    if (!showPastDays && (jsDay >= 0 && jsDay <= 4)) {
      visibleDays = DAYS.filter(d => d.dayIdx >= jsDay);
    }

    const currentIndex = visibleDays.findIndex(d => d.full === activeDay);
    if (diff < 0 && currentIndex < visibleDays.length - 1) selectDay(visibleDays[currentIndex + 1].full);
    else if (diff > 0 && currentIndex > 0) selectDay(visibleDays[currentIndex - 1].full);
  }, { passive: true });
}

function renderLegend() {
  const legend = document.getElementById("legend");
  if (!legend) return;
  if (activeView === "drive" || activeView === "guide" || activeView === "tasks" || activeView === "cad") {
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

// Weekly Guide Controller
function selectGuideCourse(courseCode) {
  triggerHaptic("light");
  selectedGuideCourse = courseCode;
  renderGuideScreen();
}

function selectGuideWeek(week) {
  triggerHaptic("light");
  selectedGuideWeek = week;
  renderGuideScreen();
}

function openGuideWeek(week = "Week 4", course = null) {
  triggerHaptic("light");
  selectedGuideWeek = week;
  if (course) selectedGuideCourse = course;
  setView('guide', week, course);
}

// Weekly Guide progress (persisted per "week|course")
let guideProgress = JSON.parse(localStorage.getItem("cufe_guide_progress") || "{}");
let guideCollapsed = {};

function getActiveGuideItem() {
  return WEEKLY_GUIDE_DATA.find(d => d.week === selectedGuideWeek && d.code === selectedGuideCourse);
}

function getGuideState() {
  const key = `${selectedGuideWeek}|${selectedGuideCourse}`;
  if (!guideProgress[key]) guideProgress[key] = { lecture: false, sheet: false, practice: false, review: false, videos: [] };
  if (!Array.isArray(guideProgress[key].videos)) guideProgress[key].videos = [];
  return guideProgress[key];
}

function saveGuideProgress() {
  localStorage.setItem("cufe_guide_progress", JSON.stringify(guideProgress));
}

function isGuidePracticeDone(item, st) {
  const n = item && item.playlists ? item.playlists.length : 0;
  if (n > 0) return st.videos.filter(i => i < n).length >= n;
  return !!st.practice;
}

function toggleGuideStep(step) {
  triggerHaptic("light");
  const st = getGuideState();
  if (step === "practice") {
    const item = getActiveGuideItem();
    const n = item && item.playlists ? item.playlists.length : 0;
    if (n > 0) st.videos = isGuidePracticeDone(item, st) ? [] : [...Array(n).keys()];
    else st.practice = !st.practice;
  } else {
    st[step] = !st[step];
  }
  saveGuideProgress();
  renderGuideScreen();
}

function toggleGuideVideo(index, ev) {
  if (ev) { ev.preventDefault(); ev.stopPropagation(); }
  triggerHaptic("light");
  const st = getGuideState();
  st.videos = st.videos.includes(index) ? st.videos.filter(i => i !== index) : [...st.videos, index];
  saveGuideProgress();
  renderGuideScreen();
}

function markGuideVideoWatched(index) {
  const st = getGuideState();
  if (!st.videos.includes(index)) {
    st.videos.push(index);
    saveGuideProgress();
    setTimeout(renderGuideScreen, 250);
  }
}

function toggleGuideSection(id) {
  triggerHaptic("light");
  guideCollapsed[id] = !guideCollapsed[id];
  renderGuideScreen();
}

function formatGuideWeekLabel(w) {
  return String(w).replace(/week\s*(\d+)/i, (_, n) => `Week ${n.padStart(2, "0")}`);
}

const WG_ICON = {
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  ext: `<svg class="wg-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>`,
  up: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>`,
  right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`,
  down: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`,
  bars: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="13" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>`
};

function renderGuideSection(id, type, icon, label, badge, body) {
  const collapsed = !!guideCollapsed[id];
  return `
    <section class="wg-sec wg-${type} ${collapsed ? 'collapsed' : ''}">
      <div class="wg-sec-head">
        <span class="wg-sec-icon">${icon}</span>
        <span class="wg-sec-label">${label}</span>
        <div class="wg-sec-actions">
          ${badge}
          <button class="wg-chevron" onclick="toggleGuideSection('${id}')" aria-label="${collapsed ? 'Expand' : 'Collapse'} ${label}" aria-expanded="${!collapsed}">${WG_ICON.up}</button>
        </div>
      </div>
      <div class="wg-sec-body">${body}</div>
    </section>
  `;
}

function renderGuideCard(activeItem, course, availableWeeks) {
  const st = getGuideState();
  const playlists = activeItem.playlists || [];
  const hasPractice = !!(activeItem.practice || playlists.length > 0);
  const watchedCount = st.videos.filter(i => i < playlists.length).length;

  const steps = [
    activeItem.lectures && { id: "lecture", label: "Lecture", done: !!st.lecture },
    activeItem.sheet && { id: "sheet", label: "Sheet", done: !!st.sheet },
    hasPractice && { id: "practice", label: "Practice", done: isGuidePracticeDone(activeItem, st) },
    { id: "review", label: "Review", done: !!st.review }
  ].filter(Boolean);
  const doneCount = steps.filter(s => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);
  const currentStep = steps.find(s => !s.done);

  const statusBtn = (step, done) => `
    <button class="wg-status ${done ? 'done' : ''}" onclick="toggleGuideStep('${step}')" aria-pressed="${done}">
      ${done ? WG_ICON.check + '<span>Completed</span>' : '<span>Mark done</span>'}
    </button>`;

  const lectureVideos = activeItem.lecture_videos || [];
  const lectureBody = `
    <div class="wg-sec-title" dir="auto">${activeItem.lectures}</div>
    ${activeItem.slides_note ? `
      <div class="wg-sec-sub" style="display:flex;align-items:center;gap:6px;color:#38bdf8;font-weight:600;margin-top:2px;" dir="auto">
        <span>📌</span><span>ملاحظة السلايدات: ${activeItem.slides_note}</span>
      </div>` : ''}
    ${(activeItem.slides_url || activeItem.recordings_url || activeItem.attendance_notes_url || activeItem.summary_url) ? `
      <div class="wg-pills">
        ${activeItem.slides_url ? `
          <a href="${activeItem.slides_url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
            <span class="wg-pill-ico">📘</span><span class="wg-pill-text" dir="auto">السلايدات (Slides)</span>${WG_ICON.ext}
          </a>` : ''}
        ${activeItem.recordings_url ? `
          <a href="${activeItem.recordings_url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
            <span class="wg-pill-ico">🎙️</span><span class="wg-pill-text" dir="auto">تسجيلات المحاضرة</span>${WG_ICON.ext}
          </a>` : ''}
        ${activeItem.attendance_notes_url ? `
          <a href="${activeItem.attendance_notes_url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
            <span class="wg-pill-ico">✍️</span><span class="wg-pill-text" dir="auto">نوتس الحضور (Notes)</span>${WG_ICON.ext}
          </a>` : ''}
        ${(!activeItem.summaries && activeItem.summary_url) ? `
          <a href="${activeItem.summary_url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
            <span class="wg-pill-ico">📕</span><span class="wg-pill-text">Notes</span>${WG_ICON.ext}
          </a>` : ''}
      </div>` : ''}
    ${lectureVideos.length > 0 ? `
      <div style="margin-top:6px;">
        <div style="font-size:12px;font-weight:700;color:var(--wg-cyan);margin-bottom:6px;display:flex;align-items:center;gap:6px;">
          <span>🎥</span><span>فيديوهات المحاضرة الرسمية (Lecture Videos):</span>
        </div>
        <div class="wg-videos">
          ${lectureVideos.map((lv) => `
            <div class="wg-video-row">
              <a href="${lv.url}" target="_blank" rel="noopener noreferrer" class="wg-video-link">
                <span class="wg-clap">🎬</span>
                <span class="wg-video-title" dir="auto">${lv.title}</span>
              </a>
              <a href="${lv.url}" target="_blank" rel="noopener noreferrer" class="wg-video-go" aria-label="Open video">${WG_ICON.right}</a>
            </div>`).join('')}
        </div>
      </div>` : ''}
  `;

  const sheetBody = `
    <div class="wg-sec-title" dir="auto">${activeItem.sheet}</div>
    ${activeItem.sheet_note ? `
      <div class="wg-sec-sub" style="color:#fbbf24;font-weight:600;display:flex;align-items:flex-start;gap:6px;margin-bottom:2px;" dir="auto">
        <span>⚠️</span><span>${activeItem.sheet_note}</span>
      </div>` : ''}
    ${(activeItem.sheet_url || activeItem.solution_url || activeItem.reference_url) ? `
      <div class="wg-pills">
        ${activeItem.sheet_url ? `
          <a href="${activeItem.sheet_url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
            <span class="wg-pill-ico">📝</span><span class="wg-pill-text" dir="auto">ملف الشيت (Sheet)</span>${WG_ICON.ext}
          </a>` : ''}
        ${activeItem.reference_url ? `
          <a href="${activeItem.reference_url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
            <span class="wg-pill-ico">📖</span><span class="wg-pill-text" dir="auto">المرجع المعتمد (Reference)</span>${WG_ICON.ext}
          </a>` : ''}
        ${activeItem.solution_url ? `
          <a href="${activeItem.solution_url}" target="_blank" rel="noopener noreferrer" class="wg-pill wg-pill-solution">
            <span class="wg-pill-ico">✅</span><span class="wg-pill-text" dir="auto">${activeItem.solution_label || 'الحلول والمسائل المحلولة'}</span>${WG_ICON.ext}
          </a>` : ''}
      </div>` : ''}
  `;

  const practiceBadge = playlists.length > 0 ? `
    <button class="wg-status wg-status-tone ${watchedCount === playlists.length ? 'done' : ''}" onclick="toggleGuideStep('practice')" title="Toggle all">
      <span class="wg-ring" style="--p:${Math.round((watchedCount / playlists.length) * 100)}"></span>
      <span>${watchedCount} / ${playlists.length} Completed</span>
    </button>` : statusBtn("practice", !!st.practice);

  const practiceBody = `
    ${activeItem.practice ? `<div class="wg-sec-sub" dir="auto">${activeItem.practice}</div>` : ''}
    ${playlists.length > 0 ? `
      <div class="wg-videos">
        ${playlists.map((pl, i) => {
          const watched = st.videos.includes(i);
          return `
            <div class="wg-video-row ${watched ? 'watched' : ''}">
              <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:3px;">
                <a href="${pl.url}" target="_blank" rel="noopener noreferrer" class="wg-video-link" onclick="markGuideVideoWatched(${i})">
                  <span class="wg-clap">🎬</span>
                  <span class="wg-video-title" dir="auto">${pl.title}</span>
                </a>
                ${pl.note ? `
                  <div class="wg-video-note-badge" style="font-size:11.5px;color:#fde047;background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.3);border-radius:6px;padding:3px 8px;margin-right:24px;font-weight:600;line-height:1.45;display:inline-flex;align-items:center;gap:4px;" dir="auto">
                    <span>${pl.note}</span>
                  </div>` : ''}
              </div>
              <button class="wg-watch ${watched ? 'done' : ''}" onclick="toggleGuideVideo(${i}, event)" aria-pressed="${watched}" aria-label="${watched ? 'Mark as not watched' : 'Mark as watched'}">${WG_ICON.check}</button>
              <a href="${pl.url}" target="_blank" rel="noopener noreferrer" class="wg-video-go" onclick="markGuideVideoWatched(${i})" aria-label="Open video">${WG_ICON.right}</a>
            </div>`;
        }).join("")}
      </div>` : ''}
  `;

  const minutesBody = activeItem.minutes ? `
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${activeItem.minutes.the ? `
        <div style="display:flex;align-items:center;gap:8px;background:rgba(245, 158, 11, 0.12);border:1px solid rgba(245, 158, 11, 0.35);border-radius:10px;padding:10px 13px;font-size:13px;color:#fef3c7;font-weight:700;" dir="auto">
          <span>📅</span><span>${activeItem.minutes.the}</span>
        </div>` : ''}
      ${activeItem.minutes.covered ? `
        <div style="background:rgba(34, 197, 94, 0.08);border:1px solid rgba(34, 197, 94, 0.25);border-radius:10px;padding:10px 13px;font-size:13px;line-height:1.6;color:var(--wg-text);" dir="auto">
          <strong style="color:#4ade80;">✅ ما تم شرحه:</strong> ${activeItem.minutes.covered}
        </div>` : ''}
      ${activeItem.minutes.remaining ? `
        <div style="background:rgba(244, 63, 94, 0.08);border:1px solid rgba(244, 63, 94, 0.25);border-radius:10px;padding:10px 13px;font-size:13px;line-height:1.6;color:var(--wg-text);" dir="auto">
          <strong style="color:#fb7185;">⏳ المتبقي ولم يُشرح بعد:</strong> ${activeItem.minutes.remaining}
        </div>` : ''}
    </div>
  ` : '';

  const notesBody = `
    ${(activeItem.important_notes && activeItem.important_notes.length > 0) ? `
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px;">
        ${activeItem.important_notes.map(note => `
          <div style="background:linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%);border:1px solid rgba(167, 139, 250, 0.28);border-radius:12px;padding:11px 14px;font-size:13px;line-height:1.65;color:#f8fafc;unicode-bidi:plaintext;" dir="auto">
            ${note}
          </div>
        `).join("")}
      </div>` : ''}
    ${(activeItem.summaries && activeItem.summaries.length > 0) ? `
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:2px;">
        <div style="font-size:12px;font-weight:700;color:var(--wg-purple);margin-bottom:2px;display:flex;align-items:center;gap:6px;">
          <span>📑</span><span>التلخيصات المعتمدة (Summaries):</span>
        </div>
        <div class="wg-pills">
          ${activeItem.summaries.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
              <span class="wg-pill-ico">📕</span><span class="wg-pill-text" dir="auto">${s.title}</span>${WG_ICON.ext}
            </a>
          `).join('')}
        </div>
      </div>` : (activeItem.summary_url ? `
      <a href="${activeItem.summary_url}" target="_blank" rel="noopener noreferrer" class="wg-note-link">
        <span class="wg-sec-title" dir="auto">${activeItem.summary_title || 'ملخص ونوتس المحاضرة'}</span>
        ${WG_ICON.ext}
      </a>` : '')}
  `;

  return `
    <div class="wg-card cascade-item" style="--c: ${course.color};">
      <div class="wg-head">
        <div class="wg-head-info">
          <div class="wg-code">${activeItem.code}</div>
          <div class="wg-name" dir="auto">${course.name}</div>
          ${activeItem.status_badge ? `
            <div style="margin-top:5px;">
              <span style="font-size:11px;font-weight:700;color:#f59e0b;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);padding:2px 9px;border-radius:6px;display:inline-flex;align-items:center;gap:4px;">
                ${activeItem.status_badge}
              </span>
            </div>` : ''}
        </div>
        <div class="wg-head-right">
          <label class="wg-week-select-wrap">
            <span class="wg-sr">Select week</span>
            <select class="wg-week-select" id="guideWeekSelect" onchange="selectGuideWeek(this.value)">
              ${(availableWeeks.length > 0 ? availableWeeks : [selectedGuideWeek]).map(w => `
                <option value="${w}" ${w === selectedGuideWeek ? 'selected' : ''}>${formatGuideWeekLabel(w)}</option>
              `).join("")}
            </select>
            ${WG_ICON.down}
          </label>
          ${activeItem.code === 'MDP G111' ? `
            <button class="capsule-pill-btn cad-hub-pill" style="font-size:11px !important;" onclick="setView('cad')">⚡ SolidWorks Hub Pro</button>
          ` : ''}
        </div>
      </div>

      <div class="wg-progress">
        <div class="wg-progress-main">
          <div class="wg-progress-label">${WG_ICON.bars}<span>Week Progress</span></div>
          <div class="wg-progress-row">
            <div class="wg-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="wg-bar-fill" style="width:${pct}%"></div></div>
            <span class="wg-pct">${pct}%</span>
          </div>
        </div>
        <div class="wg-steps">
          ${steps.map(s => `
            <button class="wg-step ${s.done ? 'done' : ''} ${currentStep && currentStep.id === s.id ? 'current' : ''}" onclick="toggleGuideStep('${s.id}')" aria-pressed="${s.done}">
              <span class="wg-step-dot">${WG_ICON.check}</span>
              <span>${s.label}</span>
            </button>
          `).join("")}
        </div>
      </div>

      ${activeItem.code === 'GEN G119' ? `
        <div class="wg-quiz-hub-box" style="margin-bottom:16px;padding:16px 18px;border-radius:16px;background:linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(2,132,199,0.08) 100%);border:1.5px solid rgba(16,185,129,0.45);box-shadow:0 8px 24px rgba(0,0,0,0.15);">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:22px;">⚡</span>
              <h3 style="margin:0;font-size:15px;font-weight:800;color:#10b981;">Guide for Quiz 2 | Marketing (Chapter 2)</h3>
            </div>
            <span style="font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px;background:rgba(16,185,129,0.2);color:#10b981;border:1px solid rgba(16,185,129,0.4);">⏱️ المدة 5 دقائق فقط</span>
          </div>
          <p style="font-size:12.5px;color:var(--text-muted);margin:0 0 12px 0;line-height:1.5;">
            الكويز الأحد القادم داخل المحاضرة (8:00 صباحاً - قاعة 3103-414). الامتحان 20 سؤال مطابق لأسئلة الـ Test Bank بالحرف.
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <button onclick="openMarketingQuiz2Modal()" class="wg-pill" style="background:#10b981;color:#fff;font-weight:800;border:none;cursor:pointer;box-shadow:0 0 12px rgba(16,185,129,0.35);">
              <span>🎮</span><span>محاكي كويز 2 التفاعلي (Quiz 2 Simulator)</span>
            </button>
            <a href="https://drive.google.com/file/d/1r3PrYQiXtpfFhpJbFhv0a0pK9qf2g045/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" class="wg-pill">
              <span>📘</span><span>Lecture Slides 2 ↗</span>
            </a>
            <a href="https://drive.google.com/file/d/1G5ztFeMyJ8C4aUQYxJIvS0-kJ-fP2Bqb/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" class="wg-pill">
              <span>📝</span><span>Test Bank CH 2 ↗</span>
            </a>
            <a href="https://drive.google.com/file/d/1QyXqM7S4ih0xRfDPx_PAdqo95NpPO1Zm/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" class="wg-pill">
              <span>📄</span><span>Chapter 2 Summary ↗</span>
            </a>
          </div>
        </div>
      ` : ''}

      ${activeItem.code === 'MDP G121' ? `
        <div class="wg-quiz-hub-box" style="margin-bottom:16px;padding:16px 18px;border-radius:16px;background:linear-gradient(135deg, rgba(56,189,248,0.16) 0%, rgba(2,132,199,0.06) 100%);border:1.5px solid rgba(56,189,248,0.45);box-shadow:0 8px 24px rgba(0,0,0,0.15);">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:22px;">⚡</span>
              <h3 style="margin:0;font-size:15px;font-weight:800;color:#38bdf8;">Quiz 1 Guide | Crystal Structure (5 Marks)</h3>
            </div>
            <span style="font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px;background:rgba(56,189,248,0.2);color:#38bdf8;border:1px solid rgba(56,189,248,0.4);">🎯 5 درجات • مدرج 7104</span>
          </div>
          <div style="font-size:12.5px;color:var(--text-main);margin:0 0 10px 0;line-height:1.6;background:rgba(255,255,255,0.04);padding:10px 12px;border-radius:10px;border-left:3px solid #f59e0b;">
            <div style="color:#fde047;font-weight:700;margin-bottom:4px;">🎯 ملاحظات المعيد ونظام الامتحان:</div>
            <div>• مفيش أسئلة نظري إن شاء الله — الأسئلة مسائل وتطبيقات شبه اللي اتحلت في السكشن بالظبط.</div>
            <div>• الشيت فيه حاجات مش بتيجي في الامتحان، فالمذاكرة الأساسية تكون من سلايدات السكشن مع حل الأسئلة اللي فيها + كويز وأسينمنت السنة اللي فاتت.</div>
          </div>
          <div style="font-size:12px;color:#cbd5e1;margin-bottom:12px;line-height:1.6;">
            <strong style="color:#38bdf8;">📋 خطة المذاكرة بالترتيب (3 خطوات):</strong><br>
            1. مذاكرة سلايدات السكشن وحل الأسئلة اللي جواها (الأساس).<br>
            2. حل كويز السنة اللي فاتت 2025/2026 (محلول ديجيتال وخط إيد).<br>
            3. للتدريب الزيادة: حل أسينمنت السنة اللي فاتت (شبه الأسئلة اللي معانا جداً).
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <a href="https://drive.google.com/file/d/1Y5_Qf5AIDxCfrk-3xMhINI9qyEO-IDTc/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" class="wg-pill" style="background:#0284c7;color:#fff;font-weight:800;border:none;">
              <span>📘</span><span>1. Tutorial Slides (سلايدات السكشن - أساسي) ↗</span>
            </a>
            <a href="https://drive.google.com/drive/folders/1-yeXybwOFT1tQPo8-oVQXAfYAlcpnprr" target="_blank" rel="noopener noreferrer" class="wg-pill">
              <span>📝</span><span>2. Quiz 2025/2026 + الحلول ↗</span>
            </a>
            <a href="https://drive.google.com/drive/folders/1qmlZ4WhUtwsi6PkgXexuX_5jPVpy0UkP" target="_blank" rel="noopener noreferrer" class="wg-pill">
              <span>📂</span><span>3. Assignment 2025/2026 + الحلول ↗</span>
            </a>
          </div>
        </div>
      ` : ''}

      ${activeItem.tool ? `
        <div class="wg-tool-neon-card" style="margin-bottom:14px;background:linear-gradient(135deg,rgba(54,70,201,0.2) 0%,rgba(210,56,45,0.12) 50%,rgba(15,23,42,0.92) 100%);border:1.5px solid rgba(147,163,255,0.5);border-radius:14px;padding:16px 18px;position:relative;overflow:hidden;box-shadow:0 0 25px rgba(54,70,201,0.25),inset 0 1px 0 rgba(255,255,255,0.15);">
          <div style="position:absolute;top:-20px;left:-20px;width:110px;height:110px;background:radial-gradient(circle,rgba(210,56,45,0.3) 0%,transparent 70%);pointer-events:none;"></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
            <span style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,rgba(210,56,45,0.25),rgba(54,70,201,0.25));color:#ff8a80;border:1px solid rgba(255,112,100,0.55);border-radius:20px;padding:3px 12px;font-size:11.5px;font-weight:700;letter-spacing:0.4px;box-shadow:0 0 12px rgba(210,56,45,0.25);">
              ${activeItem.tool.badge || 'Interactive Tool 🛠️'}
            </span>
            <span style="font-size:11px;color:#38bdf8;font-family:'JetBrains Mono',monospace;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.3);padding:2px 8px;border-radius:6px;font-weight:600;">SVG Live Simulation 📐</span>
          </div>
          <div style="font-size:16px;font-weight:800;color:#ffffff;line-height:1.45;margin-bottom:6px;text-shadow:0 0 12px rgba(147,163,255,0.4);" dir="auto">
            ${activeItem.tool.title}
          </div>
          <div style="font-size:13px;line-height:1.65;color:#cbd5e1;margin-bottom:14px;" dir="auto">
            ${activeItem.tool.desc || activeItem.tool.description}
          </div>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <a href="${activeItem.tool.url || activeItem.tool.link}" class="wg-tool-launch-btn" style="display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#3646c9 0%,#d2382d 100%);color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;padding:9px 20px;border-radius:8px;box-shadow:0 4px 16px rgba(210,56,45,0.4),0 0 12px rgba(54,70,201,0.3);transition:all .2s ease;">
              <span>فتح الأداة التفاعلية</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
      ` : ''}

      ${activeItem.status_note ? `
        <div class="wg-status-banner" style="margin-bottom:14px;background:linear-gradient(135deg,rgba(245,158,11,0.14) 0%,rgba(15,23,42,0.85) 100%);border:1.5px solid rgba(245,158,11,0.4);border-radius:12px;padding:12px 16px;color:#fef3c7;font-size:13px;line-height:1.6;font-weight:700;display:flex;align-items:center;gap:10px;box-shadow:0 0 16px rgba(245,158,11,0.15);" dir="auto">
          <span style="font-size:19px;flex-shrink:0;">⏳</span>
          <span>${activeItem.status_note}</span>
        </div>
      ` : ''}

      ${activeItem.minutes ? renderGuideSection("minutes", "lecture", "📋", activeItem.minutes.the ? "ملخص المحاضرة وتحديثات التيك هوم (Lecture Minutes)" : "ملخص المحاضرة (Lecture Minutes)", `
        <span class="wg-status wg-status-tone wg-static">⚡ <span>Official</span></span>`, minutesBody) : ''}
      ${activeItem.lectures ? renderGuideSection("lecture", "lecture", "📘", "Lecture", statusBtn("lecture", !!st.lecture), lectureBody) : ''}
      ${activeItem.sheet ? renderGuideSection("sheet", "sheet", "📝", "Sheet", statusBtn("sheet", !!st.sheet), sheetBody) : ''}
      ${hasPractice ? renderGuideSection("practice", "practice", "🎯", "Practice", practiceBadge, practiceBody) : ''}
      ${(activeItem.important_notes || activeItem.summary_url || activeItem.summaries) ? renderGuideSection("notes", "notes", "💡", (activeItem.summaries && activeItem.summaries.length > 0) ? "التلخيصات والملاحظات (Summaries & Notes)" : (activeItem.important_notes ? "الملاحظات والتنبيهات العامة (Important Notes)" : "Quick Notes"), `
        <span class="wg-status wg-status-tone wg-static">${activeItem.important_notes ? '📢 <span>Announcements</span>' : '📎 <span>1 file</span>'}</span>`, notesBody) : ''}
    </div>
  `;
}

function renderGuideScreen() {
  const container = document.getElementById("viewContainer");
  const allGuidedCourses = Object.keys(COURSES).filter(c => WEEKLY_GUIDE_DATA.some(d => d.code === c));
  if (!allGuidedCourses.includes(selectedGuideCourse) && allGuidedCourses.length > 0) {
    selectedGuideCourse = allGuidedCourses[0];
  }

  const courseItems = WEEKLY_GUIDE_DATA.filter(d => d.code === selectedGuideCourse);
  const availableWeeks = [...new Set(courseItems.map(d => d.week || "Week 1"))];
  if (!availableWeeks.includes(selectedGuideWeek) && availableWeeks.length > 0) {
    selectedGuideWeek = availableWeeks[availableWeeks.length - 1];
  }

  const activeItem = courseItems.find(d => d.week === selectedGuideWeek);
  const course = COURSES[selectedGuideCourse] || { name: selectedGuideCourse, color: "var(--accent)" };

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

        <div class="guide-course-pills-bar">
          ${allGuidedCourses.map(code => {
            const cInfo = COURSES[code] || { color: 'var(--accent)' };
            const isActive = code === selectedGuideCourse;
            return `
              <button class="guide-c-pill ${isActive ? 'active' : ''}" 
                      style="--c-active: ${cInfo.color};" 
                      onclick="selectGuideCourse('${code}')">
                ${code}
              </button>
            `;
          }).join("")}
        </div>
      </div>

      ${!activeItem ? `
        <div style="text-align:center;padding:36px;color:var(--text-muted);background:var(--surface);border-radius:18px;border:1px dashed var(--border)">
          لا توجد بيانات متاحة لهذا المقرر في ${selectedGuideWeek}.
        </div>
      ` : renderGuideCard(activeItem, course, availableWeeks)}
    </div>
  `;
}

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
          <input type="text" id="driveSearchInput" placeholder="ابحث عن المادة..." value="${searchQuery}" oninput="handleDriveSearch(this.value)">
        </div>
        <div class="vault-main-links">
          <div class="vault-btn-primary" onclick="openSafeDriveLink('${MAIN_SEMESTER_DRIVE}')"><span>📁 Batch 30 Drive</span><span>↗</span></div>
          <div class="vault-btn-archive" onclick="openSafeDriveLink('${ARCHIVE_BATCH29_DRIVE}')"><span>🗄 Batch 29 Archive</span><span>↗</span></div>
        </div>
      </div>
      <div class="courses-grid">
        ${filteredCourses.map(([code, c]) => {
          const d = DRIVE_DATA[code] || { folder: MAIN_SEMESTER_DRIVE, lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE };
          const isDynamics = (code === "EMC G101");
          const isMaterials = (code === "MDP G121");
          const isSolidWorks = (code === "MDP G111");
          const isMarketing = (code === "GEN G119");
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
                ${isSolidWorks ? `
                  <div class="capsule-open-btn" style="color:#10b981;border-color:rgba(16,185,129,0.3);" onclick="setView('cad')">
                    <span>⚡ SolidWorks Hub Pro</span><span>↗</span>
                  </div>
                ` : ''}
                ${isDynamics ? `
                  <div class="capsule-roadmap-open-btn" onclick="openDynamicsRoadmapModal()">
                    <span>🗺️️ Dynamics Roadmap</span><span>↗</span>
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

// ==========================================================================
// SolidWorks CAD Master Pro - Streamlined & Actionable UI
// ==========================================================================
const SW_STREAM_DATA = [
  { key: 'A', name: 'قوس مماس فوري (Tangent Arc)', cat: 'sketch', cmd: 'Tangent Arc', desc: 'وأنت بترسم Line، اضغط A هيقلب القلم لقوس مماس على طول بدون ما تخرج من الأمر.' },
  { key: 'Ctrl+8', name: 'الرؤية في وشك (Normal To)', cat: 'views', cmd: 'Normal To', desc: 'يخلي السطح المختار عمودي ومباشر أمام عينك للرسم.' },
  { key: 'Shift', name: 'أقصى بُعد لدائرة (Max Distance)', cat: 'sketch', cmd: 'Max Dimension', desc: 'علق إيدك على Shift وكليك على محيط الدائرتين، هيقيس أبعد نقطة فوراً بدون خطوط سنتر.' },
  { key: 'F', name: 'الموديل تاه في الشاشة؟ (Zoom Fit)', cat: 'views', cmd: 'Zoom to Fit', desc: 'يجيب الموديل كامل في نص الشاشة بضغطة واحدة.' },
  { key: 'Alt+Drag', name: 'تجميع ذكي (Smart Mate)', cat: 'assembly', cmd: 'Smart Mate', desc: 'في التجميع: اسحب حافة دائرية لمسمار أو جلبة مع Alt وارميها في الثقب لعمل قيدين معاً.' },
  { key: 'S', name: 'شريط الأوامر السريع (Shortcut Bar)', cat: 'sketch', cmd: 'Shortcut Bar', desc: 'يفتح قائمة أوامر سريعة تحت مكان الماوس مباشرة.' },
  { key: 'Tab', name: 'إخفاء قطعة في التجميع', cat: 'assembly', cmd: 'Hide Component', desc: 'حط الماوس على القطعة ودوس Tab تخفيها في ثانية.' },
  { key: 'Ctrl+Drag', name: 'نسخ سريع (Duplicate)', cat: 'assembly', cmd: 'Copy Component', desc: 'اسحب البارت مع Ctrl يعمل منه نسخة ثانية فوراً.' },
  { key: 'Ctrl+7', name: 'المنظور الأيزومتري (Isometric)', cat: 'views', cmd: 'Isometric View', desc: 'يرجع زاوية الرؤية للوضع القياسي 3D.' },
  { key: 'D', name: 'زرار الصح والإلغاء تحت الماوس', cat: 'sketch', cmd: 'Confirmation Corner', desc: 'يجيب علامة الصح الخضراء والـ Cancel لمكان الماوس مباشرة.' },
  { key: 'Ctrl+Q', name: 'تحديث جبري للشجرة (Force Rebuild)', cat: 'filters', cmd: 'Force Rebuild', desc: 'إعادة قراءة وحساب كافة أسطر الشجرة بالكامل لحل أخطاء التحديث الغريبة.' },
  { key: 'E', name: 'تحديد الحواف فقط (Filter Edges)', cat: 'filters', cmd: 'Filter Edges', desc: 'يقفل التحديد على الحواف لتجنب اختيار الأسطح بالخطأ أثناء عمل Fillet.' }
];

let cadActiveSearchQuery = '';
let activeInspectedCmd = SW_STREAM_DATA[0];
let screenWakeLock = null;
let cadActiveFilter = 'all';

function setCadFilter(filter) {
  triggerHaptic('light');
  cadActiveFilter = filter;
  renderCadHubScreen();
}

function toggleCadShortcutsDrawer() {
  triggerHaptic('light');
  const content = document.getElementById("cadDrawerContent");
  const btn = document.getElementById("cadDrawerToggleBtn");
  if (!content) return;
  const isHidden = content.style.display === "none";
  content.style.display = isHidden ? "block" : "none";
  if (btn) {
    btn.setAttribute("aria-expanded", isHidden ? "true" : "false");
    btn.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
  }
}

function renderCadHubScreen() {
  const container = document.getElementById("viewContainer");
  if (!container) return;

  const dataList = typeof SOLIDWORKS_HUB_DATA !== 'undefined' ? SOLIDWORKS_HUB_DATA : [];
  const filteredList = (cadActiveFilter === 'all') 
    ? dataList 
    : dataList.filter(item => item.id === cadActiveFilter || item.sheetNum.toLowerCase().replace(/\s+/g, '-') === cadActiveFilter);

  const filterTabs = [
    { id: 'all', label: 'الكل' },
    { id: 'sheet-1', label: 'Sheet 1' },
    { id: 'sheet-2', label: 'Sheet 2' },
    { id: 'sheet-3', label: 'Sheet 3' },
    { id: 'sheet-4', label: 'Sheet 4' }
  ];

  container.innerHTML = `
    <div class="cad-page-container">
      <!-- Top Bar: Back & Tools -->
      <div class="cad-top-bar">
        <button class="cad-back-btn" onclick="setView('week')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>الرجوع للجدول</span>
        </button>
        <div class="cad-top-actions">
          <button class="cad-wake-lock-btn ${screenWakeLock ? 'active' : ''}" id="cadWakeLockBtn" onclick="toggleScreenWakeLock()" title="تثبيت إضاءة الشاشة في المعمل">
            <span>💡</span><span>${screenWakeLock ? 'Screen ON' : 'Lab Mode'}</span>
          </button>
        </div>
      </div>

      <!-- Studio Header -->
      <header class="cad-header-box">
        <div class="cad-kicker">
          <span class="cad-pulse-dot"></span>
          <span>MDP G111 • SOLIDWORKS STUDIO</span>
        </div>
        <h1 class="cad-title">SolidWorks Studio & CAD Hub ⚙️</h1>
        <p class="cad-subtitle">كل شيتات الكاد، رسومات البارتات، التجميعة، ولوحات الرسم من مكان واحد.</p>

        <!-- Fast Filter Tabs -->
        <div class="cad-filter-pills" role="tablist" aria-label="Sheet Filter">
          ${filterTabs.map(tab => `
            <button class="cad-filter-pill ${cadActiveFilter === tab.id ? 'active' : ''}" 
                    onclick="setCadFilter('${tab.id}')"
                    role="tab"
                    aria-selected="${cadActiveFilter === tab.id}">
              ${tab.id === 'sheet-4' ? '🎯 ' : ''}${tab.label}
            </button>
          `).join('')}
        </div>
      </header>

      <!-- Bento Grid -->
      <div class="cad-bento-grid">
        ${filteredList.map(sheet => {
          const isFeatured = !!sheet.isFeatured;
          const specialVideo = (sheet.videos || []).find(v => v.isSpecial);
          const regularVideos = (sheet.videos || []).filter(v => !v.isSpecial);

          return `
            <div class="cad-bento-card ${isFeatured ? 'is-featured' : ''}" id="cad-${sheet.id}">
              <!-- Card Header -->
              <div class="cad-card-header">
                <div class="cad-card-header-left">
                  <div class="cad-badges-row">
                    <span class="cad-sheet-badge" style="--c-accent: ${sheet.color || '#10b981'};">${sheet.sheetNum}</span>
                    <span class="cad-type-badge">${sheet.badge}</span>
                    ${isFeatured ? '<span class="cad-exam-badge">⭐ Exam Project</span>' : ''}
                  </div>
                  <h2 class="cad-piece-name" dir="auto">${sheet.title}</h2>
                  ${sheet.tagline ? `<div class="cad-piece-sub" dir="auto">${sheet.tagline}</div>` : ''}
                </div>
              </div>

              <!-- PDF Drawings Section -->
              <div class="cad-section-box">
                <div class="cad-sec-heading">
                  <span class="cad-sec-icon">📐</span>
                  <span>ملفات الرسم والشيتات (PDF Drawings)</span>
                  <span class="cad-count-tag">${(sheet.pdfs || []).length} ملف</span>
                </div>
                <div class="cad-pdfs-list">
                  ${(sheet.pdfs || []).map(pdf => `
                    <a href="${pdf.url}" target="_blank" rel="noopener noreferrer" class="cad-pdf-btn">
                      <div class="cad-pdf-info">
                        <svg class="cad-pdf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span class="cad-pdf-title" dir="auto">${pdf.title}</span>
                      </div>
                      <span class="cad-pdf-action">
                        <span>عرض / تحميل</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </span>
                    </a>
                  `).join('')}
                </div>
              </div>

              <!-- Special Midterm Video Card (Featured on Sheet 4) -->
              ${specialVideo ? `
                <div class="cad-special-midterm-wrap">
                  <div class="cad-special-header">
                    <span class="cad-fire-icon">🔥</span>
                    <span>فيديو مراجعة الميدتيرم وطريقة الامتحان 🎯</span>
                  </div>
                  <a href="${specialVideo.url}" target="_blank" rel="noopener noreferrer" class="cad-special-video-box">
                    <div class="cad-special-content">
                      <div class="cad-special-title" dir="auto">${specialVideo.title}</div>
                      <div class="cad-special-note">نصائح حاسمة لتوزيع الوقت وتجنب أخطاء الوزن والماتريال في الامتحان</div>
                    </div>
                    <div class="cad-special-cta">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      <span>مشاهدة الآن</span>
                    </div>
                  </a>
                </div>
              ` : ''}

              <!-- Video Tutorials Section -->
              <div class="cad-section-box">
                <div class="cad-sec-heading">
                  <span class="cad-sec-icon">🎬</span>
                  <span>فيديوهات الشرح والتطبيق (Video Tutorials)</span>
                  ${regularVideos.length > 0 ? `<span class="cad-count-tag">${regularVideos.length} فيديو</span>` : ''}
                </div>
                ${regularVideos.length > 0 ? `
                  <div class="cad-videos-list">
                    ${regularVideos.map(vid => `
                      <a href="${vid.url}" target="_blank" rel="noopener noreferrer" class="cad-video-item">
                        <div class="cad-video-info">
                          <span class="cad-yt-badge">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                          </span>
                          <span class="cad-video-title" dir="auto">${vid.title}</span>
                        </div>
                        <span class="cad-video-go">
                          <span>تشغيل</span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </span>
                      </a>
                    `).join('')}
                  </div>
                ` : `
                  <div class="cad-empty-practice-box" dir="auto">
                    <span>📐</span>
                    <div>ملفات التمارين والمساقط أعلاه كافية ومصممة للتدريب الذاتي في السكشن والمعمل.</div>
                  </div>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quick Shortcuts Drawer / Cheatsheet Box -->
      <div class="cad-shortcuts-drawer">
        <div class="cad-drawer-head" onclick="toggleCadShortcutsDrawer()">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:18px;">⚡</span>
            <div>
              <div style="font-weight:800;font-size:13.5px;color:#f8fafc;">إسعافات واختصارات سريعة في المعمل (Shortcuts Cheat Sheet)</div>
              <div style="font-size:11px;color:#94a3b8;">أهم الأوامر المنقذة: قوس مماس (A)، في وشك (Ctrl+8)، الموديل تاه (F)...</div>
            </div>
          </div>
          <button class="cad-drawer-toggle-btn" id="cadDrawerToggleBtn" aria-expanded="false" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>
        <div class="cad-drawer-content" id="cadDrawerContent" style="display:none;">
          <div class="cad-search-box">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" id="cadCommandSearchInput" placeholder="ابحث بالعامية: قوس، عمودي، أبعاد، تجميع..." value="${cadActiveSearchQuery}" oninput="handleCadSearch(this.value)">
          </div>
          <div class="cad-stream-grid" id="cadStreamGrid"></div>
          <div class="cad-key-card" id="cadKeyCard">
            <div class="key-card-header">
              <span class="key-badge" id="keyCardBadge">${activeInspectedCmd.key}</span>
              <span class="key-name" id="keyCardName">${activeInspectedCmd.name}</span>
              <button class="cad-copy-cmd-btn" id="keyCardCopyBtn" onclick="copyActiveCommandCode()">
                <span>نسخ الاختصار</span>
              </button>
            </div>
            <div class="key-card-desc" id="keyCardDesc">${activeInspectedCmd.desc}</div>
          </div>
          <div style="margin-top:12px;">
            <a href="https://drive.google.com/file/d/1L3sQoOHH1M2o57PDNMIqmAp0c1gEEOrD/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" class="cad-download-pdf-btn">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:16px;">📥</span>
                <div>
                  <div style="font-weight:800;">ملخص الاختصارات المعتمد (PDF)</div>
                  <div style="font-size:9.5px;color:var(--text-muted);">تحميل مباشر من درايف الدفعة</div>
                </div>
              </div>
              <span style="font-size:13px;color:var(--c-mdp1);font-weight:800;">تحميل ↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  renderCadStreamGrid();
}

function handleCadSearch(query) {
  cadActiveSearchQuery = query.trim().toLowerCase();
  renderCadStreamGrid();
}

function renderCadStreamGrid() {
  const grid = document.getElementById('cadStreamGrid');
  if (!grid) return;
  let list = SW_STREAM_DATA;

  if (cadActiveSearchQuery) {
    list = list.filter(item => 
      item.key.toLowerCase().includes(cadActiveSearchQuery) ||
      item.name.toLowerCase().includes(cadActiveSearchQuery) ||
      item.cmd.toLowerCase().includes(cadActiveSearchQuery) ||
      item.desc.toLowerCase().includes(cadActiveSearchQuery)
    );
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1;text-align:center;padding:24px;color:var(--text-muted);font-size:12px;">
        اكتب كلمة تانية، زي: قوس، عمودي، بعد، تجميع 🔍
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map((item, idx) => `
    <div class="cad-stream-item ${activeInspectedCmd?.name === item.name ? 'active' : ''}" onclick="inspectCommandByIndex(${idx})">
      <span class="cad-stream-key">${item.key}</span>
      <span class="cad-stream-label">${item.name}</span>
    </div>
  `).join('');
}

function inspectCommandByIndex(idx) {
  let list = SW_STREAM_DATA;
  if (cadActiveSearchQuery) {
    list = list.filter(item => 
      item.key.toLowerCase().includes(cadActiveSearchQuery) ||
      item.name.toLowerCase().includes(cadActiveSearchQuery) ||
      item.cmd.toLowerCase().includes(cadActiveSearchQuery) ||
      item.desc.toLowerCase().includes(cadActiveSearchQuery)
    );
  }
  if (list[idx]) inspectCommand(list[idx]);
}

function inspectCommand(cmdObj) {
  triggerHaptic('heavy');
  activeInspectedCmd = cmdObj;
  const badge = document.getElementById('keyCardBadge');
  const name = document.getElementById('keyCardName');
  const desc = document.getElementById('keyCardDesc');
  if (badge) badge.textContent = cmdObj.key;
  if (name) name.textContent = cmdObj.name;
  if (desc) desc.textContent = cmdObj.desc;
  document.querySelectorAll('.cad-stream-item').forEach(el => {
    const isThis = el.querySelector('.cad-stream-key')?.textContent === cmdObj.key;
    el.classList.toggle('active', isThis);
  });
}

function inspectKey(key) {
  const match = SW_STREAM_DATA.find(k => k.key.toLowerCase() === key.toLowerCase() || k.key.includes(key));
  if (match) {
    inspectCommand(match);
  }
}

function copyActiveCommandCode() {
  if (!activeInspectedCmd) return;
  triggerHaptic('heavy');
  navigator.clipboard.writeText(activeInspectedCmd.cmd || activeInspectedCmd.name).then(() => {
    const btn = document.getElementById('keyCardCopyBtn');
    if (btn) {
      btn.textContent = '✓ تم النسخ!';
      btn.style.color = '#10b981';
      setTimeout(() => {
        btn.textContent = 'نسخ الاختصار';
        btn.style.color = '';
      }, 1500);
    }
  }).catch(() => {});
}

async function toggleScreenWakeLock() {
  triggerHaptic('heavy');
  const btn = document.getElementById('cadWakeLockBtn');

  if ('wakeLock' in navigator) {
    if (screenWakeLock === null) {
      try {
        screenWakeLock = await navigator.wakeLock.request('screen');
        if (btn) btn.classList.add('active');
        screenWakeLock.addEventListener('release', () => {
          screenWakeLock = null;
          if (btn) btn.classList.remove('active');
        });
      } catch (err) {
        alert("تعذر تثبيت إضاءة الشاشة في المتصفح حالياً.");
      }
    } else {
      screenWakeLock.release().then(() => {
        screenWakeLock = null;
        if (btn) btn.classList.remove('active');
      });
    }
  } else {
    alert("خاصية تثبيت الشاشة غير مدعومة في متصفحك.");
  }
}

// Master Render Function
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
  const fwBanner = document.getElementById("firstWeekBanner");
  const pastToggleBtn = document.getElementById("togglePastDaysBtn");

  if (pastToggleBtn) {
    pastToggleBtn.classList.toggle('active', showPastDays);
    pastToggleBtn.innerHTML = showPastDays ? `<span>👁️ إخفاء الأيام السابقة</span>` : `<span>👁️ الأيام السابقة</span>`;
  }

  const navWeek = document.getElementById("navWeekBtn");
  const navDay = document.getElementById("navDayBtn");
  const navDrive = document.getElementById("navDriveBtn");
  const navGuide = document.getElementById("navGuideBtn");
  const navTask = document.getElementById("navTaskBtn");

  if (navWeek) navWeek.classList.remove("active");
  if (navDay) navDay.classList.remove("active");
  if (navDrive) navDrive.classList.remove("active");
  if (navGuide) navGuide.classList.remove("active");
  if (navTask) navTask.classList.remove("active");

  if (activeView === "drive" || activeView === "guide" || activeView === "tasks" || activeView === "quiz-guide" || activeView === "cad") {
    if (controlBar) controlBar.style.display = "none";
    if (liveBox) liveBox.style.display = "none";
    if (mainHeader) mainHeader.style.display = "none";
    if (daysBar) daysBar.style.display = "none";
    if (dynBanner) dynBanner.style.display = "none";
    if (fwBanner) fwBanner.style.display = "none";
    if (legend) legend.style.display = "none";
    if (progressBox) progressBox.style.display = "none";

    if (activeView === "drive") {
      if (navDrive) navDrive.classList.add("active");
      renderDriveScreen();
    } else if (activeView === "guide") {
      if (navGuide) navGuide.classList.add("active");
      renderGuideScreen();
    } else if (activeView === "tasks") {
      if (navTask) navTask.classList.add("active");
      renderTasksScreen();
    } else if (activeView === "quiz-guide") {
      if (navTask) navTask.classList.add("active");
      renderQuizPreparationGuideView(activeQuizGuideId);
    } else if (activeView === "cad") {
      renderCadHubScreen();
    }
  } else {
    if (controlBar) controlBar.style.display = "flex";
    if (liveBox) liveBox.style.display = "flex";
    if (mainHeader) mainHeader.style.display = "flex";
    if (fwBanner) fwBanner.style.display = "block";
    if (legend) legend.style.display = "flex";
    if (progressBox) progressBox.style.display = "flex";

    if (activeView === "week") {
      if (navWeek) navWeek.classList.add("active");
      if (daysBar) daysBar.style.display = "none";
      renderWeekMatrix();
    } else {
      if (navDay) navDay.classList.add("active");
      if (daysBar) daysBar.style.display = "flex";
      renderDaysBar();
      renderDailyAgenda();
    }
  }

  updateLiveTracker();
  updateAcademicCalendarInfo();
  updateCountdowns();
}

function setView(mode, week, course) { 
  triggerHaptic("light"); 
  if (mode === "guide") {
    if (week) selectedGuideWeek = week;
    if (course) selectedGuideCourse = course;
    if (window.location.hash !== "#guide") window.location.hash = "#guide";
  } else if (mode === "cad") {
    if (window.location.hash !== "#cad") window.location.hash = "#cad";
  } else {
    if (window.location.hash === "#cad" || window.location.hash === "#guide") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }
  activeView = mode; 
  render(); 
  updateCountdowns();
}

function selectDay(day) { 
  triggerHaptic("light"); 
  activeDay = day; 
  renderDaysBar(); 
  renderDailyAgenda(); 
  updateDynamicsBannerUI(); 
}

// Controls Listeners
const sSelect = document.getElementById("sectionSelect");
if (sSelect) {
  sSelect.value = activeGroup;
  sSelect.addEventListener("change", e => {
    triggerHaptic("heavy");
    activeGroup = e.target.value;
    localStorage.setItem("cufe_active_group", activeGroup);
    render();
  });
}

function initDeviceMode() { setDeviceMode(localStorage.getItem("cufe_device_mode") || "mobile"); }
function setDeviceMode(mode) {
  const container = document.getElementById("mainContainer");
  const btn = document.getElementById("deviceModeBtn");
  const icon = document.getElementById("deviceModeIcon");
  const text = document.getElementById("deviceModeText");

  if (!container || !btn || !icon || !text) return;

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

const dModeBtn = document.getElementById("deviceModeBtn");
if (dModeBtn) {
  dModeBtn.addEventListener("click", () => {
    triggerHaptic("light");
    const isPc = document.getElementById("mainContainer").classList.contains("pc-mode");
    setDeviceMode(isPc ? "mobile" : "pc");
  });
}

function updateStatusBarColor(theme) {
  const meta = document.getElementById("themeColorMeta");
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#070b12" : "#f8fafc");
  }
}

function initTheme() {
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const saved = localStorage.getItem("cufe_theme") || (prefersLight ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", saved);
  updateStatusBarColor(saved);
}

const thmBtn = document.getElementById("themeBtn");
if (thmBtn) {
  thmBtn.addEventListener("click", () => {
    triggerHaptic("light");
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = (current === "dark") ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("cufe_theme", next);
    updateStatusBarColor(next);
  });
}

const prtBtn = document.getElementById("printBtn");
if (prtBtn) {
  prtBtn.addEventListener("click", () => {
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
}

const clnBtn = document.getElementById("calendarBtn");
if (clnBtn) clnBtn.addEventListener("click", exportToCalendar);

// Carousel Loop
let currentBannerIdx = 0;
const bannerTrack = document.getElementById('bannerTrack');

function getCarouselCount() {
  return document.querySelectorAll('#bannerTrack .banner-card').length || 1;
}

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
    const total = getCarouselCount();
    const index = Math.round(bannerTrack.scrollLeft / width);
    if (index !== currentBannerIdx && index >= 0 && index < total) {
      currentBannerIdx = index;
      updateBannerDots(index);
    }
  }, { passive: true });

  setInterval(() => {
    const bannerContainer = document.getElementById("firstWeekBanner");
    const total = getCarouselCount();
    if (bannerContainer && bannerContainer.style.display !== "none" && total > 1) {
      currentBannerIdx = (currentBannerIdx + 1) % total;
      goToBanner(currentBannerIdx);
    }
  }, 5500);
}

// PWA Install Engine
let deferredInstallPrompt = null;
const installBtn = document.getElementById("pwaTopInstallBtn");

function isIosDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isRunningStandalone() {
  return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone === true);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      if (reg) reg.update();
    }).catch(() => {});
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (installBtn && !isRunningStandalone()) {
    installBtn.style.display = "inline-flex";
  }
});

if (isIosDevice() && installBtn && !isRunningStandalone()) {
  installBtn.style.display = "inline-flex";
}

function openIosInstallModal() {
  const modal = document.getElementById("iosInstallModal");
  if (modal) modal.classList.add("open");
}

function closeIosInstallModal() {
  const modal = document.getElementById("iosInstallModal");
  if (modal) modal.classList.remove("open");
}

const iosModal = document.getElementById("iosInstallModal");
if (iosModal) {
  iosModal.addEventListener("click", (e) => {
    if (e.target.id === "iosInstallModal") closeIosInstallModal();
  });
}

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    triggerHaptic("heavy");

    if (isIosDevice()) {
      openIosInstallModal();
      return;
    }

    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === "accepted") {
        installBtn.style.display = "none";
      }
      deferredInstallPrompt = null;
    }
  });
}

window.addEventListener("appinstalled", () => {
  if (installBtn) installBtn.style.display = "none";
});

// Boot Sequence
initDeviceMode();
initTheme();
if (window.location.hash.startsWith("#guide")) {
  selectedGuideWeek = "Week 4";
  selectedGuideCourse = "EMC G101";
  activeView = "guide";
} else if (window.location.hash.startsWith("#cad")) {
  activeView = "cad";
}
render();
window.addEventListener("hashchange", () => {
  if (window.location.hash.startsWith("#guide")) {
    setView("guide", selectedGuideWeek || "Week 4", selectedGuideCourse || "EMC G101");
  } else if (window.location.hash.startsWith("#cad")) {
    setView("cad");
  }
});
syncFromGoogleSheets();
setInterval(updateLiveTracker, 60000);
if (window._countdownInterval) clearInterval(window._countdownInterval);
window._countdownInterval = setInterval(updateCountdowns, 60000);
updateCountdowns();


/* ==========================================================================
   Quiz Simulator — Marketing (GEN G119 — Chapter 3 & 2) Arena
   ========================================================================== */

let quiz2State = {
  active: false,
  chapter: 3, // 3 (default for Quiz 3) | 2
  mode: 'exam', // 'exam' (5-min real exam) | 'practice' (full test bank) | 'review'
  filter: 'all', // 'all' | 'mcq' | 'tf'
  questions: [],
  currentIndex: 0,
  userAnswers: {}, // qIndex -> optionIndex
  flagged: {}, // qIndex -> boolean
  startTime: null,
  elapsedSeconds: 0,
  timerSeconds: 300, // 5:00
  timerInterval: null,
  isSubmitted: false,
  mistakeIndices: [],
  keyListenerBound: false
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function openMarketingQuiz3Modal(mode = null) {
  quiz2State.chapter = 3;
  openMarketingQuizArenaModal(mode, 3);
}

function openMarketingQuiz2Modal(mode = null) {
  quiz2State.chapter = 2;
  openMarketingQuizArenaModal(mode, 2);
}

function openMarketingQuizArenaModal(mode = null, chapter = 3) {
  if (typeof triggerHaptic === 'function') triggerHaptic("heavy");

  const pool = chapter === 3 ? (window.marketingQuiz3Questions || []) : (window.marketingQuiz2Questions || []);
  if (!pool.length) {
    alert("بنك أسئلة الكويز غير محمل بعد!");
    return;
  }

  // Remove existing modal if any
  closeMarketingQuiz2Modal();

  let modal = document.createElement("div");
  modal.id = "marketingQuiz2Modal";
  modal.className = "quiz2-arena-overlay";
  modal.innerHTML = `
    <div class="quiz2-arena-card" id="quiz2ArenaCard" role="dialog" aria-modal="true">
      <div id="quiz2ArenaContent"></div>
    </div>
  `;

  // Attach backdrop click listener
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeMarketingQuiz2Modal();
    }
  });

  // Strict Safeguard: DOM Portal directly to document.body
  document.body.appendChild(modal);

  // Scroll lock
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  document.body.classList.add("modal-open");

  // Global key listener
  bindQuiz2Keyboard();

  // If explicit mode requested, start it; otherwise always render lobby!
  if (mode === 'exam' || mode === 'practice') {
    startQuiz2Session(mode);
  } else {
    renderQuiz2Lobby();
  }
}

function closeMarketingQuiz2Modal() {
  if (quiz2State.timerInterval) {
    clearInterval(quiz2State.timerInterval);
    quiz2State.timerInterval = null;
  }

  quiz2State.active = false;
  unbindQuiz2Keyboard();

  const modal = document.getElementById("marketingQuiz2Modal");
  if (modal) {
    modal.remove();
  }

  // Strict Safeguard: Always restore scrolling
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  document.body.classList.remove('modal-open');
}

function setQuizArenaChapter(ch) {
  quiz2State.chapter = ch;
  renderQuiz2Lobby();
}

function renderQuiz2Lobby() {
  const content = document.getElementById("quiz2ArenaContent");
  if (!content) return;

  if (quiz2State.timerInterval) {
    clearInterval(quiz2State.timerInterval);
    quiz2State.timerInterval = null;
  }
  quiz2State.active = false;

  const currentCh = quiz2State.chapter || 3;
  const pool = currentCh === 3 ? (window.marketingQuiz3Questions || []) : (window.marketingQuiz2Questions || []);
  const totalQuestions = pool.length || (currentCh === 3 ? 125 : 125);

  const chTitle = currentCh === 3 
    ? "GEN G119 — Marketing Quiz 3 | Chapter 3" 
    : "GEN G119 — Marketing Quiz 2 | Chapter 2";
  const chSubtitle = currentCh === 3 
    ? "Analyzing the Marketing Environment (Microenvironment & Macroenvironment)" 
    : "Company and Marketing Strategy: Partnering to Build Customer Relationships";
  const chBadge = currentCh === 3 
    ? "Quiz 3 • Chapter 3 (كويز الأحد 1 نوفمبر)" 
    : "Quiz 2 • Chapter 2 (الأرشيف)";

  content.innerHTML = `
    <div class="quiz2-lobby-screen">
      <header class="quiz2-lobby-head">
        <div class="quiz2-lobby-head-left">
          <span class="quiz2-tag-code">GEN G119</span>
          <span class="quiz2-lobby-pill">${chBadge}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="display:inline-flex;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:9999px;padding:2px 4px;">
            <button onclick="setQuizArenaChapter(3)" style="background:${currentCh === 3 ? '#06b6d4' : 'transparent'};color:${currentCh === 3 ? '#08121e' : 'var(--text-muted)'};font-weight:800;font-size:11.5px;padding:4px 12px;border:none;border-radius:9999px;cursor:pointer;">Ch.3 (Quiz 3 ⚡)</button>
            <button onclick="setQuizArenaChapter(2)" style="background:${currentCh === 2 ? '#06b6d4' : 'transparent'};color:${currentCh === 2 ? '#08121e' : 'var(--text-muted)'};font-weight:800;font-size:11.5px;padding:4px 12px;border:none;border-radius:9999px;cursor:pointer;">Ch.2 (Quiz 2)</button>
          </div>
          <button class="quiz2-btn-close" onclick="closeMarketingQuiz2Modal()" aria-label="Close" title="إغلاق المحاكي (Esc)">✕</button>
        </div>
      </header>

      <div class="quiz2-lobby-hero">
        <div class="quiz2-lobby-icon-bubble">${currentCh === 3 ? '⚡' : '🎯'}</div>
        <h2 class="quiz2-lobby-title">${chTitle}</h2>
        <p class="quiz2-lobby-subtitle">${chSubtitle}</p>
        <div class="quiz2-lobby-stats-strip">
          <span class="quiz2-lobby-stat-item">📚 ${totalQuestions} سؤال كامل من التست بانك</span>
          <span class="quiz2-lobby-dot">•</span>
          <span class="quiz2-lobby-stat-item">⏱️ محاكاة امتحان الـ 5 دقائق الحقيقي</span>
          <span class="quiz2-lobby-dot">•</span>
          <span class="quiz2-lobby-stat-item">💡 تصحيح فوري وشرح اختيارات</span>
        </div>
      </div>

      <div class="quiz2-lobby-cards-grid">
        <!-- 1) Quiz Mode Card -->
        <div class="quiz2-lobby-card exam-card" onclick="startQuiz2Session('exam')" role="button" tabindex="0">
          <div class="quiz2-card-glow-edge"></div>
          <div class="quiz2-card-badge-chip">⚡ يحاكي امتحان المحاضرة</div>
          <div class="quiz2-card-header-row">
            <div class="quiz2-card-icon-box">⚡</div>
            <div class="quiz2-card-title-col">
              <h3 class="quiz2-card-title">امتحان محاكاة الكويز (Quiz Mode)</h3>
              <span class="quiz2-card-subtitle">20 سؤال عشوائي • تايمر 5 دقائق</span>
            </div>
          </div>
          <p class="quiz2-card-desc">
            امتحان سريع يحاكي نظام الكويز بالضبط لقياس سرعتك ودقتك في الإجابة تحت ضغط الوقت مع تقييم نهائي فوري وإحصائيات كاملة.
          </p>
          <ul class="quiz2-card-features">
            <li><span>✓</span> 20 سؤال عشوائي متنوع (اختيار من متعدد MCQ + صح وغلط)</li>
            <li><span>⏱️</span> تايمر سريع 5 دقائق (05:00) يتوقف تلقائياً عند انتهاء الوقت</li>
            <li><span>📊</span> تقرير درجات تفصيلي وإمكانية إعادة حل الأسئلة التي أخطأت فيها فقط</li>
          </ul>
          <button class="quiz2-card-cta-btn primary" onclick="event.stopPropagation(); startQuiz2Session('exam');">
            <span>⚡ ابدأ امتحان المحاكاة (20 سؤال)</span>
          </button>
        </div>

        <!-- 2) Full Study Bank Card -->
        <div class="quiz2-lobby-card practice-card" onclick="startQuiz2Session('practice')" role="button" tabindex="0">
          <div class="quiz2-card-glow-edge"></div>
          <div class="quiz2-card-badge-chip">📚 تدريب شامل مفتوح</div>
          <div class="quiz2-card-header-row">
            <div class="quiz2-card-icon-box">📚</div>
            <div class="quiz2-card-title-col">
              <h3 class="quiz2-card-title">تدريب البنك الكامل (Full Study Bank)</h3>
              <span class="quiz2-card-subtitle">جميع الـ ${totalQuestions} سؤال • بدون تايمر</span>
            </div>
          </div>
          <p class="quiz2-card-desc">
            تصفح وحل كل أسئلة بنك الشابتر بالكامل بدون أي ضغط زمني، مع إظهار الإجابة الصحيحة فوراً ورقم صفحة الكتاب بعد كل اختيار.
          </p>
          <ul class="quiz2-card-features">
            <li><span>✓</span> بنك الأسئلة المعتمد بالكامل (100 MCQ + 25 True/False)</li>
            <li><span>♾️</span> وقت مفتوح تماماً ومريح بدون تايمر للتركيز في الفهم</li>
            <li><span>💡</span> كشف وتلوين الإجابة الصحيحة فور اختيارك مع رقم الصفحة في الكتاب</li>
          </ul>
          <button class="quiz2-card-cta-btn secondary" onclick="event.stopPropagation(); startQuiz2Session('practice');">
            <span>📚 ابدأ تدريب البنك (${totalQuestions} سؤال)</span>
          </button>
        </div>
      </div>

      <div class="quiz2-lobby-footer-bar">
        <div class="quiz2-lobby-footer-note">
          <span>💡 نصيحة للمذاكرة: ابدأ بتدريب البنك الكامل أولاً للتأكد من حفظ جميع الأسئلة، ثم اختبر نفسك بامتحان المحاكاة للتأكد من إنهاء الـ 20 سؤال في أقل من 5 دقائق!</span>
        </div>
      </div>
    </div>
  `;
}

function returnToQuiz2Lobby() {
  if (quiz2State.mode === 'exam' && !quiz2State.isSubmitted && Object.keys(quiz2State.userAnswers).length > 0) {
    if (!confirm("هل تريد العودة لشاشة اختيار الوضع وتغيير نظام التدريب؟")) return;
  }
  if (quiz2State.timerInterval) {
    clearInterval(quiz2State.timerInterval);
    quiz2State.timerInterval = null;
  }
  quiz2State.active = false;
  renderQuiz2Lobby();
}

function bindQuiz2Keyboard() {
  if (quiz2State.keyListenerBound) return;
  window.addEventListener("keydown", handleQuiz2Keydown);
  quiz2State.keyListenerBound = true;
}

function unbindQuiz2Keyboard() {
  window.removeEventListener("keydown", handleQuiz2Keydown);
  quiz2State.keyListenerBound = false;
}

function handleQuiz2Keydown(e) {
  if (!quiz2State.active) return;

  if (e.key === "Escape") {
    e.preventDefault();
    closeMarketingQuiz2Modal();
    return;
  }

  if (quiz2State.isSubmitted) return;

  const q = quiz2State.questions[quiz2State.currentIndex];
  if (!q) return;

  // Options 1-5 or A-E
  const keyUpper = e.key.toUpperCase();
  let optIndex = -1;

  if (["1", "2", "3", "4", "5"].includes(e.key)) {
    optIndex = parseInt(e.key, 10) - 1;
  } else if (["A", "B", "C", "D", "E"].includes(keyUpper)) {
    optIndex = keyUpper.charCodeAt(0) - 65;
  } else if (q.type === "tf") {
    if (keyUpper === "T") optIndex = 0;
    if (keyUpper === "F") optIndex = 1;
  }

  if (optIndex >= 0 && optIndex < q.options.length) {
    e.preventDefault();
    selectQuiz2Option(optIndex);
    return;
  }

  // Navigation
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    nextQuiz2Question();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    prevQuiz2Question();
  } else if (keyUpper === "F" || keyUpper === "M") {
    e.preventDefault();
    toggleQuiz2Flag();
  }
}

function startQuiz2Session(mode = 'exam', customQuestions = null) {
  if (quiz2State.timerInterval) {
    clearInterval(quiz2State.timerInterval);
    quiz2State.timerInterval = null;
  }

  quiz2State.active = true;
  quiz2State.mode = mode;
  quiz2State.isSubmitted = false;
  quiz2State.currentIndex = 0;
  quiz2State.userAnswers = {};
  quiz2State.flagged = {};
  quiz2State.startTime = Date.now();
  quiz2State.elapsedSeconds = 0;
  quiz2State.mistakeIndices = [];

  const currentCh = quiz2State.chapter || 3;
  const masterPool = currentCh === 3 ? (window.marketingQuiz3Questions || []) : (window.marketingQuiz2Questions || []);

  if (customQuestions && customQuestions.length) {
    quiz2State.questions = [...customQuestions];
  } else if (mode === 'exam') {
    // 5-minute real exam: pick 20 random questions
    const shuffled = shuffleArray(masterPool);
    quiz2State.questions = shuffled.slice(0, 20);
    quiz2State.timerSeconds = 300; // 5:00
  } else {
    // Full test bank
    quiz2State.questions = [...masterPool];
    quiz2State.timerSeconds = 0;
  }

  renderQuiz2Arena();

  if (mode === 'exam') {
    startQuiz2Timer();
  }
}

function startQuiz2Timer() {
  if (quiz2State.timerInterval) clearInterval(quiz2State.timerInterval);

  quiz2State.timerInterval = setInterval(() => {
    quiz2State.timerSeconds--;
    quiz2State.elapsedSeconds++;

    updateQuiz2TimerDisplay();

    if (quiz2State.timerSeconds <= 0) {
      clearInterval(quiz2State.timerInterval);
      quiz2State.timerInterval = null;
      submitQuiz2(true);
    }
  }, 1000);
}

function updateQuiz2TimerDisplay() {
  const timerEl = document.getElementById("quiz2TimerBox");
  if (!timerEl) return;

  const s = Math.max(0, quiz2State.timerSeconds);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  timerEl.innerHTML = `⏱️ ${timeStr}`;

  timerEl.classList.remove("warning", "critical");
  if (s <= 60) {
    timerEl.classList.add("critical");
  } else if (s <= 120) {
    timerEl.classList.add("warning");
  }
}

function renderQuiz2Arena() {
  const content = document.getElementById("quiz2ArenaContent");
  if (!content) return;

  const total = quiz2State.questions.length;
  const current = quiz2State.currentIndex + 1;
  const answeredCount = Object.keys(quiz2State.userAnswers).length;
  const progressPct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
  const q = quiz2State.questions[quiz2State.currentIndex];

  if (!q) {
    renderQuiz2Results();
    return;
  }

  const isExam = quiz2State.mode === 'exam';
  const isFlagged = !!quiz2State.flagged[quiz2State.currentIndex];
  const userSelected = quiz2State.userAnswers[quiz2State.currentIndex];
  const hasAnswered = userSelected !== undefined;

  content.innerHTML = `
    <!-- Top Header Bar -->
    <header class="quiz2-arena-head">
      <div class="quiz2-head-left">
        <span class="quiz2-tag-code">GEN G119</span>
        <button class="quiz2-btn-mode-change" onclick="returnToQuiz2Lobby()" title="الرجوع لشاشة اختيار الوضع">
          <span>🔙 تغيير الوضع</span>
        </button>
        <div class="quiz2-mode-pills">
          <button class="quiz2-mode-pill ${isExam ? 'active' : ''}" onclick="switchQuiz2Mode('exam')">
            ⚡ تحدي 5 دقائق
          </button>
          <button class="quiz2-mode-pill ${!isExam ? 'active' : ''}" onclick="switchQuiz2Mode('practice')">
            📚 البنك الكامل (${(quiz2State.chapter === 3 ? (window.marketingQuiz3Questions || []) : (window.marketingQuiz2Questions || [])).length})
          </button>
        </div>
      </div>

      <div class="quiz2-head-right">
        ${isExam ? `
          <div class="quiz2-timer-box" id="quiz2TimerBox">⏱️ 05:00</div>
        ` : `
          <div class="quiz2-practice-counter">سؤال ${current} من ${total}</div>
        `}
        <button class="quiz2-btn-close" onclick="closeMarketingQuiz2Modal()" aria-label="Close" title="إغلاق المحاكي (Esc)">✕</button>
      </div>
    </header>

    <!-- Progress Bar -->
    <div class="quiz2-progress-bar-wrap">
      <div class="quiz2-progress-fill" style="width: ${progressPct}%;"></div>
    </div>
    <div class="quiz2-progress-meta">
      <span>تم حل <strong>${answeredCount}</strong> من <strong>${total}</strong> سؤال (${progressPct}%)</span>
      <span>${isExam ? '⏱️ سرعة المحاكاة الواقعية' : '💡 وضع التدريب بالتصحيح الفوري'}</span>
    </div>

    <!-- Question Map Carousel / Drawer -->
    <div class="quiz2-qmap-container" id="quiz2QMap">
      <div class="quiz2-qmap-track">
        ${quiz2State.questions.map((item, idx) => {
          const ans = quiz2State.userAnswers[idx];
          const flg = quiz2State.flagged[idx];
          const isCur = idx === quiz2State.currentIndex;
          let cls = "quiz2-qmap-btn";
          if (isCur) cls += " current";
          if (flg) cls += " flagged";

          if (ans !== undefined) {
            if (isExam) {
              cls += " answered";
            } else {
              cls += (ans === item.answer) ? " correct" : " wrong";
            }
          }

          return `
            <button class="${cls}" onclick="jumpToQuiz2Question(${idx})" title="سؤال ${idx + 1}">
              ${flg ? '🚩' : (idx + 1)}
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Question Card Main -->
    <main class="quiz2-question-card">
      <div class="quiz2-q-badge-row">
        <span class="quiz2-q-badge">سؤال رقم ${current} • ${q.type === 'tf' ? 'صح / خطأ' : 'اختيار من متعدد MCQ'}</span>
        ${q.pageRef ? `<span class="quiz2-ref-badge">📖 Ref: P.${q.pageRef}</span>` : ''}
      </div>

      <div class="quiz2-question-text" dir="ltr">
        ${escapeQuizHtml(q.question)}
      </div>

      <!-- Options Grid -->
      <div class="quiz2-options-list" dir="ltr">
        ${q.options.map((opt, optIdx) => {
          const letter = q.type === 'tf' ? (optIdx === 0 ? 'T' : 'F') : String.fromCharCode(65 + optIdx);
          const isSelected = userSelected === optIdx;
          const isCorrect = optIdx === q.answer;
          let optCls = "quiz2-option-card";

          if (hasAnswered) {
            if (isExam) {
              if (isSelected) optCls += " selected";
            } else {
              // Practice mode: instant feedback!
              if (isCorrect) {
                optCls += " is-correct";
              } else if (isSelected && !isCorrect) {
                optCls += " is-wrong";
              }
            }
          }

          return `
            <div class="${optCls}" onclick="selectQuiz2Option(${optIdx})" role="button" tabindex="0">
              <span class="quiz2-opt-letter">${letter}</span>
              <span class="quiz2-opt-text">${escapeQuizHtml(opt)}</span>
              ${hasAnswered && !isExam ? `
                <span class="quiz2-opt-icon">
                  ${isCorrect ? '✓' : (isSelected ? '✗' : '')}
                </span>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>

      ${!isExam && hasAnswered ? `
        <div class="quiz2-instant-feedback ${userSelected === q.answer ? 'correct' : 'wrong'}">
          ${userSelected === q.answer ? `
            <span>🎉 <strong>إجابة صحيحة!</strong> أحسنت، الإجابة هي (${String.fromCharCode(65 + q.answer)}).</span>
          ` : `
            <span>❌ <strong>إجابة خاطئة!</strong> الإجابة الصحيحة هي: <strong>(${String.fromCharCode(65 + q.answer)}) ${escapeQuizHtml(q.options[q.answer])}</strong></span>
          `}
        </div>
      ` : ''}
    </main>

    <!-- Bottom Actions Toolbar -->
    <footer class="quiz2-arena-footer">
      <div class="quiz2-foot-left">
        <button class="quiz2-btn-flag ${isFlagged ? 'active' : ''}" onclick="toggleQuiz2Flag()">
          <span>${isFlagged ? '🚩 تم التعليم للمراجعة' : '🏳️ علّم للمراجعة'}</span>
        </button>
      </div>

      <div class="quiz2-foot-right">
        <button class="quiz2-btn-nav" onclick="prevQuiz2Question()" ${quiz2State.currentIndex === 0 ? 'disabled' : ''}>
          <span>◀ السابق</span>
        </button>

        ${current < total ? `
          <button class="quiz2-btn-nav quiz2-btn-primary" onclick="nextQuiz2Question()">
            <span>التالي ▶</span>
          </button>
        ` : `
          <button class="quiz2-btn-nav quiz2-btn-finish" onclick="submitQuiz2()">
            <span>🏁 إنهاء وتسليم</span>
          </button>
        `}
      </div>
    </footer>

    <!-- Shortcuts hint bar -->
    <div class="quiz2-shortcuts-hint">
      <span>💡 اختصارات: [1-5 / A-D] للاختيار • [← / →] للتنقل • [F] للتعليم • [Esc] للإغلاق</span>
    </div>
  `;

  if (isExam) {
    updateQuiz2TimerDisplay();
  }
}

function escapeQuizHtml(str) {
  return String(str || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function switchQuiz2Mode(newMode) {
  if (quiz2State.mode === newMode) return;
  if (confirm(newMode === 'exam' ? 'هل تريد بدء تحدي الـ 5 دقائق الآن؟' : 'هل تريد الانتقال لبنك الأسئلة الكامل للتمرين الحر؟')) {
    startQuiz2Session(newMode);
  }
}

function selectQuiz2Option(optIdx) {
  if (quiz2State.isSubmitted) return;
  const q = quiz2State.questions[quiz2State.currentIndex];
  if (!q) return;

  const prevAnswer = quiz2State.userAnswers[quiz2State.currentIndex];
  quiz2State.userAnswers[quiz2State.currentIndex] = optIdx;

  if (typeof triggerHaptic === 'function') {
    if (quiz2State.mode !== 'exam') {
      triggerHaptic(optIdx === q.answer ? 'light' : 'heavy');
    } else {
      triggerHaptic('light');
    }
  }

  renderQuiz2Arena();
}

function toggleQuiz2Flag() {
  const cur = quiz2State.currentIndex;
  quiz2State.flagged[cur] = !quiz2State.flagged[cur];
  if (typeof triggerHaptic === 'function') triggerHaptic('light');
  renderQuiz2Arena();
}

function nextQuiz2Question() {
  if (quiz2State.currentIndex < quiz2State.questions.length - 1) {
    quiz2State.currentIndex++;
    renderQuiz2Arena();
  }
}

function prevQuiz2Question() {
  if (quiz2State.currentIndex > 0) {
    quiz2State.currentIndex--;
    renderQuiz2Arena();
  }
}

function jumpToQuiz2Question(idx) {
  if (idx >= 0 && idx < quiz2State.questions.length) {
    quiz2State.currentIndex = idx;
    renderQuiz2Arena();
  }
}

function submitQuiz2(isTimeout = false) {
  if (quiz2State.timerInterval) {
    clearInterval(quiz2State.timerInterval);
    quiz2State.timerInterval = null;
  }

  quiz2State.isSubmitted = true;
  if (typeof triggerHaptic === 'function') triggerHaptic("heavy");

  const total = quiz2State.questions.length;
  let correctCount = 0;
  quiz2State.mistakeIndices = [];

  quiz2State.questions.forEach((q, idx) => {
    const userAns = quiz2State.userAnswers[idx];
    if (userAns === q.answer) {
      correctCount++;
    } else {
      quiz2State.mistakeIndices.push(idx);
    }
  });

  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  if (scorePct >= 85 && typeof confetti === 'function') {
    confetti({ particleCount: 110, spread: 90, origin: { y: 0.5 }, zIndex: 100050 });
  }

  renderQuiz2Results(isTimeout, correctCount, total, scorePct);
}

function renderQuiz2Results(isTimeout = false, correctCount = 0, total = 0, scorePct = 0) {
  const content = document.getElementById("quiz2ArenaContent");
  if (!content) return;

  const mistakesCount = quiz2State.mistakeIndices.length;
  const timeTakenSec = quiz2State.elapsedSeconds || (300 - quiz2State.timerSeconds);
  const mins = Math.floor(timeTakenSec / 60);
  const secs = timeTakenSec % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const avgSpeed = total > 0 ? (timeTakenSec / total).toFixed(1) : "0.0";

  let feedbackBadge = "🎯 أداء جيد";
  let feedbackCls = "good";
  if (scorePct >= 95) {
    feedbackBadge = "🏆 أداء أسطوري — A+ مضمونة!";
    feedbackCls = "legendary";
  } else if (scorePct >= 80) {
    feedbackBadge = "🌟 ممتاز جداً — جاهز تماماً للكويز";
    feedbackCls = "excellent";
  } else if (scorePct >= 60) {
    feedbackBadge = "⚡ جيد — اتدرب أكتر على السرعة";
    feedbackCls = "pass";
  } else {
    feedbackBadge = "📚 محتاج مراجعة وحل أخطائك";
    feedbackCls = "retry";
  }

  content.innerHTML = `
    <header class="quiz2-arena-head">
      <div class="quiz2-head-left">
        <span class="quiz2-tag-code">GEN G119</span>
        <span class="quiz2-mode-pill active">📊 النتيجة والتحليلات</span>
      </div>
      <button class="quiz2-btn-close" onclick="closeMarketingQuiz2Modal()" aria-label="Close">✕</button>
    </header>

    <div class="quiz2-results-body">
      ${isTimeout ? `
        <div class="quiz2-timeout-alert">
          ⏰ <strong>انتهى الوقت المخصص (5 دقائق)!</strong> تم تسليم الإجابات تلقائياً لمحاكاة وقت الكويز الفعلي.
        </div>
      ` : ''}

      <div class="quiz2-results-hero">
        <div class="quiz2-score-gauge-box">
          <svg class="quiz2-score-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" class="gauge-bg" />
            <circle cx="50" cy="50" r="42" class="gauge-fill" style="stroke-dashoffset: ${264 - (264 * scorePct) / 100};" />
          </svg>
          <div class="quiz2-score-inner">
            <span class="score-pct">${scorePct}%</span>
            <span class="score-sub">${correctCount}/${total}</span>
          </div>
        </div>

        <div class="quiz2-verdict-box">
          <div class="quiz2-verdict-badge ${feedbackCls}">${feedbackBadge}</div>
          <h2 class="quiz2-verdict-title">${quiz2State.chapter === 3 ? 'كويز 3 ماركتنج (Chapter 3)' : 'كويز 2 ماركتنج (Chapter 2)'}</h2>
          <p class="quiz2-verdict-desc">
            ${scorePct >= 85 
              ? 'مستواك ممتاز جداً وسرعتك تؤهلك لقفل الكويز الفعلي داخل المحاضرة بسهولة! حافظ على هذا المستوى.' 
              : 'الكويز مدته 5 دقائق فقط وسرعة التظليل بتفرق، راجع أخطاءك فوراً بالضغط على الزر الذهبي بالأسفل.'}
          </p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="quiz2-stats-grid">
        <div class="quiz2-stat-card">
          <span class="stat-icon">🎯</span>
          <div class="stat-val" style="color:#10b981;">${correctCount}</div>
          <div class="stat-lbl">إجابة صحيحة</div>
        </div>
        <div class="quiz2-stat-card">
          <span class="stat-icon">❌</span>
          <div class="stat-val" style="color:#ef4444;">${mistakesCount}</div>
          <div class="stat-lbl">أخطاء للتدريب</div>
        </div>
        <div class="quiz2-stat-card">
          <span class="stat-icon">⏱️</span>
          <div class="stat-val" style="color:#38bdf8;">${timeStr}</div>
          <div class="stat-lbl">الوقت المستغرق</div>
        </div>
        <div class="quiz2-stat-card">
          <span class="stat-icon">⚡</span>
          <div class="stat-val" style="color:#fbbf24;">${avgSpeed}s</div>
          <div class="stat-lbl">متوسط سرعة الإجابة</div>
        </div>
      </div>

      <!-- Action Buttons Grid -->
      <div class="quiz2-results-actions">
        ${mistakesCount > 0 ? `
          <button class="quiz2-btn-golden" onclick="retryQuiz2Mistakes()">
            <span>🔄 إعادة حل الأسئلة الخاطئة فقط (${mistakesCount} سؤال)</span>
          </button>
        ` : `
          <div class="quiz2-perfect-box">
            <span>🎉 ممتاز! لا توجد أي أخطاء لديك في هذه المحاولة (100%).</span>
          </div>
        `}

        <button class="quiz2-action-btn primary" onclick="startQuiz2Session('exam')">
          <span>⚡ بدء تحدي 5 دقائق جديد (أسئلة عشوائية)</span>
        </button>

        <button class="quiz2-action-btn secondary" onclick="returnToQuiz2Lobby()">
          <span>🔙 تغيير الوضع (Start Lobby)</span>
        </button>

        <button class="quiz2-action-btn secondary" onclick="renderFullQuiz2Review()">
          <span>📚 مراجعة كافة الأسئلة وإجاباتها النموذجية</span>
        </button>

        <button class="quiz2-action-btn secondary" onclick="closeMarketingQuiz2Modal()">
          <span>✕ إغلاق المحاكي</span>
        </button>
      </div>
    </div>
  `;
}

function retryQuiz2Mistakes() {
  if (!quiz2State.mistakeIndices.length) return;
  const missedQuestions = quiz2State.mistakeIndices.map(idx => quiz2State.questions[idx]);
  startQuiz2Session('practice', missedQuestions);
}

function renderFullQuiz2Review() {
  const content = document.getElementById("quiz2ArenaContent");
  if (!content) return;

  content.innerHTML = `
    <header class="quiz2-arena-head">
      <div class="quiz2-head-left">
        <span class="quiz2-tag-code">GEN G119</span>
        <span class="quiz2-mode-pill active">📚 مراجعة الحل النموذجي</span>
      </div>
      <button class="quiz2-btn-close" onclick="closeMarketingQuiz2Modal()" aria-label="Close">✕</button>
    </header>

    <div class="quiz2-review-list">
      ${quiz2State.questions.map((q, idx) => {
        const userAns = quiz2State.userAnswers[idx];
        const isCorrect = userAns === q.answer;
        const correctLetter = q.type === 'tf' ? (q.answer === 0 ? 'True' : 'False') : String.fromCharCode(65 + q.answer);
        const userLetter = userAns !== undefined ? (q.type === 'tf' ? (userAns === 0 ? 'True' : 'False') : String.fromCharCode(65 + userAns)) : 'لم تتم الإجابة';

        return `
          <div class="quiz2-review-item ${isCorrect ? 'correct' : 'wrong'}">
            <div class="quiz2-review-item-head">
              <span class="quiz2-review-num">سؤال ${idx + 1} (${q.type === 'tf' ? 'True/False' : 'MCQ'})</span>
              <span class="quiz2-review-badge ${isCorrect ? 'correct' : 'wrong'}">
                ${isCorrect ? '✓ إجابة صحيحة' : '✗ إجابة خاطئة'}
              </span>
            </div>
            <div class="quiz2-review-qtext" dir="ltr">${escapeQuizHtml(q.question)}</div>
            <div class="quiz2-review-opts" dir="ltr">
              ${q.options.map((opt, oIdx) => {
                const optLetter = q.type === 'tf' ? (oIdx === 0 ? 'T' : 'F') : String.fromCharCode(65 + oIdx);
                const isThisCorrect = oIdx === q.answer;
                const isThisChosen = oIdx === userAns;
                let cName = "quiz2-review-opt";
                if (isThisCorrect) cName += " is-correct-answer";
                if (isThisChosen && !isThisCorrect) cName += " is-user-wrong";

                return `
                  <div class="${cName}">
                    <strong>${optLetter})</strong> ${escapeQuizHtml(opt)}
                    ${isThisCorrect ? ' <span class="tag-correct">✓ الإجابة الصحيحة</span>' : ''}
                    ${isThisChosen && !isThisCorrect ? ' <span class="tag-wrong">✗ اختيارك</span>' : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}

      <div style="display:flex;gap:10px;margin-top:20px;justify-content:center;">
        <button class="quiz2-action-btn primary" onclick="startQuiz2Session('exam')">
          <span>⚡ بدء تحدي 5 دقائق جديد</span>
        </button>

        <button class="quiz2-action-btn secondary" onclick="returnToQuiz2Lobby()">
          <span>🔙 شاشة اختيار الوضع</span>
        </button>
        <button class="quiz2-action-btn secondary" onclick="closeMarketingQuiz2Modal()">
          <span>✕ إغلاق المحاكي</span>
        </button>
      </div>
    </div>
  `;
}

window.openMarketingQuiz3Modal = openMarketingQuiz3Modal;
window.openMarketingQuiz2Modal = openMarketingQuiz2Modal;
window.renderQuiz2Lobby = renderQuiz2Lobby;
window.returnToQuiz2Lobby = returnToQuiz2Lobby;
window.closeMarketingQuiz2Modal = closeMarketingQuiz2Modal;
