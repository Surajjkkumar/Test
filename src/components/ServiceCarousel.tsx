import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';

export type Service = {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

export const SERVICES: Service[] = [
  { id: 'golf', label: 'Golf', icon: 'golf' },
  { id: 'physical-inventory', label: 'Physical Inventory', icon: 'clipboard-list-outline' },
  { id: 'dining', label: 'Dining', icon: 'silverware-fork-knife' },
  { id: 'mobile-ordering', label: 'Mobile Ordering', icon: 'cellphone' },
  { id: 'fb-pos', label: 'F&B POS', icon: 'cash-register' },
  { id: 'bms', label: 'BMS', icon: 'office-building-cog-outline' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CONTENT_HORIZONTAL_PADDING = 20;
const CARD_GAP = 8;
const CONTENT_WIDTH = Math.min(SCREEN_WIDTH, 430) - CONTENT_HORIZONTAL_PADDING * 2;
const CARD_WIDTH = (CONTENT_WIDTH - CARD_GAP * 2) / 3.15;

type Props = {
  onSelect?: (service: Service) => void;
};

export default function ServiceCarousel({ onSelect }: Props) {
  const [atEnd, setAtEnd] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtEnd = contentOffset.x > contentSize.width - layoutMeasurement.width - 12;
    setAtEnd(isAtEnd);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        accessibilityLabel="Club services"
      >
        {SERVICES.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[styles.card, { width: CARD_WIDTH }]}
            activeOpacity={0.85}
            onPress={() => onSelect?.(service)}
            accessibilityRole="button"
            accessibilityLabel={service.label}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name={service.icon} size={16} color={colors.white} />
            </View>
            <Text style={styles.label} numberOfLines={2}>
              {service.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no">
        <View style={[styles.dot, !atEnd && styles.dotActive]} />
        <View style={[styles.dot, atEnd && styles.dotActive]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: CARD_GAP,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  card: {
    minHeight: 96,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 9,
  },
  label: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 13,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    height: 10,
    marginTop: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    backgroundColor: colors.white,
  },
});
