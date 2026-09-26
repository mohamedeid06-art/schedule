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
    name: "Entrepreneurship & Marketing", 
    color: "var(--c-gen)", 
    hex: "#06b6d4", 
    instructor: "Dr. Faculty Staff" 
  },
  "MTH G102": { 
    name: "Linear Algebra & Multivariable Integrals", 
    color: "var(--c-mth)", 
    hex: "#0284c7", 
    instructor: "Dr. Ahmed Abdelnaby & Dr. Lucy" 
  },
  "EMC G101": { 
    name: "Dynamics of Rigid Bodies", 
    color: "var(--c-emc)", 
    hex: "#8b5cf6", 
    instructor: "Dr. Samir Hedeyma" 
  },
  "MDP G111": { 
    name: "Computer-Aided Mechanical Drafting (SolidWorks)", 
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
    name: "Electrical & Electronics Engineering", 
    color: "var(--c-epe)", 
    hex: "#f43f5e", 
    instructor: "Dr. Electrical Staff" 
  }
};

// تكليفات المواد الثابتة (أساينمنت اللينير سؤالين الشيت لكل سكشن)
const COURSE_STATIC_ASSIGNMENTS = [
  {
    id: "mth-assign-1",
    code: "MTH G102",
    title: "Assignment 1 — Linear Algebra (سؤالين الشيت)",
    type: "Assignment",
    start: "2026-09-24T08:00:00",
    deadlinesByGroup: {
      "ME1-01": "2026-10-01T09:00:00",
      "ME1-02": "2026-09-28T10:00:00",
      "ME1-03": "2026-09-28T13:00:00",
      "ME1-04": "2026-10-01T11:00:00"
    },
    folderUrl: "https://drive.google.com/drive/folders/1qlO9-i9plEckcSaTcEKb7tDymh01ALUl",
    desc: "حل السؤالين المحددين في آخر الشيت تحت عنوان Assignment بخط واضح.",
    note: "التسليم ورقي للمعيد في ميعاد السكشن لكل سكشن."
  }
];

// دليل الأسبوع الدراسي الأول بجميع الروابط المباشرة (الكهربية + التكامل)
const DEFAULT_WEEKLY_GUIDES = [
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
  {
    week: "Week 1",
    code: "MTH G102",
    lectures: "Double Integrals (Part 1)",
    slides_url: "https://drive.google.com/drive/folders/1WCbR1VLo8sUZ_x58Of08lW71aq5Ht9z8",
    sheet: "Sheet 1 & Assignment 1 (Double Integrals)",
    sheet_url: "https://drive.google.com/drive/folders/1z47GRFcIBjHRVF7DKk5eBq-aUIWJv3j0",
    solution_url: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N",
    practice: "حل مسائل الشيت ومتابعة فيديوهات الشرح",
    playlists: [
      { title: "م. عمار ياسر (كامل)", url: "https://youtu.be/IfuyRoFzthk?si=a71lDUGo6x5WT_36" },
      { title: "م. أحمد المغربي (فيديو 1)", url: "https://youtu.be/VlDgu4dylLU?si=KHdffO0btzRircFE" },
      { title: "م. أحمد المغربي (فيديو 2 د 30:45)", url: "https://youtu.be/8ANactIJ6Sk?si=6qaK7EO2R-LSh9BB" }
    ],
    summary_title: "ملاحظات ونوتس المحاضرة (Notes)",
    summary_url: "https://drive.google.com/drive/folders/1DDpbyWJji6Y1kazpLp_0GdmjcwjrMYIx"
  }
];

