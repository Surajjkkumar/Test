import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors, NAV_HEIGHT } from '../theme';

type Props = {
  message: string;
  visible: boolean;
};

export default function Toast({ message, visible }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 20,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { opacity, transform: [{ translateY }] }]}
      accessibilityLiveRegion="polite"
      role="status"
    >
      <Text style={styles.text} numberOfLines={1}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: NAV_HEIGHT + 20,
    backgroundColor: colors.ink,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 999,
    zIndex: 40,
  },
  text: {
    color: colors.white,
    fontSize: 11,
  },
});
