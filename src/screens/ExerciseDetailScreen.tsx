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

export default function ExerciseDetailScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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

