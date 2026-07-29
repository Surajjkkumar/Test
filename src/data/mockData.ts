import { ChatSummary } from '../types/chat';

const club = (title: string, group: ChatSummary['group'], id: string): ChatSummary => ({
  id,
  title,
  group,
  messages: [
    {
      id: `${id}-1`,
      sender: 'bot',
      text: 'Hello! How can I assist you today?',
      timestamp: '10:42 AM',
    },
    {
      id: `${id}-2`,
      sender: 'user',
      text: title,
      timestamp: '10:45 AM',
    },
    {
      id: `${id}-3`,
      sender: 'bot',
      text: 'Sure, I can help with that. What seems to be the problem?',
      timestamp: '10:45 AM',
    },
  ],
});

export const mockChats: ChatSummary[] = [
  {
    id: 'today-1',
    title: 'Password Reset Request',
    group: 'Today',
    messages: [
      { id: 'm1', sender: 'bot', text: 'Hello! How can I assist you today?', timestamp: '10:42 AM' },
      { id: 'm2', sender: 'user', text: 'I need help with my account', timestamp: '10:45 AM' },
      { id: 'm3', sender: 'bot', text: 'Sure, I can help with that. What seems to be the problem?', timestamp: '10:45 AM' },
    ],
  },
  club('Pool Hours This Weekend', 'Today', 'today-2'),
  club('Golf Lesson Availability', 'Today', 'today-3'),
  club('Invite a Guest to the Club', 'Today', 'today-4'),
  club('Membership Renewal Details', 'Today', 'today-5'),
  club('Spa Appointment Booking', 'Today', 'today-6'),

  club('Pool Hours This Weekend', 'Yesterday', 'yesterday-1'),
  club('Golf Lesson Availability', 'Yesterday', 'yesterday-2'),
  club('Invite a Guest to the Club', 'Yesterday', 'yesterday-3'),
  club('Membership Renewal Details', 'Yesterday', 'yesterday-4'),
  club('Spa Appointment Booking', 'Yesterday', 'yesterday-5'),

  club('Check My Upcoming Bookings', 'Previous', 'prev-1'),
  club('Golf Lesson Availability', 'Previous', 'prev-2'),
  club('Invite a Guest to the Club', 'Previous', 'prev-3'),
  club('Membership Renewal Details', 'Previous', 'prev-4'),
  club("Today's Club Events", 'Previous', 'prev-5'),
  club('Lost My Membership Card', 'Previous', 'prev-6'),
  club('Weather Impact on the Course', 'Previous', 'prev-7'),
  club('Locker Assignment Request', 'Previous', 'prev-8'),
  club('Spa Appointment Booking', 'Previous', 'prev-9'),
  club('Parking Information', 'Previous', 'prev-10'),
  club('Book a Private Event', 'Previous', 'prev-11'),
];

export const canedBotReplies = [
  "Got it — let me look into that for you.",
  "I can help with that. Could you share a bit more detail?",
  "Thanks for the info! Here's what I found for you.",
  "That's a great question. Let me check our records.",
  "I've noted that down. Is there anything else you'd like help with?",
  "Sure thing! I'll take care of that right away.",
];

export function getBotReply(): string {
  return canedBotReplies[Math.floor(Math.random() * canedBotReplies.length)];
}

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
