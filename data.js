/* ==========================================================================
   CUFE Mechanical Engineering — Batch 30 Master Data Repository
   ========================================================================== */

const ACADEMIC_YEAR_START = new Date(2026, 8, 19);

// Google Sheets Sync IDs
const QUIZZES_SHEET_ID = "1vYP4V4CrjeTtZkYU7TPbTvIQ4TqJZ2BWvipBvT5j1B0";
const ALERTS_SHEET_ID  = "1mearSta_QWzdR0EzGyU-o7EYipAFibOMrRIcqyL9f7E";
const WEEKLY_GUIDE_SHEET_ID = "1EA8YyyArFjEjQBlVu932pYJXgQaS51TEzunIdQuBsas";
const BUILDINGS_LOCATIONS_SHEET_ID = "1A38Yix4nay_Yu6-iaol4Gt7MvB9HofLBJ_vowznStGs";
const DYNAMICS_MASTER_SHEET_ID = "1vku_hv5X-4PMdHoPBlQ80XnTKzqsdp6GZdKIYh2fWbo";

const QUIZZES_CSV_URL = `https://docs.google.com/spreadsheets/d/${QUIZZES_SHEET_ID}/gviz/tq?tqx=out:csv`;
const ALERTS_CSV_URL   = `https://docs.google.com/spreadsheets/d/${ALERTS_SHEET_ID}/gviz/tq?tqx=out:csv`;
const WEEKLY_GUIDE_CSV_URL = `https://docs.google.com/spreadsheets/d/${WEEKLY_GUIDE_SHEET_ID}/gviz/tq?tqx=out:csv`;
const BUILDINGS_CSV_URL = `https://docs.google.com/spreadsheets/d/${BUILDINGS_LOCATIONS_SHEET_ID}/gviz/tq?tqx=out:csv`;
const DYNAMICS_SCHEDULE_CSV_URL = `https://docs.google.com/spreadsheets/d/${DYNAMICS_MASTER_SHEET_ID}/gviz/tq?tqx=out:csv&gid=807310814`;

const MAIN_SEMESTER_DRIVE = "https://drive.google.com/drive/folders/1GsVU0lpQXxKWLFeoVfjvTov1XmsNbn8o?usp=drive_link";
const ARCHIVE_BATCH29_DRIVE = "https://drive.google.com/drive/folders/1n2rhGtD9BSuusZEH__ix5ZYnHFuNgrv4";

// قاعدة بيانات المواد الرسمية
const COURSES = {
  "GEN G119": {
    name: "Entrepreneurship and Marketing",
    color: "var(--c-gen)",
    hex: "#06b6d4", 
    instructor: "Dr. Tamer El-Hariry" 
  },
  "MTH G102": { 
    name: "Linear Algebra and Multivariable Integrals", 
    color: "var(--c-mth)", 
    hex: "#38bdf8", 
    instructor: "Dr. Ahmed Abdelnaby & Dr. Lucy" 
  },
  "EMC G101": { 
    name: "Dynamics of Rigid Bodies", 
    color: "var(--c-emc)", 
    hex: "#8b5cf6", 
    instructor: "Dr. Samir Hedeyma" 
  },
  "MDP G111": { 
    name: "Computer-Aided Mechanical Drafting", 
    color: "var(--c-mdp1)", 
    hex: "#10b981", 
    instructor: "Dr. Design Staff" 
  },
  "MDP G121": { 
    name: "Materials Science", 
    color: "var(--c-mdp2)", 
    hex: "#f59e0b", 
    instructor: "Dr. Ehab & Dr. Mamdouh" 
  },
  "EPE G113": { 
    name: "Electrical and Electronics Engineering", 
    color: "var(--c-epe)", 
    hex: "#fb923c", 
    instructor: "Dr. Electrical Staff" 
  }
};

