"use client";

import { Button } from "@/components/Button";
import { DANGEROUS_REPAIRS } from "@/lib/safety";
import { useLanguage } from "@/lib/LanguageContext";
import {
  ShieldCheckIcon,
  HeartIcon,
  AcademicCapIcon,
  LightBulbIcon,
  GlobeAmericasIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  const { t, language } = useLanguage();

  const translationsDict: Record<string, {
    title: string;
    subtitle: string;
    whyTitle: string;
    whyDesc: string;
    missionTitle: string;
    missionDesc: string;
    safetyTitle: string;
    safetyDesc: string;
    whatTitle: string;
    whatFeatures: string[];
    learnTitle: string;
    learnDesc: string;
    exploreBtn: string;
    startBtn: string;
    dangerousRepairs: string[];
  }> = {
    en: {
      title: "About RepairBuddy",
      subtitle: "Making repair safe, easy, and rewarding.",
      whyTitle: "Why we built this",
      whyDesc: "Too many working items are thrown away because fixing them feels complicated or unsafe. RepairBuddy helps neighbors repair with confidence — saving cash, reducing waste, and promoting community resilience.",
      missionTitle: "Our Mission",
      missionDesc: "To build a self-reliant community where fixing is preferred over dumping. Reduce carbon footprints, one item at a time.",
      safetyTitle: "Safety Promise",
      safetyDesc: "RepairBuddy will never give step-by-step instructions for dangerous repairs:",
      whatTitle: "What it does",
      whatFeatures: [
        "Checks whether a repair is safe for beginners",
        "Provides clear green, yellow, and red safety signals",
        "Offers beginner-safe, step-by-step guides",
        "Compares repair cost vs replacement cost",
        "Tracks money saved and waste avoided",
      ],
      learnTitle: "Learn the trades",
      learnDesc: "Repair habits connect directly to professional careers in electrical work, HVAC, automotive engineering, and electronics.",
      exploreBtn: "Explore CTE Credits",
      startBtn: "Start a repair",
      dangerousRepairs: DANGEROUS_REPAIRS,
    },
    es: {
      title: "Sobre CompañeroReparación",
      subtitle: "Haciendo la reparación segura, fácil y gratificante.",
      whyTitle: "Por qué construimos esto",
      whyDesc: "Muchos artículos útiles se desechan porque repararlos parece complicado o inseguro. CompañeroReparación ayuda a los vecinos a reparar con confianza, ahorrando dinero, reduciendo residuos y promoviendo la resiliencia comunitaria.",
      missionTitle: "Nuestra Misión",
      missionDesc: "Construir una comunidad autosuficiente donde se prefiera reparar antes que desechar. Reducir la huella de carbono, un objeto a la vez.",
      safetyTitle: "Promesa de Seguridad",
      safetyDesc: "CompañeroReparación nunca dará instrucciones paso a paso para reparaciones peligrosas:",
      whatTitle: "Qué hace",
      whatFeatures: [
        "Verifica si una reparación es segura para principiantes",
        "Proporciona señales claras de seguridad en verde, amarillo y rojo",
        "Ofrece guías paso a paso seguras para principiantes",
        "Compara el costo de reparación versus el costo de reemplazo",
        "Realiza un seguimiento del dinero ahorrado y residuos evitados",
      ],
      learnTitle: "Aprende los oficios",
      learnDesc: "Los hábitos de reparación se conectan directamente con carreras profesionales en electricidad, HVAC, ingeniería automotriz y electrónica.",
      exploreBtn: "Explorar Créditos CTE",
      startBtn: "Iniciar una reparación",
      dangerousRepairs: ["Microondas", "Cortasetos", "Baterías de Litio", "Generadores", "Estufas de Gas"],
    },
    zh: {
      title: "关于 修复伙伴",
      subtitle: "使修理变得安全、简单且有收获。",
      whyTitle: "我们为什么开发这个",
      whyDesc: "太多功能完好的物品被扔掉，因为修理它们看起来很复杂或不安全。修复伙伴帮助邻里充满信心地修理——节省资金、减少浪费并增强社区的韧性。",
      missionTitle: "我们的使命",
      missionDesc: "建立一个自给自足的社区，在这里，修理比丢弃更受欢迎。减少碳足迹，从修好每一件物品开始。",
      safetyTitle: "安全承诺",
      safetyDesc: "修复伙伴 绝对不会为危险的维修提供步骤指导：",
      whatTitle: "功能介绍",
      whatFeatures: [
        "检查修理对初学者是否安全",
        "提供清晰的绿、黄、红安全信号指示",
        "提供适合初学者的安全分步指南",
        "对比修理成本与重置成本",
        "统计节省的资金和减少的废弃物",
      ],
      learnTitle: "学习技能职业",
      learnDesc: "修理习惯可以直接对接电气工程、暖通空调(HVAC)、汽车工程和电子产品等专业职业方向。",
      exploreBtn: "探索 CTE 专业学分",
      startBtn: "开始修理",
      dangerousRepairs: ["微波炉", "绿篱修剪机", "锂电池", "发电机", "燃气灶"],
    },
    fr: {
      title: "À propos de CompagnonRéparation",
      subtitle: "Rendre les réparations sûres, faciles et gratifiantes.",
      whyTitle: "Pourquoi nous l'avons construit",
      whyDesc: "Trop d'objets sont jetés parce que les réparer semble compliqué ou dangereux. CompagnonRéparation aide à réparer en toute confiance.",
      missionTitle: "Notre Mission",
      missionDesc: "Bâtir une communauté autonome où réparer est préféré à jeter.",
      safetyTitle: "Promesse de sécurité",
      safetyDesc: "CompagnonRéparation ne donnera jamais d'instructions pour les réparations dangereuses :",
      whatTitle: "Ce qu'il fait",
      whatFeatures: [
        "Vérifie si la réparation est sûre pour les débutants",
        "Affiche des signaux de sécurité clairs (vert, jaune, rouge)",
        "Propose des guides DIY simples",
        "Compare le coût de réparation au remplacement",
        "Calcule l'argent économisé et les déchets évités",
      ],
      learnTitle: "Apprendre les métiers",
      learnDesc: "Les compétences de réparation mènent à des carrières techniques.",
      exploreBtn: "Explorer les crédits CTE",
      startBtn: "Commencer une réparation",
      dangerousRepairs: ["Micro-ondes", "Taille-haie", "Batteries Lithium", "Générateurs", "Gazinières"],
    },
    ar: {
      title: "حول صديق_الإصلاح",
      subtitle: "جعل الإصلاح آمناً وسهلاً ومجزياً.",
      whyTitle: "لماذا بنينا هذا",
      whyDesc: "يتم التخلص من العديد من العناصر الصالحة لأن إصلاحها يبدو معقدًا أو غير آمن. يساعد صديق_الإصلاح في الإصلاح بثقة.",
      missionTitle: "مهمتنا",
      missionDesc: "بناء مجتمع يعتمد على نفسه ويفضل الإصلاح على التخلص من الأشياء.",
      safetyTitle: "وعد السلامة",
      safetyDesc: "لن يقدم صديق_الإصلاح إرشادات لإصلاحات خطيرة:",
      whatTitle: "ماذا يقدم",
      whatFeatures: [
        "يتحقق مما إذا كان الإصلاح آمنًا للمبتدئين",
        "يوفر إشارات سلامة واضحة بالألوان",
        "يقدم أدلة إصلاح خطوة بخطوة للمبتدئين",
        "يقارن تكلفة الإصلاح بالاستبدال",
        "يتتبع الأموال الموفرة والنفايات التي تم تجنبها",
      ],
      learnTitle: "تعلم المهن",
      learnDesc: "ترتبط مهارات الإصلاح بالوظائف المهنية التقنية.",
      exploreBtn: "استكشف اعتمادات CTE",
      startBtn: "ابدأ الإصلاح",
      dangerousRepairs: ["الميكروويف", "آلة قص التحوط", "بطاريات الليثيوم", "المولدات", "مواقد الغاز"],
    },
    hi: {
      title: "मरम्मतमित्र के बारे में",
      subtitle: "मरम्मत को सुरक्षित, आसान और फायदेमंद बनाना।",
      whyTitle: "हमने इसे क्यों बनाया",
      whyDesc: "कई काम करने वाली चीजें फेंक दी जाती हैं क्योंकि उन्हें ठीक करना कठिन या असुरक्षित लगता है। मरम्मतमित्र विश्वास के साथ मरम्मत करने में मदद करता है।",
      missionTitle: "हमारा उद्देश्य",
      missionDesc: "एक आत्मनिर्भर समुदाय का निर्माण करना जहां फेंकने के बजाय ठीक करने को प्राथमिकता दी जाए।",
      safetyTitle: "सुरक्षा वादा",
      safetyDesc: "मरम्मतमित्र खतरनाक मरम्मत के लिए कभी निर्देश नहीं देगा:",
      whatTitle: "यह क्या करता है",
      whatFeatures: [
        "जांच करता है कि क्या मरम्मत शुरुआती लोगों के लिए सुरक्षित है",
        "स्पष्ट सुरक्षा संकेत (हरा, पीला, लाल) प्रदान करता है",
        "सरल चरण-दर-चरण गाइड प्रदान करता है",
        "बदलने की तुलना में मरम्मत की लागत की तुलना करता है",
        "बचाए गए पैसे और टाले गए कचरे को ट्रैक करता है",
      ],
      learnTitle: "व्यापार सीखें",
      learnDesc: "मरम्मत की आदतें सीधे पेशेवर करियर से जुड़ती हैं।",
      exploreBtn: "CTE क्रेडिट खोजें",
      startBtn: "मरम्मत शुरू करें",
      dangerousRepairs: ["माइक्रोवेव", "हेज ट्रिमर", "लिथियम बैटरी", "जेनरेटर", "गैस स्टोव"],
    },
    pt: {
      title: "Sobre CompanheiroReparo",
      subtitle: "Tornando o reparo seguro, fácil e recompensador.",
      whyTitle: "Por que criamos isso",
      whyDesc: "Muitos itens úteis são descartados porque consertá-los parece difícil. CompanheiroReparo ajuda a consertar com confiança.",
      missionTitle: "Nossa Missão",
      missionDesc: "Construir uma comunidade autossuficiente onde consertar é preferível a descartar.",
      safetyTitle: "Promessa de Segurança",
      safetyDesc: "O CompanheiroReparo nunca dará instruções para reparos perigosos:",
      whatTitle: "O que ele faz",
      whatFeatures: [
        "Verifica se o reparo é seguro para iniciantes",
        "Fornece sinais claros de segurança (verde, amarelo, vermelho)",
        "Oferece guias DIY simples",
        "Compara o custo de reparo com a substituição",
        "Acompanha o dinheiro economizado e o lixo evitado",
      ],
      learnTitle: "Aprenda os ofícios",
      learnDesc: "Os hábitos de conserto conectam-se a carreiras técnicas.",
      exploreBtn: "Explorar Créditos CTE",
      startBtn: "Iniciar reparo",
      dangerousRepairs: ["Micro-ondas", "Cortador de Cerca", "Baterias de Lítio", "Geradores", "Fogões a Gás"],
    },
    ko: {
      title: "수리친구 소개",
      subtitle: "수리를 안전하고 쉽고 가치 있게 만듭니다.",
      whyTitle: "개발 배경",
      whyDesc: "수리가 복잡하고 위험해 보여 쓸 만한 물건들이 버려집니다. 수리친구는 안전하고 쉬운 자가 수리를 도와줍니다.",
      missionTitle: "우리의 미션",
      missionDesc: "버리는 대신 수리하는 자립적인 커뮤니티를 만듭니다.",
      safetyTitle: "안전 약속",
      safetyDesc: "수리친구는 위험한 수리에 대해 절대 지침을 제공하지 않습니다:",
      whatTitle: "기능",
      whatFeatures: [
        "초보자에게 수리가 안전한지 확인",
        "녹색, 황색, 적색의 명확한 안전 신호 제공",
        "안전한 단계별 DIY 가이드 제공",
        "수리 비용과 새 제품 가격 비교",
        "절약한 비용 및 방지한 폐기물 추적",
      ],
      learnTitle: "기술 습득",
      learnDesc: "수리 습관은 전기, 전기 장비 등의 전문 기술직 진로로 연결됩니다.",
      exploreBtn: "CTE 크레딧 탐색",
      startBtn: "수리 시작",
      dangerousRepairs: ["전자레인지", "헤지 트리머", "리튬 배터리", "발전기", "가스레인지"],
    },
    ja: {
      title: "修理バディについて",
      subtitle: "修理を安全に、簡単に、そして価値あるものに。",
      whyTitle: "開発の理由",
      whyDesc: "修理が難しく危険に思えるため、多くの日常品が廃棄されています。修理バディは自信を持って自分で直せるようサポートします。",
      missionTitle: "ミッション",
      missionDesc: "捨てるよりも直すことを好む、自立したコミュニティを築くこと。",
      safetyTitle: "安全の約束",
      safetyDesc: "修理バディは危険を伴う修理について手順ガイドを提供しません：",
      whatTitle: "機能について",
      whatFeatures: [
        "修理が初心者にとって安全かチェック",
        "緑、黄、赤のわかりやすい安全シグナル表示",
        "初心者向けの安全なステップバイステップガイド",
        "修理費用と買い替え費用の比較",
        "節約金額と廃棄削減量のトラッキング",
      ],
      learnTitle: "職業スキルを学ぶ",
      learnDesc: "修理の習慣は、電気、空調、電子機器などの専門技術職へ繋がります。",
      exploreBtn: "CTEクレジットを探索",
      startBtn: "修理を開始",
      dangerousRepairs: ["電子レンジ", "ヘッジトリマー", "リチウム電池", "発電機", "ガスコンロ"],
    },
    vi: {
      title: "Giới thiệu BạnSửaChữa",
      subtitle: "Giúp việc sửa chữa trở nên an toàn, dễ dàng và ý nghĩa.",
      whyTitle: "Tại sao chúng tôi xây dựng ứng dụng",
      whyDesc: "Nhiều món đồ hữu ích bị vứt bỏ vì người dùng ngại sửa. BạnSửaChữa giúp bạn tự tin khắc phục sự cố.",
      missionTitle: "Sứ mệnh",
      missionDesc: "Xây dựng cộng đồng tự lực, ưu tiên sửa chữa thay vì vứt bỏ.",
      safetyTitle: "Cam kết an toàn",
      safetyDesc: "BạnSửaChữa sẽ không bao giờ hướng dẫn các sửa chữa nguy hiểm:",
      whatTitle: "Tính năng chính",
      whatFeatures: [
        "Kiểm tra mức độ an toàn của sửa chữa đối với người mới",
        "Cung cấp cảnh báo an toàn xanh, vàng, đỏ rõ ràng",
        "Cung cấp hướng dẫn DIY đơn giản",
        "So sánh chi phí sửa chữa và mua mới",
        "Theo dõi số tiền tiết kiệm và rác thải tránh được",
      ],
      learnTitle: "Học nghề kỹ thuật",
      learnDesc: "Thói quen sửa chữa giúp định hướng tới các công việc kỹ thuật chuyên nghiệp.",
      exploreBtn: "Khám phá tín chỉ CTE",
      startBtn: "Bắt đầu sửa",
      dangerousRepairs: ["Lò vi sóng", "Máy cắt tỉa hàng rào", "Pin Lithium", "Máy phát điện", "Bếp ga"],
    },
    de: {
      title: "Über ReparaturKumpel",
      subtitle: "Reparaturen sicher, einfach und lohnend machen.",
      whyTitle: "Warum wir dies entwickelt haben",
      whyDesc: "Viele Gegenstände werden weggeworfen, weil Reparaturen kompliziert wirken. ReparaturKumpel hilft, sicher zu reparieren.",
      missionTitle: "Unsere Mission",
      missionDesc: "Eine selbstständige Gemeinschaft aufzubauen, in der repariert statt weggeworfen wird.",
      safetyTitle: "Sicherheitsversprechen",
      safetyDesc: "ReparaturKumpel gibt niemals Anleitungen für gefährliche Arbeiten:",
      whatTitle: "Was er tut",
      whatFeatures: [
        "Prüft, ob die Reparatur für Anfänger sicher ist",
        "Zeigt grüne, gelbe und rote Sicherheitssignale",
        "Bietet einfache DIY-Schritt-für-Schritt-Anleitungen",
        "Vergleicht Reparatur- und Neukaufkosten",
        "Verfolgt gespartes Geld und vermiedenen Abfall",
      ],
      learnTitle: "Berufe lernen",
      learnDesc: "Reparaturfähigkeiten führen zu Berufen in der Elektro- und Heizungstechnik.",
      exploreBtn: "CTE-Credits erkunden",
      startBtn: "Reparatur beginnen",
      dangerousRepairs: ["Mikrowelle", "Heckenschere", "Lithium-Batterien", "Generatoren", "Gasherde"],
    },
    tl: {
      title: "Tungkol sa KatulongSaPag-aayos",
      subtitle: "Gawing ligtas, madali, at may saysay ang pag-aayos.",
      whyTitle: "Bakit namin binuo ito",
      whyDesc: "Maraming gumagana pang gamit ang tinatapon dahil mahirap ayusin. Ang KatulongSaPag-aayos ay tumutulong sa pag-aayos nang may tiwala sa sarili.",
      missionTitle: "Aming Misyon",
      missionDesc: "Bumuo ng komunidad na mas gustong mag-ayos kaysa magtapon ng gamit.",
      safetyTitle: "Pangako sa Kaligtasan",
      safetyDesc: "Ang KatulongSaPag-aayos ay hindi magbibigay ng gabay para sa mapanganib na pag-aayos:",
      whatTitle: "Ano ang ginagawa nito",
      whatFeatures: [
        "Tinitiyak kung ligtas ang pag-aayos sa mga nagsisimula",
        "Nagbibigay ng malinaw na kulay berde, dilaw, at pulang babala",
        "Nagbibigay ng simpleng DIY guides",
        "Inihahambing ang gastos sa pag-aayos laban sa pagbili ng bago",
        "Tino-track ang perang natipid at basurang naiwasan",
      ],
      learnTitle: "Matuto ng Bokasyonal",
      learnDesc: "Ang pag-aayos ay nagbibigay-daan sa mga propesyonal na karera sa kuryente, makinarya, at electronics.",
      exploreBtn: "Tuklasin ang CTE Credits",
      startBtn: "Simulan ang pag-aayos",
      dangerousRepairs: ["Microwave", "Hedge Trimmer", "Lithium Battery", "Generator", "Gas Stove"],
    },
  };

  const text = translationsDict[language] || translationsDict["en"];

  return (
    <div className="space-y-8 animate-fade-in pb-12 px-2 pt-2">
      <div className="text-center space-y-3 px-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {text.title.split(t("repairBuddy"))[0]}
          <span className="text-gradient">{t("repairBuddy")}</span>
          {text.title.split(t("repairBuddy"))[1]}
        </h1>
        <p className="text-slate-600 text-sm font-bold leading-relaxed">
          {text.subtitle}
        </p>
      </div>

      {/* 🧡 Why We Built This */}
      <section className="opacity-0 animate-pop-in delay-75" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-orange-200 bg-white shadow-md overflow-hidden card-hover-orange group">
          <div className="h-36 w-full relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
              alt="Community working together" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-950/60 to-transparent" />
          </div>
          <div className="p-6">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-500 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              <HeartIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">{text.whyTitle}</h2>
            <p className="text-slate-700 text-sm leading-relaxed font-bold">
              {text.whyDesc}
            </p>
          </div>
        </div>
      </section>

      {/* 🌍 Our Mission */}
      <section className="opacity-0 animate-pop-in delay-150" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-orange-200 bg-orange-50/20 p-6 shadow-md card-hover-orange group">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
            <GlobeAmericasIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">{text.missionTitle}</h2>
          <p className="text-slate-700 text-sm leading-relaxed font-bold">
            {text.missionDesc}
          </p>
        </div>
      </section>

      {/* 🛑 Safety Promise */}
      <section className="opacity-0 animate-pop-in delay-250" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-red-200 bg-red-50/10 p-6 shadow-md">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500 shadow-sm shrink-0">
              <ShieldCheckIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{text.safetyTitle}</h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-bold mb-5">
            {text.safetyDesc}
          </p>
          <div className="flex flex-wrap gap-2">
            {text.dangerousRepairs.map((d) => (
              <span
                key={d}
                className="rounded-xl border-2 border-red-200 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-red-500 shadow-sm hover:bg-red-50 hover:scale-105 transition-all duration-300 cursor-default"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 💡 What It Does */}
      <section className="opacity-0 animate-pop-in delay-350" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-orange-200 bg-white p-6 shadow-md card-hover-orange">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 shadow-sm">
            <LightBulbIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-5">{text.whatTitle}</h2>
          <ul className="space-y-4 mb-6">
            {text.whatFeatures.map((fText, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-bold leading-relaxed">
                <div className="rounded-full bg-orange-200 p-1 shrink-0 mt-0.5">
                  <CheckIcon className="h-4 w-4 text-orange-700 font-black" />
                </div>
                <span>{fText}</span>
              </li>
            ))}
          </ul>
          <Button href="/choose-item" className="w-full py-4 text-base shadow-lg">
            {text.startBtn}
          </Button>
        </div>
      </section>

      {/* 🎓 Learn the Trades */}
      <section className="opacity-0 animate-pop-in delay-450" style={{ animationFillMode: 'forwards' }}>
        <div className="rounded-3xl border-2 border-orange-200 bg-orange-50/20 p-6 shadow-md card-hover-orange group">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
            <AcademicCapIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">{text.learnTitle}</h2>
          <p className="text-sm text-slate-700 leading-relaxed font-bold mb-6">
            {text.learnDesc}
          </p>
          <a
            href="https://www.clark.edu/academics/hs-dual-credit/cte/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-orange-500/30 active:scale-90 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            {text.exploreBtn}
            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
