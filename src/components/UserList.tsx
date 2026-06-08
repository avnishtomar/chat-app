import type { User } from '../types';
import Avatar from './Avatar';

type UserListProps = {
  users: User[];
  activeUserId: string | null;
  onSelect: (userId: string) => void;
  unreadCounts: Record<string, number>;
};

export default function UserList({ users, activeUserId, onSelect, unreadCounts }: UserListProps) {
  return (
    <ul className="mbc-user-list" aria-label="Contacts">
      {users.map((user) => {
        const isActive = user.id === activeUserId;
        const unread = unreadCounts[user.id] ?? 0;
        return (
          <li key={user.id}>
            <button
              type="button"
              className={isActive ? 'mbc-user-row mbc-user-row--active' : 'mbc-user-row'}
              onClick={() => onSelect(user.id)}
            >
              <Avatar src={user.avatar} name={user.name} className="mbc-avatar" />
              <span className="mbc-user-meta">
                <strong>{user.name}</strong>
              </span>
              {unread > 0 ? (
                <span className="mbc-user-count" aria-label={`${unread} unread`}>
                  {unread}
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
