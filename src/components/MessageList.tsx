import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Message, User } from '../types';
import MessageBubble from './MessageBubble';

type MessageListProps = {
  messages: Message[];
  activeUser: User;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
};

const SCROLL_THRESHOLD = 80;
const BOTTOM_THRESHOLD = 40;

function isNearBottom(list: HTMLUListElement): boolean {
  return list.scrollHeight - list.scrollTop - list.clientHeight <= BOTTOM_THRESHOLD;
}

function getDayKey(value: string): string {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDateSeparator(value: string): string {
  const date = new Date(value);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (dateOnly.getTime() === today.getTime()) return 'Today';
  if (dateOnly.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function MessageList({
  messages,
  activeUser,
  onLoadMore,
  isLoadingMore,
  hasMore,
}: MessageListProps) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const prevBottomIdRef = useRef<string | number | null>(null);
  const prevFirstIdRef = useRef<string | number | null>(null);
  const prevScrollTopRef = useRef(0);
  const isAtBottomRef = useRef(true);
  const userIntendedLoadMoreRef = useRef(false);
  const topFetchArmedRef = useRef(true);
  const lockScrollHandlerRef = useRef(false);
  const loadingAnchorRef = useRef<{ scrollTop: number; scrollHeight: number } | null>(null);
  const restoreAnimationFrameRef = useRef<number | null>(null);
  const isRestoringScrollRef = useRef(false);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);

  const cancelRestoreAnimation = useCallback(() => {
    if (restoreAnimationFrameRef.current !== null) {
      cancelAnimationFrame(restoreAnimationFrameRef.current);
      restoreAnimationFrameRef.current = null;
    }
    isRestoringScrollRef.current = false;
  }, []);

  const animateRestoreScroll = useCallback(
    (list: HTMLUListElement, targetScrollTop: number) => {
      cancelRestoreAnimation();
      isRestoringScrollRef.current = true;
      const start = list.scrollTop;
      const delta = targetScrollTop - start;
      if (Math.abs(delta) < 1) {
        list.scrollTop = targetScrollTop;
        isRestoringScrollRef.current = false;
        return;
      }
      const durationMs = 180;
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        list.scrollTop = start + delta * eased;
        if (progress < 1) {
          restoreAnimationFrameRef.current = requestAnimationFrame(step);
          return;
        }
        restoreAnimationFrameRef.current = null;
        isRestoringScrollRef.current = false;
      };
      restoreAnimationFrameRef.current = requestAnimationFrame(step);
    },
    [cancelRestoreAnimation],
  );

  const scrollToBottom = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    lockScrollHandlerRef.current = true;
    list.scrollTop = list.scrollHeight;
    prevScrollTopRef.current = list.scrollTop;
    isAtBottomRef.current = true;
    setShowNewMessagesButton(false);
  }, []);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (isLoadingMore) {
      loadingAnchorRef.current = { scrollTop: list.scrollTop, scrollHeight: list.scrollHeight };
      return;
    }
    if (loadingAnchorRef.current) {
      const anchor = loadingAnchorRef.current;
      const heightDiff = list.scrollHeight - anchor.scrollHeight;
      const targetScrollTop = anchor.scrollTop + heightDiff;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        list.scrollTop = targetScrollTop;
      } else {
        animateRestoreScroll(list, targetScrollTop);
      }
      prevScrollTopRef.current = targetScrollTop;
      isAtBottomRef.current = isNearBottom(list);
      loadingAnchorRef.current = null;
    }
  }, [animateRestoreScroll, isLoadingMore]);

  useEffect(() => () => { cancelRestoreAnimation(); }, [cancelRestoreAnimation]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || messages.length === 0) return;
    const firstId = messages[0]?.id ?? null;
    const bottomId = messages[messages.length - 1]?.id ?? null;
    const prevBottomId = prevBottomIdRef.current;
    const prevFirstId = prevFirstIdRef.current;

    if (prevBottomId !== bottomId) {
      const isInitialLoad = prevBottomId === null;
      if (isInitialLoad || isAtBottomRef.current) {
        scrollToBottom();
      } else {
        setShowNewMessagesButton(true);
      }
    } else if (prevFirstId !== firstId && isLoadingMore) {
      lockScrollHandlerRef.current = true;
    }

    prevFirstIdRef.current = firstId;
    prevBottomIdRef.current = bottomId;
  }, [isLoadingMore, messages, scrollToBottom]);

  useLayoutEffect(() => {
    prevFirstIdRef.current = null;
    prevBottomIdRef.current = null;
    setShowNewMessagesButton(false);
    isAtBottomRef.current = true;
    userIntendedLoadMoreRef.current = false;
    topFetchArmedRef.current = true;
    loadingAnchorRef.current = null;
    const list = listRef.current;
    if (list) {
      list.scrollTop = list.scrollHeight;
      prevScrollTopRef.current = list.scrollTop;
    }
  }, [activeUser.id]);

  const handleScroll = useCallback(() => {
    if (lockScrollHandlerRef.current) {
      lockScrollHandlerRef.current = false;
      return;
    }
    if (isRestoringScrollRef.current) return;
    const list = listRef.current;
    if (!list || !hasMore || isLoadingMore) return;
    const currentScrollTop = list.scrollTop;
    isAtBottomRef.current = isNearBottom(list);
    if (isAtBottomRef.current) setShowNewMessagesButton(false);
    const wasScrollingUp = currentScrollTop < prevScrollTopRef.current;
    prevScrollTopRef.current = currentScrollTop;
    if (currentScrollTop > SCROLL_THRESHOLD * 2) topFetchArmedRef.current = true;
    if (
      userIntendedLoadMoreRef.current &&
      topFetchArmedRef.current &&
      wasScrollingUp &&
      currentScrollTop <= SCROLL_THRESHOLD
    ) {
      topFetchArmedRef.current = false;
      userIntendedLoadMoreRef.current = false;
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  const markUserIntentByWheel = useCallback((e: WheelEvent) => {
    if (e.deltaY < 0) userIntendedLoadMoreRef.current = true;
  }, []);

  const markUserIntentByTouch = useCallback(() => {
    userIntendedLoadMoreRef.current = true;
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.addEventListener('scroll', handleScroll, { passive: true });
    list.addEventListener('wheel', markUserIntentByWheel, { passive: true });
    list.addEventListener('touchmove', markUserIntentByTouch, { passive: true });
    return () => {
      list.removeEventListener('scroll', handleScroll);
      list.removeEventListener('wheel', markUserIntentByWheel);
      list.removeEventListener('touchmove', markUserIntentByTouch);
    };
  }, [handleScroll, markUserIntentByTouch, markUserIntentByWheel]);

  return (
    <ul className="mbc-message-history" ref={listRef}>
      {hasMore && (
        <li className="mbc-load-more-row">
          {isLoadingMore ? (
            <span className="mbc-load-more-spinner">Loading older messages…</span>
          ) : null}
        </li>
      )}
      {messages.map((message, index) => {
        const prev = messages[index - 1];
        const showDateSeparator =
          !prev || getDayKey(prev.timestamp) !== getDayKey(message.timestamp);
        return (
          <Fragment key={String(message.id)}>
            {showDateSeparator ? (
              <li className="mbc-date-separator-row">
                <span className="mbc-date-separator">
                  {formatDateSeparator(message.timestamp)}
                </span>
              </li>
            ) : null}
            <MessageBubble message={message} activeUser={activeUser} />
          </Fragment>
        );
      })}
      {showNewMessagesButton ? (
        <li className="mbc-new-messages-row">
          <button type="button" className="mbc-new-messages-btn" onClick={scrollToBottom}>
            ↓ New Messages
          </button>
        </li>
      ) : null}
    </ul>
  );
}
