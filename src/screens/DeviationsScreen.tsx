import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Image, Dimensions, Animated, Easing, Platform, StatusBar } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Home as HomeIcon, Users as UsersIcon, LayoutGrid as LayoutIcon, TrendingUp as TrendIcon, MoreHorizontal as MoreIcon, Bell, ChevronRight, ChevronLeft, Search, Star, Edit3, Plus, X, CheckCircle, Clock, Activity, LogOut, HelpCircle, Settings, ArrowRight, Calendar, Filter, Play, Minus, BarChart2 } from 'lucide-react-native';
import { Screen } from '../types';
import { patients, programs, deviations, progressData, weeklyData } from '../data/mockData';
import { Avatar, MotionCareLogo } from '../components';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DeviationsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { styles, colors } = useTheme();
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
          <Filter size={15} color={colors.teal} />
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
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.programPatientText}>Total</Text>
            <Text style={styles.deviationsHeaderCountText}>{deviations.length} issues</Text>
          </View>
        </View>

        {/* Calendar filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hFilterRow}>
          <TouchableOpacity style={[styles.filterPillActive, { backgroundColor: colors.teal }]}>
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

