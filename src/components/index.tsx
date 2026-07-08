import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Screen } from '../types';
import { TEAL } from '../theme/colors';
import { styles } from '../theme/styles';
import { Home as HomeIcon, Users as UsersIcon, LayoutGrid as LayoutIcon, TrendingUp as TrendIcon, MoreHorizontal as MoreIcon } from 'lucide-react-native';

const motionCareLogo = require('../../assets/MotionCare_logo.png');

export function Avatar({
  initials,
  color,
  size = "md",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };
  const fontMap = {
    sm: 11,
    md: 13,
    lg: 15,
    xl: 18,
  };
  const diameter = sizeMap[size];
  const fontSize = fontMap[size];

  return (
    <View
      style={[
        styles.avatarContainer,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize }]}>{initials}</Text>
    </View>
  );
}

export function MotionCareLogo({ size = 60, withBg = true }: { size?: number; withBg?: boolean }) {
  return (
    <View
      style={[
        styles.logoWrapper,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: withBg ? "white" : "transparent",
        },
        withBg && styles.logoShadow,
      ]}
    >
      <Image
        source={motionCareLogo}
        style={{ width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }}
        resizeMode="contain"
      />
    </View>
  );
}

export function BottomNav({
  current,
  onNavigate,
}: {
  current: string;
  onNavigate: (s: Screen) => void;
}) {
  const tabs = [
    { id: "dashboard", icon: HomeIcon, label: "Home" },
    { id: "patients", icon: UsersIcon, label: "Patients" },
    { id: "programs", icon: LayoutIcon, label: "Programs" },
    { id: "progress", icon: TrendIcon, label: "Progress" },
    { id: "more", icon: MoreIcon, label: "More" },
  ];
  return (
    <View style={styles.bottomNav}>
      {tabs.map((t) => {
        const active =
          current === t.id ||
          (current === "patient-detail" && t.id === "patients") ||
          (current === "edit-program" && t.id === "programs") ||
          (current === "exercise-detail" && t.id === "programs") ||
          (current === "deviations" && t.id === "patients");
        const IconComponent = t.icon;
        const color = active ? TEAL : "#8A94A6";

        return (
          <TouchableOpacity
            key={t.id}
            onPress={() => onNavigate(t.id as Screen)}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <IconComponent size={20} color={color} strokeWidth={active ? 2.5 : 1.8} />
            <Text style={[styles.navLabel, { color }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

