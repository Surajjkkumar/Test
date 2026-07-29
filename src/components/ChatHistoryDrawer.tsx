import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { ChatSummary } from '../types/chat';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 340);

interface Props {
  visible: boolean;
  chats: ChatSummary[];
  activeChatId: string | null;
  onClose: () => void;
  onSelectChat: (chat: ChatSummary) => void;
  onNewChat: () => void;
}

export default function ChatHistoryDrawer({
  visible,
  chats,
  activeChatId,
  onClose,
  onSelectChat,
  onNewChat,
}: Props) {
  const [query, setQuery] = useState('');
  const translateX = useRef(new Animated.Value(PANEL_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : PANEL_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, translateX]);

  const sections = useMemo(() => {
    const filtered = query.trim()
      ? chats.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))
      : chats;

    const groups: ChatSummary['group'][] = ['Today', 'Yesterday', 'Previous'];
    return groups
      .map((group) => ({
        title: group.toUpperCase(),
        data: filtered.filter((c) => c.group === group),
      }))
      .filter((s) => s.data.length > 0);
  }, [chats, query]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chat History</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={26} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrap}>
            <Ionicons name="search" size={16} color={colors.drawerSectionLabel} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor={colors.drawerSectionLabel}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 90 }}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionLabel}>{section.title}</Text>
            )}
            renderItem={({ item }) => {
              const active = item.id === activeChatId;
              return (
                <TouchableOpacity
                  style={[styles.chatItem, active && styles.chatItemActive]}
                  onPress={() => onSelectChat(item)}
                >
                  <Text
                    numberOfLines={1}
                    style={[styles.chatItemText, active && styles.chatItemTextActive]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.newChatButton} onPress={onNewChat}>
              <Ionicons name="add" size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.newChatText}>New Chat</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  panel: {
    width: PANEL_WIDTH,
    backgroundColor: colors.drawerBg,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.drawerSearchBg,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
  },
  sectionLabel: {
    color: colors.drawerSectionLabel,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 6,
    marginHorizontal: 16,
  },
  chatItem: {
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  chatItemActive: {
    backgroundColor: colors.drawerItemActiveBg,
  },
  chatItemText: {
    color: colors.drawerItemText,
    fontSize: 14,
  },
  chatItemTextActive: {
    color: colors.drawerItemActiveText,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.drawerBg,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 22,
    paddingVertical: 12,
  },
  newChatText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
