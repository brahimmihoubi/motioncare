import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
  Easing,
  StatusBar,
  Platform,
} from "react-native";
import Svg, {
  Circle,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import {
  Home as HomeIcon,
  Users as UsersIcon,
  LayoutGrid as LayoutIcon,
  TrendingUp as TrendIcon,
  MoreHorizontal as MoreIcon,
  Bell,
  ChevronRight,
  ChevronLeft,
  Search,
  Star,
  Edit3,
  Plus,
  X,
  CheckCircle,
  Clock,
  Activity,
  LogOut,
  HelpCircle,
  Settings,
  ArrowRight,
  Calendar,
  Filter,
  Play,
  Minus,
  BarChart2,
} from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Theme constants
const TEAL = "#0BC4BC";
const TEAL_DARK = "#089A94";
const TEAL_LIGHT = "#E8FAF9";
const BG_COLOR = "#F5F7FA";

type Screen =
  | "splash"
  | "onboarding"
  | "welcome"
  | "dashboard"
  | "patients"
  | "patient-detail"
  | "programs"
  | "edit-program"
  | "exercise-detail"
  | "deviations"
  | "progress"
  | "more";

// Mock data
const patients = [
  {
    id: 1,
    name: "Yousuf Ali",
    condition: "Knee Ligament Injury",
    doctor: "Dr. Sara Ahmed",
    visits: 12,
    completed: 67,
    avatar: "YA",
    color: "#FF8C69",
    status: "Active",
    lastVisit: "Today",
  },
  {
    id: 2,
    name: "Lina Kahlil",
    condition: "ACL Reconstruction",
    doctor: "Dr. Sara Ahmed",
    visits: 8,
    completed: 45,
    avatar: "LK",
    color: "#7C83FD",
    status: "Active",
    lastVisit: "Yesterday",
  },
  {
    id: 3,
    name: "Peter Cooper",
    condition: "Lower Back Pain",
    doctor: "Dr. Sara Ahmed",
    visits: 15,
    completed: 82,
    avatar: "PC",
    color: "#4CAF50",
    status: "Completed",
    lastVisit: "2 days ago",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    condition: "Hamstring Strain",
    doctor: "Dr. Sara Ahmed",
    visits: 6,
    completed: 30,
    avatar: "SJ",
    color: "#FF6B9D",
    status: "Active",
    lastVisit: "3 days ago",
  },
  {
    id: 5,
    name: "Mark Stevens",
    condition: "Shoulder Impingement",
    doctor: "Dr. Sara Ahmed",
    visits: 10,
    completed: 55,
    avatar: "MS",
    color: "#FFB347",
    status: "Active",
    lastVisit: "1 week ago",
  },
];

const programs = [
  {
    id: 1,
    name: "Knee Strengthening Program",
    exercises: 6,
    weeks: 8,
    icon: "💪",
    color: "#FFE5D0",
    iconColor: "#FF8C69",
    patient: "Yousuf Ali",
  },
  {
    id: 2,
    name: "Tear ACL Reconstruction",
    exercises: 9,
    weeks: 12,
    icon: "🦵",
    color: "#E5E5FF",
    iconColor: "#7C83FD",
    patient: "Lina Kahlil",
  },
  {
    id: 3,
    name: "Hamstrings Rehab",
    exercises: 5,
    weeks: 6,
    icon: "🏃",
    color: "#D0FFE5",
    iconColor: "#4CAF50",
    patient: "Sarah Johnson",
  },
];

const deviations = [
  {
    id: 1,
    date: "July 10, 2024",
    title: "Hip Extension – Too Wide",
    desc: "Patient extended hip 15° beyond prescribed range during set 3.",
    severity: "high",
  },
  {
    id: 2,
    date: "July 12, 2024",
    title: "Knee Flexion – Early",
    desc: "Flexion initiated 2 seconds ahead of cue in all three sets.",
    severity: "medium",
  },
  {
    id: 3,
    date: "July 8, 2024",
    title: "Balance Issue",
    desc: "Patient shifted weight left during single-leg stance exercise.",
    severity: "low",
  },
  {
    id: 4,
    date: "July 5, 2024",
    title: "Incomplete Range",
    desc: "Leg raise only reached 45° instead of prescribed 60°.",
    severity: "medium",
  },
];

const progressData = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 90 },
  { day: "Sun", value: 75 },
];

const weeklyData = [
  { week: "W1", sessions: 3 },
  { week: "W2", sessions: 5 },
  { week: "W3", sessions: 4 },
  { week: "W4", sessions: 6 },
  { week: "W5", sessions: 5 },
  { week: "W6", sessions: 7 },
];

const rehabKidsLogo = require("./assets/logo.png");

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
function Avatar({
  initials,
  color,
  size = "md",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };
  const fontMap = {
    sm: 11,
    md: 13,
    lg: 15,
    xl: 18,
  };
  const diameter = sizeMap[size];
  const fontSize = fontMap[size];

  return (
    <View
      style={[
        styles.avatarContainer,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize }]}>{initials}</Text>
    </View>
  );
}

function RehabKidsLogo({ size = 60, withBg = true }: { size?: number; withBg?: boolean }) {
  return (
    <View
      style={[
        styles.logoWrapper,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: withBg ? "white" : "transparent",
        },
        withBg && styles.logoShadow,
      ]}
    >
      <Image
        source={rehabKidsLogo}
        style={{ width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }}
        resizeMode="contain"
      />
    </View>
  );
}

