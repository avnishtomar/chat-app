/**
 * Parameterised API client factory.
 *
 * Accepts `apiBaseUrl` and `token` directly — never reads from cookies,
 * environment variables, or any global state.
 */
export type ApiUser = {
    id: string;
    name: string;
    avatar: string;
    status?: string;
};
export type MessagesPage = {
    messages: unknown[];
    nextCursor: string | null;
    hasMore: boolean;
};
/**
 * Creates a REST API client bound to the supplied base URL and bearer token.
 * Safe to call inside `useMemo` — a new client is only created when the
 * arguments change.
 */
export declare function createApiClient(apiBaseUrl: string, token: string): {
    fetchChatUsers: () => Promise<ApiUser[]>;
    fetchRecentConversations: () => Promise<unknown[]>;
    fetchConversationMessages: (conversationId: string, cursor?: string, limit?: number) => Promise<MessagesPage>;
};
export type ApiClient = ReturnType<typeof createApiClient>;
//# sourceMappingURL=api.d.ts.map