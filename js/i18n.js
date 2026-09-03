/* ============================================================
   i18n.js — UI LABELS (EN/AR) + LANGUAGE SWITCHING
   ------------------------------------------------------------
   ▸ To change any visible label, button, heading or message:
     edit it in the UI dictionary below (en: and ar: blocks).
   ▸ {n} {a} {b} are placeholders filled at runtime.
   Also contains the localized data accessors (cName, cCap...)
   used by every view, and the language toggle logic.
============================================================ */
const UI = {
en:{
doc_title:"Atlas Academy — Learn World Geography", brand:"Atlas Academy",
nav_home:"Home",nav_countries:"Countries",nav_flags:"Flags",nav_continents:"Continents",nav_learn:"Learn",nav_quiz:"Quiz",lang_switch:"العربية",
footer_1:"Atlas Academy · Learn world geography, one country at a time.",
footer_2:"Data covers all 193 UN member states plus Vatican City and Palestine. Progress is saved locally in this browser.",
hero_eyebrow:"World Geography, Made Simple",hero_h1:"Explore every country, capital and flag on Earth.",
hero_lead:"Browse {n} country profiles across six continents, train with flip-style flashcards, and test yourself with themed quizzes. Everything runs right in your browser.",
hero_cta1:"Start a random quiz",hero_cta2:"Browse countries",didyouknow:"Did you know?",
stat_countries:"Countries",stat_learned:"Learned",stat_quizzes:"Quizzes taken",stat_acc:"Accuracy",
explore_h:"Start exploring",
idx1_t:"Countries",idx1_d:"Browse profiles, flags, capitals and key facts",idx1_m:"{n} countries",
idx2_t:"Flags",idx2_d:"A gallery of world flags with a guessing quiz",idx2_m:"{n} flags",
idx3_t:"Continents",idx3_d:"Seven continents, from Africa to Antarctica",idx3_m:"7 regions",
idx4_t:"Learning Mode",idx4_d:"Flashcards to memorize capitals, currencies and facts",idx4_m:"{n} learned",
idx5_t:"Quizzes",idx5_d:"Nine themed quizzes with instant feedback",idx5_m:"9 quiz types",
progress_h:"Your progress",reset:"Reset progress",reset_confirm:"Click again to confirm",reset_done:"Progress reset",
p_learned:"Countries learned",p_conts:"Continents explored",p_acc:"Quiz accuracy",p_answers:"answers",
ach_h:"Achievements",ach_unlocked:"Achievement unlocked",
ach1_n:"First Steps",ach1_d:"Complete your first quiz",ach2_n:"Sharp Mind",ach2_d:"Answer 10 questions correctly",
ach3_n:"Globe Trotter",ach3_d:"Open 25 country profiles",ach4_n:"Continental Tour",ach4_d:"Explore all 7 continents",
ach5_n:"Cartographer",ach5_d:"Learn 50 countries in flashcards",ach6_n:"Flag Master",ach6_d:"Score 9+ in a flag quiz",
countries_h:"Countries of the World",
countries_sub:"All {n} sovereign states — 193 UN members plus Vatican City and Palestine. Click any country for its full details.",
search_ph:"Search countries or capitals...",all:"All",count_of:"{a} of {b} countries",count_of_flags:"{a} of {b} flags",
no_countries:"No countries match your search.",no_flags:"No flags match your search.",
flags_h:"Flags of the World",flags_sub:"All {n} flags, with search and continent filters. Every flag in this gallery has a verified country code.",take_flag_quiz:"Take the flag quiz",
cont_h:"The Seven Continents",cont_sub:"Click a continent to explore its key facts and countries.",
cont_area:"Area",cont_pop:"Population",cont_high:"Highest point",cont_river:"Longest river",cont_countries:"Countries",
cont_explored:"Explored",cont_atlas:"In this atlas",cont_n_countries:"— {n} countries",
cont_antarctica_note:"There are no countries on Antarctica. It is reserved for peace and science under the Antarctic Treaty, signed in 1959, and shared by nations around the world.",
cont_click:"Click a country to open its full profile.",cont_treaty:"None — Antarctic Treaty",
learn_h:"Learning Mode",learn_sub:"Flip through flashcards and mark the countries you've mastered.",
shuffle:"Shuffle",card_of:"Card {a} of {b}",flip_hint:"Tap the card to flip it",deck_progress:"Deck progress",
tip_keys:"Tip: use the ← and → arrow keys to move between cards.",
quiz_h:"Quizzes",quiz_sub:"Nine ways to test your geography — 10 questions each, with instant feedback.",
all_quizzes:"All quizzes",score:"Score",not_taken:"Not taken yet",best:"Best {a}/10",
qc1_n:"Country → Capital",qc1_d:"Given a country, choose its capital city.",
qc2_n:"Capital → Country",qc2_d:"Given a capital city, find its country.",
qc3_n:"Flag → Country",qc3_d:"See a flag and name the country it belongs to.",
qc4_n:"Country → Flag",qc4_d:"Pick the right flag for each country.",
qc5_n:"Country → Continent",qc5_d:"Place each country on the correct continent.",
qc6_n:"Continent → Countries",qc6_d:"Which of these countries belongs to which continent?",
qc7_n:"World Geography Facts",qc7_d:"Landmarks, records and essential world trivia.",
qc8_n:"Rivers, Mountains & Oceans",qc8_d:"The physical geography of our planet.",
qc9_n:"Random Mixed",qc9_d:"A bit of everything — ten random questions.",
correct_fb:"Correct!",wrong_fb:"Not quite. The correct answer is highlighted.",
r_perfect:"Perfect score — outstanding!",r_8:"Excellent work!",r_6:"Good job — keep going!",r_4:"Not bad — review and retry.",r_low:"Keep practicing — you'll get there.",
try_again:"Try again",choose_other:"Choose another quiz",new_best:"New best score!",best_cat:"Best in this category: {a}/10",
k_capital:"Capital",k_population:"Population",k_area:"Area",k_currency:"Currency",k_langs:"Languages",k_official:"Official languages",
m_neighbors:"Neighboring countries",mark:"Mark as learned",learned:"Learned",close:"Close"
},
ar:{
doc_title:"أطلس أكاديمي — تعلم جغرافيا العالم", brand:"أطلس أكاديمي",
nav_home:"الرئيسية",nav_countries:"الدول",nav_flags:"الأعلام",nav_continents:"القارات",nav_learn:"تعلم",nav_quiz:"اختبار",lang_switch:"English",
footer_1:"أطلس أكاديمي · تعلّم جغرافيا العالم دولةً بدولة.",
footer_2:"تغطي البيانات الدول الأعضاء في الأمم المتحدة البالغة 193 دولة، إضافة إلى الفاتيكان وفلسطين. يُحفظ تقدمك محليًا في هذا المتصفح.",
hero_eyebrow:"جغرافيا العالم ببساطة",hero_h1:"استكشف كل دولة وعاصمة وعلم على وجه الأرض.",
hero_lead:"تصفح ملفات {n} دولة عبر ست قارات، وتدرّب على بطاقات تعليمية تُقلب، واختبر نفسك باختبارات متنوعة — كل ذلك يعمل داخل متصفحك.",
hero_cta1:"ابدأ اختبارًا عشوائيًا",hero_cta2:"تصفح الدول",didyouknow:"هل تعلم؟",
stat_countries:"دولة",stat_learned:"متعلمة",stat_quizzes:"اختبار",stat_acc:"الدقة",
explore_h:"ابدأ الاستكشاف",
idx1_t:"الدول",idx1_d:"تصفح الملفات والأعلام والعواصم والمعلومات الأساسية",idx1_m:"{n} دولة",
idx2_t:"الأعلام",idx2_d:"معرض أعلام العالم مع اختبار تخمين",idx2_m:"{n} علمًا",
idx3_t:"القارات",idx3_d:"سبع قارات من أفريقيا إلى أنتاركتيكا",idx3_m:"7 قارات",
idx4_t:"وضع التعلم",idx4_d:"بطاقات لحفظ العواصم والعملات والمعلومات",idx4_m:"{n} متعلمة",
idx5_t:"الاختبارات",idx5_d:"تسعة اختبارات متنوعة مع تغذية راجعة فورية",idx5_m:"9 أنواع",
progress_h:"تقدمك",reset:"إعادة تعيين التقدم",reset_confirm:"اضغط مجددًا للتأكيد",reset_done:"أُعيد تعيين التقدم",
p_learned:"الدول المتعلمة",p_conts:"القارات المستكشفة",p_acc:"دقة الاختبارات",p_answers:"إجابة",
ach_h:"الإنجازات",ach_unlocked:"إنجاز جديد",
ach1_n:"الخطوات الأولى",ach1_d:"أكمل أول اختبار",ach2_n:"عقل حاد",ach2_d:"أجب عن 10 أسئلة بشكل صحيح",
ach3_n:"جامع العالم",ach3_d:"افتح 25 ملف دولة",ach4_n:"جولة قارية",ach4_d:"استكشف القارات السبع",
ach5_n:"رسّام الخرائط",ach5_d:"تعلّم 50 دولة بالبطاقات",ach6_n:"سيّد الأعلام",ach6_d:"احصل على 9+ في اختبار الأعلام",
countries_h:"دول العالم",
countries_sub:"كل {n} دولة ذات سيادة — 193 عضوًا في الأمم المتحدة إضافة إلى الفاتيكان وفلسطين. انقر على أي دولة لعرض تفاصيلها.",
search_ph:"ابحث عن دولة أو عاصمة...",all:"الكل",count_of:"{a} من {b} دولة",count_of_flags:"{a} من {b} علم",
no_countries:"لا توجد دول تطابق بحثك.",no_flags:"لا توجد أعلام تطابق بحثك.",
flags_h:"أعلام العالم",flags_sub:"جميع الأعلام البالغ عددها {n} مع بحث ومرشحات قارات. لكل علم في المعرض رمز دولة موثّق.",take_flag_quiz:"اختبار الأعلام",
cont_h:"القارات السبع",cont_sub:"انقر على قارة لاستكشاف حقائقها الأساسية ودولها.",
cont_area:"المساحة",cont_pop:"السكان",cont_high:"أعلى قمة",cont_river:"أطول نهر",cont_countries:"الدول",
cont_explored:"تمت الاستكشاف",cont_atlas:"في هذا الأطلس",cont_n_countries:"— {n} دول",
cont_antarctica_note:"لا توجد دول على أرض أنتاركتيكا؛ فهي محفوظة للسلام والعلوم بموجب معاهدة أنتاركتيكا الموقعة عام 1959، ويشترك فيها دول العالم.",
cont_click:"انقر على أي دولة لفتح ملفها الكامل.",cont_treaty:"لا يوجد — معاهدة أنتاركتيكا",
learn_h:"وضع التعلم",learn_sub:"اقلب البطاقات التعليمية وحدّد الدول التي أتقنتها.",
shuffle:"خلط",card_of:"البطاقة {a} من {b}",flip_hint:"انقر على البطاقة لقلبها",deck_progress:"تقدم المجموعة",
tip_keys:"نصيحة: استخدم مفتاحي السهمين ← و → للتنقل بين البطاقات.",
quiz_h:"الاختبارات",quiz_sub:"تسع طرق لاختبار جغرافيتك — 10 أسئلة لكل اختبار مع تغذية راجعة فورية.",
all_quizzes:"كل الاختبارات",score:"النتيجة",not_taken:"لم يُؤخذ بعد",best:"أفضل {a}/10",
qc1_n:"دولة ← عاصمة",qc1_d:"تظهر دولة وتختار عاصمتها.",
qc2_n:"عاصمة ← دولة",qc2_d:"تظهر عاصمة وتجد دولتها.",
qc3_n:"علم ← دولة",qc3_d:"شاهد علمًا وسمِّ الدولة التي يتبعها.",
qc4_n:"دولة ← علم",qc4_d:"اختر العلم الصحيح لكل دولة.",
qc5_n:"دولة ← قارة",qc5_d:"ضع كل دولة في قارتها الصحيحة.",
qc6_n:"قارة ← دول",qc6_d:"أي من هذه الدول تقع في القارة المطلوبة؟",
qc7_n:"حقائق جغرافية عالمية",qc7_d:"معالم وأرقام ومعلومات أساسية عن العالم.",
qc8_n:"أنهار وجبال ومحيطات",qc8_d:"الجغرافيا الطبيعية لكوكبنا.",
qc9_n:"اختبار عشوائي مختلط",qc9_d:"قسط من كل شيء — عشرة أسئلة عشوائية.",
correct_fb:"إجابة صحيحة!",wrong_fb:"ليست صحيحة. الإجابة الصحيحة مظلّلة الآن.",
r_perfect:"نتيجة كاملة — مذهل!",r_8:"عمل رائع!",r_6:"أحسنت — واصل!",r_4:"ليس سيئًا — راجع وحاول مجددًا.",r_low:"واصل التدرب — ستنجح حتمًا.",
try_again:"حاول مجددًا",choose_other:"اختر اختبارًا آخر",new_best:"أفضل نتيجة جديدة!",best_cat:"أفضل نتيجة في هذه الفئة: {a}/10",
k_capital:"العاصمة",k_population:"السكان",k_area:"المساحة",k_currency:"العملة",k_langs:"اللغات",k_official:"اللغات الرسمية",
m_neighbors:"الدول المجاورة",mark:"تحديد كمتعلمة",learned:"متعلمة",close:"إغلاق"
}};