function BottomNav({
  current,
  onNavigate,
}: {
  current: string;
  onNavigate: (s: Screen) => void;
}) {
  const tabs = [
    { id: "dashboard", icon: HomeIcon, label: "Home" },
    { id: "patients", icon: UsersIcon, label: "Patients" },
    { id: "programs", icon: LayoutIcon, label: "Programs" },
    { id: "progress", icon: TrendIcon, label: "Progress" },
    { id: "more", icon: MoreIcon, label: "More" },
  ];
  return (
    <View style={styles.bottomNav}>
      {tabs.map((t) => {
        const active =
          current === t.id ||
          (current === "patient-detail" && t.id === "patients") ||
          (current === "edit-program" && t.id === "programs") ||
          (current === "exercise-detail" && t.id === "programs") ||
          (current === "deviations" && t.id === "patients");
        const IconComponent = t.icon;
        const color = active ? TEAL : "#8A94A6";

        return (
          <TouchableOpacity
            key={t.id}
            onPress={() => onNavigate(t.id as Screen)}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <IconComponent size={20} color={color} strokeWidth={active ? 2.5 : 1.8} />
            <Text style={[styles.navLabel, { color }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── SCREEN 0A: Splash ───────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Dots bounce animations
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse loop animation
    Animated.loop(
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 1.6,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Staggered bouncing dots
    const makeBounce = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -8,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ])
      );
    };

    const d1Anim = makeBounce(dot1, 0);
    const d2Anim = makeBounce(dot2, 200);
    const d3Anim = makeBounce(dot3, 400);

    d1Anim.start();
    d2Anim.start();
    d3Anim.start();

    // Exit timeout
    const exitTimer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        d1Anim.stop();
        d2Anim.stop();
        d3Anim.stop();
        onDone();
      });
    }, 2600);

    return () => clearTimeout(exitTimer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.splashContainer,
        {
          opacity: containerOpacity,
        },
      ]}
    >
      {/* Decorative Circles */}
      <View style={[styles.decorCircle, { width: 320, height: 320, top: -80, right: -80 }]} />
      <View style={[styles.decorCircle, { width: 240, height: 240, bottom: -60, left: -60 }]} />
      <View style={[styles.decorCircle, { width: 160, height: 160, top: "40%", right: -40, opacity: 0.04 }]} />

      <Animated.View
        style={[
          styles.splashContent,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Pulse Logo Ring Container */}
        <View style={styles.splashLogoContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              },
            ]}
          />
          <RehabKidsLogo size={90} />
        </View>

        <Text style={styles.splashTitle}>RehabKids</Text>
        <Text style={styles.splashSubtitle}>Move · Play · Heal · Grow</Text>
      </Animated.View>

      {/* Bouncing loading dots */}
      <View style={styles.splashDotsRow}>
        {[dot1, dot2, dot3].map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.splashDot,
              {
                transform: [{ translateY: anim }],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

// ─── SCREEN 0B: Onboarding ────────────────────────────────────────────────────
const ONBOARDING_SLIDES = [
  {
    icon: (
      <Svg width="160" height="140" viewBox="0 0 160 140" fill="none">
        <Rect x="20" y="20" width="120" height="100" rx="20" fill="#E8FAF9" />
        <Rect x="38" y="38" width="84" height="64" rx="12" fill="white" />
        <Rect x="46" y="50" width="50" height="8" rx="4" fill="#0BC4BC" opacity="0.7" />
        <Rect x="46" y="62" width="35" height="6" rx="3" fill="#CBD5E0" />
        <Circle cx="110" cy="55" r="10" fill="#FFE5D0" />
        <SvgText x="110" y="58" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FF8C69">YA</SvgText>
        <Rect x="46" y="76" width="50" height="8" rx="4" fill="#7C83FD" opacity="0.7" />
        <Rect x="46" y="88" width="30" height="6" rx="3" fill="#CBD5E0" />
        <Circle cx="110" cy="81" r="10" fill="#E5E5FF" />
        <SvgText x="110" y="84" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#7C83FD">LK</SvgText>
        <Circle cx="130" cy="30" r="14" fill="#0BC4BC" />
        <Rect x="124" y="29" width="12" height="2" rx="1" fill="white" />
        <Rect x="129" y="24" width="2" height="12" rx="1" fill="white" />
      </Svg>
    ),
    title: "Smart Patient\nManagement",
    subtitle: "Manage all your patients and their rehabilitation programs from a single, intuitive dashboard.",
    accent: TEAL,
    bg: "#E8FAF9",
  },
  {
    icon: (
      <Svg width="160" height="140" viewBox="0 0 160 140" fill="none">
        <Rect x="20" y="20" width="120" height="100" rx="20" fill="#FFF1F0" />
        <Rect x="42" y="82" width="14" height="28" rx="4" fill="#FFB3AE" />
        <Rect x="62" y="64" width="14" height="46" rx="4" fill="#FF6B6B" />
        <Rect x="82" y="54" width="14" height="56" rx="4" fill="#E53E3E" />
        <Rect x="102" y="70" width="14" height="40" rx="4" fill="#FFB3AE" />
        <Circle cx="120" cy="38" r="16" fill="#E53E3E" />
        <Path d="M120 28 C116 28 112 32 112 37 L112 42 L110 44 L130 44 L128 42 L128 37 C128 32 124 28 120 28Z" fill="white" />
        <Rect x="117" y="44" width="6" height="3" rx="1.5" fill="white" />
        <Circle cx="42" cy="38" r="10" fill="#FFFBF0" stroke="#F59E0B" strokeWidth="1.5" />
        <Rect x="41" y="33" width="2" height="6" rx="1" fill="#F59E0B" />
        <Circle cx="42" cy="41" r="1" fill="#F59E0B" />
      </Svg>
    ),
    title: "Real-time\nDeviation Alerts",
    subtitle: "Get instant notifications when patients deviate from prescribed exercises so you can intervene early.",
    accent: "#E53E3E",
    bg: "#FFF1F0",
  },
  {
    icon: (
      <Svg width="160" height="140" viewBox="0 0 160 140" fill="none">
        <Rect x="20" y="20" width="120" height="100" rx="20" fill="#F0FFF4" />
        <Path d="M38 100 L58 80 L78 88 L98 60 L118 50 L118 110 L38 110Z" fill="#4CAF50" opacity="0.15" />
        <Path d="M38 100 L58 80 L78 88 L98 60 L118 50" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="38" cy="100" r="3.5" fill="#4CAF50" />
        <Circle cx="58" cy="80" r="3.5" fill="#4CAF50" />
        <Circle cx="78" cy="88" r="3.5" fill="#4CAF50" />
        <Circle cx="98" cy="60" r="3.5" fill="#4CAF50" />
        <Circle cx="118" cy="50" r="5" fill="#4CAF50" />
        <Circle cx="118" cy="50" r="9" fill="#4CAF50" opacity="0.2" />
        <Circle cx="46" cy="40" r="14" fill="#4CAF50" />
        <Path d="M40 34 L52 34 L52 40 C52 43.3 49.3 46 46 46 C42.7 46 40 43.3 40 40Z" fill="white" />
        <Rect x="44" y="46" width="4" height="4" rx="1" fill="white" />
        <Rect x="41" y="50" width="10" height="2" rx="1" fill="white" />
        <Rect x="36" y="34" width="4" height="6" rx="2" fill="white" opacity="0.7" />
        <Rect x="52" y="34" width="4" height="6" rx="2" fill="white" opacity="0.7" />
      </Svg>
    ),
    title: "Track & Visualize\nProgress",
    subtitle: "Monitor patient recovery with detailed analytics, progress charts, and goal tracking in real time.",
    accent: "#4CAF50",
    bg: "#F0FFF4",
  },
];

function OnboardingScreen({ onFinish, onSkip }: { onFinish: () => void; onSkip: () => void }) {
  const [slide, setSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const current = ONBOARDING_SLIDES[slide];
  const isLast = slide === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    if (slide < ONBOARDING_SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (slide + 1) * SCREEN_WIDTH,
        animated: true,
      });
      setSlide(slide + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (slide > 0) {
      scrollViewRef.current?.scrollTo({
        x: (slide - 1) * SCREEN_WIDTH,
        animated: true,
      });
      setSlide(slide - 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainerWhite}>
      <View style={styles.onboardingHeader}>
        {slide > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.circleBtnSmall}>
            <ChevronLeft size={18} color="#8A94A6" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
        {!isLast ? (
          <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
            listener: (event: any) => {
              const x = event.nativeEvent.contentOffset.x;
              const index = Math.round(x / SCREEN_WIDTH);
              if (index !== slide && index >= 0 && index < ONBOARDING_SLIDES.length) {
                setSlide(index);
              }
            },
          }
        )}
        scrollEventThrottle={16}
        style={styles.onboardingScroll}
      >
        {ONBOARDING_SLIDES.map((s, index) => (
          <View key={index} style={[styles.onboardingSlide, { width: SCREEN_WIDTH }]}>
            <View style={[styles.slideCard, { backgroundColor: s.bg }]}>
              {s.icon}
            </View>
            <Text style={styles.slideTitle}>{s.title}</Text>
            <Text style={styles.slideSubtitle}>{s.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.onboardingFooter}>
        <View style={styles.paginationDots}>
          {ONBOARDING_SLIDES.map((_, i) => {
            const active = i === slide;
            return (
              <View
                key={i}
                style={[
                  styles.paginationDot,
                  {
                    width: active ? 24 : 8,
                    backgroundColor: active ? current.accent : "#CBD5E0",
                  },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.ctaBtn,
            {
              backgroundColor: current.accent,
              shadowColor: current.accent,
            },
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaBtnText}>
            {isLast ? "Get Started" : "Next"}
          </Text>
          {isLast ? (
            <ArrowRight size={18} color="white" />
          ) : (
            <ChevronRight size={18} color="white" />
          )}
        </TouchableOpacity>

        <Text style={styles.slideCounter}>
          {slide + 1} of {ONBOARDING_SLIDES.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── SCREEN 1: Welcome ────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={[styles.splashContainer, { justifyContent: "space-between", paddingVertical: 50 }]}>
      {/* Decorative Circles */}
      <View style={[styles.decorCircle, { width: 320, height: 320, top: -80, right: -80 }]} />
      <View style={[styles.decorCircle, { width: 240, height: 240, bottom: -60, left: -60 }]} />

      <View style={[styles.splashContent, { marginTop: 40 }]}>
        <RehabKidsLogo size={110} />
        <Text style={[styles.splashTitle, { fontSize: 32, marginTop: 20 }]}>RehabKids</Text>
        <Text style={[styles.splashSubtitle, { fontSize: 11, tracking: 1.2 }]}>
          Pediatric Rehabilitation Exercise Assistant
        </Text>
      </View>

      <View style={{ width: "100%", paddingHorizontal: 30, gap: 15, alignItems: "center" }}>
        <Text style={styles.welcomePromo}>
          Smart rehabilitation{"\n"}
          <Text style={{ color: "#82ECE9" }}>for young patients</Text>
        </Text>

        <TouchableOpacity
          onPress={onStart}
          style={[styles.ctaBtn, { backgroundColor: "white", width: "100%", height: 52 }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.ctaBtnText, { color: TEAL }]}>Get Started</Text>
        </TouchableOpacity>

        <Text style={styles.welcomeSignIn}>
          Already have an account?{" "}
          <Text style={{ color: "white", fontWeight: "bold" }}>Sign In</Text>
        </Text>
      </View>
    </View>
  );
}

// ─── SCREEN 2: Dashboard ──────────────────────────────────────────────────────
function DashboardScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.appHeader}>
        <View style={styles.headerProfile}>
          <RehabKidsLogo size={38} withBg={false} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.headerProfileGreet}>Good Morning 👋</Text>
            <Text style={styles.headerProfileName}>Dr. Sara Ahmed</Text>
          </View>
        </View>
        <View style={styles.headerActionBtn}>
          <Bell size={18} color={TEAL} />
          <View style={styles.badgeDot} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Stats Card */}
        <View style={styles.dashboardStatsCard}>
          <View style={styles.statsCardGrid}>
            <View style={styles.statsCardCol}>
              <Text style={styles.statsCardLabel}>Total Patients</Text>
              <Text style={styles.statsCardVal}>96</Text>
              <Text style={styles.statsCardSub}>↑ 4 new this month</Text>
            </View>
            <View style={styles.dividerVal} />
            <View style={styles.statsCardCol}>
              <Text style={styles.statsCardLabel}>Satisfaction</Text>
              <Text style={styles.statsCardVal}>98%</Text>
              <Text style={styles.statsCardSub}>↑ 2% from last month</Text>
            </View>
            <View style={styles.starCircle}>
              <Star size={20} color="#FFD700" fill="#FFD700" />
            </View>
          </View>
        </View>

        {/* Schedule Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <TouchableOpacity onPress={() => onNavigate("patients")}>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Patients mini list */}
        <View style={styles.dashboardList}>
          {patients.slice(0, 4).map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => onNavigate("patient-detail")}
              style={styles.patientListItem}
              activeOpacity={0.7}
            >
              <Avatar initials={p.avatar} color={p.color} size="md" />
              <View style={styles.patientListMeta}>
                <Text style={styles.patientListName}>{p.name}</Text>
                <Text style={styles.patientListCondition} numberOfLines={1}>
                  {p.condition}
                </Text>
              </View>
              <View style={styles.patientListEnd}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: p.status === "Active" ? TEAL_LIGHT : "#F0FFF4",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: p.status === "Active" ? TEAL : "#4CAF50" },
                    ]}
                  >
                    {p.status}
                  </Text>
                </View>
                <Text style={styles.patientListTime}>{p.lastVisit}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => onNavigate("patients")}
          style={[styles.ctaBtn, { marginVertical: 20, backgroundColor: TEAL }]}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaBtnText}>View All Patients</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SCREEN 3: Patients ────────────────────────────────────────────────────────
function PatientsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");

  const filtered = patients.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.condition.toLowerCase().includes(query.toLowerCase());
    if (tab === "All") return matchesQuery;
    return matchesQuery && p.status === tab;
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.patientsHeaderContainer}>
        <View style={styles.patientsHeaderRow}>
          <Text style={styles.titleText}>Patients</Text>
          <TouchableOpacity style={styles.addBtnContainer}>
            <Plus size={18} color={TEAL} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={16} color="#8A94A6" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search patients..."
            placeholderTextColor="#8A94A6"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Tab row */}
        <View style={styles.tabsRow}>
          {["All", "Active", "Completed"].map((t) => {
            const active = tab === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                style={[styles.tabBtn, active && { backgroundColor: TEAL }]}
              >
                <Text style={[styles.tabBtnText, { color: active ? "white" : "#8A94A6" }]}>
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Detailed patient list */}
        <View style={styles.patientGrid}>
          {filtered.map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => onNavigate("patient-detail")}
              style={styles.patientGridCard}
              activeOpacity={0.7}
            >
              <Avatar initials={p.avatar} color={p.color} size="lg" />
              <View style={styles.patientGridMeta}>
                <Text style={styles.patientListNameLarge}>{p.name}</Text>
                <Text style={styles.patientListConditionLarge}>{p.condition}</Text>
                <View style={styles.patientGridProgressRow}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[styles.progressBarFill, { width: `${p.completed}%`, backgroundColor: TEAL }]}
                    />
                  </View>
                  <Text style={styles.progressPctText}>{p.completed}%</Text>
                </View>
              </View>
              <ChevronRight size={18} color="#CBD5E0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SCREEN 4: Patient Detail ──────────────────────────────────────────────────
function PatientDetailScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const p = patients[0];
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => onNavigate("patients")} style={styles.circleBtnSmall}>
          <ChevronLeft size={18} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Patient Details</Text>
        <TouchableOpacity style={styles.circleBtnSmall}>
          <Edit3 size={16} color={TEAL} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Profile Card */}
        <View style={styles.detailProfileCard}>
          <View style={styles.profileCardHeader}>
            <Avatar initials={p.avatar} color={p.color} size="xl" />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.profileCardName}>{p.name}</Text>
              <Text style={styles.profileCardDoctor}>{p.doctor}</Text>
              <View style={styles.profileCardBadge}>
                <Text style={styles.profileCardBadgeText}>{p.condition}</Text>
              </View>
            </View>
          </View>

          {/* Grid Stats */}
          <View style={styles.profileStatsRow}>
            {[
              { label: "Total Visits", value: p.visits },
              { label: "Completed", value: `${p.completed}%` },
              { label: "Sessions", value: "24" },
            ].map((s, idx) => (
              <View key={idx} style={styles.profileStatCol}>
                <Text style={styles.profileStatVal}>{s.value}</Text>
                <Text style={styles.profileStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Circular Progress Section */}
        <View style={styles.progressRingCard}>
          <View style={styles.ringSvgContainer}>
            <Svg width={70} height={70} viewBox="0 0 36 36">
              <Circle cx="18" cy="18" r="15" fill="none" stroke="#EEF2F6" strokeWidth="3" />
              <Circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke={TEAL}
                strokeWidth="3"
                strokeDasharray={[2 * Math.PI * 15 * (p.completed / 100), 2 * Math.PI * 15]}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </Svg>
            <View style={styles.ringTextAbs}>
              <Text style={styles.ringTextVal}>{p.completed}%</Text>
            </View>
          </View>
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.ringCardTitle}>Program Progress</Text>
            <Text style={styles.ringCardSubtitle}>Knee Strengthening</Text>
            <Text style={styles.ringCardCount}>{p.visits} of 18 sessions done</Text>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsCard}>
          <View style={styles.recommendationsHeader}>
            <Text style={styles.recommendationsTitle}>P.A Recommendations</Text>
            <ChevronRight size={16} color="#CBD5E0" />
          </View>
          {[
            "Avoid high-impact activities for 3 weeks",
            "Perform daily stretching routines",
            "Ice knee after each session",
          ].map((rec, i) => (
            <View key={i} style={styles.recommendationItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>

        {/* Deviations summary */}
        <View style={styles.deviationsSummaryCard}>
          <View style={styles.recommendationsHeader}>
            <Text style={styles.recommendationsTitle}>Recent Deviations</Text>
            <TouchableOpacity onPress={() => onNavigate("deviations")}>
              <Text style={styles.viewDeviationsText}>View All</Text>
            </TouchableOpacity>
          </View>
          {deviations.slice(0, 2).map((d) => (
            <View key={d.id} style={styles.deviationMiniItem}>
              <View style={styles.bulletDotRed} />
              <View style={{ flex: 1 }}>
                <Text style={styles.deviationMiniTitle}>{d.title}</Text>
                <Text style={styles.deviationMiniDate}>{d.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => onNavigate("edit-program")}
          style={[styles.ctaBtn, { backgroundColor: TEAL, marginVertical: 10 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaBtnText}>Edit Program</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SCREEN 5: Programs ────────────────────────────────────────────────────────
function ProgramsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <Text style={[styles.titleText, { flex: 1, paddingLeft: 10 }]}>Programs</Text>
        <TouchableOpacity style={styles.addBtnContainer}>
          <Plus size={18} color={TEAL} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Sub-tabs */}
        <View style={styles.tabsRow}>
          {["Active", "Completed", "Draft"].map((t, idx) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, idx === 0 && { backgroundColor: TEAL }]}
            >
              <Text style={[styles.tabBtnText, { color: idx === 0 ? "white" : "#8A94A6" }]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Programs List */}
        <View style={styles.dashboardList}>
          {programs.map((prog) => (
            <TouchableOpacity
              key={prog.id}
              onPress={() => onNavigate("edit-program")}
              style={styles.programItemCard}
              activeOpacity={0.7}
            >
              <View style={[styles.programIconBox, { backgroundColor: prog.color }]}>
                <Text style={{ fontSize: 22 }}>{prog.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.programNameText}>{prog.name}</Text>
                <Text style={styles.programPatientText}>Patient: {prog.patient}</Text>
                <View style={styles.programDetailsRow}>
                  <View style={styles.programMetaInline}>
                    <Activity size={12} color={TEAL} />
                    <Text style={styles.programMetaText}>{prog.exercises} exercises</Text>
                  </View>
                  <View style={[styles.programMetaInline, { marginLeft: 15 }]}>
                    <Clock size={12} color={TEAL} />
                    <Text style={styles.programMetaText}>{prog.weeks} weeks</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={18} color="#CBD5E0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SCREEN 6: Edit Program ────────────────────────────────────────────────────
function EditProgramScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const exercises = [
    { name: "Leg Raises", sets: 3, reps: "10 reps", icon: "🦵" },
    { name: "Wall Squats", sets: 3, reps: "12 reps", icon: "🏋️" },
    { name: "Calf Raises", sets: 4, reps: "15 reps", icon: "💪" },
    { name: "Hip Abduction", sets: 3, reps: "10 reps", icon: "🤸" },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => onNavigate("programs")} style={styles.circleBtnSmall}>
          <ChevronLeft size={18} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Edit Program</Text>
        <TouchableOpacity style={styles.saveHeaderBtn}>
          <Text style={styles.saveHeaderBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Banner */}
        <View style={styles.editProgramBanner}>
          <View style={styles.bannerRow}>
            <View style={[styles.programIconBox, { backgroundColor: "#FFE5D0" }]}>
              <Text style={{ fontSize: 22 }}>💪</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.programNameText}>Knee Strengthening Program</Text>
              <Text style={styles.programPatientText}>Patient: Yousuf Ali</Text>
            </View>
          </View>

          <View style={styles.bannerGrid}>
            {[
              { label: "Duration", value: "8 Weeks" },
              { label: "Frequency", value: "3x per week" },
              { label: "Start Date", value: "Jul 1, 2024" },
              { label: "End Date", value: "Aug 26, 2024" },
            ].map((f, idx) => (
              <View key={idx} style={styles.bannerGridCell}>
                <Text style={styles.bannerGridCellLabel}>{f.label}</Text>
                <Text style={styles.bannerGridCellVal}>{f.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Exercises Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          <TouchableOpacity style={styles.addExerciseLink}>
            <Plus size={12} color={TEAL} style={{ marginRight: 3 }} />
            <Text style={styles.addExerciseLinkText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>

        {/* Exercises list */}
        <View style={styles.dashboardList}>
          {exercises.map((ex) => (
            <TouchableOpacity
              key={ex.name}
              onPress={() => onNavigate("exercise-detail")}
              style={styles.exerciseListItem}
              activeOpacity={0.7}
            >
              <View style={styles.exerciseIconBox}>
                <Text style={{ fontSize: 18 }}>{ex.icon}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseRepsMeta}>
                  {ex.sets} sets · {ex.reps}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity style={styles.circleMinusBtn}>
                  <Minus size={12} color="#FF6B6B" />
                </TouchableOpacity>
                <ChevronRight size={16} color="#CBD5E0" style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: TEAL, marginVertical: 20 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaBtnText}>Update Program</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SCREEN 7: Exercise Detail ─────────────────────────────────────────────────
function ExerciseDetailScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [rest, setRest] = useState(60);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => onNavigate("edit-program")} style={styles.circleBtnSmall}>
          <ChevronLeft size={18} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Leg / Leg Raises</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Visual Frame */}
        <View style={styles.exerciseVisualFrame}>
          <Text style={{ fontSize: 60, marginBottom: 8 }}>🦵</Text>
          <Text style={styles.exerciseVisualTitle}>Straight Leg Raise</Text>
          <Text style={styles.exerciseVisualSub}>Quadriceps strengthening</Text>

          <TouchableOpacity style={styles.playBtnContainer} activeOpacity={0.85}>
            <Play size={20} color="white" style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.descCardTitle}>Description</Text>
          <Text style={styles.descCardText}>
            Lie flat on your back. Keep one leg straight and raise it to 45°. Hold for 2 seconds
            then lower slowly. Focus on keeping core tight throughout.
          </Text>
        </View>

        {/* Routines Title */}
        <Text style={[styles.sectionTitle, { marginHorizontal: 20, marginBottom: 10 }]}>
          Exercise Routines
        </Text>

        {/* Counter cards */}
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {[
            { label: "Sets", value: sets, onChange: setSets, unit: "sets", min: 1, max: 10 },
            { label: "Repetitions", value: reps, onChange: setReps, unit: "reps", min: 5, max: 30 },
            { label: "Rest Time", value: rest, onChange: setRest, unit: "sec", min: 15, max: 180, step: 5 },
          ].map((item) => (
            <View key={item.label} style={styles.counterCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.counterCardLabel}>{item.label}</Text>
                <Text style={styles.counterCardVal}>
                  {item.value} <Text style={styles.counterCardUnit}>{item.unit}</Text>
                </Text>
              </View>
              <View style={styles.counterControlsRow}>
                <TouchableOpacity
                  onPress={() => item.onChange(Math.max(item.min, item.value - (item.step || 1)))}
                  style={styles.counterStepBtn}
                >
                  <Minus size={14} color={TEAL} />
                </TouchableOpacity>
                <Text style={styles.counterControlVal}>{item.value}</Text>
                <TouchableOpacity
                  onPress={() => item.onChange(Math.min(item.max, item.value + (item.step || 1)))}
                  style={styles.counterStepBtn}
                >
                  <Plus size={14} color={TEAL} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: TEAL, marginVertical: 20 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaBtnText}>Save Routine</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SCREEN 8: Deviations ─────────────────────────────────────────────────────
function DeviationsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const severityColors: Record<string, { bg: string; text: string; dot: string }> = {
    high: { bg: "#FFF1F0", text: "#E53E3E", dot: "#E53E3E" },
    medium: { bg: "#FFFBF0", text: "#D97706", dot: "#F59E0B" },
    low: { bg: "#F0FFF4", text: "#38A169", dot: "#48BB78" },
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => onNavigate("patient-detail")} style={styles.circleBtnSmall}>
          <ChevronLeft size={18} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Deviations</Text>
        <TouchableOpacity style={styles.circleBtnSmall}>
          <Filter size={15} color={TEAL} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Patient Mini card */}
        <View style={styles.deviationsPatientHeader}>
          <Avatar initials="YA" color="#FF8C69" size="md" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.programNameText}>Yousuf Ali</Text>
            <Text style={styles.programPatientText}>Knee Ligament Injury</Text>
          </View>
          <View style={{ marginLeft: "auto", alignItems: "flex-end" }}>
            <Text style={styles.programPatientText}>Total</Text>
            <Text style={styles.deviationsHeaderCountText}>{deviations.length} issues</Text>
          </View>
        </View>

        {/* Calendar filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hFilterRow}>
          <TouchableOpacity style={[styles.filterPillActive, { backgroundColor: TEAL }]}>
            <Calendar size={12} color="white" style={{ marginRight: 4 }} />
            <Text style={styles.filterPillActiveText}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterPillText}>Last Week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterPillText}>All Time</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Severity counts grid */}
        <View style={styles.severityGrid}>
          {[
            { label: "High", count: 1, color: "#E53E3E", bg: "#FFF1F0" },
            { label: "Medium", count: 2, color: "#D97706", bg: "#FFFBF0" },
            { label: "Low", count: 1, color: "#38A169", bg: "#F0FFF4" },
          ].map((s) => (
            <View key={s.label} style={[styles.severityGridCell, { backgroundColor: s.bg }]}>
              <Text style={[styles.severityGridCellCount, { color: s.color }]}>{s.count}</Text>
              <Text style={[styles.severityGridCellLabel, { color: s.color }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Logs */}
        <View style={{ paddingHorizontal: 20, gap: 12, paddingBottom: 20 }}>
          {deviations.map((d) => {
            const sc = severityColors[d.severity];
            return (
              <View key={d.id} style={styles.deviationDetailCard}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <View style={{ alignItems: "center", marginRight: 8, paddingTop: 4 }}>
                    <View style={[styles.deviationDot, { backgroundColor: sc.dot }]} />
                    <View style={styles.deviationDotConnector} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.deviationCardHeaderRow}>
                      <Text style={styles.deviationCardTitle}>{d.title}</Text>
                      <View style={[styles.severityBadgeInline, { backgroundColor: sc.bg }]}>
                        <Text style={[styles.severityBadgeInlineText, { color: sc.text }]}>
                          {d.severity}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.deviationCardDesc}>{d.desc}</Text>
                    <View style={styles.deviationCardFooterRow}>
                      <Calendar size={10} color="#CBD5E0" style={{ marginRight: 4 }} />
                      <Text style={styles.deviationCardDateText}>{d.date}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SCREEN 9: Progress ────────────────────────────────────────────────────────
function ProgressScreen() {
  const chartWidth = SCREEN_WIDTH - 70; // responsive sizing matching screen layout padding
  const chartHeight = 110;

  // Custom SVG Area Chart calculation
  const areaPaddingY = 10;
  const areaHeight = chartHeight - areaPaddingY * 2;
  const areaPoints = progressData.map((d, i) => {
    const x = (i * chartWidth) / (progressData.length - 1);
    const y = areaHeight + areaPaddingY - (d.value / 100) * areaHeight;
    return { x, y, day: d.day, val: d.value };
  });

  const areaLineD = areaPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaShapeD = `${areaLineD} L ${areaPoints[areaPoints.length - 1].x} ${chartHeight} L ${areaPoints[0].x} ${chartHeight} Z`;

  // Custom SVG Bar Chart calculation
  const barMaxVal = 8;
  const barSpacing = chartWidth / weeklyData.length;
  const barWidth = 14;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <Text style={[styles.titleText, { flex: 1, paddingLeft: 10 }]}>Progress</Text>
        <TouchableOpacity style={styles.circleBtnSmall}>
          <Filter size={15} color={TEAL} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Patient Selector Row */}
        <View style={styles.progressPatientSelector}>
          <Avatar initials="YA" color="#FF8C69" size="md" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.programNameText}>Yousuf Ali</Text>
            <Text style={styles.programPatientText}>Knee Strengthening Program</Text>
          </View>
          <ChevronRight size={18} color="#CBD5E0" />
        </View>

        {/* Small stats tiles */}
        <View style={styles.progressStatsGrid}>
          {[
            { label: "Completion Rate", value: "67%", change: "+8%", color: TEAL },
            { label: "Avg Score", value: "82", change: "+5", color: "#7C83FD" },
            { label: "Streak", value: "7 days", change: "Best!", color: "#FF8C69" },
            { label: "Exercises Done", value: "48", change: "+12", color: "#4CAF50" },
          ].map((c, i) => (
            <View key={i} style={styles.progressStatTile}>
              <View style={styles.statTileHeader}>
                <Text style={styles.statTileChange}>{c.change}</Text>
              </View>
              <Text style={[styles.statTileValue, { color: c.color }]}>{c.value}</Text>
              <Text style={styles.statTileLabel}>{c.label}</Text>
            </View>
          ))}
        </View>

        {/* SVG Area Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Completion Rate</Text>
            <Text style={styles.chartCardSubtitle}>This Week</Text>
          </View>

          <View style={{ height: chartHeight, marginVertical: 10, width: "100%" }}>
            <Svg width={chartWidth} height={chartHeight}>
              <Defs>
                <LinearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                  <Stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              {/* Background grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
                <Path
                  key={idx}
                  d={`M 0 ${areaPaddingY + p * areaHeight} L ${chartWidth} ${areaPaddingY + p * areaHeight}`}
                  stroke="#EEF2F6"
                  strokeWidth="1"
                />
              ))}

              {/* Area shape */}
              <Path d={areaShapeD} fill="url(#tealGrad)" />

              {/* Path line */}
              <Path d={areaLineD} fill="none" stroke={TEAL} strokeWidth="2.5" />

              {/* Interactive Dots */}
              {areaPoints.map((p, i) => (
                <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={TEAL} />
              ))}
            </Svg>
          </View>

          {/* X Axis Labels */}
          <View style={styles.xAxisRow}>
            {progressData.map((d, i) => (
              <Text key={i} style={styles.xAxisText}>
                {d.day}
              </Text>
            ))}
          </View>
        </View>

        {/* SVG Bar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Weekly Sessions</Text>
            <Text style={styles.chartCardSubtitle}>6 Weeks</Text>
          </View>

          <View style={{ height: chartHeight, marginVertical: 10, width: "100%" }}>
            <Svg width={chartWidth} height={chartHeight}>
              {/* Background grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
                <Path
                  key={idx}
                  d={`M 0 ${areaPaddingY + p * areaHeight} L ${chartWidth} ${areaPaddingY + p * areaHeight}`}
                  stroke="#EEF2F6"
                  strokeWidth="1"
                />
              ))}

              {/* Render Bars */}
              {weeklyData.map((d, i) => {
                const barHeight = (d.sessions / barMaxVal) * areaHeight;
                const x = i * barSpacing + (barSpacing - barWidth) / 2;
                const y = areaHeight + areaPaddingY - barHeight;

                return (
                  <Rect
                    key={i}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={4}
                    ry={4}
                    fill={TEAL}
                  />
                );
              })}
            </Svg>
          </View>

          {/* X Axis Labels */}
          <View style={styles.xAxisRow}>
            {weeklyData.map((d, i) => (
              <Text key={i} style={styles.xAxisText}>
                {d.week}
              </Text>
            ))}
          </View>
        </View>

        {/* Weekly Goal Progress */}
        <View style={styles.weeklyGoalCard}>
          <View style={styles.weeklyGoalHeader}>
            <Text style={styles.chartCardTitle}>Weekly Goal</Text>
            <Text style={styles.weeklyGoalFraction}>5 / 7 sessions</Text>
          </View>
          <View style={styles.goalProgressBarBg}>
            <View style={[styles.goalProgressBarFill, { width: "71%", backgroundColor: TEAL }]} />
          </View>
          <Text style={styles.weeklyGoalSubtitle}>71% of weekly goal completed</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── SCREEN 10: More ──────────────────────────────────────────────────────────
function MoreScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", desc: "View your dashboard", screen: "dashboard" },
    { icon: Bell, label: "Notifications", desc: "Manage alerts", screen: "deviations" },
    { icon: BarChart2, label: "Analytics", desc: "View reports", screen: "progress" },
    { icon: HelpCircle, label: "Help & Support", desc: "Get assistance", screen: "welcome" },
    { icon: Settings, label: "Settings", desc: "App preferences", screen: "welcome" },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <Text style={[styles.titleText, { paddingLeft: 10 }]}>More</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Profile Stats Banner */}
        <View style={styles.moreProfileBanner}>
          <View style={styles.profileBannerHeader}>
            <RehabKidsLogo size={64} withBg={true} />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.profileBannerName}>Dr. Sara Ahmed</Text>
              <Text style={styles.profileBannerRole}>Physical Therapist</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={11} color="#FFD700" fill="#FFD700" style={{ marginRight: 2 }} />
                ))}
                <Text style={styles.ratingText}>5.0</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Edit3 size={18} color="white" style={{ opacity: 0.7 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.moreBannerStatsRow}>
            {[
              { label: "Patients", value: "96" },
              { label: "Programs", value: "24" },
              { label: "Rating", value: "4.9" },
            ].map((s, idx) => (
              <View key={idx} style={styles.moreBannerStatCol}>
                <Text style={styles.moreBannerStatVal}>{s.value}</Text>
                <Text style={styles.moreBannerStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuItemsContainer}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => onNavigate(item.screen as Screen)}
                style={[styles.menuItemRow, idx < menuItems.length - 1 && styles.menuItemBorder]}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <Icon size={17} color={TEAL} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                  <Text style={styles.menuItemDesc}>{item.desc}</Text>
                </View>
                <ChevronRight size={15} color="#CBD5E0" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Row */}
        <TouchableOpacity style={styles.logoutRow} activeOpacity={0.7} onPress={() => onNavigate("welcome")}>
          <View style={styles.logoutIconContainer}>
            <LogOut size={17} color="#FF6B6B" />
          </View>
          <Text style={styles.logoutLabel}>Log Out</Text>
          <ChevronRight size={15} color="#CBD5E0" style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        <Text style={styles.moreVersionText}>RehabKids v2.4.1</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── MAIN APP CONTAINER ────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen onDone={() => setScreen("onboarding")} />;
      case "onboarding":
        return (
          <OnboardingScreen
            onFinish={() => setScreen("welcome")}
            onSkip={() => setScreen("welcome")}
          />
        );
      case "welcome":
        return <WelcomeScreen onStart={() => setScreen("dashboard")} />;
      case "dashboard":
        return <DashboardScreen onNavigate={setScreen} />;
      case "patients":
        return <PatientsScreen onNavigate={setScreen} />;
      case "patient-detail":
        return <PatientDetailScreen onNavigate={setScreen} />;
      case "programs":
        return <ProgramsScreen onNavigate={setScreen} />;
      case "edit-program":
        return <EditProgramScreen onNavigate={setScreen} />;
      case "exercise-detail":
        return <ExerciseDetailScreen onNavigate={setScreen} />;
      case "deviations":
        return <DeviationsScreen onNavigate={setScreen} />;
      case "progress":
        return <ProgressScreen />;
      case "more":
        return <MoreScreen onNavigate={setScreen} />;
      default:
        return <DashboardScreen onNavigate={setScreen} />;
    }
  };

  const showNav =
    screen !== "splash" && screen !== "onboarding" && screen !== "welcome";

  return (
    <View style={styles.appContainer}>
      <StatusBar
        backgroundColor={screen === "splash" || screen === "welcome" ? TEAL : "white"}
        barStyle={screen === "splash" || screen === "welcome" ? "light-content" : "dark-content"}
      />
      <View style={styles.mainContentContainer}>{renderScreen()}</View>
      {showNav && <BottomNav current={screen} onNavigate={setScreen} />}
    </View>
  );
}

// ─── NATIVE STYLESHEET ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Root container
  appContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  mainContentContainer: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  safeContainerWhite: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollBody: {
    flex: 1,
  },

  // Helpers
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "700",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoShadow: {
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaBtn: {
    height: 48,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
    marginHorizontal: 20,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },

  // Navigation
  bottomNav: {
    height: 64,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F5F7FA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: Platform.OS === "ios" ? 15 : 0,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },

  // Splash Screen
  splashContainer: {
    flex: 1,
    backgroundColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "white",
    opacity: 0.06,
  },
  splashContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  splashLogoContainer: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 20,
  },
  pulseRing: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "white",
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "white",
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    color: "#E8FAF9",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 6,
  },
  splashDotsRow: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row",
    gap: 8,
  },
  splashDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },

  // Onboarding Screen
  onboardingHeader: {
    flexDirection: "row",
    justifyContent: "between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  circleBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  skipBtn: {
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  skipBtnText: {
    color: "#8A94A6",
    fontSize: 12,
    fontWeight: "600",
  },
  onboardingScroll: {
    flex: 1,
  },
  onboardingSlide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  slideCard: {
    width: 220,
    height: 200,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 30,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A2E",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 10,
  },
  slideSubtitle: {
    fontSize: 14,
    color: "#8A94A6",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 15,
  },
  onboardingFooter: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 25,
    alignItems: "center",
    gap: 15,
  },
  paginationDots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 5,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  slideCounter: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8A94A6",
  },

  // Welcome Screen
  welcomePromo: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 15,
  },
  welcomeSignIn: {
    color: "#82ECE9",
    fontSize: 14,
  },

  // Headers
  appHeader: {
    flexDirection: "row",
    justifyContent: "between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerProfileGreet: {
    fontSize: 11,
    color: "#8A94A6",
    fontWeight: "500",
  },
  headerProfileName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
    marginTop: 1,
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badgeDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B6B",
    borderWidth: 1.5,
    borderColor: "white",
  },

  // Dashboard Screen
  dashboardStatsCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: TEAL,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 4,
    overflow: "hidden",
    marginBottom: 20,
  },
  statsCardGrid: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  statsCardCol: {
    flex: 1,
  },
  statsCardLabel: {
    color: "#C2F3F0",
    fontSize: 11,
    fontWeight: "500",
  },
  statsCardVal: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    marginVertical: 2,
  },
  statsCardSub: {
    color: "#C2F3F0",
    fontSize: 10,
  },
  dividerVal: {
    width: 1,
    height: 48,
    backgroundColor: "white",
    opacity: 0.2,
    marginHorizontal: 12,
  },
  starCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: "600",
    color: TEAL,
  },
  dashboardList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  patientListItem: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  patientListMeta: {
    flex: 1,
    marginLeft: 12,
  },
  patientListName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  patientListCondition: {
    fontSize: 12,
    color: "#8A94A6",
    marginTop: 2,
  },
  patientListEnd: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  patientListTime: {
    fontSize: 10,
    color: "#8A94A6",
  },

  // Patients Screen
  patientsHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "white",
  },
  patientsHeaderRow: {
    flexDirection: "row",
    justifyContent: "between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A2E",
  },
  addBtnContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#1A1A2E",
    paddingVertical: 0,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginVertical: 15,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 0.5,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  patientGrid: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 25,
  },
  patientGridCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  patientGridMeta: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  patientListNameLarge: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  patientListConditionLarge: {
    fontSize: 12,
    color: "#8A94A6",
    marginTop: 2,
  },
  patientGridProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#F5F7FA",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  progressPctText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#8A94A6",
    width: 28,
    textAlign: "right",
  },

  // Detail Screen
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F7FA",
  },
  detailHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  detailProfileCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginTop: 15,
    marginBottom: 12,
  },
  profileCardHeader: {
    flexDirection: "row",
    alignItems: "start",
  },
  profileCardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  profileCardDoctor: {
    fontSize: 12,
    color: "#8A94A6",
    marginTop: 2,
  },
  profileCardBadge: {
    alignSelf: "flex-start",
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  profileCardBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: TEAL,
  },
  profileStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F5F7FA",
    marginTop: 15,
    paddingTop: 12,
  },
  profileStatCol: {
    flex: 1,
    alignItems: "center",
  },
  profileStatVal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  profileStatLabel: {
    fontSize: 10,
    color: "#8A94A6",
    marginTop: 2,
  },
  progressRingCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 12,
  },
  ringSvgContainer: {
    position: "relative",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  ringTextAbs: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringTextVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  ringCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  ringCardSubtitle: {
    fontSize: 12,
    color: "#8A94A6",
    marginTop: 1,
  },
  ringCardCount: {
    fontSize: 11,
    color: "#5C6470",
    marginTop: 4,
  },
  recommendationsCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 12,
  },
  recommendationsHeader: {
    flexDirection: "row",
    justifyContent: "between",
    alignItems: "center",
    marginBottom: 12,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TEAL,
    marginRight: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: "#5C6470",
    flex: 1,
  },
  deviationsSummaryCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 20,
  },
  viewDeviationsText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEAL,
  },
  deviationMiniItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1F0",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  bulletDotRed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF6B6B",
    marginRight: 8,
  },
  deviationMiniTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E53E3E",
  },
  deviationMiniDate: {
    fontSize: 9,
    color: "#8A94A6",
    marginTop: 1,
  },

  // Program Screen
  programItemCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  programIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  programNameText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  programPatientText: {
    fontSize: 12,
    color: "#8A94A6",
    marginTop: 2,
  },
  programDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  programMetaInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  programMetaText: {
    fontSize: 11,
    color: "#5C6470",
  },

  // Edit Program
  editProgramBanner: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginTop: 15,
    marginBottom: 20,
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  bannerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  bannerGridCell: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bannerGridCellLabel: {
    fontSize: 9,
    color: "#8A94A6",
    textTransform: "uppercase",
  },
  bannerGridCellVal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A2E",
    marginTop: 2,
  },
  saveHeaderBtn: {
    backgroundColor: TEAL,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
  },
  saveHeaderBtnText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  addExerciseLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  addExerciseLinkText: {
    fontSize: 12,
    fontWeight: "600",
    color: TEAL,
  },
  exerciseListItem: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  exerciseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  exerciseRepsMeta: {
    fontSize: 11,
    color: "#8A94A6",
    marginTop: 2,
  },
  circleMinusBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF1F0",
    alignItems: "center",
    justifyContent: "center",
  },

  // Exercise Detail
  exerciseVisualFrame: {
    height: 180,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    backgroundColor: "#D0F5F3",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 1.5,
    marginBottom: 15,
  },
  exerciseVisualTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEAL,
  },
  exerciseVisualSub: {
    fontSize: 11,
    color: "#8A94A6",
    marginTop: 1,
  },
  playBtnContainer: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
    bottom: -15,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  descCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  descCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  descCardText: {
    fontSize: 12,
    color: "#5C6470",
    lineHeight: 18,
  },
  counterCard: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  counterCardLabel: {
    fontSize: 11,
    color: "#8A94A6",
  },
  counterCardVal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
    marginTop: 2,
  },
  counterCardUnit: {
    fontSize: 12,
    color: "#CBD5E0",
    fontWeight: "400",
  },
  counterControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  counterStepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  counterControlVal: {
    fontSize: 16,
    fontWeight: "700",
    color: TEAL,
    width: 24,
    textAlign: "center",
  },

  // Deviations Screen
  deviationsPatientHeader: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginTop: 15,
  },
  deviationsHeaderCountText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6B6B",
    marginTop: 1,
  },
  hFilterRow: {
    flexDirection: "row",
    paddingLeft: 20,
    marginVertical: 15,
  },
  filterPillActive: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  filterPillActiveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "white",
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "white",
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 0.5,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8A94A6",
  },
  severityGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 15,
  },
  severityGridCell: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  severityGridCellCount: {
    fontSize: 20,
    fontWeight: "800",
  },
  severityGridCellLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 1,
  },
  deviationDetailCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  deviationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deviationDotConnector: {
    width: 1,
    height: 44,
    backgroundColor: "#F5F7FA",
    marginTop: 4,
  },
  deviationCardHeaderRow: {
    flexDirection: "row",
    justifyContent: "between",
    alignItems: "center",
    marginBottom: 4,
  },
  deviationCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  severityBadgeInline: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  severityBadgeInlineText: {
    fontSize: 9,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  deviationCardDesc: {
    fontSize: 12,
    color: "#5C6470",
    lineHeight: 16,
  },
  deviationCardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  deviationCardDateText: {
    fontSize: 10,
    color: "#8A94A6",
  },

  // Progress Screen
  progressPatientSelector: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  progressStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 15,
  },
  progressStatTile: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 0.5,
  },
  statTileHeader: {
    alignItems: "flex-end",
    marginBottom: 4,
  },
  statTileChange: {
    fontSize: 9,
    fontWeight: "700",
    color: "#4CAF50",
    backgroundColor: "#F0FFF4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statTileValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  statTileLabel: {
    fontSize: 10,
    color: "#8A94A6",
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 15,
  },
  chartCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  chartCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  chartCardSubtitle: {
    fontSize: 11,
    color: "#8A94A6",
  },
  xAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  xAxisText: {
    fontSize: 9,
    color: "#8A94A6",
    fontWeight: "500",
    width: 24,
    textAlign: "center",
  },
  weeklyGoalCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 20,
  },
  weeklyGoalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  weeklyGoalFraction: {
    fontSize: 12,
    fontWeight: "700",
    color: TEAL,
  },
  goalProgressBarBg: {
    height: 10,
    backgroundColor: "#F5F7FA",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 4,
  },
  goalProgressBarFill: {
    height: 10,
    borderRadius: 5,
  },
  weeklyGoalSubtitle: {
    fontSize: 11,
    color: "#8A94A6",
    marginTop: 4,
  },

  // More Screen
  moreProfileBanner: {
    backgroundColor: TEAL,
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 18,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 4,
    marginTop: 15,
    marginBottom: 20,
  },
  profileBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  profileBannerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  profileBannerRole: {
    fontSize: 11,
    color: "#C2F3F0",
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    color: "#C2F3F0",
    marginLeft: 3,
    fontWeight: "600",
  },
  moreBannerStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 12,
  },
  moreBannerStatCol: {
    flex: 1,
    alignItems: "center",
  },
  moreBannerStatVal: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  moreBannerStatLabel: {
    fontSize: 10,
    color: "#C2F3F0",
    marginTop: 2,
  },
  menuItemsContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    overflow: "hidden",
    marginBottom: 15,
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F7FA",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  menuItemDesc: {
    fontSize: 11,
    color: "#8A94A6",
    marginTop: 2,
  },
  logoutRow: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 15,
  },
  logoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF1F0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FF6B6B",
    marginLeft: 12,
  },
  moreVersionText: {
    fontSize: 10,
    color: "#CBD5E0",
    textAlign: "center",
    marginVertical: 15,
  },
});
