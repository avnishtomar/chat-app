import type { User } from '../types';
import Avatar from './Avatar';

type ChatHeaderProps = {
  user: User;
};

export default function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <header className="mbc-chat-header">
      <Avatar src={user.avatar} name={user.name} className="mbc-avatar mbc-avatar--large" />
      <div className="mbc-chat-user-info">
        <h3>{user.name}</h3>
        <p>{user.status ?? 'Available'}</p>
      </div>
    </header>
  );
}
