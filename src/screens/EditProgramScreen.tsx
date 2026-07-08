import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Image, Dimensions, Animated, Easing, Platform, StatusBar } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Home as HomeIcon, Users as UsersIcon, LayoutGrid as LayoutIcon, TrendingUp as TrendIcon, MoreHorizontal as MoreIcon, Bell, ChevronRight, ChevronLeft, Search, Star, Edit3, Plus, X, CheckCircle, Clock, Activity, LogOut, HelpCircle, Settings, ArrowRight, Calendar, Filter, Play, Minus, BarChart2 } from 'lucide-react-native';
import { Screen } from '../types';
import { TEAL, TEAL_DARK, TEAL_LIGHT, BG_COLOR } from '../theme/colors';
import { styles } from '../theme/styles';
import { patients, programs, deviations, progressData, weeklyData } from '../data/mockData';
import { Avatar, RehabKidsLogo } from '../components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EditProgramScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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

