import type { Message, User } from '../types';
type MessageListProps = {
    messages: Message[];
    activeUser: User;
    onLoadMore: () => void;
    isLoadingMore: boolean;
    hasMore: boolean;
};
export default function MessageList({ messages, activeUser, onLoadMore, isLoadingMore, hasMore, }: MessageListProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=MessageList.d.ts.map