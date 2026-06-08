import type { User } from '../types';
type UserListProps = {
    users: User[];
    activeUserId: string | null;
    onSelect: (userId: string) => void;
    unreadCounts: Record<string, number>;
};
export default function UserList({ users, activeUserId, onSelect, unreadCounts }: UserListProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=UserList.d.ts.map