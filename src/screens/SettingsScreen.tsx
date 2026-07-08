import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { ChevronLeft, ChevronRight, User, Lock, Bell, Globe, Moon, Ruler, HelpCircle, FileText, Shield, Trash2 } from 'lucide-react-native';
import { Screen } from '../types';
import { TEAL, TEAL_LIGHT, BG_COLOR } from '../theme/colors';

export default function SettingsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const SettingItem = ({ icon: Icon, label, value, isToggle, toggleValue, onToggle, isDestructive }: any) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      activeOpacity={isToggle ? 1 : 0.7}
      onPress={() => !isToggle && console.log(label)}
    >
      <View style={[styles.iconContainer, isDestructive && { backgroundColor: '#FFF1F0' }]}>
        <Icon size={18} color={isDestructive ? '#FF6B6B' : TEAL} />
      </View>
      <View style={styles.labelContainer}>
        <Text style={[styles.settingLabel, isDestructive && { color: '#FF6B6B' }]}>{label}</Text>
      </View>
      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#E2E8F0", true: TEAL_LIGHT }}
          thumbColor={toggleValue ? TEAL : "#F8FAFC"}
          ios_backgroundColor="#E2E8F0"
        />
      ) : value ? (
        <View style={styles.valueRow}>
          <Text style={styles.settingValue}>{value}</Text>
          <ChevronRight size={16} color="#CBD5E0" />
        </View>
      ) : (
        <ChevronRight size={16} color="#CBD5E0" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('more')}>
          <ChevronLeft size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} /> {/* Placeholder for balance */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
        
        <View style={styles.section}>
          <SectionHeader title="ACCOUNT" />
          <View style={styles.card}>
            <SettingItem icon={User} label="Edit Profile" />
            <View style={styles.divider} />
            <SettingItem icon={Lock} label="Change Password" />
            <View style={styles.divider} />
            <SettingItem icon={Bell} label="Push Notifications" isToggle toggleValue={notifications} onToggle={setNotifications} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="PREFERENCES" />
          <View style={styles.card}>
            <SettingItem icon={Globe} label="Language" value="English" />
            <View style={styles.divider} />
            <SettingItem icon={Moon} label="Dark Mode" isToggle toggleValue={darkMode} onToggle={setDarkMode} />
            <View style={styles.divider} />
            <SettingItem icon={Ruler} label="Units" value="Metric" />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="SUPPORT & LEGAL" />
          <View style={styles.card}>
            <SettingItem icon={HelpCircle} label="Help Center" />
            <View style={styles.divider} />
            <SettingItem icon={Shield} label="Privacy Policy" />
            <View style={styles.divider} />
            <SettingItem icon={FileText} label="Terms of Service" />
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 40 }]}>
          <SectionHeader title="DANGER ZONE" />
          <View style={styles.card}>
            <SettingItem icon={Trash2} label="Delete Account" isDestructive />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
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
    color: '#1A1A2E',
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
    color: '#8A94A6',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    backgroundColor: 'white',
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
    backgroundColor: TEAL_LIGHT,
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
    color: '#1A1A2E',
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#8A94A6',
    marginRight: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F7FA',
    marginLeft: 50,
  },
});
