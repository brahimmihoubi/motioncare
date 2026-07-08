import React from 'react';
import Svg, { Rect, Circle, Path, Text as SvgText } from 'react-native-svg';
import { TEAL } from '../theme/colors';

// Mock data
export const patients = [
  {
    id: 1,
    name: "Yousuf Ali",
    condition: "Knee Ligament Injury",
    doctor: "Dr. Sara Ahmed",
    visits: 12,
    completed: 67,
    avatar: "YA",
    color: "#FF8C69",
    status: "Active",
    lastVisit: "Today",
  },
  {
    id: 2,
    name: "Lina Kahlil",
    condition: "ACL Reconstruction",
    doctor: "Dr. Sara Ahmed",
    visits: 8,
    completed: 45,
    avatar: "LK",
    color: "#7C83FD",
    status: "Active",
    lastVisit: "Yesterday",
  },
  {
    id: 3,
    name: "Peter Cooper",
    condition: "Lower Back Pain",
    doctor: "Dr. Sara Ahmed",
    visits: 15,
    completed: 82,
    avatar: "PC",
    color: "#4CAF50",
    status: "Completed",
    lastVisit: "2 days ago",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    condition: "Hamstring Strain",
    doctor: "Dr. Sara Ahmed",
    visits: 6,
    completed: 30,
    avatar: "SJ",
    color: "#FF6B9D",
    status: "Active",
    lastVisit: "3 days ago",
  },
  {
    id: 5,
    name: "Mark Stevens",
    condition: "Shoulder Impingement",
    doctor: "Dr. Sara Ahmed",
    visits: 10,
    completed: 55,
    avatar: "MS",
    color: "#FFB347",
    status: "Active",
    lastVisit: "1 week ago",
  },
];

export const programs = [
  {
    id: 1,
    name: "Knee Strengthening Program",
    exercises: 6,
    weeks: 8,
    icon: "💪",
    color: "#FFE5D0",
    iconColor: "#FF8C69",
    patient: "Yousuf Ali",
  },
  {
    id: 2,
    name: "Tear ACL Reconstruction",
    exercises: 9,
    weeks: 12,
    icon: "🦵",
    color: "#E5E5FF",
    iconColor: "#7C83FD",
    patient: "Lina Kahlil",
  },
  {
    id: 3,
    name: "Hamstrings Rehab",
    exercises: 5,
    weeks: 6,
    icon: "🏃",
    color: "#D0FFE5",
    iconColor: "#4CAF50",
    patient: "Sarah Johnson",
  },
];

export const deviations = [
  {
    id: 1,
    date: "July 10, 2024",
    title: "Hip Extension – Too Wide",
    desc: "Patient extended hip 15° beyond prescribed range during set 3.",
    severity: "high",
  },
  {
    id: 2,
    date: "July 12, 2024",
    title: "Knee Flexion – Early",
    desc: "Flexion initiated 2 seconds ahead of cue in all three sets.",
    severity: "medium",
  },
  {
    id: 3,
    date: "July 8, 2024",
    title: "Balance Issue",
    desc: "Patient shifted weight left during single-leg stance exercise.",
    severity: "low",
  },
  {
    id: 4,
    date: "July 5, 2024",
    title: "Incomplete Range",
    desc: "Leg raise only reached 45° instead of prescribed 60°.",
    severity: "medium",
  },
];

export const progressData = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 90 },
  { day: "Sun", value: 75 },
];

export const weeklyData = [
  { week: "W1", sessions: 3 },
  { week: "W2", sessions: 5 },
  { week: "W3", sessions: 4 },
  { week: "W4", sessions: 6 },
  { week: "W5", sessions: 5 },
  { week: "W6", sessions: 7 },
];

