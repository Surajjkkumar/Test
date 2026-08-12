import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, NAV_HEIGHT } from '../theme';

type IconSpec =
  | { set: 'ionicons'; name: keyof typeof Ionicons.glyphMap }
  | { set: 'mci'; name: keyof typeof MaterialCommunityIcons.glyphMap };

type NavItem = {
  id: string;
  label: string;
  icon: IconSpec;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'Home', label: 'Home', icon: { set: 'ionicons', name: 'home' } },
  { id: 'Tee Time', label: 'Tee Time', icon: { set: 'mci', name: 'golf-tee' } },
  { id: 'Events', label: 'Events', icon: { set: 'ionicons', name: 'calendar-outline' } },
  { id: 'Dining', label: 'Dining', icon: { set: 'mci', name: 'silverware-fork-knife' } },
  { id: 'Menu', label: 'Menu', icon: { set: 'ionicons', name: 'menu' } },
];

type Props = {
  onSelect?: (id: string) => void;
};

export default function BottomNavigation({ onSelect }: Props) {
  const [active, setActive] = useState('Home');
  const insets = useSafeAreaInsets();

  const handlePress = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(8, insets.bottom) }]}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />
      <View style={styles.row}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const color = isActive ? colors.activeWhite : colors.inactiveWhite;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => handlePress(item.id)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              {isActive && <View style={styles.activeIndicator} />}
              {item.icon.set === 'ionicons' ? (
                <Ionicons name={item.icon.name} size={24} color={color} />
              ) : (
                <MaterialCommunityIcons name={item.icon.name} size={24} color={color} />
              )}
              <Text style={[styles.label, { color, fontWeight: isActive ? '800' : '600' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: NAV_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.navBorder,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.navOverlay,
  },
  row: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 30,
    height: 3,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 10.5,
  },
});
