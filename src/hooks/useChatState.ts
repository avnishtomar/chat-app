import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type { ApiClient } from '../services/api';
import type { Conversation, Message, ReceivedMessage, SocketError, User } from '../types';
import { mapRecentByUserId, nextLocalMessageId, toMessageList } from '../utils/helpers';

const PAGE_LIMIT = 20;

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

export function useChatState({
  apiClient,
  socket,
  onMessageSent,
  onError,
}: UseChatStateOptions): ChatState {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation>({});
  const [conversationByUserId, setConversationByUserId] = useState<Record<string, string>>({});
  const [conversationInitialized, setConversationInitialized] = useState<Record<string, boolean>>({});
  const [conversationInitialLoading, setConversationInitialLoading] = useState<Record<string, boolean>>({});
  const [conversationNextCursor, setConversationNextCursor] = useState<Record<string, string | null>>({});
  const [conversationHasMore, setConversationHasMore] = useState<Record<string, boolean>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loadingMoreId, setLoadingMoreId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [connected, setConnected] = useState(false);

  const initialLoadInFlightRef = useRef<Record<string, boolean>>({});
  const loadMoreInFlightRef = useRef<Record<string, boolean>>({});
  const activeUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeUserIdRef.current = activeUserId;
  }, [activeUserId]);

  // Clear unread badge on conversation open
  useEffect(() => {
    if (!activeUserId) return;
    setUnreadCounts((prev) => {
      if (!prev[activeUserId]) return prev;
      return { ...prev, [activeUserId]: 0 };
    });
  }, [activeUserId]);

  // Load first page when a conversation is selected
  useEffect(() => {
    if (!activeUserId) return;
    const selectedUserId = activeUserId;
    const conversationId = conversationByUserId[selectedUserId];
    if (!conversationId) return;

    const cached = conversations[selectedUserId] ?? [];
    if (cached.length > 0) {
      setConversationInitialized((prev) => ({ ...prev, [conversationId]: true }));
      return;
    }
    if (conversationInitialized[conversationId]) return;
    if (initialLoadInFlightRef.current[conversationId]) return;

    initialLoadInFlightRef.current[conversationId] = true;
    setConversationInitialLoading((prev) => ({ ...prev, [conversationId]: true }));

    async function loadFirstPage() {
      try {
        const { messages: raw, hasMore, nextCursor } =
          await apiClient.fetchConversationMessages(conversationId, undefined, PAGE_LIMIT);
        const normalized = toMessageList(raw, selectedUserId);
        setConversations((prev) => ({ ...prev, [selectedUserId]: normalized }));
        setConversationInitialized((prev) => ({ ...prev, [conversationId]: true }));
        setConversationNextCursor((prev) => ({ ...prev, [conversationId]: nextCursor }));
        setConversationHasMore((prev) => ({ ...prev, [conversationId]: hasMore }));
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error(String(err)));
        setConversationInitialized((prev) => ({ ...prev, [conversationId]: true }));
        setConversationNextCursor((prev) => ({ ...prev, [conversationId]: null }));
        setConversationHasMore((prev) => ({ ...prev, [conversationId]: false }));
      } finally {
        delete initialLoadInFlightRef.current[conversationId];
        setConversationInitialLoading((prev) => ({ ...prev, [conversationId]: false }));
      }
    }

    void loadFirstPage();
  }, [activeUserId, apiClient, conversationByUserId, conversationInitialized, conversations, onError]);

  // Socket lifecycle
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const fetchedUsers = await apiClient.fetchChatUsers();
        if (cancelled) return;

        setUsers(fetchedUsers);
        setActiveUserId((prev) => prev ?? fetchedUsers[0]?.id ?? null);
        setConversations((prev) => {
          const next = { ...prev };
          for (const u of fetchedUsers) {
            if (!next[u.id]) next[u.id] = [];
          }
          return next;
        });

        const recent = await apiClient.fetchRecentConversations();
        if (cancelled) return;

        setConversationByUserId(mapRecentByUserId(recent, fetchedUsers));
        setConversationInitialized({});
        setConversationInitialLoading({});
        setConversationNextCursor({});
        setConversationHasMore({});
        setUnreadCounts({});
        initialLoadInFlightRef.current = {};
        loadMoreInFlightRef.current = {};
      } catch (err) {
        if (!cancelled) {
          onError?.(err instanceof Error ? err : new Error(String(err)));
          setUsers([]);
          setConversationByUserId({});
        }
      }
    }

    const onConnect = () => {
      setConnected(true);
      void bootstrap();
    };

    const onDisconnect = () => setConnected(false);

    const onReceiveMessage = (payload: ReceivedMessage) => {
      const userId = String(payload.senderId);
      const text = payload.message ?? payload.content ?? '';
      if (!text.trim()) return;

      const incoming: Message = {
        id: payload.id,
        sender: userId,
        message: text,
        timestamp: payload.createdAt,
      };

      setConversations((prev) => ({
        ...prev,
        [userId]: [...(prev[userId] ?? []), incoming],
      }));

      if (activeUserIdRef.current !== userId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [userId]: (prev[userId] ?? 0) + 1,
        }));
      }
    };

    const onSocketError = (payload: SocketError) => {
      const err = new Error(`Socket error (${payload.code}): ${payload.message}`);
      onError?.(err);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('error', onSocketError);
    socket.connect();

    return () => {
      cancelled = true;
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('error', onSocketError);
      socket.disconnect();
    };
  }, [apiClient, onError, socket]);

  const activeUser = useMemo<User | null>(
    () => users.find((u) => u.id === activeUserId) ?? null,
    [activeUserId, users],
  );

  const activeMessages = activeUserId ? conversations[activeUserId] ?? [] : [];

  const sendMessage = useCallback(() => {
    if (!activeUserId) return;
    const text = draft.trim();
    if (!text) return;
    if (text.length > 5000) {
      console.warn('[MyBharatChat] Message exceeds 5000 characters');
      return;
    }

    const optimistic: Message = {
      id: nextLocalMessageId(),
      sender: 'me',
      message: text,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) => ({
      ...prev,
      [activeUserId]: [...(prev[activeUserId] ?? []), optimistic],
    }));

    socket.emit('send_message', { receiverId: activeUserId, content: text });
    setDraft('');
    onMessageSent?.(text);
  }, [activeUserId, draft, onMessageSent, socket]);

  const loadMoreMessages = useCallback(() => {
    if (!activeUserId) return;
    const conversationId = conversationByUserId[activeUserId];
    if (!conversationId) return;
    if (loadMoreInFlightRef.current[conversationId]) return;
    if (!conversationHasMore[conversationId]) return;
    const cursor = conversationNextCursor[conversationId];
    if (!cursor) return;

    const selectedUserId = activeUserId;
    loadMoreInFlightRef.current[conversationId] = true;
    setLoadingMoreId(conversationId);

    apiClient
      .fetchConversationMessages(conversationId, cursor, PAGE_LIMIT)
      .then(({ messages: raw, hasMore, nextCursor }) => {
        const older = toMessageList(raw, selectedUserId);
        setConversations((prev) => ({
          ...prev,
          [selectedUserId]: [
            ...older.filter(
              (n) => !(prev[selectedUserId] ?? []).some((m) => m.id === n.id),
            ),
            ...(prev[selectedUserId] ?? []),
          ],
        }));
        setConversationNextCursor((prev) => ({ ...prev, [conversationId]: nextCursor }));
        setConversationHasMore((prev) => ({ ...prev, [conversationId]: hasMore }));
      })
      .catch((err) => { onError?.(err instanceof Error ? err : new Error(String(err))); })
      .finally(() => {
        delete loadMoreInFlightRef.current[conversationId];
        setLoadingMoreId(null);
      });
  }, [activeUserId, apiClient, conversationByUserId, conversationHasMore, conversationNextCursor, onError]);

  const handleSelectUser = useCallback((userId: string) => {
    setActiveUserId(userId);
    setUnreadCounts((prev) => {
      if (!prev[userId]) return prev;
      return { ...prev, [userId]: 0 };
    });
  }, []);

  const activeConversationId = activeUserId ? conversationByUserId[activeUserId] : null;
  const isLoadingMore = activeConversationId ? loadingMoreId === activeConversationId : false;
  const hasMore = activeConversationId ? (conversationHasMore[activeConversationId] ?? false) : false;
  const isInitialLoading = activeConversationId
    ? (conversationInitialLoading[activeConversationId] ?? false)
    : false;

  return {
    users,
    activeUserId,
    conversations,
    unreadCounts,
    connected,
    draft,
    activeUser,
    activeMessages,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    handleSelectUser,
    setDraft,
    sendMessage,
    loadMoreMessages,
  };
}
