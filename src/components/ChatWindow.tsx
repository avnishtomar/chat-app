import type { Message, User } from '../types';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

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

export default function ChatWindow({
  activeUser,
  messages,
  draft,
  onDraftChange,
  onSend,
  onLoadMore,
  isInitialLoading,
  isLoadingMore,
  hasMore,
  welcomeMessage = 'Choose a contact on the left to open the conversation.',
}: ChatWindowProps) {
  if (!activeUser) {
    return (
      <section className="mbc-chat-window mbc-chat-window--placeholder">
        <div>
          <h3>Select a conversation to start chatting.</h3>
          <p>{welcomeMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mbc-chat-window">
      <ChatHeader user={activeUser} />
      {isInitialLoading ? (
        <div className="mbc-message-history-skeleton" aria-label="Loading messages">
          <span className="mbc-skeleton-line mbc-skeleton-line--w30" />
          <span className="mbc-skeleton-line mbc-skeleton-line--w55" />
          <span className="mbc-skeleton-line mbc-skeleton-line--w40 mbc-skeleton-line--mine" />
          <span className="mbc-skeleton-line mbc-skeleton-line--w65" />
          <span className="mbc-skeleton-line mbc-skeleton-line--w38 mbc-skeleton-line--mine" />
          <span className="mbc-skeleton-line mbc-skeleton-line--w52" />
        </div>
      ) : (
        <MessageList
          messages={messages}
          activeUser={activeUser}
          onLoadMore={onLoadMore}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
        />
      )}
      <MessageInput value={draft} onChange={onDraftChange} onSend={onSend} />
    </section>
  );
}
