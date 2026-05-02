import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const TAB_CONFIG = [
    { name: 'index',    icon: 'home',         iconO: 'home-outline',         siLabel: 'ගෙදර',    enLabel: 'Home' },
    { name: 'reports',  icon: 'bar-chart',    iconO: 'bar-chart-outline',    siLabel: 'වාර්තා',  enLabel: 'Reports' },
    { name: 'monthly',  icon: 'calendar',     iconO: 'calendar-outline',     siLabel: 'මාසිකව', enLabel: 'Monthly' },
    { name: 'settings', icon: 'settings',     iconO: 'settings-outline',     siLabel: 'සැකසීම', enLabel: 'Settings' },
  ];

  const left = state.routes.slice(0, 2);
  const right = state.routes.slice(2, 4);

  const renderTab = (route: any, routeIdx: number) => {
    const cfg = TAB_CONFIG[routeIdx];
    const isFocused = state.index === routeIdx;
    return (
      <TouchableOpacity
        key={route.key}
        testID={`tab-${route.name}`}
        style={styles.tabBtn}
        onPress={() => navigation.navigate(route.name)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={(isFocused ? cfg.icon : cfg.iconO) as any}
          size={22}
          color={isFocused ? COLORS.primary : '#9CA3AF'}
        />
        <Text style={[styles.tabLabel, { color: isFocused ? COLORS.primary : '#9CA3AF' }]}>
          {cfg.siLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
      {left.map((r: any, i: number) => renderTab(r, i))}
      <View style={styles.fabWrap}>
        <TouchableOpacity
          testID="fab-add-transaction"
          style={styles.fab}
          onPress={() => router.push('/add-transaction')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {right.map((r: any, i: number) => renderTab(r, i + 2))}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="monthly" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 12,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 50,
  },
  tabLabel: {
    fontSize: 9,
    marginTop: 3,
    fontWeight: '600',
  },
  fabWrap: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 14 : 18,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
});
