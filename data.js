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
    instructor: "Dr. Tamer El-Hariry" 
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

// تكليفات المواد الثابتة
const COURSE_STATIC_ASSIGNMENTS = [
  {
    id: "gen-quiz-1",
    code: "GEN G119",
    title: "Quiz 1 — Marketing (20 Questions / 5 Mins)",
    type: "In-Class Quiz",
    day: "Sunday",
    start: "2026-10-04T08:00:00",
    deadlinesByGroup: {
      "ME1-01": "2026-10-04T08:05:00",
      "ME1-02": "2026-10-04T08:05:00",
      "ME1-03": "2026-10-04T08:05:00",
      "ME1-04": "2026-10-04T08:05:00"
    },
    folderUrl: "https://drive.google.com/file/d/1EcxDGu2vcXayuRs6Ytep9kYdLgqUInRs/view?usp=drivesdk",
    desc: `كويز 1 أول المحاضرة على Chapter 1
• عدد الأسئلة: 20 سؤال في 5 دقائق.
• النظام: مكس بين MCQ و True or False.
• الأسئلة بتيجي مباشرة ومطابقة لأسئلة الـ Test Bank.`,
    note: "المكان: مدرج 3103 مبنى 3 — احضر قبل الساعة 8:00 صباحاً."
  },
  {
    id: "mth-assign-1",
    code: "MTH G102",
    title: "Assignment 1 — Linear Algebra (سؤالين الشيت)",
    type: "Assignment",
    day: "Thursday",
    start: "2026-09-24T08:00:00",
    deadlinesByGroup: {
      "ME1-01": "2026-10-29T09:00:00",
      "ME1-02": "2026-10-26T10:00:00",
      "ME1-03": "2026-10-26T13:00:00",
      "ME1-04": "2026-10-29T11:00:00"
    },
    folderUrl: "https://drive.google.com/drive/folders/1qlO9-i9plEckcSaTcEKb7tDymh01ALUl",
    desc: `حل السؤالين المحددين في آخر الشيت تحت عنوان Assignment بخط واضح.
• تم تأجيل التسليم ليكون مجمعاً في الأسبوع السادس أو السابع.`,
    note: "التسليم مجمع في الأسبوع 6 أو 7 ولا يوجد غياب في السكشن."
  }
];