// مواعيد امتحانات الـ Take-Home الأسبوعية بالدقيقة لمادة الديناميكا
const DYNAMICS_THE_EXAMS = [
  { no: 1, name: "P200", start: "2026-09-25T19:00:00", deadline: "2026-10-09T19:00:00", examSheet: "https://drive.google.com/file/d/1G7wTSWQLSn8PGk4c76svzkVSXQMhf2Mk/view", desc: "Solve the assigned problems for Model (P200). Show all steps and free body diagrams clearly.", note: "Submit as PDF on Google Form before deadline." },
  { no: 2, name: "P135", start: "2026-10-09T19:00:00", deadline: "2026-10-16T19:00:00", examSheet: "https://drive.google.com/file/d/1oKKepdc3UJwztVRZI78XUFI7ozdit_S6/view", desc: "Curvilinear Motion analysis for particles in Cartesian and Polar Coordinates.", note: "Early submission within 12h gets +10% bonus." },
  { no: 3, name: "P106", start: "2026-10-16T19:00:00", deadline: "2026-10-23T19:00:00", examSheet: "https://drive.google.com/file/d/1sQ8z2c6KSWZL3fqcDahuhjJZzS0WMLdZ/view", desc: "Normal and Tangential coordinates, Radius of curvature, and Relative Motion problems.", note: "Include student code in form header." },
  { no: 4, name: "P137v", start: "2026-10-23T19:00:00", deadline: "2026-10-30T19:00:00", examSheet: "https://drive.google.com/file/d/12uXkipt3rKvCEDTyhkvf4JctloCF516X/view", desc: "Kinetics of particles: Newton's second law and equations of motion.", note: "Check mass units and coordinate directions carefully." },
  { no: 5, name: "P305", start: "2026-10-30T19:00:00", deadline: "2026-11-06T19:00:00", examSheet: "https://drive.google.com/file/d/18pbuDHPOQJafJeRllipa_LITQrvNGRNL/view", desc: "Work and Energy principles applied to particles and conservative systems.", note: "Submit before Midterm revision week." },
  { no: 6, name: "P3501v", start: "2026-11-06T19:00:00", deadline: "2026-11-20T19:00:00", examSheet: "https://drive.google.com/file/d/15W7Yzak8s7pk9nwh5ZJAVyqOjC-_HDOR/view", desc: "Kinematics of Rigid Bodies (Fixed Axis Rotation & Gear trains).", note: "Duration: 2 weeks due to Midterm examinations." },
  { no: 7, name: "P356v", start: "2026-11-20T19:00:00", deadline: "2026-11-27T19:00:00", examSheet: "https://drive.google.com/file/d/1q6bJ5m6JnebbxDBhDU5GOIK1babvcP2A/view", desc: "General Plane Motion: Velocity Analysis and Instantaneous Center (IC).", note: "Instantaneous Center diagrams must be accurately drawn." },
  { no: 8, name: "P325v", start: "2026-11-27T19:00:00", deadline: "2026-12-04T19:00:00", examSheet: "https://drive.google.com/file/d/1e5oGzzi4uTT4oay7hhHB0bP-yjmZhaoq/view", desc: "General Plane Motion: Acceleration Analysis including Coriolis component.", note: "Relative acceleration vectors must be clearly labeled." },
  { no: 9, name: "P464", start: "2026-12-04T19:00:00", deadline: "2026-12-11T19:00:00", examSheet: "https://drive.google.com/file/d/1pIlU32osszyhQyhqZklv1Xal9PsvwEMd/view", desc: "Final Take-Home Exam on Planar Kinetics and Rigid Body Momentum.", note: "Final submission of the semester!" }
];

