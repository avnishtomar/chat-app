import type { Message, User } from '../types';

/** Returns a locally-unique ID for an optimistic (not-yet-acked) message. */
export function nextLocalMessageId(): string {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function toStringId(value: unknown): string | null {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return null;
}

/** Normalises a raw API messages array into typed, sorted Message objects. */
export function toMessageList(items: unknown[], activeUserId: string): Message[] {
  const list: Message[] = [];

  for (let index = 0; index < items.length; index += 1) {
    const raw = items[index] as Record<string, unknown>;
    const senderId =
      toStringId(raw.senderId) ??
      toStringId(raw.sender) ??
      toStringId((raw.sender as Record<string, unknown> | undefined)?.id);

    const body = raw.message ?? raw.content ?? raw.text;
    const text = typeof body === 'string' ? body.trim() : '';
    if (!text) continue;

    const timestamp =
      toStringId(raw.createdAt) ?? toStringId(raw.timestamp) ?? new Date().toISOString();
    const messageId =
      toStringId(raw.id) ??
      toStringId(raw.messageId) ??
      `api-${activeUserId}-${index}-${timestamp}`;

    list.push({
      id: messageId,
      sender: senderId === activeUserId ? activeUserId : 'me',
      message: text,
      timestamp,
    });
  }

  return list.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
}

/**
 * Builds a map of userId → conversationId from the /conversations/recent response.
 * Only users that appear in the provided `users` list are considered.
 */
export function mapRecentByUserId(recent: unknown[], users: User[]): Record<string, string> {
  const userIdSet = new Set(users.map((u) => u.id));
  const mapping: Record<string, string> = {};

  for (const item of recent) {
    const row = item as Record<string, unknown>;
    const conversationId =
      toStringId(row.conversationId) ?? toStringId(row.id) ?? toStringId(row.uuid);
    if (!conversationId) continue;

    const candidateUserIds: Array<string | null> = [
      toStringId(row.userId),
      toStringId(row.otherUserId),
      toStringId(row.receiverId),
      toStringId(row.senderId),
      toStringId(row.contactId),
      toStringId((row.participant as Record<string, unknown> | undefined)?.id),
      toStringId((row.user as Record<string, unknown> | undefined)?.id),
    ];

    const participants = Array.isArray(row.participants) ? row.participants : [];
    for (const p of participants) {
      candidateUserIds.push(toStringId((p as Record<string, unknown>)?.id));
      candidateUserIds.push(toStringId(p));
    }

    const matchedUserId = candidateUserIds.find(
      (c): c is string => !!c && userIdSet.has(c),
    );

    if (matchedUserId && !mapping[matchedUserId]) {
      mapping[matchedUserId] = conversationId;
    }
  }

  return mapping;
}
