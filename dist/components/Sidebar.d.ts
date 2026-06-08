import type { User } from '../types';
type SidebarProps = {
    users: User[];
    activeUserId: string | null;
    onSelectUser: (userId: string) => void;
    unreadCounts: Record<string, number>;
    isConnected: boolean;
    title?: string;
};
export default function Sidebar({ users, activeUserId, onSelectUser, unreadCounts, isConnected, title, }: SidebarProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Sidebar.d.ts.map