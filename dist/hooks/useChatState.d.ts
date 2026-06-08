import type { Socket } from 'socket.io-client';
import type { ApiClient } from '../services/api';
import type { Conversation, Message, User } from '../types';
export interface UseChatStateOptions {
    apiClient: ApiClient;
    socket: Socket;
    onMessageSent?: (message: string) => void;
    onError?: (error: Error) => void;
}
export interface ChatState {
    users: User[];
    activeUserId: string | null;
    conversations: Conversation;
    unreadCounts: Record<string, number>;
    connected: boolean;
    draft: string;
    activeUser: User | null;
    activeMessages: Message[];
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    handleSelectUser: (userId: string) => void;
    setDraft: (value: string) => void;
    sendMessage: () => void;
    loadMoreMessages: () => void;
}
export declare function useChatState({ apiClient, socket, onMessageSent, onError, }: UseChatStateOptions): ChatState;
//# sourceMappingURL=useChatState.d.ts.map