import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

type Props = {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function BottomSheet({ visible, title, body, onClose }: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const scrimOpacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: visible ? 0 : SCREEN_HEIGHT,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(scrimOpacity, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateY, scrimOpacity]);

  return (
    <>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[styles.scrim, { opacity: scrimOpacity }]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: 34 + insets.bottom, transform: [{ translateY }] },
        ]}
        accessibilityViewIsModal={visible}
        accessibilityRole="none"
      >
        <View style={styles.handle} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <TouchableOpacity
          style={styles.primary}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Got it"
        >
          <Text style={styles.primaryText}>Got it</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,25,41,0.36)',
    zIndex: 49,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 14,
    zIndex: 50,
    shadowColor: '#072133',
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.25,
    shadowRadius: 60,
    elevation: 24,
  },
  handle: {
    width: 45,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#dbe1e5',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: serif,
    fontSize: 26,
    fontWeight: '500',
    color: colors.ink,
    marginBottom: 7,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    marginBottom: 20,
  },
  primary: {
    borderRadius: 14,
    backgroundColor: colors.navy,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.white,
    fontWeight: '800',
  },
});