let DYNAMICS_ROADMAP_STEPS = [
  { week: 1, title: "Course Introduction & Kinematics of Particles (Rectilinear Motion)", date: "Sep 20 - Sep 24", the: "—" },
  { week: 2, title: "Curvilinear Motion (Cartesian & Polar Coordinates)", date: "Sep 27 - Oct 01", the: "THE 1 Release" },
  { week: 3, title: "Normal and Tangential Coordinates & Relative Motion", date: "Oct 04 - Oct 08", the: "THE 2 Release (Submit THE 1)" },
  { week: 4, title: "Kinetics of Particles: Newton's Second Law & Equations of Motion", date: "Oct 11 - Oct 15", the: "THE 3 Release (Submit THE 2)" },
  { week: 5, title: "Work & Energy Principle for Particles", date: "Oct 18 - Oct 22", the: "THE 4 Release (Submit THE 3)" },
  { week: 6, title: "Impulse & Linear/Angular Momentum & Impact", date: "Oct 25 - Oct 29", the: "THE 5 Release (Submit THE 4)" },
  { week: 7, title: "Midterm Exam Week (Exam on Particles Dynamics)", date: "Nov 01 - Nov 05", the: "⚡ Midterm Exam Week" },
  { week: 8, title: "Kinematics of Rigid Bodies (Translation & Fixed Axis Rotation)", date: "Nov 08 - Nov 12", the: "THE 6 Release (Submit THE 5)" },
  { week: 9, title: "General Plane Motion: Velocity Analysis & Instantaneous Center (IC)", date: "Nov 15 - Nov 19", the: "THE 7 Release (Submit THE 6)" },
  { week: 10, title: "General Plane Motion: Acceleration Analysis", date: "Nov 22 - Nov 26", the: "THE 8 Release (Submit THE 7)" },
  { week: 11, title: "Planar Kinetics of a Rigid Body: Force and Acceleration", date: "Nov 29 - Dec 03", the: "THE 9 Release (Submit THE 8)" },
  { week: 12, title: "Planar Kinetics: Work and Energy for Rigid Bodies", date: "Dec 06 - Dec 10", the: "Final THE Submission (THE 9)" },
  { week: 13, title: "Planar Kinetics: Impulse and Momentum for Rigid Bodies", date: "Dec 13 - Dec 17", the: "Course Review & Bonus" },
  { week: 14, title: "Comprehensive Revision & Final Exams Preparation", date: "Dec 20 - Dec 24", the: "🎯 Final Revision" }
];

const MATERIALS_ROADMAP_STEPS = [
  { week: 1, date: "Sep 21", lecture: "Introduction", tut: "Tutorial", lab: null },
  { week: 2, date: "Sep 28", lecture: "Interatomic Bonding", tut: "Interatomic Bonding (Tut)", lab: null },
  { week: 3, date: "Oct 5", lecture: "Crystal Structures-1", tut: "Crystal Structures-1 (Tut)", lab: null },
  { week: 4, date: "Oct 12", lecture: "Crystal Structures-2", tut: "Crystal Structures-2 (Tut)", lab: null },
  { week: 5, date: "Oct 19", lecture: "Imperfections in Solids", tut: "Imperfections in Solids (Tut)", lab: null },
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
  }
};

