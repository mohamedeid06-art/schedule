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
let selectedGuideWeek = "Week 2";
let selectedGuideCourse = "MTH G102";

// خيار إظهار الأيام السابقة
let showPastDays = JSON.parse(localStorage.getItem("cufe_show_past_days") || "false");

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

    <div style="margin-top:2px;">
      <button class="action-btn" style="width:100%;justify-content:center;background:rgba(99, 102, 241, 0.12);color:#6366f1;border-color:#6366f1;" onclick="closeLinksModal();openDynamicsRoadmapModal();">
        <span>🗺 فتح خريطة المنهج أسبوع بأسبوع (Roadmap)</span>
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
  if (!badge) return;
  const allTasks = getAllCombinedTasks();
  const count = allTasks.filter(t => !t.isDone).length;
  if (count > 0) {
    badge.textContent = count;
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
      if (d) allEvents.push({ date: d, code: asgn.code, title: asgn.title, type: asgn.type, color: COURSES[asgn.code]?.hex || '#0284c7' });
    });
  }
  ASSESSMENTS.filter(a => a.group === "ALL" || a.group === activeGroup).forEach(a => {
    const d = getParsedDateObj(a.date);
    if (d) allEvents.push({ date: d, code: a.code, title: a.title, type: a.type || 'Task', color: COURSES[a.code]?.hex || '#ea580c' });
  });
  return allEvents;
}

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
          { name: `${asgn.code}_Resource_File.pdf`, url: asgn.folderUrl, size: "File / Folder" }
        ],
        submissionUrl: asgn.folderUrl,
        bonusPolicy: "حسب تعليمات المحاضر والمعيد.",
        isDone: isDone
      });
    });
  }

  DYNAMICS_THE_EXAMS.forEach(ex => {
    const cd = getExactCountdown(ex.deadline);
    const id = "the-" + ex.no;
    const isDone = completedTasks.includes(id);
    
    let priority = "scheduled";
    if (isDone) priority = "done";
    else if (cd.isUrgent) priority = "due-soon";
    else if (cd.diff <= 7 * 24 * 3600 * 1000) priority = "upcoming";

    list.push({
      id: id,
      code: "EMC G101",
      title: "Take-Home Exam " + ex.no + " — Model (" + ex.name + ")",
      type: "Take-Home Exam",
      deadline: ex.deadline,
      start: ex.start,
      countdown: cd,
      priority: priority,
      desc: "تحميل ورقة الأسئلة وحل مسائل النموذج (" + ex.name + ").\n⚠️ اختر (No / None) إذا اختلف ناتجك بأكثر من 1.5% عن الاختيارات.",
      note: "استخدم رابط الفورم و Exam ID المرسل على إيميلك لحساب درجاتك بشكل صحيح.",
      files: [
        { name: "Model_" + ex.name + "_Problems.pdf", url: ex.examSheet, size: "Exam Sheet PDF" },
        { name: "Dynamics_Course_Material.pdf", url: "https://drive.google.com/drive/folders/1fbGTWzv6phQayo0PzQAxfRg7v1kyk5_Y", size: "Lectures & Sheets" }
      ],
      submissionUrl: "https://sites.google.com/eng.cu.edu.eg/planedynamics100",
      bonusPolicy: "• الغلطة بمينص: خصم 25% من درجة السؤال لكل إجابة خطأ.\n• أول 12 ساعة: بونص +10% (الدرجة القصوى 110%).\n• أول يومين (48 ساعة): بونص +5% (الدرجة القصوى 105%).\n• في الموعد (قبل الديدلاين): الدرجة من 100% كاملة.\n• بعد الديدلاين: خصم 10% لكل أسبوع تأخير.\n• تأكيد الحل: بيوصلك إيميل فور الإرسال، والدرجات بتنزل كل جمعة.",
      isDone: isDone
    });
  });

  ASSESSMENTS.filter(a => (a.group === "ALL" || a.group === activeGroup) && isAssessmentUpcoming(a.date)).forEach((a, idx) => {
    const cd = getExactCountdown(a.date);
    const id = `sheet-task-${idx}`;
    const isDone = completedTasks.includes(id);

    let priority = "scheduled";
    if (isDone) priority = "due-soon";
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

/* ==========================================================================
   Subject-based Study Hub (Tasks screen)
   ========================================================================== */

function escHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getCourseMeta(code) {
  return COURSES[code] || { name: code, color: "var(--accent)", hex: "#0284c7", instructor: "CUFE Staff" };
}

function isQuizTask(task) {
  return /quiz|exam|midterm/i.test(task.type || '');
}

function weekNum(w) {
  return parseInt(String(w || '').replace(/\D/g, ''), 10) || 0;
}

function getSubjectGuides(code) {
  return WEEKLY_GUIDE_DATA.filter(g => g.code === code).sort((a, b) => weekNum(a.week) - weekNum(b.week));
}

function applyTasksSearch(tasks) {
  const q = tasksSearchQuery.trim().toLowerCase();
  if (!q) return tasks;
  return tasks.filter(t =>
    (t.code || '').toLowerCase().includes(q) ||
    (t.title || '').toLowerCase().includes(q) ||
    (t.desc || '').toLowerCase().includes(q) ||
    (t.note || '').toLowerCase().includes(q)
  );
}

function sortByDeadline(a, b) {
  const pa = a.countdown.isPassed ? 1 : 0;
  const pb = b.countdown.isPassed ? 1 : 0;
  if (pa !== pb) return pa - pb;
  return (new Date(a.deadline).getTime() || 0) - (new Date(b.deadline).getTime() || 0);
}

function getSheetProgressId(code, week) {
  return `sheet-${code.replace(/\s+/g, '')}-${String(week).replace(/\s+/g, '')}`;
}

/* ---------- Quiz Preparation Guide & Checklist Engine ---------- */

function getQuizStateKey(task) {
  return task.id || `${task.code}::${task.title}`;
}

function buildQuizChecklist(task) {
  const groups = [
    { key: 'lectures', icon: '📖', label: 'المحاضرات المقررة (Lectures & Slides)', color: '#38bdf8', items: [] },
    { key: 'sheets',   icon: '📝', label: 'الشيتات والمسائل (Sheets & Solutions)',  color: '#f59e0b', items: [] },
    { key: 'practice', icon: '🎬', label: 'فيديوهات وتطبيقات الحل (Practice)',      color: '#f43f5e', items: [] },
    { key: 'notes',    icon: '💡', label: 'أهم القوانين والملاحظات (Notes & Tips)', color: '#a78bfa', items: [] }
  ];
  const [L, S, V, N] = groups;
  const pushUnique = (grp, item) => {
    if (grp.items.some(i => i.id === item.id)) return;
    grp.items.push(item);
  };

  const guides = getSubjectGuides(task.code);
  const descLower = (task.desc || '').toLowerCase();
  const titleLower = (task.title || '').toLowerCase();

  // Try to find if this quiz is specific to certain weeks
  const matchedGuides = guides.filter(g => {
    const wkLower = (g.week || '').toLowerCase();
    const wkNum = String(weekNum(g.week));
    return descLower.includes(wkLower) || descLower.includes(`week ${wkNum}`) || descLower.includes(`w${wkNum}`) ||
           titleLower.includes(wkLower) || titleLower.includes(`week ${wkNum}`) || titleLower.includes(`w${wkNum}`);
  });

  const targetGuides = matchedGuides.length > 0 ? matchedGuides : guides;

  targetGuides.forEach(g => {
    const wk = String(g.week || '').replace(/\s+/g, '');
    
    // 1. Lecture
    if (g.lectures) {
      const links = [];
      if (g.slides_url) links.push({ label: 'سلايدات المحاضرة', icon: '📄', url: g.slides_url });
      pushUnique(L, {
        id: `lec-${wk}`,
        title: g.lectures,
        subtitle: `${g.week} • المحاضرات وسلايداتها المقررة`,
        links: links
      });
    }

    // 2. Sheet
    if (g.sheet) {
      const links = [];
      if (g.sheet_url) links.push({ label: 'ملف الشيت', icon: '📄', url: g.sheet_url });
      if (g.solution_url && g.solution_url !== g.sheet_url) links.push({ label: 'الحلول النموذجية', icon: '✅', url: g.solution_url });
      pushUnique(S, {
        id: `sht-${wk}`,
        title: g.sheet,
        subtitle: `${g.week} • حل وتدريب على مسائل الشيت`,
        links: links
      });
    }

    // 3. Practice & Videos
    if (g.playlists && g.playlists.length > 0) {
      g.playlists.forEach((p, i) => {
        pushUnique(V, {
          id: `vid-${wk}-${i}`,
          title: p.title,
          subtitle: `${g.week} • شرح وتطبيقات وحل مسائل`,
          links: p.url ? [{ label: 'مشاهدة الفيديو', icon: '🎬', url: p.url }] : []
        });
      });
    } else if (g.practice) {
      pushUnique(V, {
        id: `prac-${wk}`,
        title: g.practice,
        subtitle: `${g.week} • تمارين ومسائل عملية`,
        links: []
      });
    }

    // 4. Quick Notes / Formulas
    if (g.summary_url || g.summary_title) {
      pushUnique(N, {
        id: `sum-${wk}`,
        title: g.summary_title || 'ملخص القوانين والنوتس السريعة',
        subtitle: `${g.week} • مراجعة القوانين والملاحظات الهامة`,
        links: g.summary_url ? [{ label: 'فتح الملخص', icon: '💡', url: g.summary_url }] : []
      });
    }
  });

  // Fallbacks if some groups are empty
  const drive = (typeof DRIVE_DATA !== 'undefined' && DRIVE_DATA[task.code]) || {};
  if (!L.items.length) {
    L.items.push({
      id: `lec-default-${task.id}`,
      title: 'مراجعة كافة المحاضرات والسلايدات الداخلة في الكويز',
      subtitle: `${task.code} • مراجعة المحتوى النظري`,
      links: drive.lectures ? [{ label: 'فولدر المحاضرات', icon: '📚', url: drive.lectures }] : []
    });
  }

  if (!S.items.length) {
    S.items.push({
      id: `sht-default-${task.id}`,
      title: 'حل المسائل والشيتات المرتبطة بجزء الامتحان',
      subtitle: `${task.code} • التمارين والحلول النموذجية`,
      links: drive.sheets ? [{ label: 'فولدر الشيتات', icon: '📝', url: drive.sheets }] : []
    });
  }

  if (!V.items.length) {
    V.items.push({
      id: `vid-default-${task.id}`,
      title: 'مشاهدة فيديوهات الشرح وحل المسائل الصعبة',
      subtitle: `${task.code} • تدريب عملي ومسائل سابقة`,
      links: []
    });
  }

  // Add Course Capsules or Roadmaps if applicable
  const customLinks = [];
  if (task.code === 'EMC G101') customLinks.push({ label: '🗺️ خارطة الديناميكا', icon: '🗺️', url: 'javascript:openDynamicsRoadmapModal()' });
  if (task.code === 'MDP G121') customLinks.push({ label: '🗺️ خارطة الماتريال', icon: '🗺️', url: 'javascript:openMaterialsRoadmapModal()' });
  if (drive.folder) customLinks.push({ label: '📁 درايف المادة الكامل', icon: '📁', url: drive.folder });

  pushUnique(N, {
    id: `formula-default-${task.id}`,
    title: 'مراجعة شيت القوانين والكبسولة السريعة قبل الكويز',
    subtitle: `${task.code} • مراجعة نهائية مركزة`,
    links: customLinks
  });

  return groups;
}

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

function getQuizReadiness(pct) {
  if (pct >= 100) return { txt: 'جاهز تماماً 💯', color: '#22c55e' };
  if (pct >= 67) return { txt: 'قربت جداً 🔥', color: '#f59e0b' };
  if (pct >= 34) return { txt: 'في الطريق 🚀', color: '#38bdf8' };
  if (pct > 0) return { txt: 'بداية كويسة ✨', color: '#a78bfa' };
  return { txt: 'لسه مبدأتش 😴', color: '#94a3b8' };
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

  const afterPct = getQuizProgressById(taskId).pct;
  if (afterPct === 100 && beforePct < 100 && typeof confetti === 'function') {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 }, zIndex: 10050 });
  }

  // Update in-place if task details overlay is currently open with this task
  if (currentDetailedTask && currentDetailedTask.id === taskId) {
    const overlay = document.getElementById("taskDetailsOverlay");
    if (overlay && overlay.classList.contains("open")) {
      const scrollPos = overlay.scrollTop;
      renderQuizPreparationGuideInOverlay(currentDetailedTask);
      overlay.scrollTop = scrollPos;
    }
  }

  // Refresh tasks hub progress bars
  if (activeView === 'tasks') {
    renderTasksHubContent();
  }
}

