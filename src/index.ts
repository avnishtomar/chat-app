/**
 * @mybharat/chat-widget — public API
 *
 * Only what is exported here is part of the stable public surface.
 * Internal components, hooks, services, and utilities are NOT re-exported
 * so consumers cannot create accidental dependencies on implementation details.
 */

// ── Component ────────────────────────────────────────────────────────────────
export { MyBharatChatApplication } from './MyBharatChatApplication';

// ── Types ────────────────────────────────────────────────────────────────────
export type { MyBharatChatApplicationProps } from './types';
// Domain types are exported so host apps can type-check callback arguments
// without importing from internal paths.
export type { Message, User } from './types';
