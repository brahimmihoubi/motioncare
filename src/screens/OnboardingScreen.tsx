import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, Animated, Easing, Platform, StatusBar } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Home as HomeIcon, Users as UsersIcon, LayoutGrid as LayoutIcon, TrendingUp as TrendIcon, MoreHorizontal as MoreIcon, Bell, ChevronRight, ChevronLeft, Search, Star, Edit3, Plus, X, CheckCircle, Clock, Activity, LogOut, HelpCircle, Settings, ArrowRight, Calendar, Filter, Play, Minus, BarChart2 } from 'lucide-react-native';
import { Screen } from '../types';
import { patients, programs, deviations, progressData, weeklyData } from '../data/mockData';
import { Avatar, MotionCareLogo } from '../components';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
    accent: "#0BC4BC",
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

export default function OnboardingScreen({ onFinish, onSkip }: { onFinish: () => void; onSkip: () => void }) {
  const { styles, colors } = useTheme();
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