// ==========================================================================
// Modern Neon Dashboard — Official Quizzes & Exam System Master Data
// ==========================================================================
const MASTER_QUIZZES = [
    {
    id: "gen-quiz-2",
    code: "GEN G119",
    title: "Quiz 2 — Marketing (Chapter 2)",
    type: "Quiz (5 Mins)",
    instructor: "Dr. Tamer El-Hariry",
    dateDisplay: "Sunday, October 25, 2026 (الأحد 25 أكتوبر 2026 — 8:00 ص)",
    countdownBadge: "الأحد 25 أكتوبر",
    date: "2026-10-25",
    start: "2026-10-25T08:00:00",
    deadline: "2026-10-25T08:05:00",
    dueDate: "2026-10-25T08:00:00",
    room: "مدرج 3103-414",
    accent: "#06b6d4",
    accentName: "cyan",
    submissionUrl: "https://drive.google.com/drive/folders/1BacoA3K8UZ8Jfg_nkGlXrXNn3eQPO4h0",
    instructions: [
      "الأحد 25 أكتوبر 8:00 ص (مدرج 3103-414) • مدة الكويز 5 دقائق فقط (نفس نظام كويز 1).",
      "المحتوى المقرر: المحاضرة الثانية (Chapter 2: Marketing Strategy) كاملة.",
      "الامتحان 20 سؤال سريع (MCQ + صح وغلط) يحتاج سرعة فائقة في الحل والتظليل.",
      "تم توفير بنك الأسئلة بالكامل (125 سؤال) مع محاكي تفاعلي ذكي للتدريب على سرعة الحل قبل المحاضرة."
    ],
    lectures: [
      { id: "gen-lec-2", title: "سلايدات المحاضرة الثانية (Chapter 2: Marketing Strategy)", slides: "https://drive.google.com/file/d/1r3PrYQiXtpfFhpJbFhv0a0pK9qf2g045/view?usp=drivesdk" }
    ],
    sheets: [
      { id: "gen-tb-2", title: "بنك أسئلة الشابتر الثاني (Test Bank CH 2 - 125 Questions)", pdf: "https://drive.google.com/file/d/1G5ztFeMyJ8C4aUQYxJIvS0-kJ-fP2Bqb/view?usp=drivesdk", sol: "https://drive.google.com/file/d/1G5ztFeMyJ8C4aUQYxJIvS0-kJ-fP2Bqb/view?usp=drivesdk" },
      { id: "gen-sum-2", title: "ملخص الشابتر الثاني الشامل (Marketing Summary CH 2)", pdf: "https://drive.google.com/file/d/1QyXqM7S4ih0xRfDPx_PAdqo95NpPO1Zm/view?usp=drivesdk", sol: "https://drive.google.com/file/d/1QyXqM7S4ih0xRfDPx_PAdqo95NpPO1Zm/view?usp=drivesdk" }
    ],
    practice: [
      { id: "gen-sim-2", title: "المحاكي التفاعلي الذكي لكويز 2 (Quiz 2 Arena Simulator)", url: "javascript:openMarketingQuiz2Modal()" }
    ],
    formula: [
      { id: "gen-form-1", title: "BCG Growth-Share Matrix & Strategic Business Units (SBUs)" },
      { id: "gen-form-2", title: "Product/Market Expansion Grid (Ansoff Matrix) & 4Ps Mix" }
    ]
  },
  {
    id: "mdp-quiz-1",
    code: "MDP G121",
    title: "Quiz 1 — Crystal Structure (5 درجات)",
    type: "Quiz (5 Marks)",
    instructor: "Dr. Ehab & Dr. Mamdouh",
    dateDisplay: "Tuesday, October 20, 2026 (الثلاثاء 20 أكتوبر 2026)",
    countdownBadge: "منتهي / Expired",
    date: "2026-10-20",
    start: "2026-10-20T08:00:00",
    deadline: "2026-10-20T10:00:00",
    dueDate: "2026-10-20T08:00:00",
    room: "مدرج 7104",
    content: "Crystal Structure — 5 درجات (5 Marks)",
    accent: "#f59e0b",
    accentName: "amber",
    instructions: [
      "المكان والموعد: مدرج 7104 — الثلاثاء 20 أكتوبر 2026.",
      "الدرجة: 5 درجات (5 Marks).",
      "🎯 مفيش أسئلة نظري إن شاء الله — الأسئلة مسائل وتطبيقات شبه اللي اتحلت في السكشن بالظبط.",
      "⚠️ الشيت فيه حاجات مش بتيجي في الامتحان، فالمذاكرة الأساسية تكون من سلايدات السكشن مع حل الأسئلة اللي فيها + كويز وأسينمنت السنة اللي فاتت.",
      "خطة المذاكرة الموصى بها بالترتيب:",
      "1. مذاكرة سلايدات السكشن وحل الأسئلة والمسائل اللي جواها (Tutorial Slides).",
      "2. حل كويز السنة اللي فاتت 2025/2026 (محلول ديجيتال وخط إيد).",
      "3. للتدريب الإضافي: حل أسينمنت السنة اللي فاتت 2025/2026 (شبه أسئلتنا جداً)."
    ],
    sheets: [
      { id: "mdp-tut-slides", title: "1. Tutorial Slides (سلايدات السكشن - أساسي)", pdf: "https://drive.google.com/file/d/1Y5_Qf5AIDxCfrk-3xMhINI9qyEO-IDTc/view?usp=drivesdk" },
      { id: "mdp-past-quiz", title: "2. كويز السنة اللي فاتت 2025/2026 + الحلول", pdf: "https://drive.google.com/drive/folders/1-yeXybwOFT1tQPo8-oVQXAfYAlcpnprr" },
      { id: "mdp-past-assign", title: "3. أسينمنت السنة اللي فاتت 2025/2026 + الحلول", pdf: "https://drive.google.com/drive/folders/1qmlZ4WhUtwsi6PkgXexuX_5jPVpy0UkP" }
    ],
    submissionUrl: "https://drive.google.com/file/d/1Y5_Qf5AIDxCfrk-3xMhINI9qyEO-IDTc/view?usp=drivesdk",
    solutionUrl: "https://drive.google.com/drive/folders/1-yeXybwOFT1tQPo8-oVQXAfYAlcpnprr"
  },
  {
    id: "epe-quiz-1",
    code: "EPE G113",
    title: "Quiz 1 — Circuit Analysis Methods (Nodal, Mesh, Thevenin...)",
    type: "Quiz (30 Mins)",
    instructor: "Dr. Electrical Staff",
    dateDisplay: "Tuesday, October 27, 2026 (الثلاثاء 27 أكتوبر 2026 — 10:00 ص)",
    countdownBadge: "الثلاثاء 27 أكتوبر",
    date: "2026-10-27",
    start: "2026-10-27T10:00:00",
    deadline: "2026-10-27T10:30:00",
    dueDate: "2026-10-27T10:00:00",
    room: "مدرج 7104-360",
    content: "Circuit Analysis (Nodal, Mesh, Superposition, Thevenin, Source Transformation)",
    duration: "⏱️ نصف ساعة (30 دقيقة)",
    marks: "Quiz 1",
    accent: "#fb923c",
    accentName: "orange",
    submissionUrl: "https://drive.google.com/drive/folders/1pj7mKzRcy2QrC__ZFXAxjSmxQHK51Iii",
    solutionUrl: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_",
    instructions: [
      "الموعد والمكان: الثلاثاء القادم 27 أكتوبر 2026 — في ميعاد المحاضرة (10:00 ص - مدرج 7104-360).",
      "مدة الكويز: ⏱️ نصف ساعة (30 دقيقة).",
      "شكل ومحتوى الامتحان: سؤال واحد عبارة عن دائرة كهربية (Circuit) يطلب حلها بأكثر من طريقة: (Nodal, Mesh, Superposition, Thevenin, Source Transformation...).",
      "المقرر داخل حتى شيت الطرق (شيت 3 بترتيب الدرايف / شيت 4 بترتيب المعيد).",
      "⚠️ تنبيه هام جداً: المصادر المعتمدة (Dependent Sources) ملغية في أسئلة Thevenin و Superposition!",
      "خطة المذاكرة الموصى بها بالترتيب:",
      "1. 🔥 الشيت الأهم (شيت 3 درايف / 4 معيد — Nodal & Mesh): أهم حاجة تتحل وتتذاكر كل فكرة وتفصيلة فيها.",
      "2. ✨ ملخص أهم التركات والأفكار للشيت الأخير.",
      "3. 📚 أسئلة المرجع: ركز على الأسئلة من 6 لـ 9 (الحل النموذجي مرفوع على الدرايف).",
      "4. 📝 كويزات وميدات سابقة من قسم كهرباء (نفس المحتوى)."
    ],
    sheets: [
      {
        id: "epe-sheet-methods",
        title: "🔥 1. الشيت الأهم (شيت 3 درايف / 4 معيد — Nodal & Mesh)",
        pdf: "https://drive.google.com/drive/folders/1pj7mKzRcy2QrC__ZFXAxjSmxQHK51Iii",
        sol: "https://drive.google.com/drive/folders/1pj7mKzRcy2QrC__ZFXAxjSmxQHK51Iii"
      },
      {
        id: "epe-sheet-ref",
        title: "📚 3. أسئلة المرجع (ركز على الأسئلة من 6 لـ 9)",
        pdf: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_",
        sol: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_"
      }
    ],
    lectures: [
      {
        id: "epe-summary-tricks",
        title: "✨ 2. ملخص أهم التركات والأفكار للشيت الأخير",
        slides: "https://drive.google.com/file/d/1k7DsSMELdv1FK6vDfaKlP3ijnM5Zly7k/view?usp=drivesdk"
      }
    ],
    practice: [
      {
        id: "epe-past-exams",
        title: "📝 4. كويزات وميدات سابقة من قسم كهرباء (نفس المحتوى)",
        url: "https://drive.google.com/drive/folders/1fouTNz6FgVSRZiIz61iDARn_pIRdVxW_"
      }
    ],
    formula: [
      {
        id: "epe-form-1",
        title: "قواعد Nodal & Mesh Analysis و Supernode / Supermesh",
        url: "https://drive.google.com/file/d/1k7DsSMELdv1FK6vDfaKlP3ijnM5Zly7k/view?usp=drivesdk"
      },
      {
        id: "epe-form-2",
        title: "Thevenin, Norton & Superposition (بدون Dependent Sources)",
        url: "https://drive.google.com/drive/folders/1pj7mKzRcy2QrC__ZFXAxjSmxQHK51Iii"
      }
    ],
    officialLinks: [
      {
        title: "🔥 1. الشيت الأهم (شيت 3 درايف / 4 معيد — Nodal & Mesh)",
        url: "https://drive.google.com/drive/folders/1pj7mKzRcy2QrC__ZFXAxjSmxQHK51Iii",
        icon: "🔥"
      },
      {
        title: "✨ 2. ملخص أهم التركات والأفكار للشيت الأخير",
        url: "https://drive.google.com/file/d/1k7DsSMELdv1FK6vDfaKlP3ijnM5Zly7k/view?usp=drivesdk",
        icon: "✨"
      },
      {
        title: "📚 3. أسئلة المرجع (ركز على الأسئلة من 6 لـ 9)",
        url: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_",
        icon: "📚"
      },
      {
        title: "📝 4. كويزات وميدات سابقة من قسم كهرباء (نفس المحتوى)",
        url: "https://drive.google.com/drive/folders/1fouTNz6FgVSRZiIz61iDARn_pIRdVxW_",
        icon: "📝"
      }
    ]
  },
  {
    id: "emc-quiz-1",
    code: "EMC G101",
    title: "Quiz 1 — MOI & Plane Kinematics of Rigid Bodies",
    type: "Quiz",
    instructor: "Dr. Samir Hedeyma",
    dateDisplay: "Wednesday, October 28, 2026 (الأربعاء 28 أكتوبر 2026 — ميعاد المحاضرة 2:00 م)",
    countdownBadge: "28 أكتوبر 2026",
    date: "2026-10-28",
    start: "2026-10-28T14:00:00",
    deadline: "2026-10-28T15:50:00",
    dueDate: "2026-10-28T14:00:00",
    room: "مدرج 7104-360",
    content: "Chapter 1 (CG & MOI) + Chapter 2 (Plane Kinematics of Rigid Bodies)",
    accent: "#8b5cf6",
    accentName: "purple",
    submissionUrl: "https://drive.google.com/drive/folders/1bjTVuMUlmMKDoSShmYnRBju3HtglV6zT",
    instructions: [
      "الموعد والمكان: الأربعاء 28 أكتوبر 2026 — مدرج 7104-360 (ميعاد المحاضرة 2:00 م).",
      "المحتوى المقرر: Chapter 1 (CG & MOI) + Chapter 2 (Plane Kinematics of Rigid Bodies) كامل.",
      "خطة المذاكرة الموصى بها بالترتيب:",
      "1. سلايدات Chapter 1 (MOI) و Chapter 2 (Kinematics) كاملة.",
      "2. حل شيت 1 (CG & MOI) وشيت 2 (Kinematics) ومراجعة الحل النموذجي.",
      "3. فيديوهات المعيدين: Velocity & Acceleration Relation، Rolling، و IC."
    ],
    lectures: [
      { id: "emc-q1-lec-1", title: "Ch1: CG & MOI + Ch2: Velocity Relation (Slides)", slides: "https://drive.google.com/file/d/1-iSeDxQBp2CzrkH5JE1Ae7YdpMDTAfXP/view?usp=drivesdk" },
      { id: "emc-q1-lec-2", title: "Ch2: Kinematics of Rigid Bodies — VR, AR, Rolling & IC (Slides)", slides: "https://drive.google.com/file/d/1raAP-bxC_Z8xD0bTM2kAL0LCd9p2CzvB/view?usp=drivesdk" }
    ],
    sheets: [
      { id: "emc-q1-sht-1", title: "Sheet 1 — CG & MOI (فولدر الشيت والحلول)", pdf: "https://drive.google.com/drive/folders/1TBDzw8XTrf6iuYgT_73Ybhus1JbJa1pg" },
      { id: "emc-q1-sht-2", title: "Sheet 2 — Kinematics of Rigid Bodies", pdf: "https://drive.google.com/file/d/1J0UdPRuvF4PgX-rLrunlO9UbOhmtY7Fq/view?usp=drivesdk", sol: "https://drive.google.com/file/d/1GfpDWDYV4baCYyvacoUA3GbmPHdx-eBw/view?usp=drivesdk" }
    ],
    practice: [
      { id: "emc-q1-vid-1", title: "م. أحمد فوزي — ملخص Chapter 2 كامل + حل الشيت", url: "https://youtu.be/mrLEzczCxpc?si=MAmczw5ZQU4y3Qc8" },
      { id: "emc-q1-vid-2", title: "م. إنجي — شرح Velocity Relation", url: "https://youtu.be/i-sy90j-dp0?si=0x6Gq3x90j46zYw5" },
      { id: "emc-q1-vid-3", title: "م. إنجي — شرح Acceleration Relation", url: "https://youtu.be/VqL2COYs3yc?si=hZ5VoeohJOYNhmgj" },
      { id: "emc-q1-vid-4", title: "مسائل محلولة على الـ AR من الشيت", url: "https://youtu.be/8vMHDoNCpLk?si=cR-bYSb4cF9vf7kv" },
      { id: "emc-q1-vid-5", title: "م. إنجي — شرح الـ Rolling", url: "https://youtu.be/7XZuHoI1fmg?si=if-1aQxsVYGTmCX5" },
      { id: "emc-q1-vid-6", title: "حل مسائل على الـ Rolling", url: "https://youtu.be/6LOrpFrexE0?si=-_MRSFBx3G67O0Qu" },
      { id: "emc-q1-vid-7", title: "م. إنجي — شرح Instantaneous Center (IC)", url: "https://youtu.be/PJJ5JOMR8yY?si=VGRgmuaUWuvBKlvQ" }
    ]
  },
  {
    id: "the-1",
    code: "EMC G101",
    title: "Take-Home Exam 1 — Model (P200)",
    type: "Take-Home Exam",
    instructor: "Dr. Samir Hedeyma",
    dateDisplay: "الجمعة 9 أكتوبر 2026 (7:00 م)",
    countdownBadge: "3d 22h 50m",
    start: "2026-09-25T19:00:00",
    deadline: "2026-10-09T19:00:00",
    accent: "#8b5cf6",
    accentName: "purple",
    submissionUrl: "https://sites.google.com/eng.cu.edu.eg/planedynamics100",
    instructions: [
      "أسئلة امتحان Model P200 المعتمد.",
      "اختار (No / None) لو الناتج طلع فرق أكتر من 1.5%.",
      "الإجابة الغلط عليها خصم -25% من الدرجة.",
      "التسليم في أول 12 ساعة بياخد بونص +10% إضافي.",
      "الموقع الرسمي للتسليم: sites.google.com/eng.cu.edu.eg/planedynamics100"
    ],
    lectures: [
      { id: "emc-lec-1", title: "Lecture 1 - Intro + Ch1: CG & MOI", slides: "https://drive.google.com/file/d/1-iSeDxQBp2CzrkH5JE1Ae7YdpMDTAfXP/view" },
      { id: "emc-lec-2", title: "Lecture 2 - Curvilinear Motion & Velocity Relations", slides: "https://drive.google.com/file/d/1-iSeDxQBp2CzrkH5JE1Ae7YdpMDTAfXP/view" }
    ],
    sheets: [
      { id: "emc-sht-1", title: "Take-Home Exam 1 (P200) Question Paper", pdf: "https://drive.google.com/file/d/1G7wTSWQLSn8PGk4c76svzkVSXQMhf2Mk", sol: "" },
      { id: "emc-sht-2", title: "Sheet 1 - Intro + Ch1: CG & MOI", pdf: "https://drive.google.com/drive/folders/1TBDzw8XTrf6iuYgT_73Ybhus1JbJa1pg", sol: "https://drive.google.com/drive/folders/1TBDzw8XTrf6iuYgT_73Ybhus1JbJa1pg" }
    ],
    practice: [
      { id: "emc-vid-1", title: "Video 1 - Velocity Analysis (Eng. Ingy)", url: "https://youtu.be/i-sy90j-dp0" },
      { id: "emc-vid-2", title: "Video 2 - Sheet Problems (Eng. Ahmed Fawzy)", url: "https://youtu.be/mrLEzczCxpc" }
    ],
    formula: [
      { id: "emc-form-1", title: "قوانين الحركة في خط مستقيم والمنحنيات" },
      { id: "emc-form-2", title: "قواعد مركز الدوران اللحظي للسرعة (IC)" }
    ]
  },
  {
    id: "mth-assign-1",
    code: "MTH G102",
    title: "Assignment 2 — Linear Algebra (Vector Spaces & Subspaces)",
    type: "Assignment",
    instructor: "Dr. Lucy & Dr. Sara",
    dateDisplay: "متابعة في المحاضرة بالاسم (عليه بونص مع د. لوسي)",
    countdownBadge: "Active Bonus 🎯",
    start: "2026-10-20T08:00:00",
    deadline: "2026-11-10T11:00:00",
    deadlinesByGroup: {
      "ME1-01": "2026-11-10T09:00:00",
      "ME1-02": "2026-11-10T10:00:00",
      "ME1-03": "2026-11-10T13:00:00",
      "ME1-04": "2026-11-10T11:00:00"
    },
    accent: "#38bdf8",
    accentName: "cyan",
    submissionUrl: "https://drive.google.com/file/d/14wOaVsWYTzE8OvTcqbj0PTBwjE3huVmH/view?usp=drivesdk",
    solutionUrl: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd",
    instructions: [
      "📝 الأسئلة اللي علينا في Assignment 2 في الأسبوع ده: من 1 لـ 11 • سؤال 16(ii) • من 19 لـ 24.",
      "⚠️ أي سؤال أو نقطة متعلقة بـ Basis أو Dimension أو Span لسه مخدناهوش فسيبوها دلوقتي.",
      "🚨 ملحوظة مهمة جداً: د. لوسي في آخر المحاضرة ممكن تنادي أسماء عشوائي من كشف الأسماء وتطلب تشوف شغلهم في المادة (الـ assignment اللي بيتبعت ومذاكرتك للمادة) وقالت إنها ممكن تدي بونص على ده وأوقات ممكن تكرر الاسم في أكتر من محاضرة! فضروري الناس تحل والإجابات هتنزل قريباً إن شاء الله ❤️",
      "📌 بالنسبة لـ Sheet 1 (Revision): هتلاقوا مكتوب عليه Assignment بس هو بنسبة كبيرة مش هيتسلم، ود. سارة هتخلي درجات أعمال السنة على كويزين.",
      "📋 د. سارة قالت اللي عايز يحضر من اللي عليهم سكشن الخميس يقدر يحضر يوم الاتنين لغاية ما نظبط المواعيد، والـ boards بتاعت السكشن بتنزل كل أسبوع على الدرايف."
    ],
    lectures: [
      { id: "mth-la-rev", title: "مراجعة الـ Matrices (د. لوسي — تتقري قبل المحاضرة)", slides: "https://drive.google.com/file/d/1Vum_-i5CsaKI9UA9xAPHUNT6lPLFxiy9/view?usp=drivesdk" },
      { id: "mth-la-lec1", title: "Linear Algebra Lec. 1 — Dr. Lucy PDF", slides: "https://drive.google.com/drive/folders/1ddsnJx-apXNVKtCY8JuD-VzqlLGIaZfY" },
      { id: "mth-la-lec2", title: "Linear Algebra Lec. 2 — Vector Spaces & Subspaces (Dr. Lucy)", slides: "https://drive.google.com/file/d/1tpwf5iFQtUYYbysdgd6nPySvu4nR_Jam/view?usp=drivesdk" },
      { id: "mth-int-lec1", title: "Integration Lec. 1 — Double Integrals (Part 1)", slides: "https://drive.google.com/drive/folders/1WCbR1VLo8sUZ_x58Of08lW71aq5Ht9z8" },
      { id: "mth-int-lec2", title: "Integration Lec. 2 — Polar Regions + Applications", slides: "https://drive.google.com/file/d/1IxaAIvGE0t4ysmkjteIsfPXMAZHJOBgY/view?usp=drivesdk" },
      { id: "mth-int-lec3", title: "Integration Lec. 3 — Triple Integrals", slides: "https://drive.google.com/file/d/1WMinLYkB2MufXbRGEIMaWb7RpO-aFcoI/view?usp=drivesdk" }
    ],
    sheets: [
      { id: "mth-la-asgn2", title: "Assignment 2 — Vector Spaces (المطلوب: 1-11, 16ii, 19-24)", pdf: "https://drive.google.com/file/d/14wOaVsWYTzE8OvTcqbj0PTBwjE3huVmH/view?usp=drivesdk", sol: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" },
      { id: "mth-la-sht1", title: "Linear Algebra Sheet 1 (Revision — مش هيتسلم)", pdf: "https://drive.google.com/file/d/1upmEswq82kaeBwUVaN6uaLBsSKOf0BL7/view?usp=drivesdk", sol: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" },
      { id: "mth-int-sht1", title: "Integration Sheet 1 & Assignment 1", pdf: "https://drive.google.com/drive/folders/1z47GRFcIBjHRVF7DKk5eBq-aUIWJv3j0", sol: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N" },
      { id: "mth-int-sht2", title: "Integration Sheet 2 & Assignment 2", pdf: "https://drive.google.com/drive/folders/19hZKh8cS5TjO4l0RpP5lFuxBabD98xjV", sol: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N" },
      { id: "mth-int-sht3", title: "Integration Sheet 3 & Assignment 3", pdf: "https://drive.google.com/drive/folders/1rSzLpNFrfMowDXk_LmRi6rvEIaj50DfI", sol: "https://drive.google.com/file/d/1T7Zpi2nwnzpuXCdauxkCZukg9xh5OkfX/view?usp=drivesdk" }
    ],
    practice: [
      { id: "mth-vid-mohab", title: "فيديوهات زميلكم مهاب لشرح وحل أسئلة الشيت والأسينمنت 🤍", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" },
      { id: "mth-doc-all", title: "Lectures & Sections (لينكات محاضرات وسكاشن اللينير من أكتر من دكتور ومعيد)", url: "https://docs.google.com/document/d/1amjERn4hxxXyRtCzcF8shwyA9T3JiqE-AR5bcDqB2Bs/edit?usp=drivesdk" },
      { id: "mth-notes-essam", title: "Notes Dr. Ahmed Essam (Lecture 2 - Lecture 3)", url: "https://drive.google.com/drive/folders/146HDk9CbIz3KkN32koT77z829iJX-5Rq" },
      { id: "mth-notes-nabila", title: "Notes Dr. Nabila (Lec. 2)", url: "https://drive.google.com/drive/folders/1K6d_p8vZ_nnDecvOx-qUVQRGSGQCD-H2" },
      { id: "mth-vid-ammar1", title: "م. عمار ياسر — Double Integrals Part 1 (للآخر)", url: "https://youtu.be/IfuyRoFzthk?si=a71lDUGo6x5WT_36" },
      { id: "mth-vid-ammar-coord", title: "م. عمار ياسر — تحويلات الـ coordinates (مهمة جداً من calc2)", url: "https://youtu.be/ndfc1-8hWuI?si=mTeyC2VR8GjKw6oW" },
      { id: "mth-vid-ammar-polar", title: "م. عمار ياسر — Polar regions", url: "https://youtu.be/QDhYk9H45NU?si=wno0MdzjRioiUxn5" },
      { id: "mth-vid-ammar-triple", title: "م. عمار ياسر — Triple integrals", url: "https://youtu.be/GZdX5oC2-ao?si=Hc0YaCaPAz1J8Ck-" }
    ],
    formula: [
      { id: "mth-form-mid", title: "نظام الميد (30 درجة): 15 Integration (MCQ لحد Triple قبل الـ applications في مستوى كويزات LectraHub) + 15 Linear (شامل كل كلمة د. لوسي بتقولها في المحاضرة)" },
      { id: "mth-form-boards", title: "Section Boards (سبورات السكشن بتنزل كل أسبوع هنا)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" }
    ]
  },
  {
    id: "epe-assign-2",
    code: "EPE G113",
    title: "Assignment 2 — Chapter 2 Problems (21 مسائل)",
    type: "Assignment",
    instructor: "Dr. Electrical Staff",
    dateDisplay: "Thursday, October 22, 2026 (12:30 PM — قاعة 14301)",
    countdownBadge: "منتهي / Expired",
    start: "2026-10-22T12:30:00",
    deadline: "2026-10-22T15:30:00",
    dueDate: "2026-10-22T12:30:00",
    room: "14301 (Faculty Hall)",
    accent: "#fb923c",
    accentName: "orange",
    submissionUrl: "https://drive.google.com/file/d/1sk39paE42hm7TO-I1t6XfnKKt4Bw50gl/view?usp=drivesdk",
    solutionUrl: "https://drive.google.com/file/d/1Fb-jlC3OuiCCUsUGG6oqd5cxZMuT_m1_/view?usp=drivesdk",
    instructions: [
      "📍 موعد ومكان التسليم: الخميس 22 أكتوبر 2026 في السكشن (قاعة 14301 - فترة 12:30 أو فترة 2:00) على ورق A4 (الاسم، الكود، السكشن، القسم).",
      "أرقام المسائل المطلوبة من Chapter 2 (إجمالي 21 مسألة):",
      "Chapter 2 (Part 1): 2.12, 2.13, 2.18, 2.23, 2.24, 2.25, 2.31, 2.32, 2.35, 2.36, 2.34, 2.44, 2.47, 2.59, 2.70, 2.71, 2.72, 2.78",
      "Chapter 2 (Part 2): 2.45, 2.53, 2.76",
      "👥 مسموح للطالب تسليم الأسينمنت الخاص به وأسينمنت لزميل واحد فقط كحد أقصى.",
      "🎥 السكشن هيتصور فيديو وهينزل على يوتيوب للشرح والمراجعة."
    ],
    sheets: [
      {
        id: "epe-sht-2",
        title: "Assignment 2 — Chapter 2 Problems (ملف الأسينمنت)",
        pdf: "https://drive.google.com/file/d/1sk39paE42hm7TO-I1t6XfnKKt4Bw50gl/view?usp=drivesdk",
        sol: "https://drive.google.com/file/d/1Fb-jlC3OuiCCUsUGG6oqd5cxZMuT_m1_/view?usp=drivesdk"
      }
    ]
  },
  {
    id: "mth-quiz-1",
    code: "MTH G102",
    title: "Quiz 1 — Double Integrals (10 درجات)",
    type: "Quiz (10 Marks)",
    instructor: "Dr. Ahmed Abdelnaby & Dr. Lucy",
    dateDisplay: "Monday, October 12, 2026 (الإثنين 12 أكتوبر 2026)",
    countdownBadge: "منتهي / Expired",
    date: "2026-10-12",
    start: "2026-10-12T11:00:00",
    deadline: "2026-10-12T11:35:00",
    dueDate: "2026-10-12T11:00:00",
    room: "مدرج 3002",
    accent: "#38bdf8",
    accentName: "cyan",
    instructions: [
      "الموعد والمكان: الإثنين 12 أكتوبر 2026 — 11:00 ظهراً بمدرج 3002 مجمع للأربع سكاشن.",
      "الدرجة ونوع الأسئلة: 10 درجات (MCQ - 5 أسئلة) في 30-35 دقيقة على أول محاضرتين فقط (Double Integrals).",
      "التصحيح على التظليل فقط، ممنوع الموبايل، والجلوس بمقعد فاضي بين كل طالب.",
      "الكود المكون من 7 أرقام يوضع قبله صفر على الشمال في التظليل.",
      "💡 تريكة هامة: الأسئلة لا تخرج عن أشكال الـ Graphs المشروحة بالمحاضرة."
    ],
    sheets: [
      { id: "mth-sht-1", title: "1. شيت 1 والأسينمنت (Double Integrals)", pdf: "https://drive.google.com/drive/folders/1z47GRFcIBjHRVF7DKk5eBq-aUIWJv3j0" },
      { id: "mth-sol-1", title: "2. الحل النموذجي لشيت 1 (Double Integrals Solution)", pdf: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N" },
      { id: "mth-drv-1", title: "3. فولدر درايف الكويز الرسمي", pdf: "https://drive.google.com/drive/folders/1WCbR1VLo8sUZ_x58Of08lW71aq5Ht9z8" }
    ],
    submissionUrl: "https://drive.google.com/drive/folders/1WCbR1VLo8sUZ_x58Of08lW71aq5Ht9z8",
    solutionUrl: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N"
  },
  {
    id: "epe-assign-1",
    code: "EPE G113",
    title: "Assignment 1 — DC Circuits & Basic Quantities",
    type: "Assignment",
    instructor: "Dr. Electrical Staff",
    dateDisplay: "Thursday, October 15, 2026 (الخميس 15 أكتوبر 2026)",
    countdownBadge: "منتهي / Expired",
    date: "2026-10-15",
    start: "2026-10-15T12:30:00",
    deadline: "2026-10-15T15:30:00",
    dueDate: "2026-10-15T12:30:00",
    room: "14301",
    accent: "#fb923c",
    accentName: "orange",
    instructions: [
      "تسليم Assignment 1 في السكشن على ورق A4.",
      "محتوى الشيت: DC Circuits & Basic Electrical Quantities.",
      "انتهت فترة التسليم الرسمية للأسبوع المنتهي."
    ],
    sheets: [
      { id: "epe-sht-1", title: "1. Sheet 1: DC Circuits & Basic Electrical Quantities", pdf: "https://drive.google.com/file/d/1z48ZfG-2CW86dlEJATipW1t-4ZNmwDru/view?usp=drivesdk" },
      { id: "epe-sol-1", title: "2. الحل النموذجي لـ Sheet 1", pdf: "https://drive.google.com/file/d/1MwqPfN9_M0FV-izQkb1BIa3Bxezcb6hM/view?usp=drivesdk" }
    ],
    submissionUrl: "https://drive.google.com/file/d/1z48ZfG-2CW86dlEJATipW1t-4ZNmwDru/view?usp=drivesdk",
    solutionUrl: "https://drive.google.com/file/d/1MwqPfN9_M0FV-izQkb1BIa3Bxezcb6hM/view?usp=drivesdk"
  }
];

// تكليفات المواد الثابتة
const COURSE_STATIC_ASSIGNMENTS = [
  {
    id: "mth-assign-1",
    code: "MTH G102",
    title: "Assignment 2 — Linear Algebra (Vector Spaces & Subspaces)",
    type: "Assignment",
    day: "Tuesday",
    start: "2026-10-20T08:00:00",
    deadlinesByGroup: {
      "ME1-01": "2026-11-10T09:00:00",
      "ME1-02": "2026-11-10T10:00:00",
      "ME1-03": "2026-11-10T13:00:00",
      "ME1-04": "2026-11-10T11:00:00"
    },
    folderUrl: "https://drive.google.com/file/d/14wOaVsWYTzE8OvTcqbj0PTBwjE3huVmH/view?usp=drivesdk",
    solutionUrl: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd",
    desc: `الأسئلة اللي علينا في Assignment 2 في الأسبوع ده: من 1 لـ 11 • سؤال 16(ii) • من 19 لـ 24 (أي سؤال أو نقطة متعلقة بـ Basis أو Dimension أو Span لسه مخدناهوش).
• د. لوسي في آخر المحاضرة ممكن تنادي أسماء عشوائي من كشف الأسماء وتطلب تشوف شغلهم في المادة (الـ assignment اللي بيتبعت ومذاكرتك للمادة) وقالت إنها ممكن تدي بونص على ده وأوقات ممكن تكرر الاسم في أكتر من محاضرة!
• بالنسبة لـ Sheet 1 (Revision): مكتوب عليه Assignment بس هو بنسبة كبيرة مش هيتسلم ود. سارة هتخلي درجات أعمال السنة على كويزين.`,
    note: "ضروري الناس تحل عشان د. لوسي بتنادي أسماء عشوائي في المحاضرة وتدي بونص والإجابات هتنزل قريباً إن شاء الله ❤️"
  },
  {
    id: "epe-assign-2",
    code: "EPE G113",
    title: "Assignment 2 — Chapter 2 Problems (21 مسائل)",
    type: "Assignment",
    day: "Thursday",
    start: "2026-10-22T12:30:00",
    deadline: "2026-10-22T15:30:00",
    dueDate: "2026-10-22T12:30:00",
    deadlinesByGroup: {
      "ME1-01": "2026-10-22T14:00:00",
      "ME1-02": "2026-10-22T14:00:00",
      "ME1-03": "2026-10-22T15:30:00",
      "ME1-04": "2026-10-22T15:30:00"
    },
    folderUrl: "https://drive.google.com/file/d/1sk39paE42hm7TO-I1t6XfnKKt4Bw50gl/view?usp=drivesdk",
    solutionUrl: "https://drive.google.com/file/d/1Fb-jlC3OuiCCUsUGG6oqd5cxZMuT_m1_/view?usp=drivesdk",
    desc: `مسائل Chapter 2 المطلوبة (إجمالي 21 مسألة):
• Chapter 2 (Part 1): 2.12, 2.13, 2.18, 2.23, 2.24, 2.25, 2.31, 2.32, 2.35, 2.36, 2.34, 2.44, 2.47, 2.59, 2.70, 2.71, 2.72, 2.78
• Chapter 2 (Part 2): 2.45, 2.53, 2.76
• تسليم Assignment 2 في السكشن على ورق A4 (الاسم، الكود، السكشن، القسم).
• مسموح للطالب تسليم الأسينمنت بتاعه وأسينمنت لزميل واحد فقط كحد أقصى.`,
    note: "موعد ومكان التسليم: الخميس 22 أكتوبر في السكشن (قاعة 14301 - Faculty Hall) فترتين: (12:30 - 2:00) و (2:00 - 3:30). السكشن هيتصور فيديو وهينزل على يوتيوب."
  }
];

// دليل الأسابيع الدراسي الشامل المعتمد (Weekly Guides)
const DEFAULT_WEEKLY_GUIDES = [
  // ===================== WEEK 1 =====================
  {
    week: "Week 1",
    code: "MTH G102",
    lectures: "Weekly Guide for Lecture 1: Double Integrals (Part 1)",
    slides_url: "https://drive.google.com/drive/folders/1WCbR1VLo8sUZ_x58Of08lW71aq5Ht9z8",
    sheet: "Sheet 1 & Assignment 1",
    sheet_url: "https://drive.google.com/drive/folders/1z47GRFcIBjHRVF7DKk5eBq-aUIWJv3j0",
    solution_url: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N",
    solution_label: "Solved Problems By Dr. Ahmed",
    practice: "فيديوهات الشرح (م. عمار ياسر & م. أحمد المغربي) + فيديوهات حل الشيت والأسينمنت لزميلكم مهاب 🤍",
    playlists: [
      { title: "م. عمار ياسر (الفيديو للآخر)", url: "https://youtu.be/IfuyRoFzthk?si=a71lDUGo6x5WT_36" },
      { title: "م. أحمد المغربي (الفيديو الأول للآخر)", url: "https://youtu.be/VlDgu4dylLU?si=KHdffO0btzRircFE" },
      { title: "م. أحمد المغربي (الفيديو التاني لحد الدقيقة 30:45)", url: "https://youtu.be/8ANactIJ6Sk?si=6qaK7EO2R-LSh9BB" },
      { title: "فيديوهات شرح وحل أسئلة الـ Sheet والـ Assignment — زميلكم مهاب 🤍", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" }
    ],
    summaries: [
      { title: "Notes (نوتس وملخصات المحاضرة)", url: "https://drive.google.com/drive/folders/1DDpbyWJji6Y1kazpLp_0GdmjcwjrMYIx" },
      { title: "Solved Problems By Dr. Ahmed (مسائل محلولة لدكتور أحمد)", url: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N" },
      { title: "درايف فيديوهات حل الشيت والأسينمنت (زميلكم مهاب 🤍)", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" },
      { title: "Section Boards (سبورات السكشن كل أسبوع)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" }
    ],
    important_notes: [
      "🤍 عشان لو حد عنده مشكلة في حل الـ sheet أو الـ assignment: زميلكم مهاب منزل فيديوهات بيشرح فيها أسئلة الشيت وإزاي تتحل على الدرايف ده، وبردو بتنزل على درايف الدفعة مع الحل.. يا ريت تدعوله دعوة حلوة 🤍",
      "📋 كل أسبوع إن شاء الله الـ boards بتاعت السكشن هتنزل على الدرايف، ود. سارة قالت اللي عايز يحضر من اللي عليهم سكشن الخميس يقدر يحضر يوم الاتنين لغاية ما نظبط المواعيد.",
      "🎯 تريكة دكتور أحمد للميد: دكتور أحمد قال إن الـ integration في الميد في مستوى الـ practice quiz اللي بينزله لكل محاضرة على LectraHub — بيبقى 5 أسئلة MCQ على كل محاضرة بتحلهم وتشوف صح ولا غلط، وبعد ما بتخلص تقدر تمتحنه تاني وبيجيبلك 5 أسئلة جداد كل مرة عشان تمرن نفسك!"
    ],
    summary_title: "Notes + Solved Problems By Dr. Ahmed",
    summary_url: "https://drive.google.com/drive/folders/1DDpbyWJji6Y1kazpLp_0GdmjcwjrMYIx"
  },
  {
    week: "Week 1",
    code: "EPE G113",
    lectures: "Lec 1: Basic Electrical Concepts, Charge, Current, Voltage & Power",
    slides_url: "https://drive.google.com/file/d/1eYqdE-2HMOQRyHotKQBGmBegnZMcyoZW/view?usp=drivesdk",
    sheet: "Sheet 1: DC Circuits & Basic Electrical Quantities",
    sheet_url: "https://drive.google.com/file/d/1z48ZfG-2CW86dlEJATipW1t-4ZNmwDru/view?usp=drivesdk",
    solution_url: "https://drive.google.com/file/d/1MwqPfN9_M0FV-izQkb1BIa3Bxezcb6hM/view?usp=drivesdk",
    practice: "حل مسائل شيت 1 ومتابعة فيديوهات الشرح المعتمدة",
    playlists: [
      { title: "م. عمار ياسر (فيديو 1)", url: "https://youtube.com/playlist?list=PLsx3PTmWiODC0g-tdKoz5DE4dOZhTvuzj&si=nlm30sMM1-z7Ynam" },
      { title: "م. محمد ماهر (حتى د 18:38)", url: "https://www.youtube.com/playlist?list=PLm877Wx3hfJ37R7tf8KaLhYXBrKtCLjzy" },
      { title: "م. طارق البغدادي", url: "https://www.youtube.com/playlist?list=PLJHkuo98VFGZPKHD2m1HccJgekI505sSE" }
    ],
    summary_title: "ملخص المحاضرة الأولى (Electrical Summary)",
    summary_url: "https://drive.google.com/file/d/15OSsv6GFMQtj6et4yHNZ_EUM__P4fA_R/view?usp=drivesdk"
  },

  // ===================== WEEK 2 =====================
  {
    week: "Week 2",
    code: "GEN G119",
    lectures: "Lecture 2: Introduction to Marketing (Chapter 1)",
    slides_url: "https://drive.google.com/file/d/1hpxjsk85GE0iYuF3zo-QdzqD4xPtL7VF/view?usp=drivesdk",
    sheet: "Test Bank CH1 (بنك الأسئلة المباشر)",
    sheet_url: "https://drive.google.com/file/d/1EcxDGu2vcXayuRs6Ytep9kYdLgqUInRs/view?usp=drivesdk",
    solution_url: "https://drive.google.com/file/d/1EcxDGu2vcXayuRs6Ytep9kYdLgqUInRs/view?usp=drivesdk",
    practice: "⚠️ كويز الأحد: 20 سؤال في 5 دقائق (مكس MCQ و True/False) من أسئلة الـ Test Bank مباشرة.",
    playlists: [],
    summary_title: "ملف بنك الأسئلة لشابتر 1 (Test Bank CH1)",
    summary_url: "https://drive.google.com/file/d/1EcxDGu2vcXayuRs6Ytep9kYdLgqUInRs/view?usp=drivesdk"
  },
  {
    week: "Week 2",
    code: "MTH G102",
    lectures: "Weekly Guide for Lecture 2: Double Integrals (Part 2) — Polar Regions + Applications",
    slides_url: "https://drive.google.com/file/d/1IxaAIvGE0t4ysmkjteIsfPXMAZHJOBgY/view?usp=drivesdk",
    sheet: "Sheet 2 & Assignment 2",
    sheet_url: "https://drive.google.com/drive/folders/19hZKh8cS5TjO4l0RpP5lFuxBabD98xjV",
    solution_url: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N",
    solution_label: "Solved Problems By Dr. Ahmed",
    practice: "فيديوهات الشرح (م. عمار ياسر & م. أحمد المغربي) + فيديوهات زميلكم مهاب لحل الشيت 🤍",
    playlists: [
      { 
        title: "م. عمار ياسر — شرح سريع لتحويلات الـ coordinates", 
        url: "https://youtu.be/ndfc1-8hWuI?si=mTeyC2VR8GjKw6oW",
        note: "💡 شرح سريع لتحويلات الـ coordinates كانت المفروض تتشرح في calc2 وهنحتاجها جداً هنا"
      },
      { title: "م. عمار ياسر — Polar regions", url: "https://youtu.be/QDhYk9H45NU?si=wno0MdzjRioiUxn5" },
      { title: "م. عمار ياسر — Applications", url: "https://youtu.be/j6eAM5iBsIw?si=DVE7LnWR4YTDNMpC" },
      { 
        title: "م. أحمد المغربي (من دقيقة 30:45 للآخر)", 
        url: "https://youtu.be/8ANactIJ6Sk?si=K3ngEnj_URhjy7Tl",
        note: "⚠️ من دقيقة 30:45 للآخر بس مش شارح الـ mass والـ CG في الفيديو ده"
      },
      { title: "فيديوهات شرح وحل أسئلة الـ Sheet والـ Assignment — زميلكم مهاب 🤍", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" }
    ],
    summaries: [
      { title: "Notes (نوتس وملخصات المحاضرة)", url: "https://drive.google.com/drive/folders/1DDpbyWJji6Y1kazpLp_0GdmjcwjrMYIx" },
      { title: "Solved Problems By Dr. Ahmed (مسائل محلولة لدكتور أحمد)", url: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N" },
      { title: "درايف فيديوهات حل الشيت والأسينمنت (زميلكم مهاب 🤍)", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" },
      { title: "Section Boards (سبورات السكشن كل أسبوع)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" }
    ],
    important_notes: [
      "⚠️ خلي بالك في الفيديوهات: فيديو م. عمار الأول بيشرح تحويلات الـ coordinates اللي كانت المفروض تتشرح في calc2 وهنحتاجها، وفيديو م. أحمد المغربي من دقيقة 30:45 للآخر بس مش شارح الـ mass والـ CG في الفيديو ده.",
      "🤍 عشان لو حد عنده مشكلة في حل الـ sheet أو الـ assignment: زميلكم مهاب منزل فيديوهات بيشرح فيها أسئلة الشيت وإزاي تتحل على الدرايف، وبردو بتنزل على درايف الدفعة مع الحل.. يا ريت تدعوله دعوة حلوة 🤍",
      "📋 كل أسبوع إن شاء الله الـ boards بتاعت السكشن هتنزل على الدرايف، ود. سارة قالت اللي عايز يحضر من اللي عليهم سكشن الخميس يقدر يحضر يوم الاتنين لغاية ما نظبط المواعيد."
    ],
    summary_title: "Notes + Solved Problems By Dr. Ahmed",
    summary_url: "https://drive.google.com/drive/folders/1DDpbyWJji6Y1kazpLp_0GdmjcwjrMYIx"
  },
  {
    week: "Week 2",
    code: "EPE G113",
    lectures: "Lecture 2: Circuit Elements, Ohm's & Kirchhoff's Laws",
    slides_url: "https://drive.google.com/file/d/1MASUBb7z-9mqOAarKOa4Iu-fomUtfbk_/view?usp=drivesdk",
    sheet: "Reference Questions (1-5) & General Questions",
    sheet_url: "https://drive.google.com/file/d/1H8pCThnlGV_FK-B5qzBeJfQlAOiwCAjq/view?usp=drivesdk",
    solution_url: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_",
    practice: "حل أسئلة الريفرنس (1 لـ 5) المحلولة بالتفصيل مع م. عمار ومسائل م. محمد ماهر",
    playlists: [
      { title: "م. عمار ياسر (فيديوهات 2 إلى 6)", url: "https://youtube.com/playlist?list=PLsx3PTmWiODC0g-tdKoz5DE4dOZhTvuzj&si=nlm30sMM1-z7Ynam" },
      { title: "م. محمد ماهر (من 2 لـ 5 - فيديو 5 حل 80 سؤال)", url: "https://www.youtube.com/playlist?list=PLm877Wx3hfJ37R7tf8KaLhYXBrKtCLjzy" },
      { title: "م. طارق البغدادي (من 1 إلى 4)", url: "https://youtube.com/playlist?list=PLJHkuo98VFGbtc9feafUsl1zEtxOh9YE7&si=S0U210d0GHyLVxjF" }
    ],
    summary_title: "ملخص المحاضرة الثانية + مرجع المادة (Reference PDF)",
    summary_url: "https://drive.google.com/file/d/1ah1zMzvhlGSiAHZ5BS5nUcBSoCTRBybG/view?usp=drivesdk"
  },
  {
    week: "Week 2",
    code: "EMC G101",
    lectures: "MOI & Chapter 2: Velocity Relation (أول 10 سلايدات)",
    slides_url: "https://drive.google.com/file/d/1-iSeDxQBp2CzrkH5JE1Ae7YdpMDTAfXP/view?usp=drivesdk",
    sheet: "Dynamics Sheet 2 (حل مسائل الـ Velocity Relation)",
    sheet_url: "https://drive.google.com/drive/folders/1TBDzw8XTrf6iuYgT_73Ybhus1JbJa1pg",
    solution_url: "https://drive.google.com/drive/folders/1TBDzw8XTrf6iuYgT_73Ybhus1JbJa1pg",
    practice: "ملاحظة: تجاهل أي سؤال مش على الـ velocity relation أو خارج أول 10 سلايدات. مفيش THE 2 هذا الأسبوع (هينزل 9 أكتوبر).",
    playlists: [
      { title: "محاضرة د. سمير (حتى د 22:55)", url: "https://youtu.be/271VDK8ocjM?feature=shared" },
      { title: "م. إنجي عبد الهادي — شرح كامل", url: "https://youtu.be/i-sy90j-dp0?si=0x6Gq3x90j46zYw5" },
      { title: "م. أحمد فوزي — شرح (حتى د 19:07)", url: "https://youtu.be/mrLEzczCxpc?si=1E9jbeCub09J0Tk7" },
      { title: "م. أحمد فوزي — حل الشيت", url: "https://youtu.be/mrLEzczCxpc?si=1E9jbeCub09J0Tk7" },
      { title: "م. إنجي عبد الهادي — حل الشيت", url: "https://youtu.be/XwngcLrhn6Y?si=rWD-1xlps0HQnJlU" }
    ],
    summary_title: "شيت الديناميكا بالحلول المؤقتة (فولدر كامل)",
    summary_url: "https://drive.google.com/drive/folders/1TBDzw8XTrf6iuYgT_73Ybhus1JbJa1pg"
  },
  {
    week: "Week 2",
    code: "MDP G111",
    lectures: "Sheet 1 Drafting & Assembly Preparation (SolidWorks)",
    slides_url: "https://drive.google.com/file/d/10oN0aJWUZiwggmvpu4ME9gls1j9w9fUj/view?usp=sharing",
    sheet: "Sheet 1: Parts Modeling & Assembly",
    sheet_url: "https://drive.google.com/file/d/1fYCgFoRqTcviWlFMxohYt6fCcgslsCSc/view?usp=drive_link",
    solution_url: "https://drive.google.com/drive/folders/1dOrqTikw_D613Q41u_HDWvRGAYDLYHpV?usp=sharing",
    practice: "لازم نيجي السكشن فاهمين تجميع أجزاء شيت 1 والـ Mates لتطبيقه في المعمل فوراً.",
    playlists: [
      { title: "تجميع شيت 1 (Part 1)", url: "https://drive.google.com/file/d/1mK6r0yRNkTf28udOOf-U_K71Jm5D6Yjb/view?usp=drive_link" },
      { title: "تجميع شيت 1 (Part 2)", url: "https://drive.google.com/file/d/1o-tgm2oNpf0Rj-VTp7IQcKE52v_4WSOt/view?usp=drive_link" },
      { title: "سيكشن شيت 1 — Pulley Bracket (رسم وتجميع)", url: "https://youtu.be/4FEoVuc008I?si=52u5KRwbj4kuBA1j" },
      { title: "إعدادات واختصارات البرنامج", url: "https://drive.google.com/file/d/1h7lj8A75cTz23cUCWo1fv9c0YdwsRILn/view?usp=drive_link" },
      { title: "شرح الـ Assembly (عربي)", url: "https://youtu.be/yHaJ_zHIyeA?si=ajGUIoQpTawLVulI" },
      { title: "شرح الـ Assembly (إنجليزي لـ د 47:00)", url: "https://youtu.be/dH0DSG7izfI?si=URc0WC8PRQxDF5SS" },
      { title: "Mechanical Mates", url: "https://youtu.be/4pW44cpxWLE?si=kTDTha4czs0YKnrs" },
      { title: "Advanced Mates", url: "https://youtu.be/G0cOEzjq_EM?si=78ZIxnis_pk6SSAz" }
    ],
    summary_title: "فولدر تحميل الـ Practice Parts للتدريب المباشر",
    summary_url: "https://drive.google.com/drive/folders/1dOrqTikw_D613Q41u_HDWvRGAYDLYHpV?usp=sharing"
  },
  {
    week: "Week 2",
    code: "MDP G121",
    lectures: "Lecture 2: Atomic Structure & Interatomic Bonding",
    slides_url: "https://drive.google.com/file/d/1CJCEFMrqSer9hOn7gX3QFyZAvvxZU-pc/view?usp=drivesdk",
    sheet: "Sheet 1: Atomic Structure",
    sheet_url: "https://drive.google.com/file/d/1mXr5-izCJgscySTAENhL1C3NiZRxp81v/view?usp=drivesdk",
    solution_url: "https://drive.google.com/file/d/12pqBhB9emTEJJ_FOJuADYodRBAR_aR5r/view?usp=drivesdk",
    practice: "حل مسائل شيت 1 ومراجعة نوتس الحضور اللي الدكتور قالها ومش في السلايدات",
    playlists: [
      { title: "سكشن م. هدى — شيت 1", url: "https://youtu.be/Jo-RnOPva2k?si=bwFRLumev2WuQqvJ" },
      { title: "سلايدات السكشن (Tutorial)", url: "https://drive.google.com/file/d/1gyQ0HaX5ldQ7cEXsFLWQETodXqzggJ0R/view?usp=drivesdk" }
    ],
    summary_title: "ملخص المحاضرة (Digital & Handwritten) + نوتس الحضور",
    summary_url: "https://drive.google.com/file/d/1ToJ6RyZkci6O59E6ViwJKagDcCVkryQj/view?usp=drivesdk"
  },

  // ===================== WEEK 3 =====================
  {
    week: "Week 3",
    code: "MTH G102",
    lectures: "Weekly Guide for Lecture 3 | Triple Integrals",
    slides_url: "https://drive.google.com/file/d/1WMinLYkB2MufXbRGEIMaWb7RpO-aFcoI/view?usp=drivesdk",
    sheet: "Sheet 3 & Assignment 3",
    sheet_url: "https://drive.google.com/drive/folders/1rSzLpNFrfMowDXk_LmRi6rvEIaj50DfI",
    solution_url: "https://drive.google.com/file/d/1T7Zpi2nwnzpuXCdauxkCZukg9xh5OkfX/view?usp=drivesdk",
    solution_label: "Solved Problems By Dr. Ahmed",
    practice: "فيديوهات الشرح (م. عمار ياسر & م. أحمد المغربي) + فيديوهات زميلكم مهاب لحل الشيت 🤍",
    playlists: [
      { 
        title: "م. عمار ياسر — فيديو تحويلات الـ coordinates", 
        url: "https://youtu.be/ndfc1-8hWuI?si=mTeyC2VR8GjKw6oW" 
      },
      { 
        title: "م. عمار ياسر — Triple integrals", 
        url: "https://youtu.be/GZdX5oC2-ao?si=Hc0YaCaPAz1J8Ck-" 
      },
      { 
        title: "م. عمار ياسر — Triple integrals Applications", 
        url: "https://youtu.be/WKqhfOQqlsc?si=vEq1ZXLXlzCFrEfX",
        note: "⚠️ في الميد الـ Integration داخل لغاية الـ Triple Integrals قبل الـ applications عشان متشرحتش"
      },
      { 
        title: "م. أحمد المغربي — Triple Integrals", 
        url: "https://youtu.be/PCabbIgzCFc?si=oBs-Nsh75EyEnB-f",
        note: "⚠️ هتلاقوا هنا في الـ applications الـ moment of inertia، دي مش معانا"
      },
      { title: "فيديوهات شرح وحل أسئلة الـ Sheet والـ Assignment — زميلكم مهاب 🤍", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" }
    ],
    summaries: [
      { title: "Notes (نوتس وملخصات المحاضرة)", url: "https://drive.google.com/drive/folders/1DDpbyWJji6Y1kazpLp_0GdmjcwjrMYIx" },
      { title: "Solved Problems By Dr. Ahmed (Triple Integrals)", url: "https://drive.google.com/file/d/1T7Zpi2nwnzpuXCdauxkCZukg9xh5OkfX/view?usp=drivesdk" },
      { title: "Section Boards (الـ Boards بتاعت السكشن كل أسبوع)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" },
      { title: "درايف فيديوهات حل الشيت والأسينمنت (زميلكم مهاب 🤍)", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" }
    ],
    important_notes: [
      "⚠️ تنبيه فيديو م. أحمد المغربي: هتلاقوا هنا في الـ applications جزئية الـ moment of inertia، دي مش معانا.",
      "🎯 بالنسبة للميدتيرم:\n• هيبقى 30 درجة: Linear 15 & Integration 15\n• الـ integration هيبقى كله MCQ وهيبقى لغاية الـ Triple Integrals قبل الـ applications عشان متشرحتش\n• الـ Linear هيبقى كله مقالي أو جزء مقالي وجزء MCQ\n• احتمال يبقى عدد الأسئلة متساوي يعني 5 أسئلة integration قصادها 5 Linear وهكذا (ده مثال)\n• دكتور أحمد قال إن الـ integration في الميد في مستوى الـ practice quiz اللي بينزله لكل محاضرة على LectraHub بيبقى خمس أسئلة MCQ على كل محاضرة بتحلهم وتشوف صح ولا غلط، بعد ما بتخلص تقدر تمتحنه تاني وبيجيبلك خمس أسئلة جداد كل مرة عشان تمرن نفسك.",
      "📋 كل أسبوع إن شاء الله الـ boards بتاعت السكشن هتنزل على الدرايف، ود. سارة قالت اللي عايز يحضر من اللي عليهم سكشن الخميس يقدر يحضر يوم الاتنين لغاية ما نظبط المواعيد.",
      "🤍 عشان لو حد عنده مشكلة في حل الـ sheet أو الـ assignment: زميلكم مهاب منزل فيديوهات بيشرح فيها أسئلة الشيت وإزاي تتحل على الدرايف وبردو بتنزل على درايف الدفعة مع الحل.. يا ريت تدعوله دعوة حلوة 🤍"
    ],
    summary_title: "Notes + Solved Problems By Dr. Ahmed",
    summary_url: "https://drive.google.com/drive/folders/1DDpbyWJji6Y1kazpLp_0GdmjcwjrMYIx"
  },
  {
    week: "Week 3",
    code: "EMC G101",
    lectures: "Chapter 2: Kinematics of Rigid Bodies (VR & AR, Constraints & Motion Types)",
    slides_url: "https://drive.google.com/file/d/1raAP-bxC_Z8xD0bTM2kAL0LCd9p2CzvB/view?usp=drivesdk",
    slides_note: "حتى سلايد 24 فقط",
    lecture_videos: [
      { title: "المحاضرة الرسمية — الجزء الأول", url: "https://youtu.be/271VDK8ocjM?feature=shared" },
      { title: "المحاضرة الرسمية — الجزء الثاني (حتى الدقيقة 07:00 فقط)", url: "https://youtu.be/EC0HXPnV3uQ?si=NTSlVYzk6j9ji5kI" },
      { title: "المحاضرة الرسمية — الجزء الثالث", url: "https://youtu.be/ZbQGqbTudbA?si=FHSYoL3iJPlY4Ttg" }
    ],
    sheet: "Dynamics Sheet 2: Kinematics of Rigid Bodies",
    sheet_url: "https://drive.google.com/file/d/1J0UdPRuvF4PgX-rLrunlO9UbOhmtY7Fq/view?usp=drivesdk",
    solution_url: "https://drive.google.com/file/d/1GfpDWDYV4baCYyvacoUA3GbmPHdx-eBw/view?usp=drivesdk",
    sheet_note: "حل أي مسائل خاصة بـ VR & AR فقط، والباقي لسه مأخدنهوش",
    practice: "سكاشن وتطبيقات المعيدين (شرح Acceleration Relation وحل مسائل الشيت)",
    playlists: [
      { title: "م. أحمد فوزي (ملخص الشابتر كاملاً + حل الشيت)", url: "https://youtu.be/mrLEzczCxpc?si=MAmczw5ZQU4y3Qc8" },
      { title: "م. إنجي (شرح Acceleration Relation)", url: "https://youtu.be/VqL2COYs3yc?si=hZ5VoeohJOYNhmgj" },
      { title: "م. إنجي (تصوير السكشن - حتى الدقيقة 32:00 شرح AR)", url: "https://youtu.be/ySiDSb0gbAo?si=hBQYD6hF8kSEGq2J" },
      { title: "مسائل محلولة Solved Problems على الـ AR من الشيت", url: "https://youtu.be/8vMHDoNCpLk?si=cR-bYSb4cF9vf7kv" }
    ],
    minutes: {
      the: "تيك هوم 2 (THE 2): ينزل رسمياً يوم الجمعة 9 أكتوبر.",
      covered: "Velocity & Acceleration Relation، و Types of Constraints، و Types of Motion.",
      remaining: "الـ IC (Instantaneous Center) والـ Rolling."
    },
    important_notes: [
      "🚫 مفيش كويز الأسبوع الجاي: الكويز غالباً هيكون في الأسبوع السادس.",
      "🎯 الأسبوع القادم إن شاء الله هنخلص Chapter 2 كاملاً.",
      "💡 متقلقوش من لخبطة الأسبوع ده، الدكتور لسه ما خلصش الشابتر، ومشاكلكم واقتراحاتكم محل اهتمام وشغالين عليها، متنسوش تملوا فورم المتابعة وبالتوفيق يا باشمهندسين ❤️🙏"
    ],
    summary_title: "الحل النموذجي لشيت 2 (Model Solution)",
    summary_url: "https://drive.google.com/file/d/1GfpDWDYV4baCYyvacoUA3GbmPHdx-eBw/view?usp=drivesdk"
  },
  {
    week: "Week 3",
    code: "MDP G121",
    tool: {
      title: "⚡ آلة حاسبة تفاعلية: رسم واستنتاج Miller Indices [uvw] & (hkl)",
      desc: "أداة عملية لحساب ورسم الـ Unit cell والمتجهات والمستويات خطوة بخطوة مع تمثيل SVG حي لمسائل الشيت.",
      description: "أداة عملية لحساب ورسم الـ Unit cell والمتجهات والمستويات خطوة بخطوة مع تمثيل SVG حي لمسائل الشيت.",
      url: "crystal-tool.html",
      link: "crystal-tool.html",
      badge: "Interactive Tool 🛠️"
    },
    lectures: "Lecture 3: Crystal Structure",
    slides_url: "https://drive.google.com/file/d/1MiCum9ETO6BT9InyOzEu1xqT4mmjHl-3/view?usp=drivesdk",
    recordings_url: "https://drive.google.com/drive/folders/1JJXsMCKmnz0ysbthqYHOMoRPzVLgQdN_",
    attendance_notes_url: "https://drive.google.com/file/d/1ZrcZEmi24DKJyH7NvTrgJ11UP-Rh7hK-/view?usp=drivesdk",
    sheet: "Sheet: Crystal Structure",
    sheet_url: "https://drive.google.com/file/d/1mXr5-izCJgscySTAENhL1C3NiZRxp81v/view?usp=drivesdk",
    solution_url: "https://drive.google.com/file/d/1yE3S4yvIePQnkyjYJVP12yQcQRYzXVz5/view?usp=drivesdk",
    practice: "سكاشن وتطبيقات م. هدى (سلايد السكشن + فيديوهات الشرح)",
    playlists: [
      { title: "سلايد السكشن (Tutorial Slides)", url: "https://drive.google.com/file/d/1Y5_Qf5AIDxCfrk-3xMhINI9qyEO-IDTc/view?usp=drivesdk" },
      { title: "سكشن م. هدى — جزء 1", url: "https://youtu.be/jtAnYnw8cyI?si=3Kbjrc_zFtLJIXIy" },
      { title: "سكشن م. هدى — جزء 2", url: "https://youtu.be/MmA4d50-h6E?si=XWDYIO78es-sygIC" }
    ],
    summaries: [
      { title: "1. Tutorial Slides (سلايدات السكشن - أساسي)", url: "https://drive.google.com/file/d/1Y5_Qf5AIDxCfrk-3xMhINI9qyEO-IDTc/view?usp=drivesdk" },
      { title: "2. كويز السنة اللي فاتت 2025/2026 + الحلول", url: "https://drive.google.com/drive/folders/1-yeXybwOFT1tQPo8-oVQXAfYAlcpnprr" },
      { title: "3. أسينمنت السنة اللي فاتت 2025/2026 + الحلول", url: "https://drive.google.com/drive/folders/1qmlZ4WhUtwsi6PkgXexuX_5jPVpy0UkP" },
      { title: "ملخص ديجيتال (Digital Summary)", url: "https://drive.google.com/file/d/1Mcap0HK9q-2pebDIXGQchmnIO8IhuAOt/view?usp=drivesdk" },
      { title: "ملخص بخط اليد (Handwritten Summary)", url: "https://drive.google.com/file/d/1sn-VDItU0oWDFHDKZ6vi3yKAIXjPh2Fn/view?usp=drivesdk" }
    ],
    important_notes: [
      "⚡ كويز 1 رسمي (5 درجات): الثلاثاء 20 أكتوبر 2026 بمدرج 7104.",
      "🎯 توجيه المعيد: مفيش أسئلة نظري إن شاء الله — الأسئلة مسائل وتطبيقات شبه اللي اتحلت في السكشن بالظبط.",
      "⚠️ الشيت فيه حاجات مش بتيجي في الامتحان، فالمذاكرة الأساسية تكون من سلايدات السكشن وحل مسائلها + كويز وأسينمنت السنة اللي فاتت.",
      "📋 خطة المذاكرة بالترتيب: 1. سلايدات السكشن (Tutorial Slides) • 2. كويز 2025/2026 • 3. أسينمنت 2025/2026."
    ],
    summary_title: "ملخص ديجيتال + ملخص بخط اليد (Crystal Structure)",
    summary_url: "https://drive.google.com/file/d/1Mcap0HK9q-2pebDIXGQchmnIO8IhuAOt/view?usp=drivesdk"
  },
  {
    week: "Week 3",
    code: "EPE G113",
    lectures: "Lecture 3: Circuit Analysis Techniques & Methods",
    slides_url: "https://drive.google.com/file/d/1HJUZR3zjcdc59Re0-F4Ksg6it7MZ2JNS/view?usp=drivesdk",
    sheet: "Sheet: Electric Circuits & Reference Problems (6 to 9)",
    sheet_url: "https://drive.google.com/file/d/1Kf1F3m-ndFnupprhlhmgabnnSw-rLXHx/view?usp=drivesdk",
    reference_url: "https://drive.google.com/file/d/1jLDeeyKMwlKTqR9qK-z9fSm9zbTymtGh/view?usp=drivesdk",
    solution_url: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_",
    sheet_note: "حل أسئلة الريفرنس المحلولة (من 6 لـ 9) وشيت المادة",
    practice: "حل أسئلة الريفرنس ومتابعة شروحات م. عمار ياسر، م. محمد ماهر، وم. طارق البغدادي",
    playlists: [
      { title: "م. عمار ياسر (فيديوهات من 7 لـ 10 - حل أسئلة الريفرنس بالتفصيل)", url: "https://youtube.com/playlist?list=PLsx3PTmWiODC0g-tdKoz5DE4dOZhTvuzj&si=nlm30sMM1-z7Ynam" },
      { title: "م. محمد ماهر (فيديوهات من 7 لـ 9)", url: "https://www.youtube.com/playlist?list=PLm877Wx3hfJ37R7tf8KaLhYXBrKtCLjzy" },
      { title: "م. طارق البغدادي (فيديوهات من 5 لـ 10)", url: "https://youtube.com/playlist?list=PLJHkuo98VFGbtc9feafUsl1zEtxOh9YE7&si=S0U210d0GHyLVxjF" }
    ],
    summaries: [
      { title: "المرجع المعتمد (Reference Book)", url: "https://drive.google.com/file/d/1jLDeeyKMwlKTqR9qK-z9fSm9zbTymtGh/view?usp=drivesdk" },
      { title: "أسئلة المرجع المحلولة (Reference Questions 6-9)", url: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_" }
    ],
    important_notes: [
      "📍 مكان التسليم: الخميس في السكشن (قاعة 14301 - Faculty Hall).",
      "⏰ الفترات المتاحة للاختيار/الحضور: الفترة الأولى (12:30 ظهراً - 2:00 ظهراً) أو الفترة الثانية (2:00 ظهراً - 3:30 عصراً).",
      "📝 ملاحظة: تم انتهاء تسليم Assignment 1، والتسليم القادم هو Assignment 2 يوم الخميس 22 أكتوبر.",
      "👥 مسموح للطالب تسليم الأسينمنت بتاعه وأسينمنت لزميل واحد فقط كحد أقصى.",
      "🎥 السكشن هيتصور فيديو وهينزل على يوتيوب."
    ],
    summary_title: "المرجع المعتمد + أسئلة المرجع المحلولة (من 6 لـ 9)",
    summary_url: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_"
  },

  // ===================== WEEK 4 =====================
  {
    week: "Week 4",
    code: "MTH G102",
    lectures: "Linear Algebra Lec. 1 Guide (Dr. Lucy PDF + مراجعة الـ Matrices)",
    slides_url: "https://drive.google.com/drive/folders/1ddsnJx-apXNVKtCY8JuD-VzqlLGIaZfY",
    slides_note: "معظم الحاجات اللي اتشرحت تعتبر مراجعة على حاجات قديمة والدكتور منبهة الناس تكون مراجعة القديم بعد كدا",
    sheet: "Sheet 1 (Revision) — Linear Algebra",
    sheet_url: "https://drive.google.com/file/d/1upmEswq82kaeBwUVaN6uaLBsSKOf0BL7/view?usp=drivesdk",
    reference_url: "https://drive.google.com/file/d/1Vum_-i5CsaKI9UA9xAPHUNT6lPLFxiy9/view?usp=drivesdk",
    solution_url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd",
    solution_label: "Section Boards (الـ Boards بتاعت السكشن)",
    sheet_note: "هتلاقوا الشيت مكتوب عليه Assignment بس هو بنسبة كبيرة مش هيتسلم ود. سارة هتخلي درجات أعمال السنة على كويزين",
    practice: "ماتيريال مجمع للـ Linear Algebra عشان تعرفوا تقدروا تذاكروا منين (محاضرات وسكاشن من أكتر من دكتور ومعيد + شيتات ونوتس أقسام تانية)",
    playlists: [
      { title: "Lectures & Sections (لينكات محاضرات وسكاشن للمادة من أكتر من دكتور ومعيد)", url: "https://docs.google.com/document/d/1amjERn4hxxXyRtCzcF8shwyA9T3JiqE-AR5bcDqB2Bs/edit?usp=drivesdk" },
      { title: "Section Boards (الـ Boards بتاعت السكشن كل أسبوع)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" },
      { title: "فيديوهات شرح وحل أسئلة الشيت والأسينمنت — زميلكم مهاب 🤍", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" }
    ],
    summaries: [
      { title: "Dr. Lucy PDF (Linear Algebra Lec. 1)", url: "https://drive.google.com/drive/folders/1ddsnJx-apXNVKtCY8JuD-VzqlLGIaZfY" },
      { title: "مراجعة الـ Matrices من د. لوسي (يفضل قريتها قبل المحاضرة)", url: "https://drive.google.com/file/d/1Vum_-i5CsaKI9UA9xAPHUNT6lPLFxiy9/view?usp=drivesdk" },
      { title: "Sheet 1 (Revision)", url: "https://drive.google.com/file/d/1upmEswq82kaeBwUVaN6uaLBsSKOf0BL7/view?usp=drivesdk" },
      { title: "Lectures & Sections (لينكات محاضرات وسكاشن من أكتر من دكتور ومعيد)", url: "https://docs.google.com/document/d/1amjERn4hxxXyRtCzcF8shwyA9T3JiqE-AR5bcDqB2Bs/edit?usp=drivesdk" },
      { title: "Sheets (Other Departments — شيتات أقسام تانية)", url: "https://drive.google.com/drive/folders/1VoWn26amBqIVtbHLHPU7Y6smEvMtZw1u" },
      { title: "Notes (Other Departments — نوتس أقسام تانية)", url: "https://drive.google.com/drive/folders/1dtDpjRWhw3eykJYYhFOoqYE6lSl8PJSP" },
      { title: "Section Boards (الـ Boards بتاعت السكشن كل أسبوع)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" }
    ],
    important_notes: [
      "📘 مراجعة الـ Matrices: بما إن الأسبوع ده بداية الـ Linear Algebra، دكتور لوسي باعتة مراجعة للـ Matrices عشان الناس تفتكر المعلومات.. جزء كبير منها اتاخد في إعدادي ما عدا بعض التفاصيل وهي هتبقى كاتبة إنها هتتشرح خلال المحاضرات إن شاء الله، فيفضل الناس تكون قريتها قبل المحاضرة عشان متبقاش تايهة.",
      "📝 بخصوص Sheet 1 وأعمال السنة: معظم الحاجات اللي اتشرحت تعتبر مراجعة على حاجات قديمة والدكتور منبهة الناس تكون مراجعة القديم بعد كدا.. هتلاقوا الشيت مكتوب عليه Assignment بس هو بنسبة كبيرة مش هيتسلم ود. سارة هتخلي درجات أعمال السنة على كويزين.",
      "📚 ماتيريال مجمع للينير: جمعنالكم هنا لينكات محاضرات وسكاشن للمادة من أكتر من دكتور ومعيد في ملف الـ Doc، وكمان فولدرات Sheets و Notes من أقسام تانية عشان تعرفوا تقدروا تذاكروا منين.",
      "📌 حضور السكشن والـ Boards: كل أسبوع إن شاء الله الـ boards بتاعت السكشن هتنزل على الدرايف، ود. سارة قالت اللي عايز يحضر من اللي عليهم سكشن الخميس يقدر يحضر يوم الاتنين لغاية ما نظبط المواعيد.",
      "🎯 بالنسبة للميدتيرم:\n• هيبقى 30 درجة: Linear 15 & Integration 15\n• الـ integration هيبقى كله MCQ وهيبقى لغاية الـ Triple Integrals قبل الـ applications عشان متشرحتش\n• الـ Linear هيبقى كله مقالي أو جزء مقالي وجزء MCQ\n• احتمال يبقى عدد الأسئلة متساوي يعني 5 أسئلة integration قصادها 5 Linear وهكذا (ده مثال)\n• دكتور أحمد قال إن الـ integration في الميد في مستوى الـ practice quiz اللي بينزله لكل محاضرة على LectraHub بيبقى خمس أسئلة MCQ على كل محاضرة بتحلهم وتشوف صح ولا غلط، بعد ما بتخلص تقدر تمتحنه تاني وبيجيبلك خمس أسئلة جداد كل مرة عشان تمرن نفسك."
    ],
    summary_title: "Dr. Lucy PDF + Matrices Revision + ماتيريال اللينير المجمع",
    summary_url: "https://drive.google.com/drive/folders/1ddsnJx-apXNVKtCY8JuD-VzqlLGIaZfY"
  },
  {
    week: "Week 4",
    code: "EMC G101",
    lectures: "Chapter 2: Kinematics of Rigid Bodies (Complete) — Rolling & Instantaneous Center (IC)",
    slides_url: "https://drive.google.com/file/d/1raAP-bxC_Z8xD0bTM2kAL0LCd9p2CzvB/view?usp=drivesdk",
    slides_note: "من أول سلايد 25",
    lecture_videos: [
      { title: "المحاضرة الرسمية — جزء 1", url: "https://youtu.be/giQo5Y4eiI0?feature=shared" },
      { title: "المحاضرة الرسمية — جزء 2", url: "https://youtu.be/sp7gcWN7xlQ?feature=shared" },
      { title: "المحاضرة الرسمية — جزء 3", url: "https://youtu.be/RlgPz8shjlk?feature=shared" },
      { title: "المحاضرة الرسمية — جزء 4", url: "https://youtu.be/RIAgLNMOKFA?feature=shared" },
      { title: "المحاضرة الرسمية — جزء 5 (من أول الدقيقة 07:00)", url: "https://youtu.be/EC0HXPnV3uQ?si=NTSlVYzk6j9ji5kI" }
    ],
    sheet: "Dynamics Sheet 2: Kinematics of Rigid Bodies (Full Sheet & Solutions)",
    sheet_url: "https://drive.google.com/file/d/1J0UdPRuvF4PgX-rLrunlO9UbOhmtY7Fq/view?usp=drivesdk",
    solution_url: "https://drive.google.com/file/d/1GfpDWDYV4baCYyvacoUA3GbmPHdx-eBw/view?usp=drivesdk",
    sheet_note: "تم إنهاء جميع موضوعات وتطبيقات الشابتر بالكامل",
    practice: "سكاشن وتطبيقات المعيدين (شرح الـ Rolling و IC وتصوير السكشن وحل الشيت)",
    playlists: [
      { title: "م. أحمد فوزي (ملخص الشابتر كامل + حل الشيت)", url: "https://youtu.be/mrLEzczCxpc?si=MAmczw5ZQU4y3Qc8" },
      { title: "م. إنجي (تصوير السكشن - من الدقيقة 32:00)", url: "https://youtu.be/ySiDSb0gbAo?si=hBQYD6hF8kSEGq2J" },
      { title: "شرح الـ Rolling (م. إنجي)", url: "https://youtu.be/7XZuHoI1fmg?si=if-1aQxsVYGTmCX5" },
      { title: "حل ومسائل على الـ Rolling", url: "https://youtu.be/6LOrpFrexE0?si=-_MRSFBx3G67O0Qu" },
      { title: "شرح الـ Instantaneous Center - IC (م. إنجي)", url: "https://youtu.be/PJJ5JOMR8yY?si=VGRgmuaUWuvBKlvQ" }
    ],
    minutes: {
      covered: "تم إنهاء Chapter 2 بالكامل."
    },
    important_notes: [
      "🎯 كويز الديناميكا بنسبة كبيرة هيكون في الأسبوع السادس إن شاء الله وهيشمل Chapter 1 & 2.",
      "💡 متنسوش تملوا فورم المتابعة عشان نقدر نساعدكم ونشوف المشاكل اللي بتواجهكم.. وبالتوفيق يا باشمهندسين ❤️🙏"
    ],
    summary_title: "الحل النموذجي لشيت 2 (Model Solution)",
    summary_url: "https://drive.google.com/file/d/1GfpDWDYV4baCYyvacoUA3GbmPHdx-eBw/view?usp=drivesdk"
  },
  {
    week: "Week 4",
    code: "MDP G121",
    status_badge: "⏳ جاري التحديث",
    status_note: "جاري التحديث: حل الشيت والملخصات هينزلوا تباعاً بعد المحاضرة إن شاء الله 🙏❤️",
    lectures: "Lecture 4: Crystal Defects (Imperfections in Solids)",
    slides_url: "https://drive.google.com/file/d/1tEW3eBlGIv5WB_f8Eq4AbLHhYqtzG3KL/view?usp=drivesdk",
    recordings_url: "https://drive.google.com/drive/folders/1anhqoJvjUJDHc12odOCViNQIpcif7r-H",
    sheet: "Sheet: Crystal Structure & Defects (Full Sheet)",
    sheet_url: "https://drive.google.com/file/d/1mXr5-izCJgscySTAENhL1C3NiZRxp81v/view?usp=drivesdk",
    sheet_note: "⏳ جاري التحديث: حل الشيت والملخصات هينزلوا تباعاً بعد المحاضرة إن شاء الله 🙏❤️",
    practice: "سكاشن وتطبيقات م. هدى (سلايد السكشن + فيديو شرح Crystal Defects)",
    playlists: [
      { title: "سلايد السكشن (Tutorial Slides)", url: "https://drive.google.com/file/d/1OzufpD58SXoC0X4iEtB2aePV-6fa6a6o/view?usp=drivesdk" },
      { title: "سكشن م. هدى — شرح Crystal Defects", url: "https://youtu.be/w23wUdV8MGU?si=2y7HiExW8SfUj4jR" }
    ],
    important_notes: [
      "⚡ كويز 1 ماتيريل: تم الانتهاء منه يوم الثلاثاء 20 أكتوبر بمدرج 7104 (5 درجات).",
      "حل الشيت والملخصات مرفوعة ومتاحة للرجوع إليها في أي وقت 🙏❤️"
    ],
    summary_title: "ملف الشيت الكامل (Full Sheet)",
    summary_url: "https://drive.google.com/file/d/1mXr5-izCJgscySTAENhL1C3NiZRxp81v/view?usp=drivesdk"
  },
  {
    week: "Week 4",
    code: "EPE G113",
    lectures: "Lecture 4: Circuit Analysis & Nodal / Mesh Methods (Chapter 2)",
    slides_url: "https://drive.google.com/file/d/1HJUZR3zjcdc59Re0-F4Ksg6it7MZ2JNS/view?usp=drivesdk",
    sheet: "Assignment 2 (Chapter 2) — 21 مسألة",
    sheet_url: "https://drive.google.com/file/d/1sk39paE42hm7TO-I1t6XfnKKt4Bw50gl/view?usp=drivesdk",
    solution_url: "https://drive.google.com/file/d/1Fb-jlC3OuiCCUsUGG6oqd5cxZMuT_m1_/view?usp=drivesdk",
    reference_url: "https://drive.google.com/file/d/1jLDeeyKMwlKTqR9qK-z9fSm9zbTymtGh/view?usp=drivesdk",
    solution_label: "الحل النموذجي (Solution)",
    sheet_note: "المسائل المطلوبة من Chapter 2: المجموعة الأولى (18 مسألة) والمجموعة الثانية (3 مسائل)",
    practice: "حل مسائل Assignment 2 ومتابعة شروحات م. عمار ياسر، م. محمد ماهر، وم. طارق البغدادي",
    playlists: [
      { title: "م. عمار ياسر (فيديوهات 7 لـ 10 - حل أسئلة الريفرنس بالتفصيل)", url: "https://youtube.com/playlist?list=PLsx3PTmWiODC0g-tdKoz5DE4dOZhTvuzj&si=nlm30sMM1-z7Ynam" },
      { title: "م. محمد ماهر (شرح وسكاشن الكهربية)", url: "https://www.youtube.com/playlist?list=PLm877Wx3hfJ37R7tf8KaLhYXBrKtCLjzy" },
      { title: "م. طارق البغدادي (شرح كورس الدوائر والكهربية)", url: "https://www.youtube.com/playlist?list=PLJHkuo98VFGZPKHD2m1HccJgekI505sSE" }
    ],
    summaries: [
      { title: "ملف Assignment 2 الرسمي (Google Drive)", url: "https://drive.google.com/file/d/1sk39paE42hm7TO-I1t6XfnKKt4Bw50gl/view?usp=drivesdk" },
      { title: "الحل النموذجي المعتمد لـ Assignment 2", url: "https://drive.google.com/file/d/1Fb-jlC3OuiCCUsUGG6oqd5cxZMuT_m1_/view?usp=drivesdk" },
      { title: "المرجع المعتمد (Reference Book)", url: "https://drive.google.com/file/d/1jLDeeyKMwlKTqR9qK-z9fSm9zbTymtGh/view?usp=drivesdk" }
    ],
    important_notes: [
      "🚨 تسليم Assignment 2 (EPE G113): انتهى التسليم الرسمي يوم الخميس 22 أكتوبر.",
      "📝 أرقام المسائل المطلوبة من Chapter 2 كانت 21 مسألة وحلولها مرفوعة بالكامل."
    ],
    summary_title: "ملف الأسينمنت والحل النموذجي (Assignment 2 & Solution)",
    summary_url: "https://drive.google.com/file/d/1Fb-jlC3OuiCCUsUGG6oqd5cxZMuT_m1_/view?usp=drivesdk"
  },
  // ===================== WEEK 5 =====================
  {
    week: "Week 5",
    code: "MTH G102",
    lectures: "Linear Algebra Lec. 2 Guide: Vector Spaces & Subspaces",
    slides_url: "https://drive.google.com/file/d/1tpwf5iFQtUYYbysdgd6nPySvu4nR_Jam/view?usp=drivesdk",
    slides_note: "Lecture PDF (Dr. Lucy) + محتوى الميد هو أي حاجة د. لوسي هتقولها لغاية المحاضرة اللي قبل الميد حتى لو مش متقالة في الـ Lecture Notes",
    sheet: "Assignment 2 (Vector Spaces & Subspaces)",
    sheet_url: "https://drive.google.com/file/d/14wOaVsWYTzE8OvTcqbj0PTBwjE3huVmH/view?usp=drivesdk",
    solution_url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd",
    solution_label: "Section Boards (الـ Boards بتاعت السكشن)",
    sheet_note: "علينا فيه الأسئلة دي في الأسبوع ده: من 1 لـ 11 • سؤال 16(ii) • من 19 لـ 24 | ⚠️ أي سؤال أو نقطة متعلقة بـ Basis أو Dimension أو Span لسه مخدناهوش",
    practice: "نوتس الأقسام التانية (د. أحمد عصام ود. نبيلة) + الماتيريال المجمع للينير وفيديوهات حل الشيت 🤍",
    playlists: [
      { title: "Dr. Ahmed Essam Notes (Lecture 2 - Lecture 3)", url: "https://drive.google.com/drive/folders/146HDk9CbIz3KkN32koT77z829iJX-5Rq" },
      { title: "Dr. Nabila Notes (Lec. 2)", url: "https://drive.google.com/drive/folders/1K6d_p8vZ_nnDecvOx-qUVQRGSGQCD-H2" },
      { title: "Lectures & Sections (لينكات محاضرات وسكاشن للمادة من أكتر من دكتور ومعيد)", url: "https://docs.google.com/document/d/1amjERn4hxxXyRtCzcF8shwyA9T3JiqE-AR5bcDqB2Bs/edit?usp=drivesdk" },
      { title: "فيديوهات شرح وحل أسئلة الشيت والأسينمنت — زميلكم مهاب 🤍", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" }
    ],
    summaries: [
      { title: "Lecture PDF — Dr. Lucy (Lec. 2: Vector Spaces & Subspaces)", url: "https://drive.google.com/file/d/1tpwf5iFQtUYYbysdgd6nPySvu4nR_Jam/view?usp=drivesdk" },
      { title: "Assignment 2 (Vector Spaces & Subspaces — المطلوب: 1-11, 16ii, 19-24)", url: "https://drive.google.com/file/d/14wOaVsWYTzE8OvTcqbj0PTBwjE3huVmH/view?usp=drivesdk" },
      { title: "Notes (Other Departments) — Dr. Ahmed Essam (Lecture 2 - Lecture 3)", url: "https://drive.google.com/drive/folders/146HDk9CbIz3KkN32koT77z829iJX-5Rq" },
      { title: "Notes (Other Departments) — Dr. Nabila (Lec. 2)", url: "https://drive.google.com/drive/folders/1K6d_p8vZ_nnDecvOx-qUVQRGSGQCD-H2" },
      { title: "Sheets (Other Departments — شيتات أقسام تانية)", url: "https://drive.google.com/drive/folders/1VoWn26amBqIVtbHLHPU7Y6smEvMtZw1u" },
      { title: "Notes (Other Departments — نوتس أقسام تانية عامة)", url: "https://drive.google.com/drive/folders/1dtDpjRWhw3eykJYYhFOoqYE6lSl8PJSP" },
      { title: "Section Boards (الـ Boards بتاعت السكشن كل أسبوع)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" }
    ],
    important_notes: [
      "📝 الأسئلة اللي علينا في Assignment 2 في الأسبوع ده:\n• من 1 لـ 11\n• سؤال 16(ii)\n• من 19 لـ 24\n⚠️ أي سؤال أو نقطة متعلقة بـ Basis أو Dimension أو Span لسه مخدناهوش.",
      "🚨 ملحوظة مهمة جداً: د. لوسي في آخر المحاضرة ممكن تنادي أسماء عشوائي من كشف الأسماء وتطلب تشوف شغلهم في المادة! الشغل ده اللي هو الـ assignment اللي بيتبعت ومذاكرتك للمادة، وقالت إنها ممكن تدي بونص على ده وأوقات ممكن تكرر الاسم في أكتر من محاضرة.. فضروري الناس تحل والإجابات هتنزل قريباً إن شاء الله ❤️",
      "🎯 محتوى الميد (مهم جداً): محتوى الميد هو أي حاجة د. لوسي هتقولها لغاية المحاضرة اللي قبل الميد حتى لو مش متقالة في الـ Lecture Notes! (والميد من 30 درجة: Linear 15 مقالي أو جزء مقالي وجزء MCQ + Integration 15 كله MCQ لغاية الـ Triple Integrals قبل الـ applications في مستوى الـ practice quiz اللي على LectraHub).",
      "📋 كل أسبوع إن شاء الله الـ boards بتاعت السكشن بتنزل على الدرايف، ود. سارة قالت اللي عايز يحضر من اللي عليهم سكشن الخميس يقدر يحضر يوم الاتنين لغاية ما نظبط المواعيد."
    ],
    summary_title: "Dr. Lucy Lec. 2 PDF + Notes (Dr. Ahmed Essam & Dr. Nabila)",
    summary_url: "https://drive.google.com/file/d/1tpwf5iFQtUYYbysdgd6nPySvu4nR_Jam/view?usp=drivesdk"
  },
  // ===================== WEEK 6 =====================
  {
    week: "Week 6",
    code: "EPE G113",
    status_badge: "✅ كويز 1 انتهى (الثلاثاء 27 أكتوبر)",
    lectures: "Lecture: Circuit Analysis Techniques (Nodal, Mesh, Superposition, Thevenin, Source Transformation)",
    slides_url: "https://drive.google.com/file/d/1HJUZR3zjcdc59Re0-F4Ksg6it7MZ2JNS/view?usp=drivesdk",
    sheet: "شيت الطرق (شيت 3 درايف / شيت 4 معيد — Nodal & Mesh)",
    sheet_url: "https://drive.google.com/drive/folders/1pj7mKzRcy2QrC__ZFXAxjSmxQHK51Iii",
    solution_url: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_",
    reference_url: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_",
    solution_label: "حلول أسئلة المرجع المحلولة (6 لـ 9)",
    sheet_note: "🔥 الشيت الأهم: أهم حاجة تتحل وتتذاكر كل فكرة وتفصيلة فيها + ملخص التركات وأسئلة المرجع والكويزات السابقة",
    practice: "حل مسائل شيت الطرق، أسئلة المرجع من 6 لـ 9، ومراجعة كويزات وميدات سابقة من قسم كهرباء",
    playlists: [
      { title: "م. عمار ياسر (حل أسئلة الريفرنس بالتفصيل)", url: "https://youtube.com/playlist?list=PLsx3PTmWiODC0g-tdKoz5DE4dOZhTvuzj&si=nlm30sMM1-z7Ynam" },
      { title: "م. محمد ماهر (شرح وسكاشن الطرق)", url: "https://www.youtube.com/playlist?list=PLm877Wx3hfJ37R7tf8KaLhYXBrKtCLjzy" },
      { title: "م. طارق البغدادي (شرح كورس الدوائر والكهربية)", url: "https://www.youtube.com/playlist?list=PLJHkuo98VFGZPKHD2m1HccJgekI505sSE" }
    ],
    summaries: [
      { title: "🔥 1. الشيت الأهم (شيت 3 درايف / 4 معيد — Nodal & Mesh)", url: "https://drive.google.com/drive/folders/1pj7mKzRcy2QrC__ZFXAxjSmxQHK51Iii" },
      { title: "✨ 2. ملخص أهم التركات والأفكار للشيت الأخير", url: "https://drive.google.com/file/d/1k7DsSMELdv1FK6vDfaKlP3ijnM5Zly7k/view?usp=drivesdk" },
      { title: "📚 3. أسئلة المرجع (ركز على الأسئلة من 6 لـ 9)", url: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_" },
      { title: "📝 4. كويزات وميدات سابقة من قسم كهرباء (نفس المحتوى)", url: "https://drive.google.com/drive/folders/1fouTNz6FgVSRZiIz61iDARn_pIRdVxW_" }
    ],
    important_notes: [
      "⚡ كويز 1 كهربية (EPE G113 — Circuit Analysis): الثلاثاء 27 أكتوبر 2026 في ميعاد المحاضرة (10:00 ص - مدرج 7104-360) • مدة الكويز: ⏱️ نصف ساعة (30 دقيقة).",
      "📝 شكل ومحتوى الامتحان: سؤال واحد عبارة عن دائرة كهربية (Circuit) يطلب حلها بأكثر من طريقة: (Nodal, Mesh, Superposition, Thevenin, Source Transformation...).",
      "📖 المقرر داخل حتى شيت الطرق (شيت 3 بترتيب الدرايف / شيت 4 بترتيب المعيد).",
      "⚠️ تنبيه هام جداً: المصادر المعتمدة (Dependent Sources) ملغية في أسئلة Thevenin و Superposition!",
      "خطة المذاكرة الرسمية بالترتيب:\n1. 🔥 الشيت الأهم (شيت 3 درايف / 4 معيد — Nodal & Mesh) — أهم حاجة تتحل وتتذاكر كل فكرة وتفصيلة فيها.\n2. ✨ ملخص أهم التركات والأفكار للشيت الأخير.\n3. 📚 أسئلة المرجع: ركز على الأسئلة من 6 لـ 9 (الحل النموذجي مرفوع على الدرايف).\n4. 📝 كويزات وميدات سابقة من قسم كهرباء (نفس المحتوى)."
    ],
    summary_title: "ملخص أهم التركات والأفكار للشيت الأخير",
    summary_url: "https://drive.google.com/file/d/1k7DsSMELdv1FK6vDfaKlP3ijnM5Zly7k/view?usp=drivesdk"
  }
];

// مواعيد امتحانات الـ Take-Home لمادة الديناميكا (THE 2 يبدأ 9 أكتوبر)
const DYNAMICS_THE_EXAMS = [
  { no: 1, name: "P200", start: "2026-09-25T19:00:00", deadline: "2026-10-09T19:00:00", examSheet: "https://drive.google.com/file/d/1G7wTSWQLSn8PGk4c76svzkVSXQMhf2Mk" },
  { no: 2, name: "P135", start: "2026-10-09T19:00:00", deadline: "2026-10-16T19:00:00", examSheet: "https://drive.google.com/file/d/1oKKepdc3UJwztVRZI78XUFI7ozdit_S6" },
  { no: 3, name: "P106", start: "2026-10-16T19:00:00", deadline: "2026-10-23T19:00:00", examSheet: "https://drive.google.com/file/d/1sQ8z2c6KSWZL3fqcDahuhjJZzS0WMLdZ" },
  { no: 4, name: "P137v", start: "2026-10-23T19:00:00", deadline: "2026-10-30T19:00:00", examSheet: "https://drive.google.com/file/d/12uXkipt3rKvCEDTyhkvf4JctloCF516X" },
  { no: 5, name: "P305", start: "2026-10-30T19:00:00", deadline: "2026-11-06T19:00:00", examSheet: "https://drive.google.com/file/d/18pbuDHPOQJafJeRllipa_LITQrvNGRNL" },
  { no: 6, name: "P3501v", start: "2026-11-06T19:00:00", deadline: "2026-11-20T19:00:00", examSheet: "https://drive.google.com/file/d/15W7Yzak8s7pk9nwh5ZJAVyqOjC-_HDOR" },
  { no: 7, name: "P356v", start: "2026-11-20T19:00:00", deadline: "2026-11-27T19:00:00", examSheet: "https://drive.google.com/file/d/1q6bJ5m6JnebbxDBhDU5GOIK1babvcP2A" },
  { no: 8, name: "P325v", start: "2026-11-27T19:00:00", deadline: "2026-12-04T19:00:00", examSheet: "https://drive.google.com/file/d/1e5oGzzi4uTT4oay7hhHB0bP-yjmZhaoq" },
  { no: 9, name: "P464", start: "2026-12-04T19:00:00", deadline: "2026-12-11T19:00:00", examSheet: "https://drive.google.com/file/d/1pIlU32osszyhQyhqZklv1Xal9PsvwEMd" }
];

const dynamicsRoadmap = [
  {
    week: 1,
    date: "Sep 20 - Sep 24",
    title: "Intro + Ch1: CG & MOI",
    topic: "مقدمة + مركز الثقل وعزم القصور الذاتي (Center of Gravity & Moment of Inertia)",
    slides: "Slides 1 → End",
    status: "completed"
  },
  {
    week: 2,
    date: "Sep 27 - Oct 01",
    title: "Ch2: Kinematics of Rigid Bodies (Part 1)",
    topic: "كينماتيكا الأجسام الجاسئة (Kinematics)",
    slides: "Slides 1 → 33",
    status: "completed"
  },
  {
    week: 3,
    date: "Oct 04 - Oct 08",
    title: "Ch2: Types of R.B Motions & Instantaneous Center",
    topic: "أنواع حركة الجسم الجاسئ + أمثلة (2Ex06, 2Ex15, 2Ex17, 2Ex20) + Rolling & IC",
    slides: "Slides 1 → 24",
    status: "completed"
  },
  {
    week: 4,
    date: "Oct 11 - Oct 15",
    title: "Ch2: Kinematics of Rigid Bodies (Part 2 — Complete)",
    topic: "إنهاء Chapter 2 بالكامل (Rolling & Instantaneous Center - IC وتطبيقاتها)",
    slides: "Slides 25 → End",
    status: "completed"
  },
  {
    week: 5,
    date: "Oct 18 - Oct 22",
    title: "Ch3: Kinetics of Rigid Bodies - Equations of Motion (Part 1)",
    topic: "كيناتيكا الأجسام الجاسئة: معادلات الحركة",
    slides: "Slides 1 → 14",
    status: "upcoming"
  },
  {
    week: 6,
    date: "Oct 25 - Oct 29",
    title: "Ch3: Kinetics of Rigid Bodies (Part 2)",
    topic: "تكملة معادلات الحركة وتطبيقاتها",
    slides: "Slides 15 → End",
    status: "upcoming"
  },
  {
    week: 7,
    date: "Nov 01 - Nov 05",
    title: "Mid-Term Exam",
    topic: "امتحان نصف الترم (Mid-Term)",
    slides: "Ch1 + Ch2 + Ch3",
    status: "upcoming",
    badge: "Midterm"
  },
  {
    week: 8,
    date: "Nov 08 - Nov 12",
    title: "Ch3: Kinetics (Continued)",
    topic: "تكملة الكيناتيكا وحل التمارين",
    slides: "Slides 15 → End",
    status: "upcoming"
  },
  {
    week: 9,
    date: "Nov 15 - Nov 19",
    title: "Ch4: Work & Energy (Part 1)",
    topic: "مبدأ الشغل والطاقة للأجسام الجاسئة",
    slides: "Slides 1 → 16",
    status: "upcoming"
  },
  {
    week: 10,
    date: "Nov 22 - Nov 26",
    title: "Ch4: Work & Energy (Part 2)",
    topic: "تكملة الشغل والطاقة وحفظ الطاقة",
    slides: "Slides 17 → End",
    status: "upcoming"
  },
  {
    week: 11,
    date: "Nov 29 - Dec 03",
    title: "Ch5: Vibrations & Oscillations (Part 1)",
    topic: "الاهتزازات الميكانيكية",
    slides: "Slides 1 → 9",
    status: "upcoming"
  },
  {
    week: 12,
    date: "Dec 06 - Dec 10",
    title: "Ch5: Vibrations & Oscillations (Part 2)",
    topic: "تطبيقات وحل مسائل الاهتزازات",
    slides: "Slides 1 → 9",
    status: "upcoming"
  },
  {
    week: 13,
    date: "Dec 13 - Dec 17",
    title: "General Revision",
    topic: "مراجعة شاملة وحل امتحانات سابقة",
    slides: "All Chapters",
    status: "upcoming"
  },
  {
    week: 14,
    date: "Dec 20 - Dec 24",
    title: "Final Revision",
    topic: "مراجعة نهائية",
    slides: "All Chapters",
    status: "upcoming"
  },
  {
    week: 15,
    date: "Dec 27 - Dec 31",
    title: "Final Exams Period",
    topic: "الامتحانات النهائية",
    slides: "-",
    status: "upcoming",
    badge: "Finals"
  },
  {
    week: 16,
    date: "Jan 03 - Jan 07",
    title: "Final Exams Period",
    topic: "الامتحانات النهائية",
    slides: "-",
    status: "upcoming",
    badge: "Finals"
  }
];

let DYNAMICS_ROADMAP_STEPS = dynamicsRoadmap;

const MATERIALS_ROADMAP_STEPS = [
  { week: 1, date: "Sep 21", lecture: "Introduction", tut: "Tutorial", lab: null },
  { week: 2, date: "Sep 28", lecture: "Atomic Structure & Interatomic Bonding", tut: "Interatomic Bonding (Tut)", lab: null },
  { week: 3, date: "Oct 5", lecture: "Crystal Structures-1", tut: "Crystal Structures-1 (Tut)", lab: null },
  { week: 4, date: "Oct 12", lecture: "Crystal Structures-2", tut: "Crystal Structures-2 (Tut)", lab: null },
  { week: 5, date: "Oct 19", lecture: "Imperfections in Solids (Quiz + Assign)", tut: "Imperfections in Solids (Tut)", lab: null },
  { week: 6, date: "Oct 26", lecture: "Mechanical Properties-1", tut: "Mechanical Properties-1 (Tut)", lab: "Tension test (Lab)" },
  { week: 7, date: "Nov 2", lecture: "Mechanical Properties-2", tut: "Mechanical Properties-2 (Tut)", lab: "Tension test (Lab)" },
  { week: 8, date: "Nov 9", lecture: "⚡ Midterm Exam", tut: "Midterm Exam Week", lab: null, isMidterm: true },
  { week: 9, date: "Nov 16", lecture: "Diffusion", tut: "Diffusion (Tut)", lab: null },
  { week: 10, date: "Nov 23", lecture: "Strengthening Mechanisms-1", tut: "—", lab: "Compression / Hardness test (Lab)" },
  { week: 11, date: "Nov 30", lecture: "Strengthening Mechanisms-2", tut: "Strengthening (Tut)", lab: null },
  { week: 12, date: "Dec 7", lecture: "Phase Diagrams", tut: "Phase Diagrams-1 (Tut)", lab: null },
  { week: 13, date: "Dec 14", lecture: "Iron-Carbon Diagram", tut: "Phase Diagrams-2 (Tut)", lab: "Microstructure (Lab)" },
  { week: 14, date: "Dec 21", lecture: "Classification of Ferrous alloys", tut: "Revision", lab: null },
  { week: 15, date: "Dec 28", lecture: "Revision", tut: "Revision", lab: null }
];

// ==========================================================================
// SolidWorks Studio & CAD Hub Data (MDP G111)
// ==========================================================================
const SOLIDWORKS_HUB_DATA = [
  {
    id: "sheet-1",
    sheetNum: "Sheet 1",
    title: "Pulley Bracket",
    tagline: "نمذجة البارت وتجهيز الرسم الهندسي",
    badge: "Part Modeling",
    color: "#10b981",
    pdfs: [
      {
        title: "رسمة الشيت 1",
        url: "https://drive.google.com/file/d/1pjyI0ESPcPPmE-Bl9PrXxAl1HUjSTjnF/view?usp=drivesdk"
      },
      {
        title: "رسمة الشيت 2",
        url: "https://drive.google.com/file/d/1_TqAKRwWpLTeoBjRP3U_DHiYB8kYwi2i/view?usp=drivesdk"
      }
    ],
    videos: [
      {
        title: "شرح نمذجة البارت (Pulley Bracket Modeling)",
        url: "https://youtu.be/VLVvU0LWBZQ?si=gQ0OFEv1XpZl2R8c"
      },
      {
        title: "سيكشن Pulley Bracket (رسم وتجميع البارت)",
        url: "https://youtu.be/4FEoVuc008I?si=52u5KRwbj4kuBA1j"
      }
    ]
  },
  {
    id: "sheet-2",
    sheetNum: "Sheet 2",
    title: "Clamping Device",
    tagline: "رسم البارتات وتجميعة الأجزاء واللوحات",
    badge: "Assembly & Drawing",
    color: "#06b6d4",
    pdfs: [
      {
        title: "شيت وتجميعة Clamping Device",
        url: "https://drive.google.com/file/d/1ZHvG1S5z1ZU7AKcmi1Wz6jeaeXCVmU5W/view?usp=drivesdk"
      }
    ],
    videos: [
      {
        title: "الشرح الكامل (Parts + Assembly + Drawing)",
        url: "https://youtu.be/Q3Eh8XHYCrY?si=QX_ioIozTn9tT8zY"
      }
    ]
  },
  {
    id: "sheet-3",
    sheetNum: "Sheet 3",
    title: "Drafting & Exercises",
    tagline: "تمارين الرسم والمساقط والقطاعات الإضافية",
    badge: "Drafting & Practice",
    color: "#8b5cf6",
    pdfs: [
      {
        title: "ملف التمارين 1",
        url: "https://drive.google.com/file/d/182v4K8ZNm70O6eacghqa1ryqRNjtXGIc/view?usp=drivesdk"
      },
      {
        title: "ملف التمارين 2",
        url: "https://drive.google.com/file/d/14TfKKytRWbhTqUn5o1B9DZoYT2H_HBTK/view?usp=drivesdk"
      },
      {
        title: "ملف التمارين 3",
        url: "https://drive.google.com/file/d/1_9D8ZUG1poOHTjLGq6LiiqtkZ8QBqXo3/view?usp=drivesdk"
      }
    ],
    videos: []
  },
  {
    id: "sheet-4",
    sheetNum: "Sheet 4",
    title: "Screw Jack Support & Midterm Prep",
    tagline: "مشروع الـ Screw Jack ومراجعة الميدتيرم الشاملة",
    badge: "Exam & Project 🎯",
    color: "#f59e0b",
    isFeatured: true,
    pdfs: [
      {
        title: "شيت Screw Jack Support",
        url: "https://drive.google.com/file/d/18GJoC6KglfJuLENv1HIFfa0ZdhowgfXd/view?usp=drivesdk"
      }
    ],
    videos: [
      {
        title: "Part 1: Parts Modeling",
        url: "https://youtu.be/bzLBQT-f8Yw?si=Ta1sEorvzghMDnxg"
      },
      {
        title: "Part 2: Assembly",
        url: "https://youtu.be/tbj3Tm2vBL4?si=xKgtG9-Ftl2tgl6D"
      },
      {
        title: "Part 3: Drawing & Sections",
        url: "https://youtu.be/we7FtlOofTU?si=4xEVRel3c8fm7PWf"
      },
      {
        title: "⭐ نصائح وطريقة امتحان الميدتيرم",
        url: "https://youtu.be/fa5p6_O0EE4?si=dWPvqLzO9pB95F1h",
        isSpecial: true
      }
    ]
  }
];
const CAD_HUB_DATA = SOLIDWORKS_HUB_DATA;

const COURSE_CUSTOM_LINKS = {
  "EMC G101": {
    title: "⚡ روابط ومصادر د. سمير هديمة المعتمدة",
    desc: "جميع الروابط، الفورمز، درايف المحاضرات، وشيتات المتابعة المعتمدة لمادة الديناميكا (Plane Dynamics 100) لدفعة 30 ❤️",
    sheets: [
      { title: "📁 فولدر درايف دكتور سمير الرسمي للمادة", url: "https://drive.google.com/drive/folders/1n9oTRCo6iE-k-MLe4rCGgVSnjuwtG1h_" },
      { title: "📚 فولدر محاضرات الـ PDF وشيتات التمارين", url: "https://drive.google.com/drive/folders/1fbGTWzv6phQayo0PzQAxfRg7v1kyk5_Y" },
      { title: "📝 رابط تسجيل بيانات أعمال السنة (فورم الموقع الرسمي)", url: "https://sites.google.com/eng.cu.edu.eg/planedynamics100" },
      { title: "📨 فورم طلب إعادة إرسال الامتحانات (THE) بأي وقت", url: "https://docs.google.com/forms/d/1DShk2ahQ0otap45Flo6RJbmlKzP4ScgKMfFRXnBAmO8/viewform?edit_requested=true" },
      { title: "📊 شيت متابعة أعمال السنة والدرجات الرسمية", url: "https://docs.google.com/spreadsheets/d/1vku_hv5X-4PMdHoPBlQ80XnTKzqsdp6GZdKIYh2fWbo" },
      { title: "📅 جدول ومواعيد المحاضرات بالتفصيل", url: "https://docs.google.com/spreadsheets/d/1vku_hv5X-4PMdHoPBlQ80XnTKzqsdp6GZdKIYh2fWbo/edit#gid=807310814" },
      { title: "❓ شيت الأسئلة والاستفسارات الخاصة بالكورس", url: "https://docs.google.com/spreadsheets/d/1vku_hv5X-4PMdHoPBlQ80XnTKzqsdp6GZdKIYh2fWbo/edit#gid=1442330133" },
      { title: "📋 شيت الإكسيل المجمع لكل روابط الكورس", url: "https://docs.google.com/spreadsheets/d/1vku_hv5X-4PMdHoPBlQ80XnTKzqsdp6GZdKIYh2fWbo/edit#gid=534482259" }
    ],
    social: [
      { title: "👥 جروب الفيسبوك الرسمي للمادة (MECN100)", url: "https://www.facebook.com/groups/138903046461531/" }
    ],
    videos: [
      { title: "🎬 شرح محاضرات الديناميكا يوتيوب — د. سمير هديمه", url: "https://www.youtube.com/playlist?list=PLYbUaz7Vj6gQPsCYu-Tao-RDAZQ3z_vEh" },
      { title: "🎬 فيديوهات سكاشن وتمارين — م. أحمد فوزي", url: "https://youtu.be/nDf__oCzpK8?t=0" },
      { title: "🎬 شرح سكاشن وحل مسائل — م. إنجي عبد الهادي", url: "https://www.youtube.com/playlist?list=PLSRWGfn5iCH9hwKUQfbIjGAFyruE6IsCA" }
    ]
  },
  "MTH G102": {
    title: "📐 كل روابط وماتيريال الـ Linear Algebra & Integration",
    desc: "تجميعة شاملة لكل ملفات المحاضرات، الشيتات، سبورات السكشن، الماتيريال المجمع، وفيديوهات الشرح وحل الشيتات لمادة الماث (MTH G102) ❤️",
    sheetsTitle: "📚 ملفات المحاضرات والشيتات والسبورات (Linear & Integration)",
    sheets: [
      { title: "📁 درايف الدفعة الرئيسي لمادة الماث", url: "https://drive.google.com/drive/folders/1MVpos5NHkVElYILFX3dTQv4s0fFBmdzD" },
      { title: "📋 Section Boards (الـ Boards بتاعت السكشن كل أسبوع — د. سارة)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" },
      { title: "📄 مراجعة الـ Matrices من د. لوسي (مهم تتقري قبل المحاضرة)", url: "https://drive.google.com/file/d/1Vum_-i5CsaKI9UA9xAPHUNT6lPLFxiy9/view?usp=drivesdk" },
      { title: "📘 Linear Algebra Lec. 1 — Dr. Lucy PDF", url: "https://drive.google.com/drive/folders/1ddsnJx-apXNVKtCY8JuD-VzqlLGIaZfY" },
      { title: "📝 Linear Algebra Sheet 1 (Revision — مش هيتسلم)", url: "https://drive.google.com/file/d/1upmEswq82kaeBwUVaN6uaLBsSKOf0BL7/view?usp=drivesdk" },
      { title: "📘 Linear Algebra Lec. 2 — Vector Spaces & Subspaces (Dr. Lucy)", url: "https://drive.google.com/file/d/1tpwf5iFQtUYYbysdgd6nPySvu4nR_Jam/view?usp=drivesdk" },
      { title: "📝 Assignment 2 — Vector Spaces (المطلوب: 1-11، 16ii، 19-24)", url: "https://drive.google.com/file/d/14wOaVsWYTzE8OvTcqbj0PTBwjE3huVmH/view?usp=drivesdk" },
      { title: "📒 Notes د. أحمد عصام (Lecture 2 - Lecture 3)", url: "https://drive.google.com/drive/folders/146HDk9CbIz3KkN32koT77z829iJX-5Rq" },
      { title: "📒 Notes د. نبيلة (Lec. 2)", url: "https://drive.google.com/drive/folders/1K6d_p8vZ_nnDecvOx-qUVQRGSGQCD-H2" },
      { title: "📚 Lectures & Sections (لينكات محاضرات وسكاشن اللينير من أكتر من دكتور ومعيد)", url: "https://docs.google.com/document/d/1amjERn4hxxXyRtCzcF8shwyA9T3JiqE-AR5bcDqB2Bs/edit?usp=drivesdk" },
      { title: "📂 Sheets (Other Departments — شيتات أقسام تانية للينير)", url: "https://drive.google.com/drive/folders/1VoWn26amBqIVtbHLHPU7Y6smEvMtZw1u" },
      { title: "📂 Notes (Other Departments — نوتس أقسام تانية للينير)", url: "https://drive.google.com/drive/folders/1dtDpjRWhw3eykJYYhFOoqYE6lSl8PJSP" },
      { title: "📘 Integration Lec. 1 Slides — Double Integrals (Part 1)", url: "https://drive.google.com/drive/folders/1WCbR1VLo8sUZ_x58Of08lW71aq5Ht9z8" },
      { title: "📝 Integration Sheet 1 & Assignment 1", url: "https://drive.google.com/drive/folders/1z47GRFcIBjHRVF7DKk5eBq-aUIWJv3j0" },
      { title: "📘 Integration Lec. 2 Slides — Polar Regions + Applications", url: "https://drive.google.com/file/d/1IxaAIvGE0t4ysmkjteIsfPXMAZHJOBgY/view?usp=drivesdk" },
      { title: "📝 Integration Sheet 2 & Assignment 2", url: "https://drive.google.com/drive/folders/19hZKh8cS5TjO4l0RpP5lFuxBabD98xjV" },
      { title: "✅ Solved Problems By Dr. Ahmed (Double Integrals)", url: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N" },
      { title: "📘 Integration Lec. 3 Slides — Triple Integrals", url: "https://drive.google.com/file/d/1WMinLYkB2MufXbRGEIMaWb7RpO-aFcoI/view?usp=drivesdk" },
      { title: "📝 Integration Sheet 3 & Assignment 3", url: "https://drive.google.com/drive/folders/1rSzLpNFrfMowDXk_LmRi6rvEIaj50DfI" },
      { title: "✅ Solved Problems By Dr. Ahmed (Triple Integrals)", url: "https://drive.google.com/file/d/1T7Zpi2nwnzpuXCdauxkCZukg9xh5OkfX/view?usp=drivesdk" },
      { title: "📒 Integration Notes (ملخصات ونوتس التكامل)", url: "https://drive.google.com/drive/folders/1DDpbyWJji6Y1kazpLp_0GdmjcwjrMYIx" }
    ],
    social: [],
    videos: [
      { title: "🤍 فيديوهات زميلكم مهاب لشرح وحل أسئلة الـ Sheet والـ Assignment", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" },
      { title: "🎬 م. عمار ياسر — Double Integrals Part 1 (الفيديو للآخر)", url: "https://youtu.be/IfuyRoFzthk?si=a71lDUGo6x5WT_36" },
      { title: "🎬 م. عمار ياسر — تحويلات الـ coordinates (مهمة جداً من calc2)", url: "https://youtu.be/ndfc1-8hWuI?si=mTeyC2VR8GjKw6oW" },
      { title: "🎬 م. عمار ياسر — Polar regions (Double Integrals Part 2)", url: "https://youtu.be/QDhYk9H45NU?si=wno0MdzjRioiUxn5" },
      { title: "🎬 م. عمار ياسر — Double Integrals Applications", url: "https://youtu.be/j6eAM5iBsIw?si=DVE7LnWR4YTDNMpC" },
      { title: "🎬 م. عمار ياسر — Triple integrals", url: "https://youtu.be/GZdX5oC2-ao?si=Hc0YaCaPAz1J8Ck-" },
      { title: "🎬 م. عمار ياسر — Triple integrals Applications", url: "https://youtu.be/WKqhfOQqlsc?si=vEq1ZXLXlzCFrEfX" },
      { title: "🎬 م. أحمد المغربي — Double Integrals (الفيديو الأول للآخر)", url: "https://youtu.be/VlDgu4dylLU?si=KHdffO0btzRircFE" },
      { title: "🎬 م. أحمد المغربي — Double Integrals (الفيديو التاني: لـ 30:45 Lec1 ومن 30:45 Lec2 بدون mass/CG)", url: "https://youtu.be/8ANactIJ6Sk?si=6qaK7EO2R-LSh9BB" },
      { title: "🎬 م. أحمد المغربي — Triple Integrals (الـ moment of inertia في الـ applications مش معانا)", url: "https://youtu.be/PCabbIgzCFc?si=oBs-Nsh75EyEnB-f" },
      { title: "🎬 قائمة جبر خطي — د. أحمد عصام", url: "https://youtube.com/playlist?list=PLPAM-Io7zvPrGUSNKLNgSpSFhgGxiXexz&si=4jvfWlMZaTa4_vLb" },
      { title: "🎬 قائمة جبر خطي — د. سماح", url: "https://youtube.com/playlist?list=PLm0BTSPNOKJRl_MaRhKPKb46bv2RlR-bK&si=5IMdIy3hQ5bjb-NQ" }
    ]
  }
};

const COURSE_CAPSULES = {
  "GEN G119": {
    code: "GEN G119",
    name: "Marketing & Entrepreneurship",
    hours: "2 Credit Hours",
    grading: "• 40 درجة كويزات (6 كويزات بيتاخد أعلى 4)\n• 20 درجة ميدتيرم\n• 40 درجة فاينال",
    tips: "الدكتور اللي كان بيدينا د. تامر الحريري (دكتور محترم جداً وهتحبوه).\nالدكتور بيدي 6 كويزات بياخد منهم أعلى 4، والأسئلة معاك حرفياً لأنها بتيجي من الـ Test Bank بالحرف وبنفس ترتيب الاختيارات!\nالميد حوالي 60 سؤال من الـ Test Bank، والفاينال حوالي 120 سؤال نفس الكلام.\nمادة سهلة ومادة A+، محتاجة بس إنك متظلمهاش في زحمة المواد التانية ووقت مذاكرتها مش كبير خالص.",
    links: [
      { title: "📁 درايف الدفعة في مادة الماركتنج والـ References", url: "https://drive.google.com/drive/folders/1BacoA3K8UZ8Jfg_nkGlXrXNn3eQPO4h0" }
    ],
    playlists: []
  },

  "MTH G102": {
    code: "MTH G102",
    name: "Linear Algebra & Multivariable Integration",
    hours: "3 Credit Hours",
    grading: "• الميد هيبقى 30 درجة: Linear 15 & Integration 15\n• الـ Integration في الميد: كله MCQ ولغاية الـ Triple Integrals قبل الـ applications عشان متشرحتش (وفي مستوى الـ practice quiz اللي على LectraHub)\n• الـ Linear في الميد: كله مقالي أو جزء مقالي وجزء MCQ (واحتمال عدد الأسئلة متساوي يعني 5 أسئلة integration قصادها 5 Linear وهكذا)\n• أعمال السنة: د. سارة هتخلي درجات أعمال السنة على كويزين (وشيت 1 المكتوب عليه Assignment بنسبة كبيرة مش هيتسلم) + د. لوسي ممكن تدي بونص في آخر المحاضرة لما بتنادي أسماء عشوائي من الكشف وتشوف حل الـ assignment ومذاكرتك!",
    tips: "خلاصة الكلام في الماث عشان متبقاش تايه:\n1. التكامل (Integration مع د. أحمد عبد النبي): دكتور أحمد قال إن الـ integration في الميد في مستوى الـ practice quiz اللي بينزله لكل محاضرة على LectraHub (بيبقى 5 أسئلة MCQ على كل محاضرة بتحلهم وتشوف صح ولا غلط، وبعد ما بتخلص تقدر تمتحنه تاني وبيجيبلك 5 أسئلة جداد كل مرة عشان تمرن نفسك) • وزميلكم مهاب منزل فيديوهات بيشرح فيها أسئلة الشيت والـ assignment وإزاي تتحل على الدرايف (يا ريت تدعوله دعوة حلوة 🤍).\n2. الجبر الخطي (Linear Algebra مع د. لوسي ود. سارة):\n• د. لوسي في آخر المحاضرة ممكن تنادي أسماء عشوائي من كشف الأسماء وتطلب تشوف شغلهم في المادة (الـ assignment اللي بيتبعت ومذاكرتك للمادة) وقالت إنها ممكن تدي بونص على ده وأوقات ممكن تكرر الاسم في أكتر من محاضرة، فضروري تحل أول بأول!\n• محتوى الميد هو أي حاجة د. لوسي هتقولها لغاية المحاضرة اللي قبل الميد حتى لو مش متقالة في الـ Lecture Notes!\n• كل أسبوع الـ boards بتاعت السكشن بتنزل على الدرايف، ود. سارة قالت اللي عايز يحضر من اللي عليهم سكشن الخميس يقدر يحضر يوم الاتنين لغاية ما نظبط المواعيد.",
    links: [
      { title: "📁 درايف الدفعة لمادة الماث", url: "https://drive.google.com/drive/folders/1MVpos5NHkVElYILFX3dTQv4s0fFBmdzD" },
      { title: "📋 Section Boards (الـ Boards بتاعت السكشن كل أسبوع)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" },
      { title: "📄 مراجعة الـ Matrices (د. لوسي — تتقري قبل المحاضرة)", url: "https://drive.google.com/file/d/1Vum_-i5CsaKI9UA9xAPHUNT6lPLFxiy9/view?usp=drivesdk" },
      { title: "📘 Dr. Lucy PDF — Lec. 1 (Linear Algebra)", url: "https://drive.google.com/drive/folders/1ddsnJx-apXNVKtCY8JuD-VzqlLGIaZfY" },
      { title: "📝 Sheet 1 (Revision — مش هيتسلم)", url: "https://drive.google.com/file/d/1upmEswq82kaeBwUVaN6uaLBsSKOf0BL7/view?usp=drivesdk" },
      { title: "📘 Dr. Lucy PDF — Lec. 2 (Vector Spaces & Subspaces)", url: "https://drive.google.com/file/d/1tpwf5iFQtUYYbysdgd6nPySvu4nR_Jam/view?usp=drivesdk" },
      { title: "📝 Assignment 2 (المطلوب: 1-11، 16ii، 19-24 بدون Basis/Dim/Span)", url: "https://drive.google.com/file/d/14wOaVsWYTzE8OvTcqbj0PTBwjE3huVmH/view?usp=drivesdk" },
      { title: "📒 Notes د. أحمد عصام (Lecture 2 - Lecture 3)", url: "https://drive.google.com/drive/folders/146HDk9CbIz3KkN32koT77z829iJX-5Rq" },
      { title: "📒 Notes د. نبيلة (Lec. 2)", url: "https://drive.google.com/drive/folders/1K6d_p8vZ_nnDecvOx-qUVQRGSGQCD-H2" },
      { title: "📚 Lectures & Sections (ماتيريال مجمع للينير من أكتر من دكتور ومعيد)", url: "https://docs.google.com/document/d/1amjERn4hxxXyRtCzcF8shwyA9T3JiqE-AR5bcDqB2Bs/edit?usp=drivesdk" },
      { title: "📂 Sheets (Other Departments — شيتات أقسام تانية)", url: "https://drive.google.com/drive/folders/1VoWn26amBqIVtbHLHPU7Y6smEvMtZw1u" },
      { title: "📂 Notes (Other Departments — نوتس أقسام تانية)", url: "https://drive.google.com/drive/folders/1dtDpjRWhw3eykJYYhFOoqYE6lSl8PJSP" },
      { title: "🤍 فيديوهات حل الشيت والأسينمنت (زميلكم مهاب)", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" }
    ],
    playlists: [
      { title: "🎬 جبر خطي — د. أحمد عصام (الأفضل لحفظ سيستم الحل)", url: "https://youtube.com/playlist?list=PLPAM-Io7zvPrGUSNKLNgSpSFhgGxiXexz&si=4jvfWlMZaTa4_vLb" },
      { title: "🎬 جبر خطي — د. سماح (الأفضل لفهم الـ Concepts)", url: "https://youtube.com/playlist?list=PLm0BTSPNOKJRl_MaRhKPKb46bv2RlR-bK&si=5IMdIy3hQ5bjb-NQ" },
      { title: "🎬 تكامل متعدد — سكاشن م. باسم", url: "https://youtube.com/playlist?list=PLMgw9qylvawgvPycR_kCxQV69oVBL1nfE&si=FwJb50mY-rE0DW4p" },
      { title: "🎬 تكامل متعدد — قناة م. أحمد المغربي", url: "https://youtube.com/playlist?list=PLdlvqNEtwNjpdMGBxLju2472aqK09shpE&si=4FsMR5X5ZEi2fkdm" }
    ]
  },

  "MDP G111": {
    code: "MDP G111",
    name: "Computer-Aided Mechanical Drafting (SolidWorks)",
    hours: "3 Credit Hours",
    grading: "• 40 درجة Classwork (سكاشن ورسم وتكليفات أسبوعية)\n• 20 درجة ميدتيرم\n• 40 درجة فاينال",
    tips: "المادة لا تعتمد على الرسم (كدراسة) إطلاقاً، المهم تكون فاهم إن ده هو الـ thickness بتاع ده وهكذا.\nكان بيدرسها د. مصطفى رشاد ود. عصام الجداوي، مش بيدققوا في الحضور بس بيقولوا كلام مهم في المحاضرة.\nفي الميد والفاينال بيطلب منك ترسم بماتريال معينة ويطلب الوزن، فلو راسم غلط الوزن مش هيطلع.\nمع البرنامج فيه جزء نظري مهم وعليه جزء مش قليل من الدرجة (المسامير والقلاووظ والسوست والـ keys والـ bearing)، ومفيش مصادر للنظري غير المحاضرة لأن المنهج بيتغير كل سنة.",
    links: [
      { title: "📁 درايف الدفعة لمادة السوليد", url: "https://drive.google.com/drive/folders/1fgyiZxQNzmAxajlpDtk0_RvijbvnlJf-" },
      { title: "📥 ملف اختصارات وتركات السوليد المعتمد (PDF)", url: "https://drive.google.com/file/d/1L3sQoOHH1M2o57PDNMIqmAp0c1gEEOrD/view?usp=drivesdk" },
      { title: "📖 كتاب رسم طيران (جه منه أغلب رسومات الامتحانات)", url: "https://drive.google.com/file/d/1fxMIKQySXbeZibpLqv_E_FEIb6AR-Q7v/view?usp=drivesdk" },
      { title: "📖 كتاب الرسم الميكانيكي (جه منه أغلب السكاشن)", url: "https://drive.google.com/file/d/1NuP1NAaLXCJ64rz3T9lrCTgDMe-sZvrV/view?usp=drivesdk" }
    ],
    playlists: [
      { title: "🎬 كورس تعليم SolidWorks (عربي)", url: "https://youtube.com/playlist?list=PLAAyGuHqGArb8PA0rz67umpZxo62YN6LJ&si=BZ26lY7_tPsE7-ZC" },
      { title: "🎬 كورس تعليم SolidWorks (إنجليزي)", url: "https://www.youtube.com/playlist?list=PLCyNBva9d5vc" }
    ]
  },

  "MDP G121": {
    code: "MDP G121",
    name: "Materials Science",
    hours: "3 Credit Hours",
    grading: "• 10 درجات أساينمنت (2 assignments كل واحد 5 درجات)\n• 15 درجة كويزات (4 كويزات بيتاخد أعلى 3، كل كويز 5 درجات مع دروب لأقل واحد)\n• 15 درجة لابات (تقريرين كل لاب 7.5 درجة، واللاب الثالث في الآخر معليهوش درجات)\n• 20 درجة ميدتيرم\n• 40 درجة فاينال",
    tips: "توزيعة درجات الماتيريال المعتمدة (دفعة 30):\nالمعيد أكد: 10 درجات أساينمنت + 15 درجة كويزات (اتفقنا على 4 كويزات يسيب أعلى 3 ويسقط الأقل) + 15 درجة ريبورتات لابات + 20 ميد + 40 فاينال.\nبيدخل اتنين دكاترة:\n1. د. إيهاب: احضروا شرحه كويس، بيتكلم عن Atomic structure و الـ stress strain curve (بيجي عليه سؤال في الميد)، والشيت كافي جداً.\n2. د. ممدوح: الـ Phase diagrams والـ Eutectic system.\n⚠️ تنبيه هام: جزء الـ Crystal Structure في المحاضرة 3 مهم للغاية وعليه كويز وأساينمنت.",
    links: [
      { title: "⚡ مصادر وخطة كويز 1 الرسمي (Crystal Structure - 5 درجات)", url: "https://drive.google.com/file/d/1Y5_Qf5AIDxCfrk-3xMhINI9qyEO-IDTc/view?usp=drivesdk" },
      { title: "📝 كويز ماتيريل السنة اللي فاتت 2025/2026 + الحلول", url: "https://drive.google.com/drive/folders/1-yeXybwOFT1tQPo8-oVQXAfYAlcpnprr" },
      { title: "📂 أسينمنت ماتيريل السنة اللي فاتت 2025/2026 + الحلول", url: "https://drive.google.com/drive/folders/1qmlZ4WhUtwsi6PkgXexuX_5jPVpy0UkP" },
      { title: "⚡ آلة حاسبة تفاعلية: رسم واستنتاج Miller Indices [uvw] & (hkl)", url: "crystal-tool.html", badge: "Interactive Tool 🛠️" },
      { title: "📁 درايف الدفعة لمادة الماتيريال والريبورتات", url: "https://drive.google.com/drive/folders/1dcN5VGCVifVn72FodQQ2d4xLeevAE5JO" }
    ],
    playlists: [
      { title: "🎬 م. هدى — سكاشن وشرح الماتيريال", url: "https://youtube.com/playlist?list=PLI7VNGlXyvOHtx_bD5d_unASYKDluSkZ9&si=gsd9-clXjTjro0vD" },
      { title: "🎬 م. باسل نصر — شرح علم المواد (Materials Science)", url: "https://youtube.com/playlist?list=PLG0Nc6SlnERcoCce2MwxncKIVo0VpiJIe&si=VF1ah5xcD2-a0jZv" }
    ]
  },

  "EPE G113": {
    code: "EPE G113",
    name: "Electrical & Electronics Engineering (EPE I)",
    hours: "3 Credit Hours",
    grading: "• 50 درجة فاينال\n• 20 درجة ميدتيرم\n• 30 درجة أعمال سنة (Classwork)",
    tips: "المادة عبارة عن Circuits & Electronics Fundamentals، الدنيا فيها مش صعبة وأسهل عن المعروف عن الـ Circuits لأن التركيز فيها على الـ Basics.\n- الـ Classwork: كويز وأساينمنت ومسائل المرجع.\n- الميدتيرم: جه 4 أسئلة وكانوا كويسين مش صعبين.\n- الفاينال: جه 4 أسئلة كل سؤال نقطتين (a, b) يعني 8 أسئلة، نص الامتحان تقريباً Circuits والباقي Electronics.",
    links: [
      { title: "📁 درايف الدفعة لمادة الهندسة الكهربية (EPE I)", url: "https://drive.google.com/drive/folders/1pk7PS5s3qRAOu6YTNvZoOaBziQoBhtVz?usp=drive_link" },
      { title: "🔥 1. الشيت الأهم (شيت 3 درايف / 4 معيد — Nodal & Mesh)", url: "https://drive.google.com/drive/folders/1pj7mKzRcy2QrC__ZFXAxjSmxQHK51Iii" },
      { title: "✨ 2. ملخص أهم التركات والأفكار للشيت الأخير", url: "https://drive.google.com/file/d/1k7DsSMELdv1FK6vDfaKlP3ijnM5Zly7k/view?usp=drivesdk" },
      { title: "📚 3. أسئلة المرجع (ركز على الأسئلة من 6 لـ 9)", url: "https://drive.google.com/drive/folders/1Bv95fwz7Uw0DpBGCGslyl5UCjZvpXxq_" },
      { title: "📝 4. كويزات وميدات سابقة من قسم كهرباء (نفس المحتوى)", url: "https://drive.google.com/drive/folders/1fouTNz6FgVSRZiIz61iDARn_pIRdVxW_" }
    ],
    playlists: [
      { title: "🎬 م. طارق البغدادي (شرح كورس الدوائر والكهربية)", url: "https://www.youtube.com/playlist?list=PLJHkuo98VFGZPKHD2m1HccJgekI505sSE" },
      { title: "🎬 م. محمد ماهر (شرح الكهربية والإلكترونيات)", url: "https://www.youtube.com/playlist?list=PLm877Wx3hfJ37R7tf8KaLhYXBrKtCLjzy" }
    ]
  },

  "EMC G101": {
    code: "EMC G101",
    name: "Dynamics of Rigid Bodies",
    hours: "3 Credit Hours",
    grading: "• 40 درجة فاينال\n• 20 درجة ميدتيرم\n• 30 درجة كويزين (أعلى كويز 20 والتاني 10)\n• 10 درجات Take Home Exam (THE)",
    tips: "دكتور سمير أبو هديمة متعاون جداً وبيحب الحضور وأي سؤال في المحاضرة عليه بونص.\nالـ Take Home Exam بيبقوا 9 امتحانات، بيتسلم كل جمعة واحد، لو اتأخرت بتاخد ماينص ولو سلمت بدري بتاخد بونص.",
    links: [
      { title: "📁 درايف الدفعة لمادة الديناميكا الشامل", url: "https://drive.google.com/drive/folders/1bjTVuMUlmMKDoSShmYnRBju3HtglV6zT" }
    ],
    playlists: [
      { title: "🎬 سكاشن م. أحمد فوزي", url: "https://youtube.com/playlist?list=PLO2pEkARUG7gJgjD7oF0u6nv_dhE-y36I&si=2Rf_nz5QBlo_5ZgP" },
      { title: "🎬 سكاشن م. إنجي عبد الهادي", url: "https://www.youtube.com/playlist?list=PLSRWGfn5iCH9hwKUQfbIjGAFyruE6IsCA&si=pzp_Hxt5UixgwWMq" }
    ]
  }
};

const DRIVE_DATA = {
  "MTH G102": { folder: "https://drive.google.com/drive/folders/1MVpos5NHkVElYILFX3dTQv4s0fFBmdzD", lectures: "https://drive.google.com/drive/folders/1ddsnJx-apXNVKtCY8JuD-VzqlLGIaZfY", sheets: "https://drive.google.com/file/d/14wOaVsWYTzE8OvTcqbj0PTBwjE3huVmH/view?usp=drivesdk", exams: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" },
  "EMC G101": { folder: "https://drive.google.com/drive/folders/1bjTVuMUlmMKDoSShmYnRBju3HtglV6zT", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE },
  "MDP G111": { folder: "https://drive.google.com/drive/folders/1fgyiZxQNzmAxajlpDtk0_RvijbvnlJf-", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE },
  "MDP G121": { folder: "https://drive.google.com/drive/folders/1dcN5VGCVifVn72FodQQ2d4xLeevAE5JO", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE },
  "EPE G113": { folder: "https://drive.google.com/drive/folders/1pk7PS5s3qRAOu6YTNvZoOaBziQoBhtVz?usp=drive_link", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE },
  "GEN G119": { folder: "https://drive.google.com/drive/folders/1BacoA3K8UZ8Jfg_nkGlXrXNn3eQPO4h0", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE }
};

let BUILDING_MAP_URLS = {
  3:  "https://maps.google.com/?q=30.0271,31.2091",
  7:  "https://maps.google.com/?q=30.0267,31.2078",
  9:  "https://maps.google.com/?q=30.0260,31.2082",
  14: "https://maps.google.com/?q=30.0264,31.2069",
  15: "https://maps.google.com/?q=30.0261,31.2056",
  16: "https://maps.google.com/?q=30.0252,31.2079",
  17: "https://maps.google.com/?q=30.0245,31.2085",
  19: "https://maps.google.com/?q=30.0243,31.2072"
};

const ROOM_INFO = {
  "3002": { bldg: 3, floor: "Ground Floor", hall: "مدرج 3002", name: "Building 3 (Architecture & Computer Eng.)" },
  "مدرج 3002": { bldg: 3, floor: "Ground Floor", hall: "مدرج 3002", name: "Building 3 (Architecture & Computer Eng.)" },
  "3103-414": { bldg: 3, floor: "1st Floor", hall: "Hall 3 (Capacity: 414)", name: "Building 3 (Architecture & Computer Eng.)" },
  "3101-306": { bldg: 3, floor: "1st Floor", hall: "Hall 1 (Capacity: 306)", name: "Building 3 (Architecture & Computer Eng.)" },
  "3102-306": { bldg: 3, floor: "1st Floor", hall: "Hall 2", name: "Building 3 (Architecture & Computer Eng.)" },
  "7104-360": { bldg: 7, floor: "1st Floor", hall: "Hall 4 (Capacity: 360)", name: "Building 7 (El-Sawy Hall Complex)" },
  "1204-(360)": { bldg: 1, floor: "2nd Floor", hall: "Hall 1204 (Preparatory)", name: "Preparatory Building" },
  "14401":    { bldg: 14, floor: "4th Floor", hall: "Hall 14401 (Drawing)", name: "Building 14 (Mechanical Design)" },
  "14100-(104)": { bldg: 14, floor: "1st Floor", hall: "Hall 100", name: "Building 14 (New Mechanical Design)" },
  "14201-50": { bldg: 14, floor: "2nd Floor", hall: "Room 1", name: "Building 14 (New Mechanical Design)" },
  "14301-50": { bldg: 14, floor: "3rd Floor", hall: "Room 1", name: "Building 14 (New Mechanical Design)" },
  "14301 (Faculty Hall)": { bldg: 14, floor: "3rd Floor", hall: "Hall 14301 (Faculty Hall)", name: "Building 14 (New Mechanical Design)" },
  "14301":    { bldg: 14, floor: "3rd Floor", hall: "Hall 14301 (Faculty Hall)", name: "Building 14 (New Mechanical Design)" },
  "Faculty Hall": { bldg: 14, floor: "3rd Floor", hall: "Hall 14301 (Faculty Hall)", name: "Building 14 (New Mechanical Design)" },
  "14302-50": { bldg: 14, floor: "3rd Floor", hall: "Room 2", name: "Building 14 (New Mechanical Design)" },
  "16211":    { bldg: 16, floor: "2nd Floor", hall: "Room 211", name: "Building 16 (Dynamics)" },
  "9201":     { bldg: 9,  floor: "2nd Floor", hall: "Room 201", name: "Building 9 (Dynamics)" },
  "17400-56": { bldg: 17, floor: "4th Floor", hall: "Room 56", name: "Building 17 (Mechanical Power)" },
  "17301-56": { bldg: 17, floor: "3rd Floor", hall: "Room 1", name: "Building 17 (Mechanical Power)" },
  "17302-148": { bldg: 17, floor: "3rd Floor", hall: "Hall 2", name: "Building 17 (Mechanical Power)" },
  "17200-56": { bldg: 17, floor: "2nd Floor", hall: "Room 56", name: "Building 17 (Mechanical Power)" },
  "17202-148": { bldg: 17, floor: "2nd Floor", hall: "Hall 2", name: "Building 17 (Mechanical Power)" },
  "19208-80":  { bldg: 19, floor: "2nd Floor", hall: "Room 208", name: "Building 19 (Automotive)" }
};

const DAYS = [
  { full: "Sunday", short: "Sun", dayIdx: 0 },
  { full: "Monday", short: "Mon", dayIdx: 1 },
  { full: "Tuesday", short: "Tue", dayIdx: 2 },
  { full: "Wednesday", short: "Wed", dayIdx: 3 },
  { full: "Thursday", short: "Thu", dayIdx: 4 }
];

const SLOTS = ["8:00 - 8:50","9:00 - 9:50","10:00 - 10:50","11:00 - 11:50","12:00 - 12:50","1:00 - 1:50","2:00 - 2:50","3:00 - 3:50","4:00 - 4:50"];
const TIMELINE_HOURS = ["8:00", "9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00"];
const TIME_STARTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const TIME_ENDS   = ["08:50", "09:50", "10:50", "11:50", "12:50", "13:50", "14:50", "15:50", "16:50"];

// جدول الحصص المعتمد
const SESSIONS = [
  // Sunday
  { day: "Sunday", start: 0, span: 2, group: "ALL", code: "GEN G119", type: "Lecture", room: "3103-414" },
  { day: "Sunday", start: 2, span: 3, group: "ME1-01", code: "MDP G111", type: "Tutorial / Lab", room: "14401", attendance: true },
  { day: "Sunday", start: 2, span: 3, group: "ME1-02", code: "MDP G111", type: "Tutorial / Lab", room: "14401", attendance: true },
  { day: "Sunday", start: 5, span: 3, group: "ME1-03", code: "MDP G111", type: "Tutorial / Lab", room: "14401", attendance: true },
  { day: "Sunday", start: 5, span: 3, group: "ME1-04", code: "MDP G111", type: "Tutorial / Lab", room: "14401", attendance: true },

  // Monday
  { day: "Monday", start: 0, span: 2, group: "ALL", code: "MDP G121", type: "Lecture", room: "3101-306" },
  { day: "Monday", start: 2, span: 2, group: "ME1-02", code: "MTH G102", type: "Tutorial", room: "14100-(104)", attendance: false, note: "📋 الـ Boards بتاعت السكشن بتنزل كل أسبوع على الدرايف • ود. سارة هتخلي درجات أعمال السنة على كويزين" },
  { day: "Monday", start: 5, span: 2, group: "ME1-03", code: "MTH G102", type: "Tutorial", room: "17302-148", attendance: false, note: "📋 الـ Boards بتاعت السكشن بتنزل كل أسبوع على الدرايف • ود. سارة هتخلي درجات أعمال السنة على كويزين" },

  // Tuesday
  {
    day: "Tuesday",
    start: 0,
    span: 2,
    group: "ALL",
    code: "MTH G102",
    type: "Lecture",
    room: "7104-360",
    attendance: true,
    hasNotice: true,
    noticeData: {
      title: "📐 تنبيهات د. لوسي ود. أحمد والميدتيرم (MTH G102)",
      slots: "الثلاثاء 8:00 ص — مدرج 7104-360 (الساوي)",
      requirements: "• 🚨 ملحوظة مهمة جداً: د. لوسي في آخر المحاضرة ممكن تنادي أسماء عشوائي من كشف الأسماء وتطلب تشوف شغلهم في المادة (الـ assignment اللي بيتبعت ومذاكرتك للمادة) وقالت إنها ممكن تدي بونص على ده وأوقات ممكن تكرر الاسم في أكتر من محاضرة! فضروري الناس تحل.\n• 📝 Assignment 2 (Vector Spaces): علينا فيه الأسئلة من 1 لـ 11، سؤال 16(ii)، ومن 19 لـ 24 (أي سؤال متعلق بـ Basis أو Dimension أو Span لسه مخدناهوش).\n• 🎯 بالنسبة للميد (30 درجة = Linear 15 & Integration 15): الـ Integration كله MCQ لغاية الـ Triple Integrals قبل الـ applications وفي مستوى الـ practice quiz على LectraHub (5 أسئلة MCQ بتتجدد كل مرة) • والـ Linear مقالي أو جزء مقالي وجزء MCQ وشامل أي حاجة د. لوسي هتقولها لغاية المحاضرة اللي قبل الميد حتى لو مش متقالة في الـ Lecture Notes!",
      taskId: "mth-assign-1",
      links: [
        { icon: "📘", label: "Dr. Lucy Lec. 2 PDF (Vector Spaces)", url: "https://drive.google.com/file/d/1tpwf5iFQtUYYbysdgd6nPySvu4nR_Jam/view?usp=drivesdk" },
        { icon: "📝", label: "Assignment 2 (1-11, 16ii, 19-24)", url: "https://drive.google.com/file/d/14wOaVsWYTzE8OvTcqbj0PTBwjE3huVmH/view?usp=drivesdk" },
        { icon: "📋", label: "Section Boards (سبورات السكشن كل أسبوع)", url: "https://drive.google.com/drive/folders/1lh2x9is9hqA1ZKzIUQn87ip3DCOc4xvd" },
        { icon: "📚", label: "ماتيريال مجمع للينير (Doc)", url: "https://docs.google.com/document/d/1amjERn4hxxXyRtCzcF8shwyA9T3JiqE-AR5bcDqB2Bs/edit?usp=drivesdk" },
        { icon: "🤍", label: "فيديوهات حل الشيت والأسينمنت (مهاب)", url: "https://drive.google.com/drive/folders/1ANvdKm4sinMPUX3E19Z7rmMD4M_j4d8m" }
      ]
    },
    note: "🚨 د. لوسي في آخر المحاضرة ممكن تنادي أسماء عشوائي من الكشف وتشوف حل الـ assignment ومذاكرتك وتدي بونص • ومحتوى الميد شامل أي حاجة بتقولها في المحاضرة حتى لو مش في الـ Notes!"
  },
  { day: "Tuesday", start: 2, span: 2, group: "ALL", code: "EPE G113", type: "Lecture", room: "7104-360" },
  // سكشن الماتيريال: سكشن 1 و 3 مدمجين في الساوي 7104
  { day: "Tuesday", start: 4, span: 3, group: "ME1-01", code: "MDP G121", type: "Tutorial", room: "7104-360" },
  { day: "Tuesday", start: 4, span: 3, group: "ME1-03", code: "MDP G121", type: "Tutorial", room: "7104-360" },

  // Wednesday
  { day: "Wednesday", start: 0, span: 2, group: "ALL", code: "MDP G111", type: "Lecture", room: "7104-360" },
  // سكشن الماتيريال: سكشن 2 و 4 مدمجين في 3102
  { day: "Wednesday", start: 2, span: 3, group: "ME1-02", code: "MDP G121", type: "Tutorial", room: "3102-306" },
  { day: "Wednesday", start: 2, span: 3, group: "ME1-04", code: "MDP G121", type: "Tutorial", room: "3102-306" },
  {
    day: "Wednesday",
    start: 6,
    span: 2,
    group: "ALL",
    code: "EMC G101",
    type: "Lecture",
    room: "7104-360",
    quizBadge: "⚡ كويز 1",
    quizTaskId: "emc-quiz-1",
    hasNotice: true,
    noticeData: {
      title: "⚡ كويز 1 ديناميكا (EMC G101 — MOI & Plane Kinematics)",
      slots: "الأربعاء 28 أكتوبر 2026 — مدرج 7104-360 (ميعاد المحاضرة 2:00 م)",
      requirements: "• المحتوى المقرر: Chapter 1 (CG & MOI) + Chapter 2 (Plane Kinematics of Rigid Bodies) كامل.\n• ذاكر السلايدات وحل شيت 1 وشيت 2 مع الحل النموذجي.\n• راجع فيديوهات الـ Velocity / Acceleration Relation والـ Rolling والـ IC.",
      taskId: "emc-quiz-1",
      links: [
        { icon: "📘", label: "سلايدات Chapter 2 (Kinematics)", url: "https://drive.google.com/file/d/1raAP-bxC_Z8xD0bTM2kAL0LCd9p2CzvB/view?usp=drivesdk" },
        { icon: "📝", label: "شيت 2 (Kinematics)", url: "https://drive.google.com/file/d/1J0UdPRuvF4PgX-rLrunlO9UbOhmtY7Fq/view?usp=drivesdk" },
        { icon: "✅", label: "الحل النموذجي لشيت 2", url: "https://drive.google.com/file/d/1GfpDWDYV4baCYyvacoUA3GbmPHdx-eBw/view?usp=drivesdk" },
        { icon: "📁", label: "شيت 1 (CG & MOI) + الحلول", url: "https://drive.google.com/drive/folders/1TBDzw8XTrf6iuYgT_73Ybhus1JbJa1pg" }
      ]
    },
    note: "⚡ كويز 1 ديناميكا: الأربعاء 28 أكتوبر بمدرج 7104 — Chapter 1 (MOI) + Chapter 2 (Plane Kinematics)."
  },

  // Thursday
  { day: "Thursday", start: 1, span: 2, group: "ME1-01", code: "MTH G102", type: "Tutorial", room: "14301-50", attendance: false, note: "📋 د. سارة قالت اللي عايز يحضر من اللي عليهم سكشن الخميس يقدر يحضر يوم الاتنين لغاية ما نظبط المواعيد • والـ Boards بتنزل كل أسبوع على الدرايف" },
  { day: "Thursday", start: 3, span: 2, group: "ME1-04", code: "MTH G102", type: "Tutorial", room: "14301-50", attendance: false, note: "📋 د. سارة قالت اللي عايز يحضر من اللي عليهم سكشن الخميس يقدر يحضر يوم الاتنين لغاية ما نظبط المواعيد • والـ Boards بتنزل كل أسبوع على الدرايف" },
  
  // سكاشن الكهربية (الخميس) - قاعة 14301 (Faculty Hall)
  { day: "Thursday", start: 4, span: 2, group: "ME1-01", code: "EPE G113", type: "Tutorial", room: "14301", attendance: false },
  { day: "Thursday", start: 4, span: 2, group: "ME1-02", code: "EPE G113", type: "Tutorial", room: "14301", attendance: false },
  { day: "Thursday", start: 6, span: 2, group: "ME1-03", code: "EPE G113", type: "Tutorial", room: "14301", attendance: false },
  { day: "Thursday", start: 6, span: 2, group: "ME1-04", code: "EPE G113", type: "Tutorial", room: "14301", attendance: false }
];

// سكشن الديناميكا التبادلي (الاثنين)
const MONDAY_DYNAMICS_SLOTS = {
  "1": { day: "Monday", start: 0, span: 3, group: "SEC", isDynSec: true, code: "EMC G101", type: "Tutorial (Slot 1)", room: "16211" },
  "2": { day: "Monday", start: 3, span: 3, group: "SEC", isDynSec: true, code: "EMC G101", type: "Tutorial (Slot 2)", room: "9201" }
};

// الإشعارات الرسمية والتنبيهات المعتمدة
const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-mth-guide-update",
    date: "30 Oct 2026",
    tag: "MTH G102 • Linear & Integration",
    title: "📐 تحديث شامل لماتيريال الماث (الـ Linear Algebra والـ Integration) ونظام الميد",
    body: "• نزل جايد الأسابيع كامل من Week 1 لـ Week 5 (Double & Triple Integrals + Linear Algebra Lec 1 & 2).\n• د. لوسي في آخر المحاضرة ممكن تنادي أسماء عشوائي وتشوف حل الـ assignment ومذاكرتك وتدي بونص!\n• الميد من 30 درجة (15 Integration كله MCQ لغاية الـ Triple قبل الـ applications في مستوى الـ practice quiz على LectraHub + 15 Linear شامل كل حاجة د. لوسي بتقولها في المحاضرة).",
    actions: [
      { label: "📖 جايد الأسابيع", action: "openGuideWeek('Week 5', 'MTH G102')" },
      { label: "🔗 كل لينكات الماث", action: "openCourseLinksModal('MTH G102')" }
    ]
  },
  {
    id: "notif-emc-quiz-1",
    date: "28 Oct 2026",
    tag: "EMC G101 • Quiz 1",
    title: "⚡ كويز 1 ديناميكا — الأربعاء 28 أكتوبر",
    body: "📍 مدرج 7104-360 • الأربعاء 28 أكتوبر 2026 (ميعاد المحاضرة 2:00 م)\nالمحتوى المقرر: Chapter 1 (CG & MOI) + Chapter 2 (Plane Kinematics of Rigid Bodies).",
    actions: [
      { label: "🎯 تفاصيل الكويز", action: "openOfficialExamModal('emc-quiz-1')" },
      { label: "📚 دليل المذاكرة", action: "openQuizPrepGuide('emc-quiz-1')" }
    ]
  },
  {
    id: "notif-epe-assign-2",
    date: "22 Oct 2026",
    tag: "EPE G113 • Assignment 2 (منتهي)",
    title: "🚨 تسليم Assignment 2 (EPE G113) — [منتهي / Expired]",
    body: "📍 انتهت فترة التسليم الرسمي لـ Assignment 2 بنهاية يوم الخميس 22 أكتوبر 2026.\nالملف والحل النموذجي متاحان على الدرايف للرجوع إليهما.",
    actions: [
      { label: "📄 فتح ملف الأسينمنت", action: "window.open('https://drive.google.com/file/d/1sk39paE42hm7TO-I1t6XfnKKt4Bw50gl/view?usp=drivesdk', '_blank')" },
      { label: "✅ فتح الحل النموذجي", action: "window.open('https://drive.google.com/file/d/1Fb-jlC3OuiCCUsUGG6oqd5cxZMuT_m1_/view?usp=drivesdk', '_blank')" }
    ]
  },
  {
    id: "notif-mdp-quiz-1",
    date: "20 Oct 2026",
    tag: "MDP G121 • Quiz 1 (منتهي)",
    title: "⚡ Quiz 1 — Crystal Structure — [منتهي / Expired]",
    body: "📍 تم الانتهاء من كويز 1 ماتيريل يوم الثلاثاء 20 أكتوبر 2026 بمدرج 7104. سلايدات السكشن وحلول امتحانات السنة السابقة متاحة للأرشيف.",
    actions: [
      { label: "📘 Tutorial Slides", action: "window.open('https://drive.google.com/file/d/1Y5_Qf5AIDxCfrk-3xMhINI9qyEO-IDTc/view?usp=drivesdk', '_blank')" },
      { label: "📝 Quiz 25/26 + الحل", action: "window.open('https://drive.google.com/drive/folders/1-yeXybwOFT1tQPo8-oVQXAfYAlcpnprr', '_blank')" },
      { label: "📂 Assignment 25/26", action: "window.open('https://drive.google.com/drive/folders/1qmlZ4WhUtwsi6PkgXexuX_5jPVpy0UkP', '_blank')" }
    ]
  },
  {
    id: "notif-epe-quiz-1",
    date: "27 Oct 2026",
    tag: "EPE G113 • Quiz 1 (منتهي)",
    title: "⚡ كويز 1 كهربية (Circuit Analysis) — [منتهي / Expired]",
    body: "📍 تم الانتهاء من كويز 1 كهربية يوم الثلاثاء 27 أكتوبر 2026. مصادر المذاكرة (شيت الطرق، ملخص التركات، أسئلة المرجع، والكويزات السابقة) متاحة في دليل الكويز وجايد الأسبوع السادس.",
    actions: [
      { label: "📚 دليل الكويز والمصادر", action: "openQuizPrepGuide('epe-quiz-1')" },
      { label: "📖 جايد الأسبوع السادس", action: "openGuideWeek('Week 6', 'EPE G113')" }
    ]
  },
  {
    id: "notif-gen-quiz-2",
    date: "25 Oct 2026",
    tag: "GEN G119 • Quiz 2 (منتهي)",
    title: "Marketing Quiz 2 (Chapter 2) — [منتهي / Expired]",
    body: "📍 تم الانتهاء من كويز 2 ماركتنج يوم الأحد 25 أكتوبر. بنك الأسئلة والمحاكي التفاعلي لسه متاحين للمراجعة قبل الميد.",
    actions: [
      { label: "🎮 محاكي كويز 2", action: "openMarketingQuiz2Modal()" }
    ]
  },
  {
    id: "ann-the-1",
    date: "5 Oct 2026",
    tag: "EMC G101",
    title: "Take-Home Exam 1 — Model P200",
    body: "امتحان الـ Take-Home الأول في الديناميكا متاح الآن، موعد التسليم الجمعة 9 أكتوبر الساعة 7:00 مساءً مع بونص 10% للتسليم المبكر."
  },
  { 
    id: "ann-01", 
    date: "8 Sep 2026", 
    tag: "Batch 30", 
    title: "Welcome to Mechanical Engineering (Batch 30)", 
    body: "Fall Semester timetable is active. Lectures commence Saturday, 19 September 2026." 
  }
];




// ==========================================================================
// Marketing (GEN G119) — Chapter 2 Test Bank Master Data (Complete 125 Questions)
// ==========================================================================
const marketingQuiz2Questions = [
  {
    "id": 1,
    "type": "mcq",
    "question": "Which of the following involves adapting a firm to take advantage of opportunities in its constantly changing environment?",
    "options": [
      "long-range planning",
      "short-range planning",
      "media planning",
      "strategic planning",
      "annual planning"
    ],
    "answer": 3,
    "pageRef": 38
  },
  {
    "id": 2,
    "type": "mcq",
    "question": "When a firm develops and maintains a strategic fit between its goals and capabilities, it is performing ________.",
    "options": [
      "mission planning",
      "values planning",
      "strategic planning",
      "business-portfolio planning",
      "operations planning"
    ],
    "answer": 2,
    "pageRef": 38
  },
  {
    "id": 3,
    "type": "mcq",
    "question": "Which of the following is the first step in strategic planning?",
    "options": [
      "set objectives and goals",
      "develop the business portfolio",
      "define the company mission",
      "plan marketing strategies",
      "identify threats and weaknesses"
    ],
    "answer": 2,
    "pageRef": 39
  },
  {
    "id": 4,
    "type": "mcq",
    "question": "Which of the following is NOT a step in the strategic planning process?",
    "options": [
      "defining the company mission",
      "setting company objectives and goals",
      "designing the business portfolio",
      "planning marketing and other functional strategies",
      "evaluating all members of the value chain"
    ],
    "answer": 4,
    "pageRef": 39
  },
  {
    "id": 5,
    "type": "mcq",
    "question": "Which of the following provides an answer to these questions: What is our business? Who are our customers? What do our customers value? What should our business be?",
    "options": [
      "objectives and goals",
      "a mission statement",
      "a business portfolio",
      "marketing and functional strategies",
      "operational strategies"
    ],
    "answer": 1,
    "pageRef": 39
  },
  {
    "id": 6,
    "type": "mcq",
    "question": "________ should be market oriented and defined in terms of ________.",
    "options": [
      "Annual plans; product needs",
      "Strategic plans; company needs",
      "Long-range plans; company needs",
      "Mission statements; customers' needs",
      "Objectives; competitors' threats"
    ],
    "answer": 3,
    "pageRef": 39
  },
  {
    "id": 7,
    "type": "mcq",
    "question": "All of the following are accurate guidelines for a company's mission statement EXCEPT which one?",
    "options": [
      "A mission statement should be realistic.",
      "A mission statement should be narrow.",
      "A mission statement should emphasize the company's strengths in the marketplace.",
      "A mission statement should be specific.",
      "A mission statement should motivate employees."
    ],
    "answer": 1,
    "pageRef": 39
  },
  {
    "id": 8,
    "type": "mcq",
    "question": "A company's mission statement serves as a statement of ________.",
    "options": [
      "fact",
      "values",
      "purpose",
      "financial goals",
      "employee commitment"
    ],
    "answer": 2,
    "pageRef": 39
  },
  {
    "id": 9,
    "type": "mcq",
    "question": "Which of the following is NOT a market-oriented business definition?",
    "options": [
      "\"to make the Internet buying experience fast, easy, and enjoyable\"",
      "\"to sell tools and home repair and improvement items\"",
      "\"to deliver low prices every day\"",
      "\"to be the guardian of our customers' financial dreams\"",
      "\"to bring aspiration and innovation to every athlete in the world\""
    ],
    "answer": 1,
    "pageRef": 40
  },
  {
    "id": 10,
    "type": "mcq",
    "question": "All of the following are examples of product-oriented mission statements, EXCEPT which one?",
    "options": [
      "\"We provide online services.\"",
      "\"We run theme parks.\"",
      "\"We sell shoes.\"",
      "\"We sell lifestyle and self-expression; success and status; memories, hopes, and dreams.\"",
      "\"We rent hotel rooms.\""
    ],
    "answer": 3,
    "pageRef": 40
  },
  {
    "id": 11,
    "type": "mcq",
    "question": "Which of the following is the principle objective of a market-oriented mission statement?",
    "options": [
      "to satisfy basic customer needs",
      "to satisfy basic supplier needs",
      "to satisfy basic stockholder needs",
      "to satisfy basic owner needs",
      "to satisfy basic partnership needs"
    ],
    "answer": 0,
    "pageRef": 39
  },
  {
    "id": 12,
    "type": "mcq",
    "question": "Revlon has clearly defined its \"mission\" of selling lifestyle and self-expression. In order for the firm to launch its strategic plan, the mission needs to next be turned into detailed ________ that guide each level of the company.",
    "options": [
      "sets of strategies",
      "sets of tactics",
      "product mixes",
      "supporting objectives",
      "sets of promotional tools"
    ],
    "answer": 3,
    "pageRef": 40
  },
  {
    "id": 13,
    "type": "mcq",
    "question": "The collection of businesses and products that make up a company is called its ________.",
    "options": [
      "strategic business unit",
      "mission statement",
      "strategic plan",
      "business portfolio",
      "operational factor"
    ],
    "answer": 3,
    "pageRef": 41
  },
  {
    "id": 14,
    "type": "mcq",
    "question": "Which of the following can be a company division, a product line within a division, or sometimes a single product or brand?",
    "options": [
      "a market",
      "the BCG",
      "an SBU",
      "a PLC",
      "a value delivery network"
    ],
    "answer": 2,
    "pageRef": 41
  },
  {
    "id": 15,
    "type": "mcq",
    "question": "After management has identified the key businesses making up its company, what is the next step in portfolio analysis?",
    "options": [
      "identifying businesses in which to invest",
      "assessing the attractiveness of its SBUs",
      "deciding whether to harvest any businesses",
      "completing short-range planning",
      "identifying SBUs"
    ],
    "answer": 1,
    "pageRef": 41
  },
  {
    "id": 16,
    "type": "mcq",
    "question": "The best known product portfolio planning method was developed by ________.",
    "options": [
      "the Boston Consulting Group",
      "Philip Kotler",
      "Harvard University",
      "the SRI Consulting Firm",
      "James P. Hess"
    ],
    "answer": 0,
    "pageRef": 41
  },
  {
    "id": 17,
    "type": "mcq",
    "question": "Most portfolio analysis methods evaluate SBUs on two dimensions, namely ________ and ________.",
    "options": [
      "market share; strength of the SBU's position",
      "market diversification; relative market share",
      "market or industry attractiveness; strength of the SBU's position",
      "market growth rates; profits",
      "market penetration; market development"
    ],
    "answer": 2,
    "pageRef": 41
  },
  {
    "id": 18,
    "type": "mcq",
    "question": "In the Boston Consulting Group approach, ________ provides a measure of market attractiveness.",
    "options": [
      "relative market share",
      "market development",
      "market penetration",
      "market growth rate",
      "market segmentation"
    ],
    "answer": 3,
    "pageRef": 41
  },
  {
    "id": 19,
    "type": "mcq",
    "question": "In the Boston Consulting Group approach, ________ serves as a measure of company strength in the market.",
    "options": [
      "relative market share",
      "market development",
      "market diversification",
      "market growth rate",
      "market segmentation"
    ],
    "answer": 0,
    "pageRef": 41
  },
  {
    "id": 20,
    "type": "mcq",
    "question": "The BCG growth-share matrix classifies four types off SBUs. They are ________ , ________ , ________ , and ________.",
    "options": [
      "product; price; promotion; placement",
      "sales; market share; price; promotion",
      "stars; cash cows; question marks; dogs",
      "planning; implementing; leading; controlling",
      "market penetration; market development; product development; diversification"
    ],
    "answer": 2,
    "pageRef": 42
  },
  {
    "id": 21,
    "type": "mcq",
    "question": "In the BCG approach, ________ are high-share, high-growth businesses or products. They need heavy investment to finance rapid growth. When their growth slows down, they turn into ________.",
    "options": [
      "cash cows; stars",
      "question marks; dogs",
      "stars; question marks",
      "stars; cash cows",
      "dogs; cash cows"
    ],
    "answer": 3,
    "pageRef": 41
  },
  {
    "id": 22,
    "type": "mcq",
    "question": "________ are low-growth, high share businesses or products. They generate a lot of cash that the firm uses to pay its bills and support other SBUs that need investment.",
    "options": [
      "Stars",
      "Cash cows",
      "Question marks",
      "Dogs",
      "Cats"
    ],
    "answer": 1,
    "pageRef": 42
  },
  {
    "id": 23,
    "type": "mcq",
    "question": "In the BCG matrix, income from ________ can be used to help finance the company's question marks and stars.",
    "options": [
      "dogs",
      "cash cows",
      "SBU revenues",
      "overseas operations",
      "low-share businesses"
    ],
    "answer": 1,
    "pageRef": 42
  },
  {
    "id": 24,
    "type": "mcq",
    "question": "The four possible strategies that can be pursued for each SBU are building, holding, ________, and ________.",
    "options": [
      "harvesting; divesting",
      "promoting; selling",
      "downsizing; expanding",
      "diversifying; penetrating",
      "developing; growing"
    ],
    "answer": 0,
    "pageRef": 42
  },
  {
    "id": 25,
    "type": "mcq",
    "question": "Which of the following does NOT accurately reflect a problem with the BCG matrix approach?",
    "options": [
      "It focuses on planning for the future.",
      "It can be costly to conduct.",
      "It can be time consuming to implement.",
      "It is difficult to define SBUs and measure market share and growth.",
      "It focuses on classifying current businesses."
    ],
    "answer": 0,
    "pageRef": 42
  },
  {
    "id": 26,
    "type": "mcq",
    "question": "Unlike strategic-planning efforts of the past, which were conducted primarily by senior managers, today's strategic planning is ________.",
    "options": [
      "short-term oriented",
      "decentralized",
      "limitation-free",
      "product oriented",
      "centralized"
    ],
    "answer": 1,
    "pageRef": "42-43"
  },
  {
    "id": 27,
    "type": "mcq",
    "question": "To increase its U.S. market share, Starbucks has stepped up efforts in the areas of product availability and promotion. These are examples of broad ________.",
    "options": [
      "brand experiences",
      "strategies for growth",
      "diversification",
      "product development",
      "value chains"
    ],
    "answer": 1,
    "pageRef": "44-45"
  },
  {
    "id": 28,
    "type": "mcq",
    "question": "Which department in a company carries the primary responsibility for achieving profitable growth?",
    "options": [
      "accounting",
      "product development",
      "operations",
      "human resources",
      "marketing"
    ],
    "answer": 4,
    "pageRef": 43
  },
  {
    "id": 29,
    "type": "mcq",
    "question": "Which of the following is a useful tool for identifying growth opportunities?",
    "options": [
      "the BCG matrix",
      "the business portfolio",
      "the product/market expansion grid",
      "the value chain",
      "the value delivery network"
    ],
    "answer": 2,
    "pageRef": 43
  },
  {
    "id": 30,
    "type": "mcq",
    "question": "Making more sales to current customers without changing a firm's products is ________.",
    "options": [
      "market attractiveness",
      "market penetration",
      "market development",
      "product development",
      "diversification"
    ],
    "answer": 1,
    "pageRef": 43
  },
  {
    "id": 31,
    "type": "mcq",
    "question": "Starbucks has introduced a debit card that lets customers prepay for coffee and snacks. This effort by Starbucks management is an example of ________.",
    "options": [
      "market development",
      "product development",
      "diversification",
      "market penetration",
      "product adaptation"
    ],
    "answer": 3,
    "pageRef": "43-45"
  },
  {
    "id": 32,
    "type": "mcq",
    "question": "While a valuable planning tool, a problem with using the BCG matrix centers is that it focuses on ________",
    "options": [
      "the future instead of the present",
      "the present instead of the future",
      "financial issues instead of the customer",
      "the customer instead of suppliers",
      "the past instead of the present"
    ],
    "answer": 1,
    "pageRef": 42
  },
  {
    "id": 33,
    "type": "mcq",
    "question": "A common practice among marketers is to identify and develop new markets for their existing products. This practice is called ________.",
    "options": [
      "market development",
      "product development",
      "market penetration",
      "market skimming",
      "dual adaptation"
    ],
    "answer": 0,
    "pageRef": 45
  },
  {
    "id": 34,
    "type": "mcq",
    "question": "Starbucks Coffee has recently begun selling and playing compilation CDs and is supporting its own XM satellite radio station. This represents which strategy for growth?",
    "options": [
      "product development",
      "market development",
      "market penetration",
      "diversification",
      "partner development"
    ],
    "answer": 3,
    "pageRef": 44
  },
  {
    "id": 35,
    "type": "mcq",
    "question": "Which of the following entails reducing the business portfolio by eliminating products that no longer fit the company's overall strategy?",
    "options": [
      "market segmentation",
      "the BCG approach",
      "product line extension",
      "downsizing",
      "market redesign"
    ],
    "answer": 3,
    "pageRef": 46
  },
  {
    "id": 36,
    "type": "mcq",
    "question": "Which of the following is NOT a reason that a firm might want to abandon products or markets?",
    "options": [
      "The market has changed, making some of the products less profitable.",
      "The firm has entered areas in which it does not have expertise.",
      "The economic environment is showing signs of recovery.",
      "The firm has grown too rapidly.",
      "The firm has not properly researched foreign markets which it has entered."
    ],
    "answer": 2,
    "pageRef": 46
  },
  {
    "id": 37,
    "type": "mcq",
    "question": "Each department in a company that carries out value-creating activities can be thought of as a link in the company's ________.",
    "options": [
      "market development",
      "product development",
      "business portfolio",
      "value chain",
      "value delivery network"
    ],
    "answer": 3,
    "pageRef": 46
  },
  {
    "id": 38,
    "type": "mcq",
    "question": "Jack Welch, CEO at General Electric, said that \"Companies can't give job security, only ________ can.\"",
    "options": [
      "development",
      "growth",
      "good strategy",
      "customers",
      "efficiency"
    ],
    "answer": 3,
    "pageRef": 47
  },
  {
    "id": 39,
    "type": "mcq",
    "question": "Multinationals like Honda Motor Co. and Wal-Mart stores have designed programs to work closely with their suppliers to help them reduce their costs and improve quality. This illustrates the importance of an efficient ________.",
    "options": [
      "business portfolio",
      "low-cost operator",
      "product mix",
      "value delivery network",
      "value chain"
    ],
    "answer": 3,
    "pageRef": 47
  },
  {
    "id": 40,
    "type": "mcq",
    "question": "Which of the following is the marketing logic by which a company hopes to achieve profitable customer relationships?",
    "options": [
      "price",
      "a consistent product mix",
      "the value delivery network",
      "marketing strategy",
      "differentiation"
    ],
    "answer": 3,
    "pageRef": 48
  },
  {
    "id": 41,
    "type": "mcq",
    "question": "Lucy Ortiz is preparing a PowerPoint presentation of the marketing process to show at a sales meeting. ________ should appear in the center of her diagram depicting marketing strategies and the marketing mix.",
    "options": [
      "Sales goals",
      "Customer value and relationships",
      "Company objectives",
      "Customer retention rates",
      "Competitors"
    ],
    "answer": 1,
    "pageRef": 49
  },
  {
    "id": 42,
    "type": "mcq",
    "question": "A sound marketing strategy begins with which of the following?",
    "options": [
      "customer analysis",
      "positioning",
      "differentiation",
      "promotion",
      "SWOT analysis"
    ],
    "answer": 0,
    "pageRef": 49
  },
  {
    "id": 43,
    "type": "mcq",
    "question": "Your firm is attempting to divide up the total market to determine the best segments it can serve. Which is the correct order of doing so?",
    "options": [
      "market segmentation, target marketing, market positioning",
      "target marketing, market positioning, market segmentation",
      "market positioning, market segmentation, target marketing",
      "market segmentation, market positioning, target marketing",
      "mass marketing, demographic segmentation, psychographic segmentation"
    ],
    "answer": 0,
    "pageRef": 49
  },
  {
    "id": 44,
    "type": "mcq",
    "question": "The process of customer-driven marketing involves which of the following?",
    "options": [
      "product; price; promotion; adaptation",
      "market segmentation; target marketing; differentiation; positioning",
      "marketing analysis; planning; implementation; feedback",
      "analysis; targeting; implementation; control",
      "problem identification; information search; decision; implementation"
    ],
    "answer": 1,
    "pageRef": 49
  },
  {
    "id": 45,
    "type": "mcq",
    "question": "Which of the following is the process of dividing a market into distinct groups of buyers with different needs, characteristics, or behaviors?",
    "options": [
      "market targeting",
      "market segmentation",
      "positioning",
      "marketing strategy",
      "differentiation"
    ],
    "answer": 1,
    "pageRef": 49
  },
  {
    "id": 46,
    "type": "mcq",
    "question": "Your new employer has asked you, as a new marketing graduate, to develop a group of potential customers who might respond in a similar way to a given set of marketing efforts. You have been asked to develop a(n) ________.",
    "options": [
      "target market",
      "market segment",
      "market",
      "market strategy",
      "undefined niche"
    ],
    "answer": 1,
    "pageRef": 49
  },
  {
    "id": 47,
    "type": "mcq",
    "question": "Which of the following involves evaluating each market segment's attractiveness and selecting one or more segments to enter?",
    "options": [
      "market segmentation",
      "differentiation",
      "market targeting",
      "the market mix",
      "positioning"
    ],
    "answer": 2,
    "pageRef": 49
  },
  {
    "id": 48,
    "type": "mcq",
    "question": "Which of the following is the place a product occupies in the consumer's mind relative to competition?",
    "options": [
      "position",
      "placement",
      "market segmentation",
      "market targeting",
      "product promotion"
    ],
    "answer": 0,
    "pageRef": 50
  },
  {
    "id": 49,
    "type": "mcq",
    "question": "Effective positioning begins with ________ the company's marketing offer in order to give consumers more perceived value.",
    "options": [
      "pricing",
      "aligning",
      "differentiating",
      "promoting",
      "placing"
    ],
    "answer": 2,
    "pageRef": 50
  },
  {
    "id": 50,
    "type": "mcq",
    "question": "Which of the four Ps describes the goods-and-services combination the company offers to the target market?",
    "options": [
      "price",
      "promotion",
      "product",
      "place",
      "package"
    ],
    "answer": 2,
    "pageRef": 51
  },
  {
    "id": 51,
    "type": "mcq",
    "question": "In the four Ps of the marketing mix, design, packaging, services, and variety all fall under the category of ________.",
    "options": [
      "product",
      "price",
      "promotion",
      "place",
      "position"
    ],
    "answer": 0,
    "pageRef": 51
  },
  {
    "id": 52,
    "type": "mcq",
    "question": "Today the four Ps are compared to the four Cs. Product and place are called ________ and ________, respectively.",
    "options": [
      "convenience; customer solution",
      "customer cost; convenience",
      "communication; customer solution",
      "customer solution; convenience",
      "communication; convenience"
    ],
    "answer": 3,
    "pageRef": 52
  },
  {
    "id": 53,
    "type": "mcq",
    "question": "In the marketing management functions, an SWOT analysis should ________ a marketing plan.",
    "options": [
      "precede",
      "coincide with",
      "follow",
      "evaluate",
      "take priority over"
    ],
    "answer": 0,
    "pageRef": 54
  },
  {
    "id": 54,
    "type": "mcq",
    "question": "In a basic SWOT analysis the \"T\" stands for ________.",
    "options": [
      "timing",
      "trust",
      "threats",
      "trade",
      "tangible"
    ],
    "answer": 2,
    "pageRef": 53
  },
  {
    "id": 55,
    "type": "mcq",
    "question": "In a basic SWOT analysis, the \"S\" stands for ________.",
    "options": [
      "situation",
      "solutions",
      "satisfactions",
      "strengths",
      "strategy"
    ],
    "answer": 3,
    "pageRef": 53
  },
  {
    "id": 56,
    "type": "mcq",
    "question": "In SWOT analysis, which of the following would be considered a strength?",
    "options": [
      "internal limitations",
      "trends in the market",
      "favorable factors in the environment",
      "factors that challenge the company's performance",
      "internal resources"
    ],
    "answer": 4,
    "pageRef": 53
  },
  {
    "id": 57,
    "type": "mcq",
    "question": "In SWOT analysis, which of the following refers to factors in the external environment?",
    "options": [
      "strengths",
      "strategies",
      "weaknesses",
      "opportunities",
      "trends"
    ],
    "answer": 3,
    "pageRef": 53
  },
  {
    "id": 58,
    "type": "mcq",
    "question": "The main section of the marketing plan presents a detailed ________ analysis of the current marketing situation.",
    "options": [
      "who, when, where",
      "when, where, how",
      "SWOT",
      "competitor",
      "economic"
    ],
    "answer": 2,
    "pageRef": 54
  },
  {
    "id": 59,
    "type": "mcq",
    "question": "A marketing plan begins with an executive summary, which quickly overviews goals and ________.",
    "options": [
      "budgets",
      "controls",
      "promotions",
      "recommendations",
      "obstacles"
    ],
    "answer": 3,
    "pageRef": 54
  },
  {
    "id": 60,
    "type": "mcq",
    "question": "According to the textbook, your boss is most likely referring to ________ when she mentions \"doing things right.\"",
    "options": [
      "strategy",
      "planning",
      "objectives",
      "implementation",
      "efficiency"
    ],
    "answer": 3,
    "pageRef": 55
  },
  {
    "id": 61,
    "type": "mcq",
    "question": "IBM has its sales and marketing people assigned to markets in specific countries, regions, and districts. This is an example of which type of marketing organization?",
    "options": [
      "geographic",
      "product",
      "functional",
      "divisional",
      "psychographic"
    ],
    "answer": 0,
    "pageRef": 56
  },
  {
    "id": 62,
    "type": "mcq",
    "question": "Which of the following is the most common approach to marketing organization?",
    "options": [
      "geographic",
      "product management",
      "functional",
      "divisional",
      "combination"
    ],
    "answer": 2,
    "pageRef": 56
  },
  {
    "id": 63,
    "type": "mcq",
    "question": "Berman Electric, a chain of 18 appliance stores, has a marketing organization in which specialists head different marketing activities. What is this type of organization called?",
    "options": [
      "geographic",
      "product",
      "organic",
      "functional",
      "market"
    ],
    "answer": 3,
    "pageRef": 56
  },
  {
    "id": 64,
    "type": "mcq",
    "question": "Modern marketing departments are arranged in the following ways, EXCEPT which one?",
    "options": [
      "functional organization",
      "geographic organization",
      "product management organization",
      "market management organization",
      "strategic management organization"
    ],
    "answer": 4,
    "pageRef": 56
  },
  {
    "id": 65,
    "type": "mcq",
    "question": "The ________ organizational format was first used by Procter and Gamble in 1929.",
    "options": [
      "geographic management",
      "functional",
      "product management",
      "customer management",
      "market management"
    ],
    "answer": 2,
    "pageRef": 56
  },
  {
    "id": 66,
    "type": "mcq",
    "question": "The ________ organizational system's main advantage is that the company is organized around the needs of specific market segments.",
    "options": [
      "market management",
      "geographic",
      "product management",
      "vertical",
      "functional"
    ],
    "answer": 0,
    "pageRef": 56
  },
  {
    "id": 67,
    "type": "mcq",
    "question": "An increasingly large number of firms are changing their organizational focus from ________ to ________.",
    "options": [
      "product management; functional management",
      "product management; geographic management",
      "brand management; customer management",
      "geographic management; functional management",
      "global management; regional management"
    ],
    "answer": 2,
    "pageRef": 57
  },
  {
    "id": 68,
    "type": "mcq",
    "question": "Evaluating the results of marketing strategies and plans and taking corrective action to ensure that objectives are attained is called ________.",
    "options": [
      "marketing control",
      "strategic control",
      "operating control",
      "developmental control",
      "efficiency"
    ],
    "answer": 0,
    "pageRef": 57
  },
  {
    "id": 69,
    "type": "mcq",
    "question": "The marketing control process entails the following steps in order: setting goals, ________, evaluating performance, and ________.",
    "options": [
      "evaluating goals; measuring performance",
      "achieving goals; measuring performance",
      "taking corrective action; measuring performance",
      "measuring performance; taking corrective action",
      "taking corrective action; following up"
    ],
    "answer": 3,
    "pageRef": 57
  },
  {
    "id": 70,
    "type": "mcq",
    "question": "Which of the following is NOT a step in the marketing control process?",
    "options": [
      "setting goals",
      "measuring performance",
      "taking corrective action",
      "defining the mission",
      "evaluating the causes of gaps between expected and actual performance"
    ],
    "answer": 3,
    "pageRef": 57
  },
  {
    "id": 71,
    "type": "mcq",
    "question": "Ensuring that the company achieves the sales, profits, and other goals set out in its annual marketing plan is the purpose of ________.",
    "options": [
      "marketing control",
      "operating control",
      "strategic control",
      "ROMI",
      "a marketing audit"
    ],
    "answer": 1,
    "pageRef": 57
  },
  {
    "id": 72,
    "type": "mcq",
    "question": "Which of the following involves looking at whether a company's basic strategies are well matched to its opportunities?",
    "options": [
      "operating control",
      "marketing control",
      "strategic control",
      "ROMI",
      "portfolio analysis"
    ],
    "answer": 2,
    "pageRef": 57
  },
  {
    "id": 73,
    "type": "mcq",
    "question": "Which of the following is a comprehensive and systematic analysis of a company's environment, objectives, strategies, and activities that is conducted by an outside and objective party?",
    "options": [
      "a marketing plan",
      "a marketing audit",
      "a marketing mix analysis",
      "a portfolio analysis",
      "SWOT analysis"
    ],
    "answer": 1,
    "pageRef": 57
  },
  {
    "id": 74,
    "type": "mcq",
    "question": "Which of the following measures the profits generated by investments in marketing activities?",
    "options": [
      "SWOT analysis",
      "a marketing audit",
      "an executive summary",
      "marketing ROI",
      "a budget"
    ],
    "answer": 3,
    "pageRef": 58
  },
  {
    "id": 75,
    "type": "mcq",
    "question": "Which of the following would NOT be useful in determining marketing ROI?",
    "options": [
      "a marketing dashboard",
      "brand awareness",
      "market share",
      "SWOT analysis",
      "customer equity"
    ],
    "answer": 3,
    "pageRef": 58
  },
  {
    "id": 76,
    "type": "tf",
    "question": "Mission statements should be realistic and general in nature.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 39
  },
  {
    "id": 77,
    "type": "tf",
    "question": "ABC Fortunes has just developed a formal statement of its purpose. This firm has put together a mission statement.",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "pageRef": 39
  },
  {
    "id": 78,
    "type": "tf",
    "question": "Mission statements should both emphasize the company's strengths in the marketplace and be motivating.",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "pageRef": 39
  },
  {
    "id": 79,
    "type": "tf",
    "question": "At America Online, \"we create customer connectivity, anytime, anywhere,\" is a product-oriented business definition.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 39
  },
  {
    "id": 80,
    "type": "tf",
    "question": "\"At Nike, we sell shoes\" is a market-oriented business definition.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 40
  },
  {
    "id": 81,
    "type": "tf",
    "question": "A firm's mission statement should be the basis for both its business and marketing objectives.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 40
  },
  {
    "id": 82,
    "type": "tf",
    "question": "The major activity in strategic planning is strategic business unit planning, whereby management evaluates the products and businesses making up the company.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 41
  },
  {
    "id": 83,
    "type": "tf",
    "question": "When designing business portfolios, most companies are well advised to add a broad range of products and businesses to their organization.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 41
  },
  {
    "id": 84,
    "type": "tf",
    "question": "The purpose of strategic planning is to find ways in which your company can best use its strengths to take advantage of attractive opportunities in the environment.",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "pageRef": 41
  },
  {
    "id": 85,
    "type": "tf",
    "question": "In the BCG matrix, \"dogs\" are low-growth businesses and products that do not generate enough cash to maintain themselves.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 42
  },
  {
    "id": 86,
    "type": "tf",
    "question": "The growth strategy of diversification involves offering modified or new products to current markets.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 46
  },
  {
    "id": 87,
    "type": "tf",
    "question": "When an organization identifies and develops new markets for its current products and services, it is engaged in market development.",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "pageRef": 45
  },
  {
    "id": 88,
    "type": "tf",
    "question": "When a firm finds products or businesses that no longer fit its overall strategy, it must carefully milk, harvest, or better develop them.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 46
  },
  {
    "id": 89,
    "type": "tf",
    "question": "In today's marketplace, competition increasingly takes place between entire value delivery networks rather than between individual competitors.",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "pageRef": 48
  },
  {
    "id": 90,
    "type": "tf",
    "question": "To improve its value delivery network, a company needs to examine the value chains of its suppliers and distributors.",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "pageRef": 47
  },
  {
    "id": 91,
    "type": "tf",
    "question": "Mandros International Foods evaluates each market segment's attractiveness and selects one or more segments to enter when considering adding new lines of imported foods. Mandros is engaged in selective marketing.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 49
  },
  {
    "id": 92,
    "type": "tf",
    "question": "The image of a product in the minds of consumers is called market segmentation.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 50
  },
  {
    "id": 93,
    "type": "tf",
    "question": "A market segment consists of consumers who respond in different ways to a given set of marketing efforts.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 49
  },
  {
    "id": 94,
    "type": "tf",
    "question": "Holiday Inn has divided the total customer market into smaller segments and selected the most promising segments. Deciding what position it wants to occupy in these segments is called targeting.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 50
  },
  {
    "id": 95,
    "type": "tf",
    "question": "When a company positions its product, it should first identify possible customer value differences within a market segment that could be the basis of a competitive advantage for the product.",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "pageRef": 50
  },
  {
    "id": 96,
    "type": "tf",
    "question": "The marketing mix consists of product, price, place, positioning, and promotion.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 48
  },
  {
    "id": 97,
    "type": "tf",
    "question": "Guided by marketing strategy, the company designs a marketing mix made up of factors under its control: product, price, place, and promotion.",
    "options": [
      "True",
      "False"
    ],
    "answer": 0,
    "pageRef": 48
  },
  {
    "id": 98,
    "type": "tf",
    "question": "One valid criticism of the four Ps concept is that services are not considered.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 52
  },
  {
    "id": 99,
    "type": "tf",
    "question": "The four Ps concept takes the seller's view of the market.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 52
  },
  {
    "id": 100,
    "type": "tf",
    "question": "The four marketing management functions are analysis, planning, implementation, and control.",
    "options": [
      "True",
      "False"
    ],
    "answer": 1,
    "pageRef": 53
  },
  {
    "id": 111,
    "type": "mcq",
    "question": "Starbucks has an annual plan in place to deal with the company's current SBUs and their operations. However, as a growth-oriented firm, Starbucks is interested in both domestic and international markets. This requires Starbucks to constantly monitor the environment and adapt to the opportunities with which it is presented. To best take advantage of its constantly changing environment, Starbucks should do which of the following?",
    "options": [
      "write a mission statement",
      "follow supporting objectives",
      "conduct strategic planning",
      "conduct profit analysis",
      "shorten its value delivery network"
    ],
    "answer": 2,
    "pageRef": 38
  },
  {
    "id": 112,
    "type": "mcq",
    "question": "Monsanto operates in many businesses, including pharmaceuticals and food products. The company defines its ________ as creating \"abundant food and a healthy environment.\"",
    "options": [
      "strategy",
      "marketing development",
      "business portfolio",
      "value-delivery network",
      "mission"
    ],
    "answer": 4,
    "pageRef": 39
  },
  {
    "id": 113,
    "type": "mcq",
    "question": "The current mission statement of the Girl Scouts of America reads \"where girls grow strong.\" The organization's former mission statement had read \"to prepare young girls for motherhood and wifely duties.\" This change reflects the guideline that mission statements should be ________.",
    "options": [
      "realistic",
      "motivating",
      "narrow",
      "market-oriented",
      "specific"
    ],
    "answer": 3,
    "pageRef": 39
  },
  {
    "id": 114,
    "type": "mcq",
    "question": "A vendor for Ford Motor Company received the following message from one of Ford's marketing managers: \"As we move forward during the 21st century, Ford is committed to building profitable customer relationships by creating environmentally better cars and getting them to market faster at lower costs.\" The marketing manager is referring to Ford's ________.",
    "options": [
      "marketing strategy",
      "marketing mix",
      "business portfolio",
      "mission statement",
      "business objectives"
    ],
    "answer": 3,
    "pageRef": 39
  },
  {
    "id": 115,
    "type": "mcq",
    "question": "When the makers of a ballpoint pen state they are in the communication equipment business, they are defining their mission too ________.",
    "options": [
      "narrowly",
      "realistically",
      "specifically",
      "broadly",
      "futuristically"
    ],
    "answer": 3,
    "pageRef": 39
  },
  {
    "id": 116,
    "type": "mcq",
    "question": "Kimball Gardens is a company that operates as two distinct businesses: one that sells lawn and garden products and one that markets booklets. Each business is called a ________.",
    "options": [
      "separate entity",
      "strategic business unit (SBU)",
      "cash cow",
      "star",
      "business portfolio"
    ],
    "answer": 1,
    "pageRef": 41
  },
  {
    "id": 117,
    "type": "mcq",
    "question": "The pharmaceuticals division of Omni Healthcare holds low market share in a high-growth market. In order to increase market share, managers would be most likely to decide which of the following?",
    "options": [
      "hold the pharmaceuticals division's share",
      "implement a harvest strategy",
      "use money from a cash cow to promote the pharmaceuticals division",
      "divest the SBU",
      "diversify the pharmaceutical division"
    ],
    "answer": 2,
    "pageRef": 42
  },
  {
    "id": 118,
    "type": "mcq",
    "question": "Wal-Mart, the world's largest retailer, has successfully launched its stores in Mexico, Canada, the U.K., and Germany, and other nations. This is an example of how Wal-Mart is pursuing ________ as a growth strategy.",
    "options": [
      "market penetration",
      "product development",
      "demographic market development",
      "geographic market development",
      "diversification"
    ],
    "answer": 3,
    "pageRef": 45
  },
  {
    "id": 119,
    "type": "mcq",
    "question": "Fence Patrol has developed an entirely new mounting system for chain link fences. Although they are a local company, through the acquisition of a distributor they now have the ability to market their products nationwide. Fence Patrol is most likely to be following a ________ strategy.",
    "options": [
      "market penetration",
      "market development",
      "diversification",
      "divesting",
      "product development"
    ],
    "answer": 2,
    "pageRef": 46
  },
  {
    "id": 120,
    "type": "mcq",
    "question": "The Bank of New York bought Pershing, an off-shore investment firm with operations in India, from Credit Suisse First Boston. The Bank of New York is pursuing a ________.",
    "options": [
      "product development strategy",
      "product adaptation strategy",
      "downsizing strategy",
      "diversification strategy",
      "market penetration strategy"
    ],
    "answer": 3,
    "pageRef": 46
  },
  {
    "id": 121,
    "type": "mcq",
    "question": "Acme, Inc., has slightly modified the production processes of its widgets and gadgets in order to tap into the Eastern European market. Acme is likely following a ________ strategy.",
    "options": [
      "market penetration",
      "market development",
      "diversification",
      "harvesting",
      "product development"
    ],
    "answer": 1,
    "pageRef": 45
  },
  {
    "id": 122,
    "type": "mcq",
    "question": "Disney is identifying and developing new markets for its theme parks. Disney is exploring possibilities for ________.",
    "options": [
      "market penetration",
      "market development",
      "diversification",
      "harvesting",
      "product development"
    ],
    "answer": 1,
    "pageRef": 45
  },
  {
    "id": 123,
    "type": "mcq",
    "question": "For Hyundai Corporation, customers who care about the price of a car and its operating economy make up one ________.",
    "options": [
      "market position",
      "value network",
      "market segment",
      "customer extension",
      "value chain"
    ],
    "answer": 2,
    "pageRef": 49
  },
  {
    "id": 124,
    "type": "mcq",
    "question": "Favorite Memories specializes in serving gift shoppers that major competitors overlook and ignore. Which of the following best describes Favorite Memories?",
    "options": [
      "market follower",
      "market challenger",
      "market seeker",
      "market nicher",
      "full market coverer"
    ],
    "answer": 3,
    "pageRef": 49
  },
  {
    "id": 125,
    "type": "mcq",
    "question": "Saturn is \"a different kind of company, different kind of a car\"; the Hummer is \"like nothing else.\" These statements reflect a firm's ________.",
    "options": [
      "product portfolio",
      "target markets",
      "market positioning",
      "strategy",
      "niche"
    ],
    "answer": 2,
    "pageRef": 50
  },
  {
    "id": 126,
    "type": "mcq",
    "question": "Harris, the marketing manager at a small sports retail chain, has conducted a marketing analysis. He has investigated the company's internal resources and situational factors, as well as factors and trends in the competitive sports retail chain market. Which of the following has Harris completed?",
    "options": [
      "a SWOT analysis",
      "a business portfolio analysis",
      "an executive summary",
      "a marketing plan",
      "a marketing mix"
    ],
    "answer": 0,
    "pageRef": 53
  },
  {
    "id": 127,
    "type": "mcq",
    "question": "Which of the following most accurately identifies a difference between a weakness and a threat in SWOT analysis?",
    "options": [
      "A company is more able to change a threat than a weakness.",
      "A company is more able to change a weakness than a threat.",
      "A company can be more negatively affected by a weakness than by a threat.",
      "A company can be more negatively affected by a threat than by a weakness.",
      "A company can more easily identify threats than weaknesses."
    ],
    "answer": 1,
    "pageRef": 53
  },
  {
    "id": 128,
    "type": "mcq",
    "question": "Emerson Studios, a chain of 25 portrait stores in five states, has organized its marketing organization into groups headed by a sales manager, an advertsing manager, and a customer-service manager. What type of organization is this?",
    "options": [
      "geographic",
      "product",
      "functional",
      "customer",
      "market"
    ],
    "answer": 2,
    "pageRef": 56
  },
  {
    "id": 129,
    "type": "mcq",
    "question": "Juanita Castro is looking at whether her company's strategies are well matched to its opportunities. Juanita is utilizing ________.",
    "options": [
      "marketing control",
      "operating control",
      "strategic control",
      "SWOT analysis",
      "a marketing audit"
    ],
    "answer": 2,
    "pageRef": 57
  },
  {
    "id": 130,
    "type": "mcq",
    "question": "As Starbucks continues to grow, it is faced with myriad challenges and surprises during the implementation of marketing plans. Hence, the marketing department must practice constant ________.",
    "options": [
      "customer management",
      "corrective action",
      "performance analysis",
      "marketing control",
      "environmental scanning"
    ],
    "answer": 3,
    "pageRef": 57
  },
  {
    "id": 131,
    "type": "mcq",
    "question": "Fun-Spot Fun Park began as a small amusement park in 1985 with a merry-go-round, slide, pony rides, and ice cream stand. Fun-Spot's philosophy is: 'We\\'re here to make you happy!'. Fun-Spot's mission is ________.",
    "options": [
      "product-oriented",
      "technology-oriented",
      "market-oriented",
      "too specific",
      "too focused on profits"
    ],
    "answer": 2,
    "pageRef": 39
  },
  {
    "id": 132,
    "type": "mcq",
    "question": "Into which quadrant of the BCG matrix does Fun-Spot fall? (High-growth, high-share family attraction)",
    "options": [
      "star",
      "question mark",
      "profit center",
      "diversification",
      "dog"
    ],
    "answer": 0,
    "pageRef": 41
  },
  {
    "id": 133,
    "type": "mcq",
    "question": "Ron and Gail plan to lower prices in an effort to encourage customers to stay longer, visit more often, and spend more money during each visit. What type of strategy are Ron and Gail planning?",
    "options": [
      "market penetration",
      "market development",
      "product development",
      "customer development",
      "diversification"
    ],
    "answer": 0,
    "pageRef": 43
  },
  {
    "id": 134,
    "type": "mcq",
    "question": "Gail and Ron strive to provide new offerings and entertainment options for their visitors. What type of strategy is this?",
    "options": [
      "market penetration",
      "market development",
      "product development",
      "customer development",
      "diversification"
    ],
    "answer": 2,
    "pageRef": 45
  },
  {
    "id": 135,
    "type": "mcq",
    "question": "Which of the following would be classified as an opportunity in a SWOT analysis of Fun Spot?",
    "options": [
      "A rival amusement park announces plans to open three new rides next season.",
      "A new luxury hotel is being constructed in the area, with the aim of luring more high-spending families on vacation.",
      "Gail and Ron have paid off the mortgage on Fun Spot, significantly reducing their monthly expenses.",
      "Fun Spot employees tend to be enthusiastic and young, projecting an image of fun and vitality at Fun Spot.",
      "Fun Spot plans to further diversify its offerings by beginning a two-week summer camp for elementary school students."
    ],
    "answer": 1,
    "pageRef": 53
  }
];

window.marketingQuiz2Questions = marketingQuiz2Questions;