/* ---------- Language state + helpers ---------- */
let LANG = localStorage.getItem("atlas-lang")==="ar" ? "ar" : "en";
function t(k){ const d=UI[LANG]; return (d&&d[k])||UI.en[k]||k; }
function tf(k,map){ let s=t(k); for(const key in map) s=s.split("{"+key+"}").join(map[key]); return s; }

/* Localized data accessors — always fall back to the English value. */
function cName(c){ return LANG==="ar" ? ((AR[c.iso]||[])[0]||c.name) : c.name; }
function cCap(c){ return LANG==="ar" ? ((AR[c.iso]||[])[1]||c.cap) : c.cap; }
function cFact(c){ return LANG==="ar" ? ((AR[c.iso]||[])[2]||c.fact) : c.fact; }
function cCur(c){ return LANG==="ar" ? (AR_CUR[c.cur]||c.cur) : c.cur; }
function cLang(c){ return LANG==="ar" ? (AR_LANG[c.lang]||c.lang) : c.lang; }
function cReg(c){ return LANG==="ar" ? (AR_REG[c.reg]||c.reg) : c.reg; }
function contName(x){ return LANG==="ar" ? (AR_CONT[x]||x) : x; }
function contData(x){ return LANG==="ar" ? (AR_CONTINENTS[x]||CONTINENTS[x]) : CONTINENTS[x]; }
function nbName(nb){ const c=NAMED[nb]; if(c) return cName(c); return (LANG==="ar"&&AR_NB[nb])||nb; }

function setLang(l){
  LANG=l; localStorage.setItem("atlas-lang",l);
  document.documentElement.lang=l;
  document.documentElement.dir = l==="ar" ? "rtl" : "ltr";
  document.title=t("doc_title");
  closeModal();
  renderChrome();
  /* A running quiz is rebuilt in the new language so questions,
     options and notes are always coherent. */
  if(quiz && !quiz.done) startQuiz(quiz.cat);
  else VIEWS[VIEW]();
}
function toggleLang(){ setLang(LANG==="ar"?"en":"ar"); }