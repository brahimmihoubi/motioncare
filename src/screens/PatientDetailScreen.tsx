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

export default function PatientDetailScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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

