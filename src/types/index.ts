// ─── Domain models ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  avatar: string;
  status?: string;
}

export interface Message {
  id: number | string;
  sender: 'me' | string;
  message: string;
  timestamp: string;
}

export interface Conversation {
  [userId: string]: Message[];
}

export interface ReceivedMessage {
  id: string | number;
  senderId: string | number;
  message?: string;
  content?: string;
  createdAt: string;
}

export interface SocketError {
  success: boolean;
  message: string;
  code: string;
}

// ─── Public component props ───────────────────────────────────────────────────

/**
 * Props accepted by <MyBharatChatApplication />.
 *
 * Only `apiBaseUrl` and `token` are strictly required for a working chat.
 * Every other prop is optional and has a sensible default.
 */
export interface MyBharatChatApplicationProps {
  // ── Connection ──────────────────────────────────────────────────────────────
  /** REST + Socket.IO backend origin, e.g. "https://api.example.com" */
  apiBaseUrl: string;
  /** Bearer JWT passed to every API request and the socket handshake */
  token?: string;
  /** Authenticated user's ID (reserved for future per-user features) */
  userId?: string;
  /** Optional tenant identifier forwarded in future multi-tenant scenarios */
  tenantId?: string;
  /**
   * Override the socket URL when the WebSocket endpoint differs from apiBaseUrl.
   * Defaults to apiBaseUrl.
   */
  socketUrl?: string;

  // ── Appearance ──────────────────────────────────────────────────────────────
  /** Colour scheme. Defaults to "light". */
  theme?: 'light' | 'dark';
  /**
   * Accent / primary colour injected as the `--mbc-primary` CSS variable.
   * Affects the send button, connection pill, unread badge, etc.
   * Accepts any valid CSS colour string.
   */
  primaryColor?: string;
  /** Label shown at the top of the conversation list. Defaults to "Conversations". */
  title?: string;
  /** Placeholder shown in the chat area before a conversation is selected. */
  welcomeMessage?: string;
  /** Pixel width applied to the widget container. */
  width?: number;
  /** Pixel height applied to the widget container. */
  height?: number;
  /** Extra CSS class(es) added to the root element. */
  className?: string;

  // ── Floating widget mode ────────────────────────────────────────────────────
  /**
   * When set, renders a fixed floating launcher button at the given corner.
   * The chat panel appears above / beside the button when opened.
   * Omit this prop for the default inline / embedded layout.
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /**
   * Pixel width of the floating panel. Defaults to 380.
   * Only relevant when `position` is set.
   */
  panelWidth?: number;
  /**
   * Pixel height of the floating panel. Defaults to 560.
   * Only relevant when `position` is set.
   */
  panelHeight?: number;
  /** Open the floating panel on initial render. Defaults to false. */
  autoOpen?: boolean;

  // ── Callbacks ───────────────────────────────────────────────────────────────
  /** Fired after the user sends a message (optimistic, before server ack). */
  onMessageSent?: (message: string) => void;
  /** Fired when the floating chat panel is opened. */
  onChatOpened?: () => void;
  /** Fired when the floating chat panel is closed. */
  onChatClosed?: () => void;
  /** Fired on socket-level or API-level errors. */
  onError?: (error: Error) => void;
}
