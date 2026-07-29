import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { ChatMessage } from '../types/chat';

interface Props {
  message: ChatMessage;
}

export default function ChatBubble({ message }: Props) {
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowBot]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.avatarBotBg }]}>
          <Ionicons name="hardware-chip-outline" size={18} color={colors.white} />
        </View>
      )}

      <View style={styles.bubbleColumn}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleBot,
          ]}
        >
          <Text style={isUser ? styles.textUser : styles.textBot}>{message.text}</Text>
        </View>
        <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampBot]}>
          {message.timestamp}
        </Text>
      </View>

      {isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.avatarUserBg }]}>
          <Ionicons name="person" size={16} color="#5B6472" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  rowBot: {
    justifyContent: 'flex-start',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  bubbleColumn: {
    maxWidth: '70%',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleBot: {
    backgroundColor: colors.bubbleBotBg,
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.bubbleUserBg,
    borderTopRightRadius: 4,
  },
  textBot: {
    color: colors.bubbleBotText,
    fontSize: 15,
    lineHeight: 20,
  },
  textUser: {
    color: colors.bubbleUserText,
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: colors.timestamp,
    marginTop: 4,
  },
  timestampBot: {
    textAlign: 'left',
    marginLeft: 4,
  },
  timestampUser: {
    textAlign: 'right',
    marginRight: 4,
  },
});
