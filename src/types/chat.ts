export type MessageSender = 'bot' | 'user';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
}

export interface ChatSummary {
  id: string;
  title: string;
  group: 'Today' | 'Yesterday' | 'Previous';
  messages: ChatMessage[];
}
