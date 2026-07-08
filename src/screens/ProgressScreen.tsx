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

export default function ProgressScreen() {
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
            <View style={[styles.goalProgressBarFill, { width: "71%" as any, backgroundColor: TEAL }]} />
          </View>
          <Text style={styles.weeklyGoalSubtitle}>71% of weekly goal completed</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