// ==========================================================================
// دليل النجاة والمصادر الأصلية لكل مادة (Course Capsules - القديم الأصلي كاملاً)
// ==========================================================================
const COURSE_CAPSULES = {
  "GEN G119": {
    code: "GEN G119", 
    name: "Marketing & Entrepreneurship", 
    hours: "2 Credit Hours",
    grading: "• 40 درجة كويزات (6 كويزات بيتاخد أعلى 4)\n• 20 درجة ميدتيرم\n• 40 درجة فاينال",
    tips: "الكويزات بتيجي كل سنة متكررة بالحرف وبنفس ترتيب الأسئلة والاختيارات من الـ Test Bank!\nالميدتيرم والفاينال بيكونوا تجميعة من نفس الـ 6 كويزات دي بالحرف.",
    links: [
      { title: "📁 فولدر المراجع والـ Test Bank (100 سؤال لكل شابتر)", url: "https://drive.google.com/drive/folders/1BacoA3K8UZ8Jfg_nkGlXrXNn3eQPO4h0" },
      { title: "🎯 فولدر الكويزات المتكررة المضمونة (خلاصة المادة A+)", url: "https://drive.google.com/drive/folders/1utSDriJ1mlgJvZlVEPl9yqichocubE4h" }
    ],
    playlists: [
      { title: "🎬 شرح كورس ريادة الأعمال والتسويق كامل", url: "https://www.youtube.com/playlist?list=PL2K9WzQ-Tj_8n8C0V1-8vE-7Xz1bXwQ_v" }
    ]
  },
  "MTH G102": {
    code: "MTH G102", 
    name: "Linear Algebra & Multivariable Integration", 
    hours: "3 Credit Hours",
    grading: "• الميدتيرم من 30 درجة (20 درجة تكامل + 10 درجات جبر)\n• التكامل: كويز واحد + أساينمنت محسوب في درجات أعمال السنة\n• الجبر: كويزين (MCQ + Written) + أساينمنت الدكتورة بتشوفه",
    tips: "1. التكامل: بيعتمد على أساسيات Calc 2 وبيكون خفيف، اهتم بحل الشيتات بيدك.\n2. الجبر: محتاج فهم concepts مع حل كتير عشان الوقت في الميدتيرم.\n3. ⚠️ تنبيه غياب هام: دكتورة لوسي الحضور عندها مهم للغاية.",
    links: [
      { title: "📁 درايف الدفعة لمادة الماث", url: "https://drive.google.com/drive/folders/1MVpos5NHkVElYILFX3dTQv4s0fFBmdzD" },
      { title: "📁 فولدر أساينمنت اللينير (Assignment 1)", url: "https://drive.google.com/drive/folders/1qlO9-i9plEckcSaTcEKb7tDymh01ALUl" }
    ],
    playlists: [
      { title: "🎬 شرح التكامل المتعدد (Multivariable Integrals) — م. عمار ياسر", url: "https://www.youtube.com/playlist?list=PLsx3PTmWiODAj0Zq_C2mX4-0c2yqQYtZ7" },
      { title: "🎬 شرح الجبر الخطي (Linear Algebra) — م. أحمد المغربي", url: "https://www.youtube.com/playlist?list=PLJHkuo98VFGZ3n4pX6n6G8qQ9zZp5m6r5" },
      { title: "🎬 حل امتحانات سابقة وأفكار متقدمة — م. عمار ياسر", url: "https://youtu.be/IfuyRoFzthk?si=a71lDUGo6x5WT_36" }
    ]
  },
  "MDP G111": {
    code: "MDP G111", 
    name: "Computer-Aided Mechanical Drafting (SolidWorks)", 
    hours: "3 Credit Hours",
    grading: "• 40 درجة Classwork (سكاشن ورسم وتكليفات أسبوعية)\n• 20 درجة ميدتيرم عملي على الأجهزة\n• 40 درجة فاينال",
    tips: "المادة تعتمد على التعامل السريع مع برنامج SolidWorks وفهم الـ Relations والأبعاد وحساب الـ Mass والـ Center of Mass بدقة بدون أخطاء.",
    links: [
      { title: "📁 درايف الدفعة لمادة السوليد ووردز ونماذج الرسم", url: "https://drive.google.com/drive/folders/1fgyiZxQNzmAxajlpDtk0_RvijbvnlJf-" }
    ],
    playlists: [
      { title: "🎬 كورس تعليم SolidWorks من الصفر للاحتراف — د. أحمد فرج", url: "https://www.youtube.com/playlist?list=PLm877Wx3hfJ09H2z8z8m6c1b3Z2rT5y8K" },
      { title: "🎬 حل تمارين وشيتات الرسم الميكانيكي على البرنامج", url: "https://www.youtube.com/playlist?list=PLsx3PTmWiODCQyT-Z6j2V8W8kYpP3Z3w_" }
    ]
  },
  "MDP G121": {
    code: "MDP G121", 
    name: "Materials Science", 
    hours: "3 Credit Hours",
    grading: "• 20 درجة ميدتيرم\n• 40 درجة أعمال سنة (تجارب المعمل وتقارير وسكاشن)\n• 40 درجة فاينال",
    tips: "متابعة المحاضرات أولاً بأول، وفهم منحنى الإجهاد والانفعال (Stress-Strain curve) وتركيبات المواد وحسابات الـ Miller Indices وتجارب المعمل.",
    links: [
      { title: "📁 درايف الدفعة لمادة الماتيريال والريبورتات", url: "https://drive.google.com/drive/folders/1dcN5VGCVifVn72FodQQ2d4xLeevAE5JO" }
    ],
    playlists: [
      { title: "🎬 شرح علم المواد كامل — د. محمد هلال", url: "https://www.youtube.com/playlist?list=PLJHkuo98VFGYgT5x7_9yBwV7m7bZ8fK3L" },
      { title: "🎬 تجارب معمل الماتيريال العملية والاختبارات", url: "https://www.youtube.com/playlist?list=PLsx3PTmWiODD3Ym6l7vG8yZ9sP5oW2r7x" }
    ]
  },
  "EPE G113": {
    code: "EPE G113", 
    name: "Electrical & Electronics Engineering (EPE I)", 
    hours: "3 Credit Hours",
    grading: "• 50 درجة فاينال\n• 20 درجة ميدتيرم\n• 30 درجة أعمال سنة (كويزات، شيتات، حضور)",
    tips: "المادة تنقسم لقسمين: الدوائر الكهربية (Circuits) في النصف الأول، والإلكترونيات (Electronics) في النصف الثاني. حل الشيتات بيدك وفهم قوانين كيرشوف وThevenin هو مفتاح الـ A+.",
    links: [
      { title: "📁 درايف الدفعة الشامل لمادة الهندسة الكهربية", url: "https://drive.google.com/drive/folders/1pk7PS5s3qRAOu6YTNvZoOaBziQoBhtVz?usp=drive_link" }
    ],
    playlists: [
      { title: "🎬 شرح هندسة كهربية ومسائل دوائر — د. حازم عزت", url: "https://www.youtube.com/playlist?list=PLm877Wx3hfJ37R7tf8KaLhYXBrKtCLjzy" },
      { title: "🎬 شرح وتبسيط الدوائر الكهربية — م. طارق البغدادي", url: "https://www.youtube.com/playlist?list=PLJHkuo98VFGZPKHD2m1HccJgekI505sSE" },
      { title: "🎬 حل سكاشن وشيتات الكهربية — م. عمار ياسر", url: "https://youtube.com/playlist?list=PLsx3PTmWiODC0g-tdKoz5DE4dOZhTvuzj&si=nlm30sMM1-z7Ynam" }
    ]
  },
  "EMC G101": {
    code: "EMC G101", 
    name: "Dynamics of Rigid Bodies", 
    hours: "3 Credit Hours",
    grading: "• 40 درجة فاينال\n• 20 درجة ميدتيرم\n• 30 درجة كويزين (15 لكل كويز)\n• 10 درجات Take Home Exam (THE)",
    tips: "تسليم الـ THE أول 12 ساعة يعطي +10% بونص، والحل بدقة ورسم الـ Free Body Diagram بوضوح يضمن الدرجة النهائية.",
    links: [
      { title: "📁 فولدر درايف مادة الديناميكا الشامل", url: "https://drive.google.com/drive/folders/1bjTVuMUlmMKDoSShmYnRBju3HtglV6zT" }
    ],
    playlists: [
      { title: "🎬 شرح محاضرات الديناميكا كاملة — د. سمير هديمه", url: "https://www.youtube.com/playlist?list=PLYbUaz7Vj6gQPsCYu-Tao-RDAZQ3z_vEh" },
      { title: "🎬 حل تمارين ومسائل متقدمة — م. إنجي عبد الهادي", url: "https://www.youtube.com/playlist?list=PLSRWGfn5iCH9hwKUQfbIjGAFyruE6IsCA" }
    ]
  }
};

