import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Image, Dimensions, Animated, Easing, Platform, StatusBar } from 'react-native';
import Svg, { Circle, Path, Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Home as HomeIcon, Users as UsersIcon, LayoutGrid as LayoutIcon, TrendingUp as TrendIcon, MoreHorizontal as MoreIcon, Bell, ChevronRight, ChevronLeft, Search, Star, Edit3, Plus, X, CheckCircle, Clock, Activity, LogOut, HelpCircle, Settings, ArrowRight, Calendar, Filter, Play, Minus, BarChart2 } from 'lucide-react-native';
import { Screen } from '../types';
import { patients, programs, deviations, progressData, weeklyData } from '../data/mockData';
import { Avatar, MotionCareLogo } from '../components';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MoreScreen({
  onNavigate,
  onLogout,
}: {
  onNavigate: (s: Screen) => void;
  onLogout?: () => void;
}) {
  const { styles, colors } = useTheme();
  const menuItems = [
    { icon: HomeIcon, label: "Dashboard", desc: "View your dashboard", screen: "dashboard" },
    { icon: Bell, label: "Notifications", desc: "Manage alerts", screen: "notifications" },
    { icon: BarChart2, label: "Analytics", desc: "View reports", screen: "progress" },
    { icon: HelpCircle, label: "Help & Support", desc: "Get assistance", screen: "welcome" },
    { icon: Settings, label: "Settings", desc: "App preferences", screen: "settings" },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.detailHeader}>
        <Text style={[styles.titleText, { paddingLeft: 10 }]}>More</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        {/* Profile Stats Banner */}
        <View style={styles.moreProfileBanner}>
          <View style={styles.profileBannerHeader}>
            <MotionCareLogo size={64} withBg={true} />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.profileBannerName}>Dr. Sara Ahmed</Text>
              <Text style={styles.profileBannerRole}>Physical Therapist</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={11} color="#FFD700" fill="#FFD700" style={{ marginRight: 2 }} />
                ))}
                <Text style={styles.ratingText}>5.0</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Edit3 size={18} color="white" style={{ opacity: 0.7 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.moreBannerStatsRow}>
            {[
              { label: "Patients", value: "96" },
              { label: "Programs", value: "24" },
              { label: "Rating", value: "4.9" },
            ].map((s, idx) => (
              <View key={idx} style={styles.moreBannerStatCol}>
                <Text style={styles.moreBannerStatVal}>{s.value}</Text>
                <Text style={styles.moreBannerStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuItemsContainer}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => onNavigate(item.screen as Screen)}
                style={[styles.menuItemRow, idx < menuItems.length - 1 && styles.menuItemBorder]}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <Icon size={17} color={colors.teal} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                  <Text style={styles.menuItemDesc}>{item.desc}</Text>
                </View>
                <ChevronRight size={15} color="#CBD5E0" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Row */}
        <TouchableOpacity
          style={styles.logoutRow}
          activeOpacity={0.7}
          onPress={() => {
            if (onLogout) {
              onLogout();
            } else {
              onNavigate('welcome');
            }
          }}
        >
          <View style={styles.logoutIconContainer}>
            <LogOut size={17} color="#FF6B6B" />
          </View>
          <Text style={styles.logoutLabel}>Log Out</Text>
          <ChevronRight size={15} color="#CBD5E0" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <Text style={styles.moreVersionText}>MotionCare v2.4.1</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

