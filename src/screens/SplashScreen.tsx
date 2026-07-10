import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Image, Dimensions, Animated, Easing, Platform, StatusBar } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Home as HomeIcon, Users as UsersIcon, LayoutGrid as LayoutIcon, TrendingUp as TrendIcon, MoreHorizontal as MoreIcon, Bell, ChevronRight, ChevronLeft, Search, Star, Edit3, Plus, X, CheckCircle, Clock, Activity, LogOut, HelpCircle, Settings, ArrowRight, Calendar, Filter, Play, Minus, BarChart2 } from 'lucide-react-native';
import { Screen } from '../types';
import { patients, programs, deviations, progressData, weeklyData } from '../data/mockData';
import { Avatar, MotionCareLogo } from '../components';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const { styles, colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Dots bounce animations
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

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
        onDoneRef.current();
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
      <View style={[styles.decorCircle, { width: 160, height: 160, top: SCREEN_WIDTH * 0.6, right: -40, opacity: 0.04 }]} />

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
          <MotionCareLogo size={90} />
        </View>

        <Text style={styles.splashTitle}>MotionCare</Text>
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

