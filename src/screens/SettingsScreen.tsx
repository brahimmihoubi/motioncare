import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { ChevronLeft, ChevronRight, User, Lock, Bell, Globe, Moon, Ruler, HelpCircle, FileText, Shield, Trash2 } from 'lucide-react-native';
import { Screen } from '../types';
import { useTheme } from '../theme/ThemeContext';

export default function SettingsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { styles, colors, theme, toggleTheme } = useTheme();
  const localStyles = getLocalStyles(colors);
  const [notifications, setNotifications] = useState(true);

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={localStyles.sectionTitle}>{title}</Text>
  );

  const SettingItem = ({ icon: Icon, label, value, isToggle, toggleValue, onToggle, isDestructive }: any) => (
    <TouchableOpacity 
      style={localStyles.settingItem} 
      activeOpacity={isToggle ? 1 : 0.7}
      onPress={() => !isToggle && console.log(label)}
    >
      <View style={[localStyles.iconContainer, isDestructive && { backgroundColor: '#FFF1F0' }]}>
        <Icon size={18} color={isDestructive ? '#FF6B6B' : colors.teal} />
      </View>
      <View style={localStyles.labelContainer}>
        <Text style={[localStyles.settingLabel, isDestructive && { color: '#FF6B6B' }]}>{label}</Text>
      </View>
      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#E2E8F0", true: colors.tealLight }}
          thumbColor={toggleValue ? colors.teal : "#F8FAFC"}
          ios_backgroundColor="#E2E8F0"
        />
      ) : value ? (
        <View style={localStyles.valueRow}>
          <Text style={localStyles.settingValue}>{value}</Text>
          <ChevronRight size={16} color={colors.textSecondary} />
        </View>
      ) : (
        <ChevronRight size={16} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={localStyles.safeContainer}>
      <View style={localStyles.header}>
        <TouchableOpacity style={localStyles.backButton} onPress={() => onNavigate('more')}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={localStyles.scrollBody}>
        
        <View style={localStyles.section}>
          <SectionHeader title="ACCOUNT" />
          <View style={localStyles.card}>
            <SettingItem icon={User} label="Edit Profile" />
            <View style={localStyles.divider} />
            <SettingItem icon={Lock} label="Change Password" />
            <View style={localStyles.divider} />
            <SettingItem icon={Bell} label="Push Notifications" isToggle toggleValue={notifications} onToggle={setNotifications} />
          </View>
        </View>

        <View style={localStyles.section}>
          <SectionHeader title="PREFERENCES" />
          <View style={localStyles.card}>
            <SettingItem icon={Globe} label="Language" value="English" />
            <View style={localStyles.divider} />
            <SettingItem icon={Moon} label="Dark Mode" isToggle toggleValue={theme === 'dark'} onToggle={toggleTheme} />
            <View style={localStyles.divider} />
            <SettingItem icon={Ruler} label="Units" value="Metric" />
          </View>
        </View>

        <View style={localStyles.section}>
          <SectionHeader title="SUPPORT & LEGAL" />
          <View style={localStyles.card}>
            <SettingItem icon={HelpCircle} label="Help Center" />
            <View style={localStyles.divider} />
            <SettingItem icon={Shield} label="Privacy Policy" />
            <View style={localStyles.divider} />
            <SettingItem icon={FileText} label="Terms of Service" />
          </View>
        </View>

        <View style={[localStyles.section, { marginBottom: 40 }]}>
          <SectionHeader title="DANGER ZONE" />
          <View style={localStyles.card}>
            <SettingItem icon={Trash2} label="Delete Account" isDestructive />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const getLocalStyles = (colors: any) => StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
  },
  scrollBody: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  labelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: colors.text,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.textSecondary,
    marginRight: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 50,
  },
});
