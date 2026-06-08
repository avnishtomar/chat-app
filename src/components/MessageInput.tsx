import { type KeyboardEvent } from 'react';

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export default function MessageInput({
  value,
  onChange,
  onSend,
  disabled = false,
}: MessageInputProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <footer className="mbc-message-input-wrap">
      <div className="mbc-composer-shell">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={disabled ? 'Select a conversation first' : 'Type a message…'}
          disabled={disabled}
          maxLength={5000}
          aria-label="Message input"
        />
        <button
          type="button"
          className="mbc-composer-plus"
          disabled={disabled}
          aria-label="Add attachment"
        >
          +
        </button>
      </div>
      <button
        type="button"
        className="mbc-composer-send"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        ➤
      </button>
    </footer>
  );
}
