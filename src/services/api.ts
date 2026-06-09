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

// ── Internal helpers ──────────────────────────────────────────────────────────

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === 'object') {
    const row = payload as Record<string, unknown>;
    const maybeData = row.data ?? row.items;
    if (Array.isArray(maybeData)) return maybeData;
    if (maybeData && typeof maybeData === 'object') {
      const nested = (maybeData as Record<string, unknown>).messages;
      if (Array.isArray(nested)) return nested;
    }
  }
  return [];
}

function normalizeUser(raw: unknown): ApiUser | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const id = row.id ?? row.userId;
  const idString = typeof id === 'string' || typeof id === 'number' ? String(id) : null;
  if (!idString) return null;

  const nameValue = row.name ?? row.fullName ?? row.username;
  const name = typeof nameValue === 'string' && nameValue.trim() ? nameValue : `User ${idString}`;

  const avatarValue = row.avatar ?? row.avatarUrl ?? row.profileImage;
  const avatar =
    typeof avatarValue === 'string' && avatarValue.trim() ? avatarValue : '/avatars/john.svg';

  const status = typeof row.status === 'string' ? row.status : undefined;

  return { id: idString, name, avatar, status };
}

function extractHasMore(payload: unknown, messages: unknown[], limit: number): boolean {
  if (!payload || typeof payload !== 'object') return messages.length >= limit;
  const p = payload as Record<string, unknown>;

  if (typeof p.hasMore === 'boolean') return p.hasMore;
  if (typeof p.has_more === 'boolean') return p.has_more;

  for (const key of ['meta', 'pagination', 'paginator', 'paging']) {
    const meta = p[key];
    if (meta && typeof meta === 'object') {
      const m = meta as Record<string, unknown>;
      if (typeof m.hasMore === 'boolean') return m.hasMore;
      if (typeof m.has_more === 'boolean') return m.has_more;
      if (typeof m.nextPage === 'number') return true;
      if (typeof m.next_page === 'number') return true;
      if (typeof m.total === 'number') {
        const pages = Math.ceil((m.total as number) / limit);
        if (typeof m.page === 'number') return m.page < pages;
        if (typeof m.currentPage === 'number') return m.currentPage < pages;
      }
    }
  }

  const data = p.data;
  if (data && typeof data === 'object') {
    const pag = (data as Record<string, unknown>).pagination;
    if (pag && typeof pag === 'object') {
      const m = pag as Record<string, unknown>;
      if (typeof m.hasMore === 'boolean') return m.hasMore;
      if (typeof m.has_more === 'boolean') return m.has_more;
      if (typeof m.nextPage === 'number') return true;
      if (typeof m.next_page === 'number') return true;
      if (typeof m.total === 'number') {
        const pages = Math.ceil((m.total as number) / limit);
        if (typeof m.page === 'number') return m.page < pages;
        if (typeof m.currentPage === 'number') return m.currentPage < pages;
      }
    }
  }

  return messages.length >= limit;
}

function extractNextCursor(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;
  if (typeof p.nextCursor === 'string' && p.nextCursor.trim()) return p.nextCursor;
  if (typeof p.next_cursor === 'string' && p.next_cursor.trim()) return p.next_cursor;
  const data = p.data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (typeof d.nextCursor === 'string' && d.nextCursor.trim()) return d.nextCursor;
    if (typeof d.next_cursor === 'string' && d.next_cursor.trim()) return d.next_cursor;
  }
  return null;
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a REST API client bound to the supplied base URL and bearer token.
 * Safe to call inside `useMemo` — a new client is only created when the
 * arguments change.
 */
export function createApiClient(apiBaseUrl: string, token: string, domain_id: number) {
  const normalizedDomainId = Number.isInteger(domain_id) ? String(domain_id) : undefined;

  async function requestJson(path: string): Promise<unknown> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(normalizedDomainId ? { 'x-domain-id': normalizedDomainId } : {}),
      },
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async function fetchChatUsers(): Promise<ApiUser[]> {
    const payload = await requestJson('/chat/users');
    const rows = extractArray(payload)
      .map(normalizeUser)
      .filter((u): u is ApiUser => u !== null);
    const deduped = new Map<string, ApiUser>();
    for (const u of rows) deduped.set(u.id, u);
    return [...deduped.values()];
  }

  async function fetchRecentConversations(): Promise<unknown[]> {
    const payload = await requestJson('/conversations/recent');
    return extractArray(payload);
  }

  async function fetchConversationMessages(
    conversationId: string,
    cursor?: string,
    limit = 20,
  ): Promise<MessagesPage> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set('cursor', cursor);
    const payload = await requestJson(
      `/conversations/${conversationId}/messages?${params.toString()}`,
    );
    const messages = extractArray(payload);
    return {
      messages,
      hasMore: extractHasMore(payload, messages, limit),
      nextCursor: extractNextCursor(payload),
    };
  }

  return { fetchChatUsers, fetchRecentConversations, fetchConversationMessages };
}

export type ApiClient = ReturnType<typeof createApiClient>;
