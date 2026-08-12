import React, { useCallback, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeroVideoPlaylist from '../components/HeroVideoPlaylist';
import ServiceCarousel, { Service } from '../components/ServiceCarousel';
import BottomNavigation from '../components/BottomNavigation';
import BottomSheet from '../components/BottomSheet';
import Toast from '../components/Toast';
import { colors, NAV_HEIGHT } from '../theme';

const SHEET_CONTENT: Record<string, { title: string; body: string }> = {
  profile: {
    title: 'Mathew Joes',
    body: 'Platinum member · Member since 2019',
  },
};

const TOAST_DURATION_MS = 1800;

export default function HomeScreen() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetKey, setSheetKey] = useState('profile');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openSheet = useCallback((key: string) => {
    setSheetKey(key);
    setSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(message);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), TOAST_DURATION_MS);
  }, []);

  const handleServiceSelect = useCallback(
    (service: Service) => {
      showToast(`${service.label} selected`);
    },
    [showToast]
  );

  const handleNavSelect = useCallback(
    (id: string) => {
      if (id === 'Home') return;
      showToast(`${id} flow will be designed next`);
    },
    [showToast]
  );

  const sheetContent = SHEET_CONTENT[sheetKey];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <HeroVideoPlaylist />

      <LinearGradient
        pointerEvents="none"
        colors={[
          'rgba(8,34,56,0.65)',
          'rgba(8,34,56,0.05)',
          'rgba(8,34,56,0.18)',
          'rgba(8,34,56,0.92)',
        ]}
        locations={[0, 0.34, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.overlay} edges={['top']} pointerEvents="box-none">
        <View style={styles.topbar}>
          <View style={styles.brandRow}>
            <View>
              <Text style={styles.brand}>COBALT</Text>
              <Text style={styles.brandSub}>BEACH CLUB</Text>
            </View>
            <View style={styles.weather} accessibilityLabel="Sunny, 28 degrees">
              <Ionicons name="sunny" size={14} color={colors.white} />
              <Text style={styles.weatherText}>28°</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => openSheet('profile')}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Text style={styles.avatarText}>MJ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        <View style={styles.heroCopy}>
          <Text style={styles.greeting}>Good morning,{'\n'}Mathew.</Text>
        </View>
      </SafeAreaView>

      <View style={[styles.bottomBlock, { bottom: NAV_HEIGHT + 16 }]} pointerEvents="box-none">
        <ServiceCarousel onSelect={handleServiceSelect} />
      </View>

      <BottomNavigation onSelect={handleNavSelect} />

      <BottomSheet
        visible={sheetVisible}
        title={sheetContent.title}
        body={sheetContent.body}
        onClose={closeSheet}
      />

      <Toast message={toastMessage} visible={toastVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  brand: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    fontWeight: '700',
    fontSize: 19,
    letterSpacing: 5,
    color: colors.white,
  },
  brandSub: {
    fontSize: 7,
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: 3,
    color: colors.white,
  },
  weather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 13,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.42)',
  },
  weatherText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
  heroCopy: {
    paddingHorizontal: 24,
    marginBottom: 96,
  },
  greeting: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    fontSize: 38,
    lineHeight: 40,
    fontWeight: '500',
    letterSpacing: -0.7,
    color: colors.white,
    maxWidth: 340,
  },
  bottomBlock: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
});