const DRIVE_DATA = {
  "MTH G102": { folder: "https://drive.google.com/drive/folders/1MVpos5NHkVElYILFX3dTQv4s0fFBmdzD", lectures: MAIN_SEMESTER_DRIVE, sheets: "https://drive.google.com/drive/folders/1qlO9-i9plEckcSaTcEKb7tDymh01ALUl", exams: MAIN_SEMESTER_DRIVE },
  "EMC G101": { folder: "https://drive.google.com/drive/folders/1bjTVuMUlmMKDoSShmYnRBju3HtglV6zT", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE },
  "MDP G111": { folder: "https://drive.google.com/drive/folders/1fgyiZxQNzmAxajlpDtk0_RvijbvnlJf-", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE },
  "MDP G121": { folder: "https://drive.google.com/drive/folders/1dcN5VGCVifVn72FodQQ2d4xLeevAE5JO", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE },
  "EPE G113": { folder: "https://drive.google.com/drive/folders/1pk7PS5s3qRAOu6YTNvZoOaBziQoBhtVz?usp=drive_link", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE },
  "GEN G119": { folder: "https://drive.google.com/drive/folders/1BacoA3K8UZ8Jfg_nkGlXrXNn3eQPO4h0", lectures: MAIN_SEMESTER_DRIVE, sheets: MAIN_SEMESTER_DRIVE, exams: MAIN_SEMESTER_DRIVE }
};

