/**
 * MyBharatChatApplication
 *
 * The single public component consumers mount. Supports two rendering modes:
 *
 *   1. Embedded (default) — fills its container like any block element.
 *   2. Floating — renders a fixed launcher button at a corner of the viewport
 *      that opens / closes a chat panel. Activated by passing the `position` prop.
 */
import { type CSSProperties, useMemo, useState } from 'react';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';
import { useChatState } from './hooks/useChatState';
import { createApiClient } from './services/api';
import { createChatSocket } from './services/socket';
import './styles/chat.css';
import type { MyBharatChatApplicationProps } from './types';

// ── Inner chat panel (shared between embedded + floating modes) ───────────────

interface ChatPanelProps {
  apiBaseUrl: string;
  token: string;
  title?: string;
  welcomeMessage?: string;
  onMessageSent?: (message: string) => void;
  onError?: (error: Error) => void;
}

function ChatPanel({
  apiBaseUrl,
  token,
  title,
  welcomeMessage,
  onMessageSent,
  onError,
}: ChatPanelProps) {
  const socket = useMemo(
    () => createChatSocket(apiBaseUrl, token),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiBaseUrl, token],
  );

  const apiClient = useMemo(
    () => createApiClient(apiBaseUrl, token),
    [apiBaseUrl, token],
  );

  const {
    users,
    activeUserId,
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
  } = useChatState({ apiClient, socket, onMessageSent, onError });

  return (
    <>
      <Sidebar
        users={users}
        activeUserId={activeUserId}
        onSelectUser={handleSelectUser}
        unreadCounts={unreadCounts}
        isConnected={connected}
        title={title}
      />
      <ChatWindow
        activeUser={activeUser}
        messages={activeMessages}
        draft={draft}
        onDraftChange={setDraft}
        onSend={sendMessage}
        onLoadMore={loadMoreMessages}
        isInitialLoading={isInitialLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        welcomeMessage={welcomeMessage}
      />
    </>
  );
}

// ── SVG icons ─────────────────────────────────────────────────────────────────

function ChatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export function MyBharatChatApplication({
  apiBaseUrl,
  token = '',
  title,
  welcomeMessage,
  theme = 'light',
  primaryColor,
  width,
  height,
  className = '',
  position,
  panelWidth = 380,
  panelHeight = 560,
  autoOpen = false,
  onMessageSent,
  onChatOpened,
  onChatClosed,
  onError,
}: MyBharatChatApplicationProps) {
  const [panelOpen, setPanelOpen] = useState(autoOpen);

  // All hooks must be called unconditionally, before any early return.
  const inlineStyle = useMemo<CSSProperties>(() => {
    const style: Record<string, string> = {};
    if (primaryColor) {
      style['--mbc-primary'] = primaryColor;
      style['--mbc-teal'] = primaryColor;
    }
    if (!position) {
      if (width) style['width'] = `${width}px`;
      if (height) style['height'] = `${height}px`;
    }
    return style as CSSProperties;
  }, [height, position, primaryColor, width]);

  const cornerStyle = useMemo<CSSProperties>(() => {
    if (!position) return {};
    const s: Record<string, string> = { position: 'fixed', zIndex: '9999' };
    if (position.includes('bottom')) { s['bottom'] = '24px'; } else { s['top'] = '24px'; }
    if (position.includes('right'))  { s['right']  = '24px'; } else { s['left'] = '24px'; }
    return s as CSSProperties;
  }, [position]);

  const panelSizeStyle = useMemo<CSSProperties>(
    () => ({ width: `${panelWidth}px`, height: `${panelHeight}px` }),
    [panelHeight, panelWidth],
  );

  // ── Floating mode ───────────────────────────────────────────────────────────

  if (position) {
    const handleOpen = () => { setPanelOpen(true); onChatOpened?.(); };
    const handleClose = () => { setPanelOpen(false); onChatClosed?.(); };

    return (
      <div
        className={`mbc-root mbc-root--floating ${className}`.trim()}
        data-theme={theme}
        style={{ ...cornerStyle, ...inlineStyle }}
        data-testid="mybharat-chat"
      >
        {panelOpen ? (
          <div className="mbc-floating-panel" style={panelSizeStyle}>
            <div className="mbc-floating-panel-inner">
              <ChatPanel
                apiBaseUrl={apiBaseUrl}
                token={token}
                title={title}
                welcomeMessage={welcomeMessage}
                onMessageSent={onMessageSent}
                onError={onError}
              />
            </div>
            <button type="button" className="mbc-floating-close" onClick={handleClose} aria-label="Close chat">
              <CloseIcon />
            </button>
          </div>
        ) : (
          <button type="button" className="mbc-floating-btn" onClick={handleOpen} aria-label="Open chat">
            <ChatIcon />
          </button>
        )}
      </div>
    );
  }

  // ── Embedded (inline) mode ──────────────────────────────────────────────────

  return (
    <div
      className={`mbc-root ${className}`.trim()}
      data-theme={theme}
      style={inlineStyle}
      data-testid="mybharat-chat"
    >
      <ChatPanel
        apiBaseUrl={apiBaseUrl}
        token={token}
        title={title}
        welcomeMessage={welcomeMessage}
        onMessageSent={onMessageSent}
        onError={onError}
      />
    </div>
  );
}
