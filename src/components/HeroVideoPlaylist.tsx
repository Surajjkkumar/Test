import React, { useEffect, useRef } from 'react';
import { Animated, AppState, AppStateStatus, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const heroVideos = [
  require('../assets/videos/01-golf.mp4'),
  require('../assets/videos/02-dining.mp4'),
  require('../assets/videos/03-club.mp4'),
];

const DISPLAY_DURATION_MS = 4000;
const CROSSFADE_DURATION_MS = 500;
const CROSSFADE_CLEANUP_MS = 520;

export default function HeroVideoPlaylist() {
  const playerA = useVideoPlayer(heroVideos[0], (player) => {
    player.loop = false;
    player.muted = true;
    player.playbackRate = 1;
    player.play();
  });

  const playerB = useVideoPlayer(heroVideos[1], (player) => {
    player.loop = false;
    player.muted = true;
    player.playbackRate = 1;
    player.pause();
  });

  const players = useRef([playerA, playerB]).current;
  const opacities = useRef([new Animated.Value(1), new Animated.Value(0)]).current;

  const activeSlot = useRef(0);
  const sequenceIndex = useRef(0);
  const transitioning = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isForeground = useRef(true);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
  };

  const armTimer = () => {
    clearTimer();
    timerRef.current = setTimeout(transition, DISPLAY_DURATION_MS);
  };

  const transition = () => {
    if (transitioning.current || !isForeground.current) return;
    transitioning.current = true;

    const activeIdx = activeSlot.current;
    const standbyIdx = 1 - activeIdx;
    const nextSeq = (sequenceIndex.current + 1) % heroVideos.length;
    const standbyPlayer = players[standbyIdx];

    try {
      standbyPlayer.currentTime = 0;
      standbyPlayer.playbackRate = 1;
      standbyPlayer.play();
    } catch {
      transitioning.current = false;
      armTimer();
      return;
    }

    Animated.parallel([
      Animated.timing(opacities[activeIdx], {
        toValue: 0,
        duration: CROSSFADE_DURATION_MS,
        useNativeDriver: true,
      }),
      Animated.timing(opacities[standbyIdx], {
        toValue: 1,
        duration: CROSSFADE_DURATION_MS,
        useNativeDriver: true,
      }),
    ]).start();

    sequenceIndex.current = nextSeq;
    activeSlot.current = standbyIdx;
    armTimer();

    cleanupTimerRef.current = setTimeout(() => {
      const oldPlayer = players[activeIdx];
      oldPlayer.pause();
      transitioning.current = false;
      const upcomingSeq = (nextSeq + 1) % heroVideos.length;
      oldPlayer.replace(heroVideos[upcomingSeq]);
      oldPlayer.pause();
    }, CROSSFADE_CLEANUP_MS);
  };

  useEffect(() => {
    armTimer();

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        isForeground.current = true;
        const active = players[activeSlot.current];
        active.playbackRate = 1;
        active.play();
        armTimer();
      } else {
        isForeground.current = false;
        clearTimer();
        players.forEach((player) => player.pause());
      }
    });

    return () => {
      clearTimer();
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: opacities[0] }]}>
        <VideoView
          player={playerA}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: opacities[1] }]}>
        <VideoView
          player={playerB}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
        />
      </Animated.View>
    </View>
  );
}
