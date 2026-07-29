import { useCallback, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatBubble from '../components/ChatBubble';
import ChatHeader from '../components/ChatHeader';
import ChatHistoryDrawer from '../components/ChatHistoryDrawer';
import ChatInputBar from '../components/ChatInputBar';
import TypingIndicator from '../components/TypingIndicator';
import { colors } from '../theme/colors';
import { formatTime, getBotReply, mockChats } from '../data/mockData';
import { ChatMessage, ChatSummary } from '../types/chat';

const NEW_CHAT_GREETING: ChatMessage = {
  id: 'new-1',
  sender: 'bot',
  text: 'Hello! How can I assist you today?',
  timestamp: formatTime(),
};

export default function ChatScreen() {
  const [chats, setChats] = useState<ChatSummary[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string>(mockChats[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChats[0].messages);
  const [isThinking, setIsThinking] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const listRef = useRef<FlatList>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const persistMessages = useCallback(
    (chatId: string, nextMessages: ChatMessage[]) => {
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, messages: nextMessages } : c))
      );
    },
    []
  );

  const handleSend = (text: string) => {
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: formatTime(),
    };
    const withUser = [...messages, userMessage];
    setMessages(withUser);
    persistMessages(activeChatId, withUser);
    setIsThinking(true);

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `${Date.now()}-bot`,
        sender: 'bot',
        text: getBotReply(),
        timestamp: formatTime(),
      };
      setMessages((prev) => {
        const withBot = [...prev, botMessage];
        persistMessages(activeChatId, withBot);
        return withBot;
      });
      setIsThinking(false);
    }, 1400);
  };

  const handleSelectChat = (chat: ChatSummary) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
    setIsThinking(false);
    setHistoryVisible(false);
  };

  const handleNewChat = () => {
    const id = `new-${Date.now()}`;
    const newChat: ChatSummary = {
      id,
      title: 'New Chat',
      group: 'Today',
      messages: [{ ...NEW_CHAT_GREETING, id: `${id}-1`, timestamp: formatTime() }],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    setMessages(newChat.messages);
    setIsThinking(false);
    setHistoryVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ChatHeader
        title="How can we Help you?"
        onMenuPress={() => setHistoryVisible(true)}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={isThinking ? <TypingIndicator /> : null}
        />

        <ChatInputBar onSend={handleSend} disabled={isThinking} />
      </KeyboardAvoidingView>

      <ChatHistoryDrawer
        visible={historyVisible}
        chats={chats}
        activeChatId={activeChatId}
        onClose={() => setHistoryVisible(false)}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.headerBg,
  },
  flex: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
});