let BUILDING_MAP_URLS = {
  3:  "https://maps.google.com/?q=30.0271,31.2091",
  7:  "https://maps.google.com/?q=30.0267,31.2078",
  14: "https://maps.google.com/?q=30.0264,31.2069",
  15: "https://maps.google.com/?q=30.0261,31.2056",
  17: "https://maps.google.com/?q=30.0245,31.2085",
  19: "https://maps.google.com/?q=30.0243,31.2072"
};

const ROOM_INFO = {
  "3103-414": { bldg: 3, floor: "1st Floor", hall: "Hall 3 (Capacity: 414)", name: "Building 3 (Architecture & Computer Eng.)" },
  "3101-306": { bldg: 3, floor: "1st Floor", hall: "Hall 1 (Capacity: 306)", name: "Building 3 (Architecture & Computer Eng.)" },
  "7104-360": { bldg: 7, floor: "1st Floor", hall: "Hall 4 (Capacity: 360)", name: "Building 7 (El-Sawy Hall Complex)" },
  "1204-(360)": { bldg: 1, floor: "2nd Floor", hall: "Hall 1204 (Preparatory)", name: "Preparatory Building" },
  "3102-306": { bldg: 3, floor: "1st Floor", hall: "Hall 2", name: "Building 3 (Architecture & Computer Eng.)" },
  "15401-300": { bldg: 15, floor: "4th Floor", hall: "Drawing Hall 1 (Capacity: 300)", name: "Building 15 (Student Services Building)" },
  "14100-(104)": { bldg: 14, floor: "1st Floor", hall: "Hall 100", name: "Building 14 (New Mechanical Design)" },
  "14201-50": { bldg: 14, floor: "2nd Floor", hall: "Room 1", name: "Building 14 (New Mechanical Design)" },
  "14301-50": { bldg: 14, floor: "3rd Floor", hall: "Room 1", name: "Building 14 (New Mechanical Design)" },
  "14302-50": { bldg: 14, floor: "3rd Floor", hall: "Room 2", name: "Building 14 (New Mechanical Design)" },
  "17400-56": { bldg: 17, floor: "4th Floor", hall: "Room 56", name: "Building 17 (Mechanical Power)" },
  "17301-56": { bldg: 17, floor: "3rd Floor", hall: "Room 1", name: "Building 17 (Mechanical Power)" },
  "17302-148": { bldg: 17, floor: "3rd Floor", hall: "Hall 2", name: "Building 17 (Mechanical Power)" },
  "17200-56": { bldg: 17, floor: "2nd Floor", hall: "Room 56", name: "Building 17 (Mechanical Power)" },
  "17202-148": { bldg: 17, floor: "2nd Floor", hall: "Hall 2", name: "Building 17 (Mechanical Power)" },
  "17201":     { bldg: 17, floor: "2nd Floor", hall: "Room 201 (Dynamics)", name: "Building 17 (Mechanical Power)" },
  "19208-80":  { bldg: 19, floor: "2nd Floor", hall: "Room 208", name: "Building 19 (Automotive)" },
  "19208":     { bldg: 19, floor: "2nd Floor", hall: "Room 208 (Dynamics)", name: "Building 19 (Automotive)" }
};

const DAYS = [
  { full: "Sunday", short: "SUN", dayIdx: 0 },
  { full: "Monday", short: "MON", dayIdx: 1 },
  { full: "Tuesday", short: "TUE", dayIdx: 2 },
  { full: "Wednesday", short: "WED", dayIdx: 3 },
  { full: "Thursday", short: "THU", dayIdx: 4 }
];

const SLOTS = ["8:00 - 8:50","9:00 - 9:50","10:00 - 10:50","11:00 - 11:50","12:00 - 12:50","1:00 - 1:50","2:00 - 2:50","3:00 - 3:50","4:00 - 4:50"];
const TIME_STARTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const TIME_ENDS   = ["08:50", "09:50", "10:50", "11:50", "12:50", "13:50", "14:50", "15:50", "16:50"];