function resetQuizChecklist(taskId) {
  if (!confirm("هل أنت متأكد من تصفير بنود التحضير لهذا الكويز؟")) return;
  triggerHaptic("medium");
  delete quizChecklistState[taskId];
  localStorage.setItem("cufe_quiz_checklists", JSON.stringify(quizChecklistState));

  if (currentDetailedTask && currentDetailedTask.id === taskId) {
    renderQuizPreparationGuideInOverlay(currentDetailedTask);
  }
  if (activeView === 'tasks') {
    renderTasksHubContent();
  }
}

/* ---------- Simplified Tasks Screen Renderer ---------- */

function renderTasksScreen() {
  const container = document.getElementById("viewContainer");
  const allTasks = getAllCombinedTasks();

  container.innerHTML = `
    <div class="tasks-hub-container">
      <div class="view-back-bar">
        <button class="view-back-btn" onclick="setView('week')">
          <span>◀</span><span>الرجوع للجدول</span>
        </button>
        <span style="font-size:12px;font-weight:800;color:var(--text-muted);">TASKS & EXAMS HUB</span>
      </div>

      <div class="tasks-main-header">
        <div class="tasks-header-left">
          <div class="tasks-icon-box">📋</div>
          <div>
            <div class="tasks-header-title">Tasks & Exams Hub</div>
            <div class="tasks-header-subtitle">الكويزات والأسينمنتس منظمة مادة مادة 🎯</div>
          </div>
        </div>
        <button class="focus-mode-btn ${isFocusModeActive ? 'active' : ''}" id="focusModeBtn" onclick="toggleFocusMode()">
          <span>⚡</span>
          <span>Focus Mode</span>
        </button>
      </div>

      <!-- Subject Filter Pills (Dark Glassmorphism) -->
      <nav class="subject-hub-bar" id="subjectHubBar" role="tablist" aria-label="فلترة حسب المادة">
        ${renderSubjectChipsHtml(allTasks)}
      </nav>

      <!-- Search Row -->
      <div class="tasks-search-row">
        <div class="tasks-search-input-box">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" id="tasksSearchInput" placeholder="ابحث عن التاسك أو الكويز..." value="${escHtml(tasksSearchQuery)}" oninput="handleTasksSearch(this.value)">
        </div>
        <button class="tasks-cal-trigger-btn" onclick="openMonthCalendarModal()" title="Open Interactive Calendar">
          📅
        </button>
      </div>

      <!-- Main Clean Content Stream -->
      <div class="subject-hub-content" id="tasksHubContent"></div>
    </div>
  `;

  renderTasksHubContent(allTasks);

  const activeChip = document.querySelector('#subjectHubBar .subject-chip.active');
  if (activeChip) activeChip.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function renderSubjectChipsHtml(allTasks) {
  const pendingAll = allTasks.filter(t => !t.isDone).length;
  const chips = [`
    <button class="subject-chip subject-chip-all ${activeSubjectFilter === 'all' ? 'active' : ''}" id="subjectChip-all"
      data-code="all" role="tab" aria-selected="${activeSubjectFilter === 'all'}" onclick="setSubjectFilter('all')">
      <span class="subject-chip-dot"></span>
      <span class="subject-chip-code">الكل</span>
      <span class="subject-chip-name">All</span>
      <span class="subject-chip-count" data-count-for="all">${pendingAll}</span>
    </button>
  `];

  Object.keys(COURSES).forEach(code => {
    const c = COURSES[code];
    const pending = allTasks.filter(t => t.code === code && !t.isDone).length;
    const shortName = c.name.split(/[(&]/)[0].trim();
    const safeId = code.replace(/\s+/g, '-');
    chips.push(`
      <button class="subject-chip ${activeSubjectFilter === code ? 'active' : ''}" id="subjectChip-${safeId}"
        data-code="${code}" role="tab" aria-selected="${activeSubjectFilter === code}" style="--chip-c:${c.hex};"
        title="${escHtml(c.name)}" onclick="setSubjectFilter('${code}')">
        <span class="subject-chip-dot"></span>
        <span class="subject-chip-code">${code}</span>
        <span class="subject-chip-name">${escHtml(shortName)}</span>
        <span class="subject-chip-count ${pending ? '' : 'zero'}" data-count-for="${code}">${pending}</span>
      </button>
    `);
  });
  return chips.join('');
}

function updateSubjectChipCounts(allTasks) {
  document.querySelectorAll('#subjectHubBar .subject-chip-count').forEach(el => {
    const code = el.dataset.countFor;
    const n = allTasks.filter(t => !t.isDone && (code === 'all' || t.code === code)).length;
    el.textContent = n;
    el.classList.toggle('zero', n === 0 && code !== 'all');
  });
}

function setSubjectFilter(code) {
  if (code !== 'all' && !COURSES[code]) code = 'all';
  const changed = code !== activeSubjectFilter;
  activeSubjectFilter = code;
  localStorage.setItem("cufe_tasks_subject", code);

  const content = document.getElementById("tasksHubContent");
  if (!content || activeView !== 'tasks') return;
  if (!changed) return;
  triggerHaptic("light");

  document.querySelectorAll('#subjectHubBar .subject-chip').forEach(ch => {
    const on = ch.dataset.code === code;
    ch.classList.toggle('active', on);
    ch.setAttribute('aria-selected', String(on));
    if (on) ch.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });

  content.classList.add('is-fading');
  clearTimeout(window._hubFadeTimer);
  window._hubFadeTimer = setTimeout(() => {
    renderTasksHubContent();
    requestAnimationFrame(() => content.classList.remove('is-fading'));
  }, 160);
}

function renderTasksHubContent(allTasksArg) {
  const el = document.getElementById("tasksHubContent");
  if (!el) return;
  const allTasks = allTasksArg || getAllCombinedTasks();

  // 1. Filter by subject
  let list = activeSubjectFilter === 'all'
    ? allTasks
    : allTasks.filter(t => t.code === activeSubjectFilter);

  // 2. Search
  list = applyTasksSearch(list);

  // Summary counts
  const totalCount = list.length;
  const dueSoonCount = list.filter(t => !t.isDone && t.priority === 'due-soon').length;
  const thisWeekCount = list.filter(t => !t.isDone && (t.priority === 'due-soon' || t.priority === 'upcoming')).length;

  // 3. Status Tab filter
  let filtered = list;
  if (activeTaskFilter === 'due-soon') {
    filtered = filtered.filter(t => !t.isDone && t.priority === 'due-soon');
  } else if (activeTaskFilter === 'this-week') {
    filtered = filtered.filter(t => !t.isDone && (t.priority === 'due-soon' || t.priority === 'upcoming'));
  } else if (activeTaskFilter === 'completed') {
    filtered = filtered.filter(t => t.isDone);
  }

  // 4. Focus Mode
  if (isFocusModeActive) {
    filtered = filtered.filter(t => !t.isDone).sort(sortByDeadline).slice(0, 3);
  }

  // 5. Clean separation: Quizzes vs Assignments
  const quizzes = filtered.filter(isQuizTask).sort(sortByDeadline);
  const assignments = filtered.filter(t => !isQuizTask(t)).sort(sortByDeadline);

  el.innerHTML = `
    <!-- Summary Chips Bar -->
    <div class="tasks-summary-bar">
      <div class="summary-stat-chip">
        <span class="summary-stat-icon">📑</span>
        <div class="summary-stat-info">
          <span class="summary-stat-num">${totalCount}</span>
          <span class="summary-stat-txt">${activeSubjectFilter === 'all' ? 'Total Tasks' : activeSubjectFilter}</span>
        </div>
      </div>

      <div class="summary-stat-chip">
        <span class="summary-stat-icon">📅</span>
        <div class="summary-stat-info">
          <span class="summary-stat-num" style="color:#f59e0b;">${thisWeekCount}</span>
          <span class="summary-stat-txt">Due This Week</span>
        </div>
      </div>

      <div class="summary-stat-chip">
        <span class="summary-stat-icon">⏳</span>
        <div class="summary-stat-info">
          <span class="summary-stat-num" style="color:#ef4444;">${dueSoonCount}</span>
          <span class="summary-stat-txt">Due Soon</span>
        </div>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="subject-pill-filters">
      <button class="sub-filter-pill ${activeTaskFilter === 'all' ? 'active' : ''}" onclick="setTaskFilterTab('all')">الكل All</button>
      <button class="sub-filter-pill ${activeTaskFilter === 'due-soon' ? 'active' : ''}" onclick="setTaskFilterTab('due-soon')">🔴 Due Soon</button>
      <button class="sub-filter-pill ${activeTaskFilter === 'this-week' ? 'active' : ''}" onclick="setTaskFilterTab('this-week')">📅 This Week</button>
      <button class="sub-filter-pill ${activeTaskFilter === 'completed' ? 'active' : ''}" onclick="setTaskFilterTab('completed')">🟢 Completed</button>
    </div>

    <!-- Clean Task & Quiz Stream -->
    <div class="tasks-stream">
      ${quizzes.length > 0 ? `
        <div>
          <div class="task-section-head">
            <div class="task-section-title-wrap" style="color:var(--quiz-color, #f97316);">
              <span>🎯</span><span>الكويزات والامتحانات (Quizzes & Exams)</span>
            </div>
            <span class="task-section-count">${quizzes.length} exams</span>
          </div>
          <div class="hub-quiz-grid">
            ${quizzes.map(renderQuizCardHtml).join('')}
          </div>
        </div>
      ` : ''}

      ${assignments.length > 0 ? `
        <div>
          <div class="task-section-head">
            <div class="task-section-title-wrap" style="color:#38bdf8;">
              <span>📝</span><span>المهام والتسليمات (Assignments & Deliverables)</span>
            </div>
            <span class="task-section-count">${assignments.length} tasks</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            ${assignments.map(renderCompactTaskCardHtml).join('')}
          </div>
        </div>
      ` : ''}

      ${filtered.length === 0 ? `
        <div class="hub-empty">
          <div style="font-size:24px;margin-bottom:6px;">✨</div>
          <div>لا توجد كويزات أو مهام مطابقة للبحث أو الفلتر حالياً</div>
          <div style="font-size:11px;color:var(--text-subtle);margin-top:4px;">جرّب اختيار مادة تانية أو تغيير فلتر الحالة</div>
        </div>
      ` : ''}
    </div>
  `;

  updateSubjectChipCounts(allTasks);
}

function refreshTasksHub() {
  updateTaskBadge();
  if (activeView !== 'tasks') return;
  if (document.getElementById("tasksHubContent")) renderTasksHubContent();
  else renderTasksScreen();
}

/* ---------- Card Renderers ---------- */

function renderQuizCardHtml(task) {
  const course = getCourseMeta(task.code);
  const p = getQuizProgressById(task.id);
  const ready = getQuizReadiness(p.pct);
  const d = new Date(task.deadline);
  const dateTxt = !isNaN(d.getTime())
    ? `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
    : escHtml(task.deadline);

  return `
    <article class="quiz-hub-card ${task.isDone ? 'is-done' : ''} ${task.countdown.isPassed ? 'is-passed' : ''}" style="--c:${course.hex};" onclick="openTaskDetails('${task.id}')">
      <div class="quiz-hub-top">
        <span class="quiz-hub-code">${task.code}</span>
        <span class="quiz-hub-type">${task.isDone ? '✓ Completed' : escHtml(task.type)}</span>
      </div>

      <div class="quiz-hub-body">
        <div class="quiz-hub-info">
          <h3 class="quiz-hub-title" dir="auto">${escHtml(task.title)}</h3>
          <div class="quiz-hub-meta">📅 ${dateTxt}</div>
          <div class="quiz-hub-countdown ${task.countdown.isUrgent ? 'urgent' : ''}">⏳ ${task.countdown.text}</div>
        </div>
      </div>

      <div class="quiz-hub-ready">
        <span style="color:${ready.color};font-weight:800;">${ready.txt}</span>
        <span class="quiz-hub-ready-count">${p.done}/${p.total} بنود مذاكرة (${p.pct}%)</span>
      </div>
      <div class="quiz-hub-bar"><span style="width:${p.pct}%;background:${ready.color};"></span></div>

      <div class="quiz-hub-actions" onclick="event.stopPropagation()">
        <button class="quiz-guide-btn" onclick="openTaskDetails('${task.id}')">
          <span>🎯</span>
          <span>خطة التحضير والتفاصيل ↗</span>
        </button>
      </div>
    </article>
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

      <div class="compact-task-title">${escHtml(task.title)}</div>

      <div class="compact-task-meta">
        <div style="display:inline-flex;align-items:center;gap:6px;font-family:'JetBrains Mono', monospace;font-size:11px;background:rgba(255,255,255,0.04);padding:4px 8px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
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
        <div class="compact-task-note">
          <span class="txt">📝 ${escHtml(task.note)}</span>
          <span style="font-size:10.5px;color:var(--accent);font-weight:800;flex-shrink:0;">تفاصيل ↗</span>
        </div>
      ` : ''}
    </div>
  `;
}

function handleTasksSearch(val) { tasksSearchQuery = val; renderTasksHubContent(); }
function setTaskFilterTab(tab) { triggerHaptic("light"); activeTaskFilter = tab; renderTasksHubContent(); }
function toggleFocusMode() {
  triggerHaptic("heavy");
  isFocusModeActive = !isFocusModeActive;
  const btn = document.getElementById("focusModeBtn");
  if (btn) btn.classList.toggle("active", isFocusModeActive);
  renderTasksHubContent();
}

/* ---------- Dedicated Task Details & Quiz Preparation Guide View ---------- */

function openQuizGuide(taskId) {
  openTaskDetails(taskId);
}

function openTaskDetails(taskId) {
  triggerHaptic("heavy");
  const allTasks = getAllCombinedTasks();
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return;

  currentDetailedTask = task;
  const overlay = document.getElementById("taskDetailsOverlay");
  const headerTag = overlay ? overlay.querySelector(".details-header span:last-child") : null;

  if (isQuizTask(task)) {
    if (headerTag) headerTag.textContent = "QUIZ PREPARATION GUIDE";
    renderQuizPreparationGuideInOverlay(task);
  } else {
    if (headerTag) headerTag.textContent = "TASK DETAILS";
    renderAssignmentDetailsInOverlay(task);
  }

  if (overlay) {
    overlay.classList.add("open");
    overlay.scrollTop = 0;
  }
}

function closeTaskDetails() {
  triggerHaptic("light");
  const overlay = document.getElementById("taskDetailsOverlay");
  if (overlay) overlay.classList.remove("open");
  currentDetailedTask = null;
  refreshTasksHub();
}

/* 1. Quiz Preparation Guide (Weekly Guide Inspired) */
function renderQuizPreparationGuideInOverlay(task) {
  const content = document.getElementById("taskDetailsContent");
  if (!content) return;
  const course = COURSES[task.code] || { name: task.code, color: "var(--accent)", instructor: "CUFE Faculty" };
  const p = getQuizProgressById(task.id);
  const ready = getQuizReadiness(p.pct);

  const dObj = new Date(task.deadline);
  const formattedDate = !isNaN(dObj.getTime()) ? dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : task.deadline;
  const formattedTime = !isNaN(dObj.getTime()) ? dObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

  const sObj = new Date(task.start);
  const formattedStartDate = !isNaN(sObj.getTime()) ? sObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const formattedStartTime = !isNaN(sObj.getTime()) ? sObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

  const descLines = (task.desc || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => `<div class="task-desc-line">${escHtml(l)}</div>`)
    .join('');

  content.innerHTML = `
    <div class="quiz-prep-hero" style="--c: ${course.color};">
      <div class="quiz-prep-hero-top">
        <span class="quiz-prep-course-pill">${task.code} • ${escHtml(course.name)}</span>
        <span class="quiz-prep-type-badge ${task.isDone ? 'done' : ''}">
          ${task.isDone ? '✓ Completed' : (task.countdown.isUrgent ? '🔴 Urgent' : '🎯 Exam / Quiz')}
        </span>
      </div>

      <h1 class="quiz-prep-hero-title" dir="auto">${escHtml(task.title)}</h1>
      <div class="quiz-prep-hero-inst">👨‍🏫 المحاضر: ${escHtml(course.instructor || 'Staff')}</div>

      <div class="details-time-strip" style="margin-top: 10px;">
        ${formattedStartDate ? `
          <div class="details-time-row">
            <span style="color:#10b981;font-weight:800;">🟢 وقت البدء:</span>
            <span class="details-time-val">${formattedStartDate} • ${formattedStartTime}</span>
          </div>
        ` : ''}
        <div class="details-time-row">
          <span style="color:#ef4444;font-weight:800;">🔴 موعد الكويز والديدلاين:</span>
          <span class="details-time-val">${formattedDate} • ${formattedTime}</span>
        </div>
        <div style="font-size:12px;font-weight:800;color:${task.countdown.isUrgent ? '#ef4444' : '#38bdf8'};margin-top:2px;direction:ltr;text-align:center;">
          ⏳ ${task.countdown.text}
        </div>
      </div>

      <!-- Preparation Readiness Progress Bar -->
      <div class="quiz-prep-readiness-box">
        <div class="quiz-prep-readiness-head">
          <div class="quiz-prep-readiness-label" style="color:${ready.color};">
            <span>🎯 معدل الجاهزية: <b>${ready.txt}</b></span>
          </div>
          <div class="quiz-prep-readiness-pct" style="color:${ready.color};">${p.pct}%</div>
        </div>
        <div class="quiz-prep-bar">
          <div class="quiz-prep-bar-fill" style="width:${p.pct}%;background:${ready.color};"></div>
        </div>
        <div class="quiz-prep-readiness-foot">
          <span>تم إنجاز ${p.done} من ${p.total} خطوة تحضيرية</span>
          <span>${p.pct === 100 ? '🎉 مستعد تماماً للكويز!' : 'علّم على اللي خلصته لمتابعة التقدم'}</span>
        </div>
      </div>
    </div>

    ${descLines ? `
      <div class="details-section-box">
        <div class="details-section-title"><span>📋</span><span>تعليمات ومقرر الكويز</span></div>
        <div class="task-desc-container">${descLines}</div>
        ${task.note ? `<div style="background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:10px;border-left:3.5px solid var(--accent);margin-top:6px;direction:rtl;text-align:right;"><b>ملاحظة:</b> ${escHtml(task.note)}</div>` : ''}
      </div>
    ` : ''}

    ${task.files && task.files.length > 0 ? `
      <div class="details-section-box">
        <div class="details-section-title"><span>📎</span><span>ملفات ومرفقات الكويز (${task.files.length})</span></div>
        <div class="details-files-list">
          ${task.files.map(f => `
            <a href="${f.url}" target="_blank" rel="noopener noreferrer" class="details-file-item">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:16px;">📄</span>
                <div>
                  <div>${escHtml(f.name)}</div>
                  <span style="font-size:9.5px;color:var(--text-muted);">${f.size || 'PDF'}</span>
                </div>
              </div>
              <span style="color:var(--accent);font-size:12px;">فتح ↗</span>
            </a>
          `).join("")}
        </div>
      </div>
    ` : ''}

    <!-- Preparation Checklist Cards (Weekly Guide Style) -->
    <div class="quiz-prep-section">
      <div class="quiz-prep-section-head">
        <div class="quiz-prep-section-title">
          <span>📚</span>
          <span>خطة المذاكرة والتحضير (Preparation Guide)</span>
        </div>
        <span class="quiz-prep-section-count">${p.done}/${p.total} منجز</span>
      </div>

      <div class="quiz-prep-cards-list">
        ${p.categories.map(cat => `
          <div class="quiz-prep-group">
            <div class="quiz-prep-group-header" style="--grp-c: ${cat.color};">
              <div style="display:flex;align-items:center;gap:6px;">
                <span>${cat.icon}</span>
                <span style="font-weight:800;font-size:13px;color:var(--text-main);">${cat.label}</span>
              </div>
              <span class="quiz-prep-group-badge">${cat.items.filter(i => p.state[i.id]).length}/${cat.items.length}</span>
            </div>

            <div class="quiz-prep-items-stack">
              ${cat.items.map(item => {
                const isChecked = !!p.state[item.id];
                return `
                  <div class="quiz-prep-card ${isChecked ? 'is-completed' : ''}" id="quizPrepCard-${item.id}">
                    <div class="quiz-prep-card-top">
                      <button class="quiz-prep-check ${isChecked ? 'checked' : ''}"
                        onclick="toggleQuizChecklistItem('${task.id}', '${item.id}')"
                        role="checkbox" aria-checked="${isChecked}" title="${isChecked ? 'إلغاء الإكمال' : 'تعليم كمكتمل'}">
                        ${isChecked ? '✓' : ''}
                      </button>

                      <div class="quiz-prep-card-body" onclick="toggleQuizChecklistItem('${task.id}', '${item.id}')" style="cursor:pointer;">
                        <div class="quiz-prep-item-title" dir="auto">${escHtml(item.title)}</div>
                        ${item.subtitle ? `<div class="quiz-prep-item-sub">${escHtml(item.subtitle)}</div>` : ''}
                      </div>
                    </div>

                    ${item.links && item.links.length > 0 ? `
                      <div class="quiz-prep-links-row">
                        ${item.links.map(l => `
                          <button class="quiz-prep-link-btn" onclick="openSafeDriveLink('${escHtml(l.url)}')">
                            <span>${l.icon || '↗'}</span>
                            <span>${escHtml(l.label)}</span>
                          </button>
                        `).join('')}
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Actions Footer -->
    <div class="quiz-prep-actions">
      <button class="quiz-prep-action-btn primary ${task.isDone ? 'is-done' : ''}" onclick="toggleTaskCompleted('${task.id}')">
        ${task.isDone ? '↩ تم إلغاء إنهاء الكويز' : '✓ خلصت الكويز بالكامل'}
      </button>
      <button class="quiz-prep-action-btn secondary" onclick="resetQuizChecklist('${task.id}')">
        <span>↺</span><span>تصفير تقدم المذاكرة</span>
      </button>
    </div>
  `;
}

/* 2. Assignment / Regular Task Details */
function renderAssignmentDetailsInOverlay(task) {
  const content = document.getElementById("taskDetailsContent");
  if (!content) return;
  const course = COURSES[task.code] || { name: task.code, color: "var(--accent)", instructor: "CUFE Faculty" };

  const dObj = new Date(task.deadline);
  const formattedDate = !isNaN(dObj.getTime()) ? dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : task.deadline;
  const formattedTime = !isNaN(dObj.getTime()) ? dObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

  const sObj = new Date(task.start);
  const formattedStartDate = !isNaN(sObj.getTime()) ? sObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const formattedStartTime = !isNaN(sObj.getTime()) ? sObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

  const formattedDescLines = (task.desc || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => `<div class="task-desc-line">${escHtml(line)}</div>`)
    .join('');

  content.innerHTML = `
    <div class="details-card-hero" style="--c: ${course.color};">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="compact-sub-pill" style="font-size:11px;">${task.code}</span>
        <span class="compact-priority-badge ${task.priority}" style="font-size:10.5px;">
          ${task.isDone ? '✓ Completed' : (task.priority === 'due-soon' ? '🔴 Due Soon' : 'Upcoming')}
        </span>
      </div>

      <div style="font-size:17px;font-weight:800;color:var(--text-main);line-height:1.35;margin-top:2px;">${escHtml(task.title)}</div>
      <div style="font-size:12px;color:var(--text-muted);font-weight:600;">${escHtml(course.name)}</div>

      <div class="details-time-strip">
        ${formattedStartDate ? `
          <div class="details-time-row">
            <span style="color:#10b981;font-weight:800;">🟢 وقت البدء:</span>
            <span class="details-time-val">${formattedStartDate} • ${formattedStartTime}</span>
          </div>
        ` : ''}
        <div class="details-time-row">
          <span style="color:#ef4444;font-weight:800;">🔴 الديدلاين النهائي:</span>
          <span class="details-time-val">${formattedDate} • ${formattedTime}</span>
        </div>
        <div style="font-size:12px;font-weight:800;color:#ef4444;margin-top:2px;direction:ltr;text-align:center;">
          ⏳ ${task.countdown.text}
        </div>
      </div>

      <div class="details-blocks-grid">
        <div class="details-meta-block">
          <span style="color:var(--text-muted);font-weight:700;">Subject</span>
          <b style="color:var(--text-main);">${task.code}</b>
        </div>
        <div class="details-meta-block">
          <span style="color:var(--text-muted);font-weight:700;">Instructor</span>
          <b style="color:var(--text-main);">${escHtml(course.instructor || 'Staff')}</b>
        </div>
        <div class="details-meta-block">
          <span style="color:var(--text-muted);font-weight:700;">Type</span>
          <b style="color:var(--accent);">${escHtml(task.type)}</b>
        </div>
      </div>
    </div>

    <div class="details-section-box">
      <div class="details-section-title"><span>📋</span><span>تفاصيل وملاحظات المهمة</span></div>
      <div class="task-desc-container">${formattedDescLines}</div>
      ${task.note ? `<div style="background:var(--surface-alt);padding:8px 12px;border-radius:10px;border-left:3.5px solid var(--accent);margin-top:6px;direction:rtl;text-align:right;"><b>ملاحظة:</b> ${escHtml(task.note)}</div>` : ''}
    </div>

    ${task.bonusPolicy ? `
      <div class="details-section-box" style="border-left:4px solid #10b981;">
        <div class="details-section-title" style="color:#10b981;"><span>💡</span><span>تعليمات التسليم والـ Bonus</span></div>
        <div style="line-height:1.5;color:var(--text-main);white-space:pre-line;direction:rtl;text-align:right;">${escHtml(task.bonusPolicy)}</div>
      </div>
    ` : ''}

    ${task.files && task.files.length > 0 ? `
      <div class="details-section-box">
        <div class="details-section-title"><span>📎</span><span>الملفات والمرفقات (${task.files.length})</span></div>
        <div class="details-files-list">
          ${task.files.map(f => `
            <a href="${f.url}" target="_blank" rel="noopener noreferrer" class="details-file-item">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:16px;">📄</span>
                <div>
                  <div>${escHtml(f.name)}</div>
                  <span style="font-size:9.5px;color:var(--text-muted);">${f.size || 'PDF'}</span>
                </div>
              </div>
              <span style="color:var(--accent);font-size:12px;">تحميل ↗</span>
            </a>
          `).join("")}
        </div>
      </div>
    ` : ''}

    ${task.submissionUrl ? `
      <div class="details-section-box">
        <div class="details-section-title"><span>🔗</span><span>رابط التسليم (Submission Portal)</span></div>
        <a href="${task.submissionUrl}" target="_blank" rel="noopener noreferrer" class="action-btn" style="width:100%;justify-content:center;height:38px;color:#8b5cf6;border-color:#8b5cf6;background:var(--surface-alt);">
          <span>فتح رابط التسليم (Google Form / Blackboard)</span>
          <span>↗</span>
        </a>
      </div>
    ` : ''}

    <button class="mark-done-btn" onclick="toggleTaskCompleted('${task.id}')">
      <span>${task.isDone ? '↩ إلغاء الإكمال والتفعيل' : '✓ Mark as Done (تم إكمال المهمة)'}</span>
    </button>
  `;
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
  
  if (currentDetailedTask && currentDetailedTask.id === taskId) {
    currentDetailedTask.isDone = !wasDone;
    if (isQuizTask(currentDetailedTask)) {
      renderQuizPreparationGuideInOverlay(currentDetailedTask);
    } else {
      renderAssignmentDetailsInOverlay(currentDetailedTask);
    }
  }

  refreshTasksHub();
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
        <div style="font-size:13px;font-weight:700;color:var(--text-main)">${n.title || ''}</div>
        <div style="font-size:11.5px;color:var(--text-muted)">${n.body || ''}</div>
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

  if (activeView === "drive" || activeView === "guide" || activeView === "tasks" || activeView === "cad") {
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
    const isSolidWorks = (s.code === "MDP G111");
    const isMarketing = (s.code === "GEN G119");
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

  const activeAssessments = getActiveSectionAssessments();

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
      const isMarketing = (sess.code === "GEN G119");
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
      const isDimmed = (highlightedCourse && highlightedCourse !== sess.code) || (isPast && !showPastDays);
      const isHighlighted = highlightedCourse === sess.code;
      const hasTask = dayTasks.some(t => t.code === sess.code);

      const posWrap = document.createElement("div");
      posWrap.className = `grid-card-positioned ${isPast && !showPastDays ? 'matrix-col-past' : ''}`;
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
              ${hasTask ? `<span class="type" style="background:var(--quiz-color);color:#fff;cursor:pointer;font-weight:800;" onclick="setView('tasks')">⚡ QUIZ</span>` : ''}
              ${sess.attendance ? '<span class="badge-attendance">⚠ ATTENDANCE</span>' : ''}
              <span class="type">${sess.isDynSec ? 'SEC' : (sess.group === "ALL" ? 'LEC' : 'SEC')}</span>
            </div>
          </div>
          <div class="title">${course.name}</div>
          <div class="footer">
            <div style="display:flex;gap:4px;align-items:center;">
              ${isSolidWorks ? `<span class="matrix-links-btn" style="color:#10b981;" onclick="setView('cad')">⚡ CAD</span>` : ''}
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

function openGuideWeek(week = "Week 2") {
  triggerHaptic("light");
  selectedGuideWeek = week;
  setView('guide', week);
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

  const lectureBody = `
    <div class="wg-sec-title" dir="auto">${activeItem.lectures}</div>
    ${(activeItem.slides_url || activeItem.summary_url) ? `
      <div class="wg-pills">
        ${activeItem.slides_url ? `
          <a href="${activeItem.slides_url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
            <span class="wg-pill-ico">📥</span><span class="wg-pill-text" dir="auto">السلايدات (Slides)</span>${WG_ICON.ext}
          </a>` : ''}
        ${activeItem.summary_url ? `
          <a href="${activeItem.summary_url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
            <span class="wg-pill-ico">📕</span><span class="wg-pill-text">Notes</span>${WG_ICON.ext}
          </a>` : ''}
      </div>` : ''}
  `;

  const sheetBody = `
    <div class="wg-sec-title" dir="auto">${activeItem.sheet}</div>
    ${(activeItem.sheet_url || activeItem.solution_url) ? `
      <div class="wg-pills">
        ${activeItem.sheet_url ? `
          <a href="${activeItem.sheet_url}" target="_blank" rel="noopener noreferrer" class="wg-pill">
            <span class="wg-pill-ico">📄</span><span class="wg-pill-text" dir="auto">ملف الشيت (Sheet)</span>${WG_ICON.ext}
          </a>` : ''}
        ${activeItem.solution_url ? `
          <a href="${activeItem.solution_url}" target="_blank" rel="noopener noreferrer" class="wg-pill wg-pill-solution">
            <span class="wg-pill-ico">✅</span><span class="wg-pill-text" dir="auto">الحلول والمسائل المحلولة</span>${WG_ICON.ext}
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
              <a href="${pl.url}" target="_blank" rel="noopener noreferrer" class="wg-video-link" onclick="markGuideVideoWatched(${i})">
                <span class="wg-clap">🎬</span>
                <span class="wg-video-title" dir="auto">${pl.title}</span>
              </a>
              <button class="wg-watch ${watched ? 'done' : ''}" onclick="toggleGuideVideo(${i}, event)" aria-pressed="${watched}" aria-label="${watched ? 'Mark as not watched' : 'Mark as watched'}">${WG_ICON.check}</button>
              <a href="${pl.url}" target="_blank" rel="noopener noreferrer" class="wg-video-go" onclick="markGuideVideoWatched(${i})" aria-label="Open video">${WG_ICON.right}</a>
            </div>`;
        }).join("")}
      </div>` : ''}
  `;

  const notesBody = `
    <a href="${activeItem.summary_url}" target="_blank" rel="noopener noreferrer" class="wg-note-link">
      <span class="wg-sec-title" dir="auto">${activeItem.summary_title || 'ملخص ونوتس المحاضرة'}</span>
      ${WG_ICON.ext}
    </a>
  `;

  return `
    <div class="wg-card cascade-item" style="--c: ${course.color};">
      <div class="wg-head">
        <div class="wg-head-info">
          <div class="wg-code">${activeItem.code}</div>
          <div class="wg-name" dir="auto">${course.name}</div>
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

      ${activeItem.lectures ? renderGuideSection("lecture", "lecture", "📄", "Lecture", statusBtn("lecture", !!st.lecture), lectureBody) : ''}
      ${activeItem.sheet ? renderGuideSection("sheet", "sheet", "📝", "Sheet", statusBtn("sheet", !!st.sheet), sheetBody) : ''}
      ${hasPractice ? renderGuideSection("practice", "practice", "🎯", "Practice", practiceBadge, practiceBody) : ''}
      ${activeItem.summary_url ? renderGuideSection("notes", "notes", "💡", "Quick Notes", `
        <span class="wg-status wg-status-tone wg-static">📎 <span>1 file</span></span>`, notesBody) : ''}
    </div>
  `;
}

function renderGuideScreen() {
  const container = document.getElementById("viewContainer");
  const availableWeeks = [...new Set(WEEKLY_GUIDE_DATA.map(d => d.week || "Week 2"))];
  if (!availableWeeks.includes(selectedGuideWeek) && availableWeeks.length > 0) {
    selectedGuideWeek = availableWeeks[0];
  }

  const weekItems = WEEKLY_GUIDE_DATA.filter(d => d.week === selectedGuideWeek);
  const availableCoursesInWeek = [...new Set(weekItems.map(d => d.code))];

  if (!availableCoursesInWeek.includes(selectedGuideCourse) && availableCoursesInWeek.length > 0) {
    selectedGuideCourse = availableCoursesInWeek[0];
  }

  const activeItem = weekItems.find(d => d.code === selectedGuideCourse);
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
          ${availableCoursesInWeek.map(code => {
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

function renderCadHubScreen() {
  const container = document.getElementById("viewContainer");
  container.innerHTML = `
    <div class="cad-page-container">
      <div class="view-back-bar">
        <button class="view-back-btn" onclick="setView('week')">
          <span>◀</span><span>الرجوع للجدول</span>
        </button>
        <span style="font-size:12px;font-weight:800;color:var(--text-muted);">CAD HUB PRO</span>
      </div>

      <!-- بانر المعمل الحالي: Sheet 1 & Assembly -->
      <div style="background:linear-gradient(135deg, rgba(16,185,129,0.15) 0%, var(--surface) 100%);border:1.5px solid var(--c-mdp1);border-radius:18px;padding:16px;display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="font-size:13.5px;font-weight:800;color:var(--c-mdp1);display:flex;align-items:center;gap:6px;">
            <span>🎯</span><span>معمل الأسبوع ده: Sheet 1 & Assembly</span>
          </div>
          <button class="cad-wake-lock-btn ${screenWakeLock ? 'active' : ''}" id="cadWakeLockBtn" onclick="toggleScreenWakeLock()" title="تثبيت إضاءة الشاشة في المعمل">
            <span>💡</span><span>${screenWakeLock ? 'Screen ON' : 'Lab Mode'}</span>
          </button>
        </div>

        <div style="font-size:11.5px;color:var(--text-main);line-height:1.5;direction:rtl;text-align:right;">
          المفروض المرة دي هنعمل <b>Assembly</b> للـ Parts؛ لازم ندخل السكشن فاهمين الخطوات:
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <a href="https://drive.google.com/file/d/1mK6r0yRNkTf28udOOf-U_K71Jm5D6Yjb/view?usp=drive_link" target="_blank" rel="noopener noreferrer" class="action-btn" style="justify-content:center;background:var(--surface);font-size:11px;color:var(--c-mdp1);border-color:var(--c-mdp1);">
            <span>🎬 تجميع شيت 1 (Part 1)</span> ↗
          </a>
          <a href="https://drive.google.com/file/d/1o-tgm2oNpf0Rj-VTp7IQcKE52v_4WSOt/view?usp=drive_link" target="_blank" rel="noopener noreferrer" class="action-btn" style="justify-content:center;background:var(--surface);font-size:11px;color:var(--c-mdp1);border-color:var(--c-mdp1);">
            <span>🎬 تجميع شيت 1 (Part 2)</span> ↗
          </a>
          <a href="https://drive.google.com/file/d/1h7lj8A75cTz23cUCWo1fv9c0YdwsRILn/view?usp=drive_link" target="_blank" rel="noopener noreferrer" class="action-btn" style="justify-content:center;background:var(--surface);font-size:11px;">
            <span>⚙️ إعدادات البرنامج</span> ↗
          </a>
          <a href="https://drive.google.com/drive/folders/1dOrqTikw_D613Q41u_HDWvRGAYDLYHpV?usp=sharing" target="_blank" rel="noopener noreferrer" class="action-btn" style="justify-content:center;background:var(--surface);font-size:11px;color:#f59e0b;border-color:rgba(245,158,11,0.4);">
            <span>📦 Practice Parts</span> ↗
          </a>
        </div>
      </div>

      <!-- شريط إسعافات سريعة في ثانية -->
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="font-size:12px;font-weight:800;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
          <span>🚑</span><span>إسعافات سريعة في المعمل (دوس على الموقف)</span>
        </span>
        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:6px;">
          <button class="action-btn" style="height:auto;padding:8px 6px;flex-direction:column;gap:3px;background:var(--surface);" onclick="inspectKey('F')">
            <b style="color:#ef4444;font-size:12px;">الموديل تاه؟</b>
            <span style="font-size:9.5px;color:var(--text-muted);">دوس F</span>
          </button>
          <button class="action-btn" style="height:auto;padding:8px 6px;flex-direction:column;gap:3px;background:var(--surface);" onclick="inspectKey('A')">
            <b style="color:var(--c-mdp1);font-size:12px;">قوس مماس؟</b>
            <span style="font-size:9.5px;color:var(--text-muted);">دوس A وأنت بترسم</span>
          </button>
          <button class="action-btn" style="height:auto;padding:8px 6px;flex-direction:column;gap:3px;background:var(--surface);" onclick="inspectKey('Ctrl+8')">
            <b style="color:var(--accent);font-size:12px;">في وشك؟</b>
            <span style="font-size:9.5px;color:var(--text-muted);">Ctrl + 8</span>
          </button>
        </div>
      </div>

      <!-- شريط البحث بالعامية -->
      <div class="cad-search-box">
        <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" id="cadCommandSearchInput" placeholder="اكتب بالعامية: قوس، عمودي، أبعاد، تجميع، نسخ..." value="${cadActiveSearchQuery}" oninput="handleCadSearch(this.value)">
      </div>

      <!-- شبكة الاختصارات السريعة -->
      <div class="cad-stream-grid" id="cadStreamGrid"></div>

      <!-- كارت تفاصيل الأمر -->
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

      <!-- ملف الـ PDF المعتمد -->
      <div style="margin-top:4px;">
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

  if (activeView === "drive" || activeView === "guide" || activeView === "tasks" || activeView === "cad") {
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
}

function setView(mode, week) { 
  triggerHaptic("light"); 
  if (mode === "guide" && week) {
    selectedGuideWeek = week;
  }
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
  const saved = localStorage.getItem("cufe_theme") || "dark";
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
    const bannerContainer = document.getElementById("firstWeekBanner");
    if (bannerContainer && bannerContainer.style.display !== "none") {
      currentBannerIdx = (currentBannerIdx + 1) % totalCarouselBanners;
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
    navigator.serviceWorker.register('./sw.js').catch(() => {});
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
render();
syncFromGoogleSheets();
setInterval(updateLiveTracker, 60000);
