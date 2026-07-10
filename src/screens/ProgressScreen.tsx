import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ChevronRight, Filter } from 'lucide-react-native';
import { Avatar } from '../components';
import { useTheme } from '../theme/ThemeContext';
import { DataService } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Fallback empty data structures for charts
const DEFAULT_DAILY = [
  { day: 'Mon', value: 0 }, { day: 'Tue', value: 0 }, { day: 'Wed', value: 0 },
  { day: 'Thu', value: 0 }, { day: 'Fri', value: 0 }, { day: 'Sat', value: 0 }, { day: 'Sun', value: 0 }
];

const DEFAULT_WEEKLY = [
  { week: 'W1', sessions: 0 }, { week: 'W2', sessions: 0 }, { week: 'W3', sessions: 0 },
  { week: 'W4', sessions: 0 }, { week: 'W5', sessions: 0 }, { week: 'W6', sessions: 0 }
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ProgressScreen() {
  const { styles, colors } = useTheme();
  const chartWidth = SCREEN_WIDTH - 70; 
  const chartHeight = 110;

  const [isLoading, setIsLoading] = useState(true);
  const [dailyProgress, setDailyProgress] = useState(DEFAULT_DAILY);
  const [weeklySessions, setWeeklySessions] = useState(DEFAULT_WEEKLY);
  const [stats, setStats] = useState({
    completionRate: 0,
    avgScore: 0,
    streak: 0,
    exercisesDone: 0
  });

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const res = await DataService.getProgressStats();
        if (res.success && res.data) {
          const data = res.data;
          
          // 1. Parse daily data
          let newDaily = [...DEFAULT_DAILY];
          if (data.dailyData && data.dailyData.length > 0) {
            data.dailyData.forEach((d: any) => {
              const dayName = DAY_NAMES[parseInt(d.dayOfWeek, 10)];
              const rate = d.total > 0 ? (d.completed / d.total) * 100 : 0;
              const idx = newDaily.findIndex(item => item.day === dayName);
              if (idx !== -1) newDaily[idx].value = rate;
            });
          }
          setDailyProgress(newDaily);

          // 2. Parse weekly data (take last 6)
          let newWeekly = [...DEFAULT_WEEKLY];
          if (data.weeklyData && data.weeklyData.length > 0) {
            const last6 = data.weeklyData.slice(-6);
            last6.forEach((w: any, idx: number) => {
               if (idx < 6) newWeekly[idx].sessions = w.sessions;
            });
          }
          setWeeklySessions(newWeekly);

          // 3. Stats
          const st = data.stats || {};
          const cr = st.totalSessions > 0 ? (st.completedSessions / st.totalSessions) * 100 : 0;
          setStats({
            completionRate: Math.round(cr),
            avgScore: 82, // Hardcoded placeholder for now
            streak: 3, // Hardcoded placeholder for now
            exercisesDone: st.totalDuration || 0 // Reusing duration field as proxy for now
          });
        }
      } catch(err) {
        console.error("Failed to load progress", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProgress();
  }, []);

  // Custom SVG Area Chart calculation
  const areaPaddingY = 10;
  const areaHeight = chartHeight - areaPaddingY * 2;
  const areaPoints = dailyProgress.map((d, i) => {
    const x = (i * chartWidth) / (dailyProgress.length - 1);
    const y = areaHeight + areaPaddingY - (d.value / 100) * areaHeight;
    return { x, y, day: d.day, val: d.value };
  });

  const areaLineD = areaPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaShapeD = `${areaLineD} L ${areaPoints[areaPoints.length - 1].x} ${chartHeight} L ${areaPoints[0].x} ${chartHeight} Z`;

  // Custom SVG Bar Chart calculation
  const maxWeeklySessions = Math.max(...weeklySessions.map(w => w.sessions), 8); // at least 8 to scale nicely
  const barSpacing = chartWidth / weeklySessions.length;
  const barWidth = 14;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <Text style={[styles.titleText, { flex: 1, paddingLeft: 10 }]}>Overall Progress</Text>
        <TouchableOpacity style={styles.circleBtnSmall}>
          <Filter size={15} color={colors.teal} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Patient Selector Row - treating it as 'All Patients' for doctor */}
        <View style={styles.progressPatientSelector}>
          <Avatar initials="ALL" color={colors.teal} size="md" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.programNameText}>All Patients</Text>
            <Text style={styles.programPatientText}>Global Analytics</Text>
          </View>
          <ChevronRight size={18} color="#CBD5E0" />
        </View>

        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.teal} />
          </View>
        ) : (
          <>
            {/* Small stats tiles */}
            <View style={styles.progressStatsGrid}>
              {[
                { label: "Completion Rate", value: `${stats.completionRate}%`, change: "+2%", color: colors.teal },
                { label: "Avg Score", value: stats.avgScore, change: "+5", color: "#7C83FD" },
                { label: "Streak", value: `${stats.streak} days`, change: "Active", color: "#FF8C69" },
                { label: "Total Duration", value: `${stats.exercisesDone}m`, change: "+12m", color: "#4CAF50" },
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
                <Text style={styles.chartCardSubtitle}>Last 7 Days</Text>
              </View>

              <View style={{ height: chartHeight, marginVertical: 10, width: "100%" }}>
                <Svg width={chartWidth} height={chartHeight}>
                  <Defs>
                    <LinearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="5%" stopColor={colors.teal} stopOpacity={0.3} />
                      <Stop offset="95%" stopColor={colors.teal} stopOpacity={0} />
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
                  <Path d={areaLineD} fill="none" stroke={colors.teal} strokeWidth="2.5" />

                  {/* Interactive Dots */}
                  {areaPoints.map((p, i) => (
                    <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={colors.teal} />
                  ))}
                </Svg>
              </View>

              {/* X Axis Labels */}
              <View style={styles.xAxisRow}>
                {dailyProgress.map((d, i) => (
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
                <Text style={styles.chartCardSubtitle}>Last 6 Weeks</Text>
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
                  {weeklySessions.map((d, i) => {
                    const barHeight = (d.sessions / maxWeeklySessions) * areaHeight;
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
                        fill={colors.teal}
                      />
                    );
                  })}
                </Svg>
              </View>

              {/* X Axis Labels */}
              <View style={styles.xAxisRow}>
                {weeklySessions.map((d, i) => (
                  <Text key={i} style={styles.xAxisText}>
                    {d.week}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