// دليل الأسابيع الدراسي الشامل المعتمد (Weekly Guides)
const DEFAULT_WEEKLY_GUIDES = [
  // ===================== WEEK 1 =====================
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
      { title: "م. أحمد المغربي (فيديو 2 لـ د 30:45)", url: "https://youtu.be/8ANactIJ6Sk?si=6qaK7EO2R-LSh9BB" }
    ],
    summary_title: "ملاحظات ونوتس المحاضرة (Notes)",
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
    lectures: "Double Integrals (Part 2) — Polar Regions + Applications",
    slides_url: "https://drive.google.com/file/d/1IxaAIvGE0t4ysmkjteIsfPXMAZHJOBgY/view?usp=drivesdk",
    sheet: "Sheet 2 & Assignment 2",
    sheet_url: "https://drive.google.com/drive/folders/19hZKh8cS5TjO4l0RpP5lFuxBabD98xjV",
    solution_url: "https://drive.google.com/drive/folders/1kKt7qJh3AtBWpXIWd1EuTtHlsuNvmH-N",
    practice: "حل مسائل شيت 2 وتطبيقات الـ Mass & Centroid",
    playlists: [
      { title: "م. عمار ياسر — تحويلات الـ coordinates", url: "https://youtu.be/ndfc1-8hWuI?si=mTeyC2VR8GjKw6oW" },
      { title: "م. عمار ياسر — Polar Regions", url: "https://youtu.be/QDhYk9H45NU?si=wno0MdzjRioiUxn5" },
      { title: "م. عمار ياسر — Applications", url: "https://youtu.be/j6eAM5iBsIw?si=DVE7LnWR4YTDNMpC" },
      { title: "م. أحمد المغربي (من د 30:45 للآخر)", url: "https://youtu.be/8ANactIJ6Sk?si=K3ngEnj_URhjy7Tl" }
    ],
    summary_title: "ملاحظات ونوتس المحاضرة + مسائل محلولة لدكتور أحمد",
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

  // ===================== WEEK 3 (PREPARATION) =====================
  {
    week: "Week 3",
    code: "MDP G121",
    lectures: "⚡ Preparation: Lecture 3 | Crystal Structure",
    slides_url: "https://drive.google.com/file/d/1MiCum9ETO6BT9InyOzEu1xqT4mmjHl-3/view?usp=drivesdk",
    sheet: "Crystal Structure Tutorial & Recordings",
    sheet_url: "https://drive.google.com/file/d/1Y5_Qf5AIDxCfrk-3xMhINI9qyEO-IDTc/view?usp=drivesdk",
    solution_url: "https://drive.google.com/drive/folders/1JJXsMCKmnz0ysbthqYHOMoRPzVLgQdN_",
    practice: "⚠ تنبيه مهم جداً: جزء الـ Crystal Structure هيكون عليه كويز وأساينمنت قريباً، حضّره من التسجيلات قبل المحاضرة.",
    playlists: [
      { title: "سكشن م. هدى — جزء 1", url: "https://youtu.be/jtAnYnw8cyI?si=3Kbjrc_zFtLJIXIy" },
      { title: "سكشن م. هدى — جزء 2", url: "https://youtu.be/MmA4d50-h6E?si=XWDYIO78es-sygIC" }
    ],
    summary_title: "تسجيلات المحاضرة المباشرة (Recordings Folder)",
    summary_url: "https://drive.google.com/drive/folders/1JJXsMCKmnz0ysbthqYHOMoRPzVLgQdN_"
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

let DYNAMICS_ROADMAP_STEPS = [
  { week: 1, title: "Course Introduction & Kinematics of Particles (Rectilinear Motion)", date: "Sep 20 - Sep 24", the: "—" },
  { week: 2, title: "Curvilinear Motion (Cartesian & Polar Coordinates) & Velocity Relation", date: "Sep 27 - Oct 01", the: "THE 1 Active (THE 2 Oct 9)" },
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
  { week: 2, date: "Sep 28", lecture: "Atomic Structure & Interatomic Bonding", tut: "Interatomic Bonding (Tut)", lab: null },
  { week: 3, date: "Oct 5", lecture: "Crystal Structures-1 (Quiz + Assign)", tut: "Crystal Structures-1 (Tut)", lab: null },
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
    grading: "• الميد من 30 درجة (20 تكامل + 10 جبر)\n• التكامل: كويز واحد + أساينمنت محسوب في أعمال السنة\n• الجبر: كويزين (MCQ + Written) + أساينمنت الدكتورة بتبص عليه",
    tips: "المادة متقسمة نصين:\n1. التكامل (Multivariable Integration): بيعتمد على أساسيات calc 2 وخفيف جداً، كان بيدينا د. أحمد عبد النبي امتحاناته لذيذة.\n2. الجبر الخطي (Linear Algebra): محتاج فهم النظري والـ concepts (بالذات في الميد) مع كتر الحل عشان تثبت السيستم. دكتورة لوسي كان الحضور عندها مهم للغاية وبتنادي من الكشف.\n\nملخص المذاكرة:\n- التكامل أسهل بكتير سواء في الامتحانات أو الحضور.\n- أساينمنت التكامل بيتحسب من أعمال السنة، وأساينمنت الجبر بتبص عليه الدكتورة.",
    links: [
      { title: "📁 درايف الدفعة لمادة الماث", url: "https://drive.google.com/drive/folders/1MVpos5NHkVElYILFX3dTQv4s0fFBmdzD" },
      { title: "📁 فولدر أساينمنت اللينير (Assignment 1)", url: "https://drive.google.com/drive/folders/1qlO9-i9plEckcSaTcEKb7tDymh01ALUl" }
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
      { title: "📁 درايف الدفعة لمادة الهندسة الكهربية (EPE I)", url: "https://drive.google.com/drive/folders/1pk7PS5s3qRAOu6YTNvZoOaBziQoBhtVz?usp=drive_link" }
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
    tips: "دكتور سمير أبو هديمة متعاون جداً وبيحب الحضور وأي سؤال في المحاضرة عليه بونص.\nالـ Take Home Exam بيبقوا 9 امتحانات، بيتسلم كل جمعة واحد، لو اتأخرت بتاخد ماينص ولو سلمت بدري بتاخد بونص.\nالأسبوع ده مفيش THE 2، هينزل رسمياً يوم 9 أكتوبر.",
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
  9:  "https://maps.google.com/?q=30.0260,31.2082",
  14: "https://maps.google.com/?q=30.0264,31.2069",
  15: "https://maps.google.com/?q=30.0261,31.2056",
  16: "https://maps.google.com/?q=30.0252,31.2079",
  17: "https://maps.google.com/?q=30.0245,31.2085",
  19: "https://maps.google.com/?q=30.0243,31.2072"
};

const ROOM_INFO = {
  "3103-414": { bldg: 3, floor: "1st Floor", hall: "Hall 3 (Capacity: 414)", name: "Building 3 (Architecture & Computer Eng.)" },
  "3101-306": { bldg: 3, floor: "1st Floor", hall: "Hall 1 (Capacity: 306)", name: "Building 3 (Architecture & Computer Eng.)" },
  "3102-306": { bldg: 3, floor: "1st Floor", hall: "Hall 2", name: "Building 3 (Architecture & Computer Eng.)" },
  "7104-360": { bldg: 7, floor: "1st Floor", hall: "Hall 4 (Capacity: 360)", name: "Building 7 (El-Sawy Hall Complex)" },
  "1204-(360)": { bldg: 1, floor: "2nd Floor", hall: "Hall 1204 (Preparatory)", name: "Preparatory Building" },
  "14401":    { bldg: 14, floor: "4th Floor", hall: "Hall 14401 (Drawing)", name: "Building 14 (Mechanical Design)" },
  "14100-(104)": { bldg: 14, floor: "1st Floor", hall: "Hall 100", name: "Building 14 (New Mechanical Design)" },
  "14201-50": { bldg: 14, floor: "2nd Floor", hall: "Room 1", name: "Building 14 (New Mechanical Design)" },
  "14301-50": { bldg: 14, floor: "3rd Floor", hall: "Room 1", name: "Building 14 (New Mechanical Design)" },
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
  { full: "Sunday", short: "SUN", dayIdx: 0 },
  { full: "Monday", short: "MON", dayIdx: 1 },
  { full: "Tuesday", short: "TUE", dayIdx: 2 },
  { full: "Wednesday", short: "WED", dayIdx: 3 },
  { full: "Thursday", short: "THU", dayIdx: 4 }
];

const SLOTS = ["8:00 - 8:50","9:00 - 9:50","10:00 - 10:50","11:00 - 11:50","12:00 - 12:50","1:00 - 1:50","2:00 - 2:50","3:00 - 3:50","4:00 - 4:50"];
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
  { day: "Monday", start: 2, span: 2, group: "ME1-02", code: "MTH G102", type: "Tutorial", room: "14100-(104)", attendance: false },
  { day: "Monday", start: 5, span: 2, group: "ME1-03", code: "MTH G102", type: "Tutorial", room: "17302-148", attendance: false },

  // Tuesday
  { day: "Tuesday", start: 0, span: 2, group: "ALL", code: "MTH G102", type: "Lecture", room: "7104-360", attendance: true },
  { day: "Tuesday", start: 2, span: 2, group: "ALL", code: "EPE G113", type: "Lecture", room: "7104-360" },
  // سكشن الماتيريال: سكشن 1 و 3 مدمجين في الساوي 7104
  { day: "Tuesday", start: 4, span: 3, group: "ME1-01", code: "MDP G121", type: "Tutorial", room: "7104-360" },
  { day: "Tuesday", start: 4, span: 3, group: "ME1-03", code: "MDP G121", type: "Tutorial", room: "7104-360" },

  // Wednesday
  { day: "Wednesday", start: 0, span: 2, group: "ALL", code: "MDP G111", type: "Lecture", room: "7104-360" },
  // سكشن الماتيريال: سكشن 2 و 4 مدمجين في 3102
  { day: "Wednesday", start: 2, span: 3, group: "ME1-02", code: "MDP G121", type: "Tutorial", room: "3102-306" },
  { day: "Wednesday", start: 2, span: 3, group: "ME1-04", code: "MDP G121", type: "Tutorial", room: "3102-306" },
  { day: "Wednesday", start: 6, span: 2, group: "ALL", code: "EMC G101", type: "Lecture", room: "7104-360" },

  // Thursday
  { day: "Thursday", start: 1, span: 2, group: "ME1-01", code: "MTH G102", type: "Tutorial", room: "14301-50", attendance: false },
  { day: "Thursday", start: 3, span: 2, group: "ME1-04", code: "MTH G102", type: "Tutorial", room: "14301-50", attendance: false },
  
  // سكاشن الكهربية (الخميس)
  { day: "Thursday", start: 4, span: 2, group: "ME1-01", code: "EPE G113", type: "Tutorial", room: "Faculty Hall", attendance: false },
  { day: "Thursday", start: 4, span: 2, group: "ME1-02", code: "EPE G113", type: "Tutorial", room: "Faculty Hall", attendance: false },
  { day: "Thursday", start: 6, span: 2, group: "ME1-03", code: "EPE G113", type: "Tutorial", room: "Faculty Hall", attendance: false },
  { day: "Thursday", start: 6, span: 2, group: "ME1-04", code: "EPE G113", type: "Tutorial", room: "Faculty Hall", attendance: false }
];

// سكشن الديناميكا التبادلي (الاثنين)
const MONDAY_DYNAMICS_SLOTS = {
  "1": { day: "Monday", start: 0, span: 3, group: "SEC", isDynSec: true, code: "EMC G101", type: "Tutorial (Slot 1)", room: "16211" },
  "2": { day: "Monday", start: 3, span: 3, group: "SEC", isDynSec: true, code: "EMC G101", type: "Tutorial (Slot 2)", room: "9201" }
};


