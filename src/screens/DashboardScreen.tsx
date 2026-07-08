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

export default function DashboardScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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

