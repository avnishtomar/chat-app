import type { User } from '../types';
import UserList from './UserList';

type SidebarProps = {
  users: User[];
  activeUserId: string | null;
  onSelectUser: (userId: string) => void;
  unreadCounts: Record<string, number>;
  isConnected: boolean;
  title?: string;
};

export default function Sidebar({
  users,
  activeUserId,
  onSelectUser,
  unreadCounts,
  isConnected,
  title = 'Conversations',
}: SidebarProps) {
  return (
    <aside className="mbc-sidebar">
      <header className="mbc-sidebar-header">
        <nav className="mbc-sidebar-tabs" aria-label="Primary navigation">
          <button type="button" className="mbc-tab-btn mbc-tab-btn--active">Chat</button>
          <button type="button" className="mbc-tab-btn">Calendar</button>
          <button type="button" className="mbc-tab-btn">Archive</button>
        </nav>
      </header>
      <div className="mbc-sidebar-status-row">
        <h2>{title}</h2>
        <span className={isConnected ? 'mbc-connection-pill mbc-connection-pill--online' : 'mbc-connection-pill mbc-connection-pill--offline'}>
          {isConnected ? 'Online' : 'Offline'}
        </span>
      </div>
      <UserList
        users={users}
        activeUserId={activeUserId}
        onSelect={onSelectUser}
        unreadCounts={unreadCounts}
      />
    </aside>
  );
}
