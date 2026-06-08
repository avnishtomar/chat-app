import type { Message, User } from '../types';
type ChatWindowProps = {
    activeUser: User | null;
    messages: Message[];
    draft: string;
    onDraftChange: (value: string) => void;
    onSend: () => void;
    onLoadMore: () => void;
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    welcomeMessage?: string;
};
export default function ChatWindow({ activeUser, messages, draft, onDraftChange, onSend, onLoadMore, isInitialLoading, isLoadingMore, hasMore, welcomeMessage, }: ChatWindowProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ChatWindow.d.ts.map