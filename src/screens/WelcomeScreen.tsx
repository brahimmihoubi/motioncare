import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Image, Dimensions, Animated, Easing, Platform, StatusBar } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Home as HomeIcon, Users as UsersIcon, LayoutGrid as LayoutIcon, TrendingUp as TrendIcon, MoreHorizontal as MoreIcon, Bell, ChevronRight, ChevronLeft, Search, Star, Edit3, Plus, X, CheckCircle, Clock, Activity, LogOut, HelpCircle, Settings, ArrowRight, Calendar, Filter, Play, Minus, BarChart2 } from 'lucide-react-native';
import { Screen } from '../types';
import { TEAL, TEAL_DARK, TEAL_LIGHT, BG_COLOR } from '../theme/colors';
import { styles } from '../theme/styles';
import { patients, programs, deviations, progressData, weeklyData } from '../data/mockData';
import { Avatar, MotionCareLogo } from '../components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={[styles.splashContainer, { justifyContent: "space-between", paddingVertical: 50 }]}>
      {/* Decorative Circles */}
      <View style={[styles.decorCircle, { width: 320, height: 320, top: -80, right: -80 }]} />
      <View style={[styles.decorCircle, { width: 240, height: 240, bottom: -60, left: -60 }]} />

      <View style={[styles.splashContent, { marginTop: 40 }]}>
        <MotionCareLogo size={110} />
        <Text style={[styles.splashTitle, { fontSize: 32, marginTop: 20 }]}>MotionCare</Text>
        <Text style={[styles.splashSubtitle, { fontSize: 11, letterSpacing: 1.2, textAlign: 'center' }]}>
          PEDIATRIC REHABILITATION EXERCISE{'\n'}ASSISTANT
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
          <Text style={{ color: "white", fontFamily: "Poppins_700Bold" }}>Sign In</Text>
        </Text>
      </View>
    </View>
  );
}