// جدول الحصص المعتمد (سكاشن الكهربية اتنقلت كلها للخميس بدون حضور مع مسحها من الأحد والاثنين)
const SESSIONS = [
  // Sunday
  { day: "Sunday", start: 0, span: 2, group: "ALL", code: "GEN G119", type: "Lecture", room: "3103-414" },
  { day: "Sunday", start: 2, span: 3, group: "ME1-01", code: "MDP G111", type: "Tutorial / Lab", room: "15401-300", attendance: true },
  { day: "Sunday", start: 2, span: 3, group: "ME1-02", code: "MDP G111", type: "Tutorial / Lab", room: "15401-300", attendance: true },
  { day: "Sunday", start: 5, span: 3, group: "ME1-03", code: "MDP G111", type: "Tutorial / Lab", room: "15401-300", attendance: true },
  { day: "Sunday", start: 5, span: 3, group: "ME1-04", code: "MDP G111", type: "Tutorial / Lab", room: "15401-300", attendance: true },

  // Monday
  { day: "Monday", start: 0, span: 2, group: "ALL", code: "MDP G121", type: "Lecture", room: "3101-306" },
  { day: "Monday", start: 2, span: 2, group: "ME1-02", code: "MTH G102", type: "Tutorial", room: "14100-(104)", attendance: true },
  { day: "Monday", start: 5, span: 2, group: "ME1-03", code: "MTH G102", type: "Tutorial", room: "17302-148", attendance: true },

  // Tuesday
  { day: "Tuesday", start: 0, span: 2, group: "ALL", code: "MTH G102", type: "Lecture", room: "7104-360", attendance: true },
  { day: "Tuesday", start: 2, span: 2, group: "ALL", code: "EPE G113", type: "Lecture", room: "7104-360" },
  { day: "Tuesday", start: 4, span: 3, group: "ME1-01", code: "MDP G121", type: "Tutorial", room: "1204-(360)" },
  { day: "Tuesday", start: 4, span: 3, group: "ME1-03", code: "MDP G121", type: "Tutorial", room: "7104-360" },

  // Wednesday
  { day: "Wednesday", start: 0, span: 2, group: "ALL", code: "MDP G111", type: "Lecture", room: "7104-360" },
  { day: "Wednesday", start: 2, span: 3, group: "ME1-02", code: "MDP G121", type: "Tutorial", room: "19208-80" },
  { day: "Wednesday", start: 2, span: 3, group: "ME1-04", code: "MDP G121", type: "Tutorial", room: "3102-306" },
  { day: "Wednesday", start: 6, span: 2, group: "ALL", code: "EMC G101", type: "Lecture", room: "7104-360" },

  // Thursday
  { day: "Thursday", start: 1, span: 2, group: "ME1-01", code: "MTH G102", type: "Tutorial", room: "14301-50", attendance: true },
  { day: "Thursday", start: 3, span: 2, group: "ME1-04", code: "MTH G102", type: "Tutorial", room: "14301-50", attendance: true },
  
  // سكاشن الكهربية الجديدة يوم الخميس (بدون حضور)
  // سكشن 1 وسكشن 2: من 12:00 إلى 1:50
  { day: "Thursday", start: 4, span: 2, group: "ME1-01", code: "EPE G113", type: "Tutorial", room: "Faculty Hall", attendance: false },
  { day: "Thursday", start: 4, span: 2, group: "ME1-02", code: "EPE G113", type: "Tutorial", room: "Faculty Hall", attendance: false },
  // سكشن 3 وسكشن 4: من 1:50 إلى 3:50
  { day: "Thursday", start: 6, span: 2, group: "ME1-03", code: "EPE G113", type: "Tutorial", room: "Faculty Hall", attendance: false },
  { day: "Thursday", start: 6, span: 2, group: "ME1-04", code: "EPE G113", type: "Tutorial", room: "Faculty Hall", attendance: false }
];

const MONDAY_DYNAMICS_SLOTS = {
  "1": { day: "Monday", start: 0, span: 3, group: "SEC", isDynSec: true, code: "EMC G101", type: "Tutorial (Slot 1)", room: "19208" },
  "2": { day: "Monday", start: 3, span: 3, group: "SEC", isDynSec: true, code: "EMC G101", type: "Tutorial (Slot 2)", room: "19208" },
  "3": { day: "Monday", start: 6, span: 3, group: "SEC", isDynSec: true, code: "EMC G101", type: "Tutorial (Slot 3)", room: "17201" }
};
