import type { Message, User } from '../types';
/** Returns a locally-unique ID for an optimistic (not-yet-acked) message. */
export declare function nextLocalMessageId(): string;
export declare function toStringId(value: unknown): string | null;
/** Normalises a raw API messages array into typed, sorted Message objects. */
export declare function toMessageList(items: unknown[], activeUserId: string): Message[];
/**
 * Builds a map of userId → conversationId from the /conversations/recent response.
 * Only users that appear in the provided `users` list are considered.
 */
export declare function mapRecentByUserId(recent: unknown[], users: User[]): Record<string, string>;
//# sourceMappingURL=helpers.d.ts.map