/* ============================================================
   data-questions.js — QUIZ QUESTION BANKS
   ------------------------------------------------------------
   ▸ FACTS  = general world geography questions (English)
   ▸ PHYS   = rivers / mountains / oceans / deserts (English)
   ▸ FACTS_AR / PHYS_AR = the same questions in Arabic
   Format per question:
   q = question text, a = correct answer,
   w = 3 wrong answers, n = explanation shown after answering
============================================================ */
const FACTS = [
{q:"Which river is traditionally considered the longest in the world?",a:"The Nile",w:["The Amazon","The Yangtze","The Mississippi"],n:"The Nile runs about 6,650 km through northeastern Africa."},
{q:"Which is the largest ocean on Earth?",a:"Pacific Ocean",w:["Atlantic Ocean","Indian Ocean","Arctic Ocean"],n:"The Pacific covers about one third of the Earth's surface."},
{q:"What is the largest hot desert in the world?",a:"The Sahara",w:["The Gobi","The Kalahari","The Arabian Desert"],n:"The Sahara covers much of North Africa — roughly the size of the United States."},
{q:"Mount Everest sits on the border of which two countries?",a:"Nepal and China",w:["India and Pakistan","Nepal and India","China and Bhutan"],n:"Everest straddles Nepal and Tibet (China) in the Himalayas."},
{q:"Which is the largest island in the world?",a:"Greenland",w:["Madagascar","Borneo","New Guinea"],n:"Greenland is an autonomous territory of Denmark."},
{q:"Which canal connects the Mediterranean Sea and the Red Sea?",a:"The Suez Canal",w:["The Panama Canal","The Corinth Canal","The Kiel Canal"],n:"The Suez Canal in Egypt opened in 1869."},
{q:"In which country is Machu Picchu located?",a:"Peru",w:["Chile","Bolivia","Ecuador"],n:"Machu Picchu was built by the Inca high in the Andes."},
{q:"The Taj Mahal is located in which country?",a:"India",w:["Pakistan","Iran","Turkey"],n:"The Taj Mahal in Agra was completed in 1653."},
{q:"Which country currently has the largest population?",a:"India",w:["China","United States","Indonesia"],n:"India surpassed China as the most populous country in 2023."},
{q:"What is the smallest country in the world?",a:"Vatican City",w:["Monaco","San Marino","Malta"],n:"Vatican City, inside Rome, covers only about 0.49 km²."},
{q:"Which city hosts the headquarters of the United Nations?",a:"New York City",w:["Geneva","Vienna","Paris"],n:"The UN headquarters opened in New York in 1952."},
{q:"Christ the Redeemer overlooks which city?",a:"Rio de Janeiro",w:["São Paulo","Lima","Bogotá"],n:"The statue stands on Corcovado mountain in Brazil."},
{q:"In which country would you find the city of Marrakesh?",a:"Morocco",w:["Tunisia","Egypt","Algeria"],n:"Marrakesh sits at the foot of Morocco's Atlas Mountains."},
{q:"The Statue of Liberty was a gift from which country?",a:"France",w:["United Kingdom","Spain","Italy"],n:"France gave the statue to the United States in 1886."},
{q:"The Bosphorus Strait runs through which city?",a:"Istanbul",w:["Athens","Cairo","Venice"],n:"It separates European Istanbul from Asian Istanbul."},
{q:"Which country is home to the Great Barrier Reef?",a:"Australia",w:["Fiji","Indonesia","Philippines"],n:"It is the largest coral reef system in the world."}
];
const PHYS = [
{q:"Which ocean lies between Africa and Australia?",a:"Indian Ocean",w:["Atlantic Ocean","Pacific Ocean","Southern Ocean"],n:"The Indian Ocean is the third-largest ocean."},
{q:"Into which ocean does the Amazon River flow?",a:"Atlantic Ocean",w:["Pacific Ocean","Caribbean Sea","Indian Ocean"],n:"The Amazon releases about 20% of all river water entering the oceans."},
{q:"Which is the highest mountain in the Americas?",a:"Aconcagua",w:["Denali","Mont Blanc","Kilimanjaro"],n:"Aconcagua (6,961 m) is in Argentina, near the Chilean border."},
{q:"The Atacama Desert, one of the driest places on Earth, is on which continent?",a:"South America",w:["Africa","Asia","Australia"],n:"Parts of the Atacama in Chile have never recorded rainfall."},
{q:"Which is the deepest lake in the world?",a:"Lake Baikal",w:["Caspian Sea","Lake Tanganyika","Lake Superior"],n:"Baikal, in Siberia (Russia), is over 1,600 m deep."},
{q:"Which river is the longest in Europe?",a:"The Volga",w:["The Danube","The Rhine","The Seine"],n:"The Volga flows through western Russia into the Caspian Sea."},
{q:"The Mariana Trench is located in which ocean?",a:"Pacific Ocean",w:["Atlantic Ocean","Indian Ocean","Arctic Ocean"],n:"Its deepest point, Challenger Deep, is about 10,935 m down."},
{q:"Which strait separates Asia from North America?",a:"The Bering Strait",w:["The Strait of Gibraltar","The Bosphorus","The Strait of Malacca"],n:"It lies between Russia's Chukotka and the US state of Alaska."},
{q:"Which desert covers much of Mongolia and northern China?",a:"The Gobi Desert",w:["The Sahara","The Kalahari","The Namib"],n:"The Gobi is a cold desert, with winter temperatures far below freezing."},
{q:"Which is the largest lake in Africa?",a:"Lake Victoria",w:["Lake Tanganyika","Lake Chad","Lake Malawi"],n:"Lake Victoria borders Uganda, Kenya and Tanzania."},
{q:"Mount Kilimanjaro is located in which country?",a:"Tanzania",w:["Kenya","Ethiopia","Uganda"],n:"Kilimanjaro (5,895 m) is Africa's highest mountain."},
{q:"The Rhine River flows into which sea?",a:"The North Sea",w:["The Baltic Sea","The Mediterranean Sea","The Black Sea"],n:"The Rhine rises in the Swiss Alps and reaches the sea in the Netherlands."},
{q:"Which is the coldest continent on Earth?",a:"Antarctica",w:["Europe","Asia","North America"],n:"Temperatures below −89 °C have been recorded there."},
{q:"The Nile River flows into which sea?",a:"The Mediterranean Sea",w:["The Red Sea","The Arabian Sea","The Black Sea"],n:"The Nile empties into the Mediterranean through its delta in Egypt."},
{q:"Which waterfall is the tallest in the world?",a:"Angel Falls",w:["Niagara Falls","Victoria Falls","Iguazu Falls"],n:"Angel Falls (979 m) plunges off a tepui in Venezuela."},
{q:"What is the imaginary line at 0° latitude called?",a:"The Equator",w:["The Prime Meridian","The Tropic of Cancer","The International Date Line"],n:"The Equator divides Earth into the Northern and Southern Hemispheres."}
];
const FACTS_AR = [
{q:"ما النهر الذي يُعد تقليديًا أطول أنهار العالم؟",a:"النيل",w:["نهر الأمازون","نهر اليانغتسي","نهر المسيسيبي"],n:"يمتد النيل نحو 6650 كم في شمال شرق أفريقيا."},
{q:"ما أكبر محيطات الأرض؟",a:"المحيط الهادئ",w:["المحيط الأطلسي","المحيط الهندي","المحيط المتجمد الشمالي"],n:"يغطي المحيط الهادئ نحو ثلث سطح الأرض."},
{q:"ما أكبر صحراء حارة في العالم؟",a:"الصحراء الكبرى",w:["صحراء غوبي","صحراء كالاهاري","الصحراء العربية"],n:"تغطي الصحراء الكبرى شمال أفريقيا بمساحة تقارب مساحة الولايات المتحدة."},
{q:"يقع جبل إفرست على حدود أي بلدين؟",a:"نيبال والصين",w:["الهند وباكستان","نيبال والهند","الصين وبوتان"],n:"يقع إفرست بين نيبال والتبت (الصين) في جبال الهيمالايا."},
{q:"ما أكبر جزيرة في العالم؟",a:"غرينلاند",w:["مدغشقر","بورنيو","غينيا الجديدة"],n:"غرينلاند إقليم ذاتي الحكم تابع للدنمارك."},
{q:"أي قناة تربط البحر المتوسط بالبحر الأحمر؟",a:"قناة السويس",w:["قناة بنما","قناة كورنث","قناة كيل"],n:"افتُتحت قناة السويس المصرية عام 1869."},
{q:"في أي دولة يقع ماتشو بيتشو؟",a:"بيرو",w:["تشيلي","بوليفيا","الإكوادور"],n:"بنى الإنكا ماتشو بيتشو في مرتفعات جبال الأنديز."},
{q:"في أي دولة يقع تاج محل؟",a:"الهند",w:["باكستان","إيران","تركيا"],n:"اكتمل بناء تاج محل في أغرا عام 1653."},
{q:"ما الدولة الأكثر سكانًا حاليًا؟",a:"الهند",w:["الصين","الولايات المتحدة","إندونيسيا"],n:"تجاوزت الهند الصينَ كأكثر دول العالم سكانًا عام 2023."},
{q:"ما أصغر دولة في العالم؟",a:"الفاتيكان",w:["موناكو","سان مارينو","مالطا"],n:"الفاتيكان داخل روما ولا تتجاوز مساحته 0.49 كم²."},
{q:"في أي مدينة يقع مقر الأمم المتحدة الرئيسي؟",a:"نيويورك",w:["جنيف","فيينا","باريس"],n:"افتُتح مقر الأمم المتحدة في نيويورك عام 1952."},
{q:"يطل تمثال المسيح المفدي على أي مدينة؟",a:"ريو دي جانيرو",w:["ساو باولو","ليما","بوغوتا"],n:"يقف التمثال على جبل كوركوفادو في البرازيل."},
{q:"في أي دولة تقع مدينة مراكش؟",a:"المغرب",w:["تونس","مصر","الجزائر"],n:"تقع مراكش عند سفح جبال الأطلس في المغرب."},
{q:"من أي دولة كان تمثال الحرية هديةً؟",a:"فرنسا",w:["المملكة المتحدة","إسبانيا","إيطاليا"],n:"أهدت فرنسا التمثال إلى الولايات المتحدة عام 1886."},
{q:"يمر مضيق البوسفور في أي مدينة؟",a:"إسطنبول",w:["أثينا","القاهرة","البندقية"],n:"يفصل البوسفور إسطنبول الأوروبية عن إسطنبول الآسيوية."},
{q:"في أي دولة يقع الحاجز المرجاني العظيم؟",a:"أستراليا",w:["فيجي","إندونيسيا","الفلبين"],n:"هو أكبر منظومة شعاب مرجانية في العالم."}
];
const PHYS_AR = [
{q:"أي محيط يقع بين أفريقيا وأستراليا؟",a:"المحيط الهندي",w:["المحيط الأطلسي","المحيط الهادئ","المحيط المتجمد الجنوبي"],n:"المحيط الهندي ثالث أكبر المحيطات."},
{q:"في أي محيط يصبّ نهر الأمازون؟",a:"المحيط الأطلسي",w:["المحيط الهادئ","بحر الكاريبي","المحيط الهندي"],n:"يصبّ الأمازون نحو 20٪ من مياه الأنهار في المحيطات."},
{q:"ما أعلى جبل في الأمريكيتين؟",a:"أكونكاغوا",w:["دينالي","مون بلان","كليمنجارو"],n:"أكونكاغوا (6961 م) في الأرجنتين قرب الحدود التشيلية."},
{q:"صحراء أتاكاما، من أجف مناطق الأرض، تقع في أي قارة؟",a:"أمريكا الجنوبية",w:["أفريقيا","آسيا","أستراليا"],n:"أجزاء من أتاكاما التشيلية لم تُسجَّل فيها أمطار قط."},
{q:"ما أعمق بحيرة في العالم؟",a:"بحيرة بايكال",w:["بحر قزوين","بحيرة تنجانيقا","بحيرة سوبيريور"],n:"بايكال في سيبيريا (روسيا) يزيد عمقها على 1600 متر."},
{q:"ما أطول نهر في أوروبا؟",a:"الفولغا",w:["نهر الدانوب","نهر الراين","نهر السين"],n:"يجري الفولغا في غرب روسيا ويصبّ في بحر قزوين."},
{q:"في أي محيط يقع خندق ماريانا؟",a:"المحيط الهادئ",w:["المحيط الأطلسي","المحيط الهندي","المحيط المتجمد الشمالي"],n:"أعمق نقطة فيه، تشالنجر ديب، نحو 10935 مترًا تحت السطح."},
{q:"أي مضيق يفصل آسيا عن أمريكا الشمالية؟",a:"مضيق بيرنغ",w:["مضيق جبل طارق","مضيق البوسفور","مضيق ملقا"],n:"يقع بين روسيا (تشوكوتكا) وألاسكا الأمريكية."},
{q:"أي صحراء تغطي معظم منغوليا وشمال الصين؟",a:"صحراء غوبي",w:["الصحراء الكبرى","صحراء كالاهاري","صحراء ناميب"],n:"غوبي صحراء باردة تنخفض درجات حرارتها شتاءً كثيرًا."},
{q:"ما أكبر بحيرات أفريقيا؟",a:"بحيرة فيكتوريا",w:["بحيرة تنجانيقا","بحيرة تشاد","بحيرة مالاوي"],n:"تحد فيكتوريا أوغندا وكينيا وتنزانيا."},
{q:"في أي دولة يقع جبل كليمنجارو؟",a:"تنزانيا",w:["كينيا","إثيوبيا","أوغندا"],n:"كليمنجارو (5895 م) أعلى قمم أفريقيا."},
{q:"في أي بحر يصبّ نهر الراين؟",a:"بحر الشمال",w:["بحر البلطيق","البحر المتوسط","البحر الأسود"],n:"ينبع الراين من جبال الألب السويسرية ويصل إلى البحر في هولندا."},
{q:"ما أبرد قارات الأرض؟",a:"أنتاركتيكا",w:["أوروبا","آسيا","أمريكا الشمالية"],n:"سُجلت فيها درجات حرارة دون −89 درجة مئوية."},
{q:"في أي بحر يصبّ نهر النيل؟",a:"البحر المتوسط",w:["البحر الأحمر","بحر العرب","البحر الأسود"],n:"يصبّ النيل في المتوسط عبر دلتاه في مصر."},
{q:"ما أعلى شلالات العالم؟",a:"شلالات أنجل",w:["شلالات نياغرا","شلالات فيكتوريا","شلالات إغوازو"],n:"تنهمر أنجل (979 م) من هضبة في فنزويلا."},
{q:"ما الخط الوهمي عند خط عرض 0 درجة؟",a:"خط الاستواء",w:["خط غرينتش","مدار السرطان","خط التاريخ الدولي"],n:"يقسم خط الاستواء الأرض إلى نصفين شمالي وجنوبي."}
];