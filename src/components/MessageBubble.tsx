import type { Message, User } from '../types';
import Avatar from './Avatar';

type MessageBubbleProps = {
  message: Message;
  activeUser: User;
};

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(value: string): string {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

export default function MessageBubble({ message, activeUser }: MessageBubbleProps) {
  const mine = message.sender === 'me';
  const senderName = mine ? 'You' : activeUser.name;

  return (
    <li className={mine ? 'mbc-bubble-row mbc-bubble-row--mine' : 'mbc-bubble-row mbc-bubble-row--theirs'}>
      <Avatar
        src={mine ? null : activeUser.avatar}
        name={senderName}
        className={mine ? 'mbc-avatar mbc-bubble-avatar mbc-bubble-avatar--mine' : 'mbc-avatar mbc-bubble-avatar'}
      />
      <div className="mbc-bubble-stack">
        <strong className="mbc-bubble-sender">{senderName}</strong>
        <article className={mine ? 'mbc-bubble mbc-bubble--mine' : 'mbc-bubble mbc-bubble--theirs'}>
          <p>{message.message}</p>
        </article>
        <div className={mine ? 'mbc-bubble-meta mbc-bubble-meta--mine' : 'mbc-bubble-meta'}>
          <span>{formatDate(message.timestamp)}</span>
          <time>{formatTime(message.timestamp)}</time>
        </div>
      </div>
    </li>
  );
}
