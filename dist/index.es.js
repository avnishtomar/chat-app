import { jsx as h, jsxs as A, Fragment as ut } from "react/jsx-runtime";
import { useRef as L, useState as B, useCallback as X, useLayoutEffect as _e, useEffect as ne, Fragment as ft, useMemo as se } from "react";
const Me = [
  "#1a73c7",
  "#2e7d32",
  "#7b1fa2",
  "#c62828",
  "#00838f",
  "#ad1457",
  "#f57f17",
  "#4527a0",
  "#00695c",
  "#6d4c41"
];
function dt(s) {
  let e = 0;
  for (let t = 0; t < s.length; t++)
    e = s.charCodeAt(t) + ((e << 5) - e);
  return Me[Math.abs(e) % Me.length];
}
function pt(s) {
  const e = s.trim().split(/\s+/);
  return e.length === 1 ? e[0].charAt(0).toUpperCase() : (e[0].charAt(0) + e[e.length - 1].charAt(0)).toUpperCase();
}
function xe({ src: s, name: e, className: t = "mbc-avatar" }) {
  if (s && !s.startsWith("/avatars/"))
    return /* @__PURE__ */ h(
      "img",
      {
        src: s,
        alt: e,
        className: t,
        onError: (i) => {
          i.currentTarget.style.display = "none";
        }
      }
    );
  const n = dt(e), r = pt(e);
  return /* @__PURE__ */ h(
    "span",
    {
      className: `mbc-avatar-initials ${t}`,
      style: { background: n },
      "aria-label": e,
      children: r
    }
  );
}
function mt({ user: s }) {
  return /* @__PURE__ */ A("header", { className: "mbc-chat-header", children: [
    /* @__PURE__ */ h(xe, { src: s.avatar, name: s.name, className: "mbc-avatar mbc-avatar--large" }),
    /* @__PURE__ */ A("div", { className: "mbc-chat-user-info", children: [
      /* @__PURE__ */ h("h3", { children: s.name }),
      /* @__PURE__ */ h("p", { children: s.status ?? "Available" })
    ] })
  ] });
}
function gt({
  value: s,
  onChange: e,
  onSend: t,
  disabled: n = !1
}) {
  return /* @__PURE__ */ A("footer", { className: "mbc-message-input-wrap", children: [
    /* @__PURE__ */ A("div", { className: "mbc-composer-shell", children: [
      /* @__PURE__ */ h(
        "input",
        {
          type: "text",
          value: s,
          onChange: (i) => e(i.target.value),
          onKeyDown: (i) => {
            i.key === "Enter" && !i.shiftKey && (i.preventDefault(), t());
          },
          placeholder: n ? "Select a conversation first" : "Type a message…",
          disabled: n,
          maxLength: 5e3,
          "aria-label": "Message input"
        }
      ),
      /* @__PURE__ */ h(
        "button",
        {
          type: "button",
          className: "mbc-composer-plus",
          disabled: n,
          "aria-label": "Add attachment",
          children: "+"
        }
      )
    ] }),
    /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        className: "mbc-composer-send",
        onClick: t,
        disabled: n || !s.trim(),
        "aria-label": "Send message",
        children: "➤"
      }
    )
  ] });
}
function yt(s) {
  return new Date(s).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function bt(s) {
  const e = new Date(s), t = String(e.getDate()).padStart(2, "0"), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getFullYear()).slice(-2);
  return `${t}-${n}-${r}`;
}
function _t({ message: s, activeUser: e }) {
  const t = s.sender === "me", n = t ? "You" : e.name;
  return /* @__PURE__ */ A("li", { className: t ? "mbc-bubble-row mbc-bubble-row--mine" : "mbc-bubble-row mbc-bubble-row--theirs", children: [
    /* @__PURE__ */ h(
      xe,
      {
        src: t ? null : e.avatar,
        name: n,
        className: t ? "mbc-avatar mbc-bubble-avatar mbc-bubble-avatar--mine" : "mbc-avatar mbc-bubble-avatar"
      }
    ),
    /* @__PURE__ */ A("div", { className: "mbc-bubble-stack", children: [
      /* @__PURE__ */ h("strong", { className: "mbc-bubble-sender", children: n }),
      /* @__PURE__ */ h("article", { className: t ? "mbc-bubble mbc-bubble--mine" : "mbc-bubble mbc-bubble--theirs", children: /* @__PURE__ */ h("p", { children: s.message }) }),
      /* @__PURE__ */ A("div", { className: t ? "mbc-bubble-meta mbc-bubble-meta--mine" : "mbc-bubble-meta", children: [
        /* @__PURE__ */ h("span", { children: bt(s.timestamp) }),
        /* @__PURE__ */ h("time", { children: yt(s.timestamp) })
      ] })
    ] })
  ] });
}
const Pe = 80, wt = 40;
function qe(s) {
  return s.scrollHeight - s.scrollTop - s.clientHeight <= wt;
}
function Ue(s) {
  const e = new Date(s);
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function vt(s) {
  const e = new Date(s), t = /* @__PURE__ */ new Date(), n = new Date(t.getFullYear(), t.getMonth(), t.getDate()), r = new Date(n);
  r.setDate(n.getDate() - 1);
  const i = new Date(e.getFullYear(), e.getMonth(), e.getDate());
  return i.getTime() === n.getTime() ? "Today" : i.getTime() === r.getTime() ? "Yesterday" : e.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
}
function Et({
  messages: s,
  activeUser: e,
  onLoadMore: t,
  isLoadingMore: n,
  hasMore: r
}) {
  const i = L(null), o = L(null), a = L(null), c = L(0), l = L(!0), f = L(!1), m = L(!0), y = L(!1), C = L(null), N = L(null), R = L(!1), [Y, I] = B(!1), D = X(() => {
    N.current !== null && (cancelAnimationFrame(N.current), N.current = null), R.current = !1;
  }, []), M = X(
    (u, k) => {
      D(), R.current = !0;
      const x = u.scrollTop, O = k - x;
      if (Math.abs(O) < 1) {
        u.scrollTop = k, R.current = !1;
        return;
      }
      const j = 180, J = performance.now(), G = (ae) => {
        const ye = ae - J, ce = Math.min(ye / j, 1), be = 1 - Math.pow(1 - ce, 3);
        if (u.scrollTop = x + O * be, ce < 1) {
          N.current = requestAnimationFrame(G);
          return;
        }
        N.current = null, R.current = !1;
      };
      N.current = requestAnimationFrame(G);
    },
    [D]
  ), W = X(() => {
    const u = i.current;
    u && (y.current = !0, u.scrollTop = u.scrollHeight, c.current = u.scrollTop, l.current = !0, I(!1));
  }, []);
  _e(() => {
    const u = i.current;
    if (u) {
      if (n) {
        C.current = { scrollTop: u.scrollTop, scrollHeight: u.scrollHeight };
        return;
      }
      if (C.current) {
        const k = C.current, x = u.scrollHeight - k.scrollHeight, O = k.scrollTop + x;
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ? u.scrollTop = O : M(u, O), c.current = O, l.current = qe(u), C.current = null;
      }
    }
  }, [M, n]), ne(() => () => {
    D();
  }, [D]), _e(() => {
    var J, G;
    if (!i.current || s.length === 0) return;
    const k = ((J = s[0]) == null ? void 0 : J.id) ?? null, x = ((G = s[s.length - 1]) == null ? void 0 : G.id) ?? null, O = o.current, j = a.current;
    O !== x ? O === null || l.current ? W() : I(!0) : j !== k && n && (y.current = !0), a.current = k, o.current = x;
  }, [n, s, W]), _e(() => {
    a.current = null, o.current = null, I(!1), l.current = !0, f.current = !1, m.current = !0, C.current = null;
    const u = i.current;
    u && (u.scrollTop = u.scrollHeight, c.current = u.scrollTop);
  }, [e.id]);
  const P = X(() => {
    if (y.current) {
      y.current = !1;
      return;
    }
    if (R.current) return;
    const u = i.current;
    if (!u || !r || n) return;
    const k = u.scrollTop;
    l.current = qe(u), l.current && I(!1);
    const x = k < c.current;
    c.current = k, k > Pe * 2 && (m.current = !0), f.current && m.current && x && k <= Pe && (m.current = !1, f.current = !1, t());
  }, [r, n, t]), v = X((u) => {
    u.deltaY < 0 && (f.current = !0);
  }, []), Q = X(() => {
    f.current = !0;
  }, []);
  return ne(() => {
    const u = i.current;
    if (u)
      return u.addEventListener("scroll", P, { passive: !0 }), u.addEventListener("wheel", v, { passive: !0 }), u.addEventListener("touchmove", Q, { passive: !0 }), () => {
        u.removeEventListener("scroll", P), u.removeEventListener("wheel", v), u.removeEventListener("touchmove", Q);
      };
  }, [P, Q, v]), /* @__PURE__ */ A("ul", { className: "mbc-message-history", ref: i, children: [
    r && /* @__PURE__ */ h("li", { className: "mbc-load-more-row", children: n ? /* @__PURE__ */ h("span", { className: "mbc-load-more-spinner", children: "Loading older messages…" }) : null }),
    s.map((u, k) => {
      const x = s[k - 1], O = !x || Ue(x.timestamp) !== Ue(u.timestamp);
      return /* @__PURE__ */ A(ft, { children: [
        O ? /* @__PURE__ */ h("li", { className: "mbc-date-separator-row", children: /* @__PURE__ */ h("span", { className: "mbc-date-separator", children: vt(u.timestamp) }) }) : null,
        /* @__PURE__ */ h(_t, { message: u, activeUser: e })
      ] }, String(u.id));
    }),
    Y ? /* @__PURE__ */ h("li", { className: "mbc-new-messages-row", children: /* @__PURE__ */ h("button", { type: "button", className: "mbc-new-messages-btn", onClick: W, children: "↓ New Messages" }) }) : null
  ] });
}
function kt({
  activeUser: s,
  messages: e,
  draft: t,
  onDraftChange: n,
  onSend: r,
  onLoadMore: i,
  isInitialLoading: o,
  isLoadingMore: a,
  hasMore: c,
  welcomeMessage: l = "Choose a contact on the left to open the conversation."
}) {
  return s ? /* @__PURE__ */ A("section", { className: "mbc-chat-window", children: [
    /* @__PURE__ */ h(mt, { user: s }),
    o ? /* @__PURE__ */ A("div", { className: "mbc-message-history-skeleton", "aria-label": "Loading messages", children: [
      /* @__PURE__ */ h("span", { className: "mbc-skeleton-line mbc-skeleton-line--w30" }),
      /* @__PURE__ */ h("span", { className: "mbc-skeleton-line mbc-skeleton-line--w55" }),
      /* @__PURE__ */ h("span", { className: "mbc-skeleton-line mbc-skeleton-line--w40 mbc-skeleton-line--mine" }),
      /* @__PURE__ */ h("span", { className: "mbc-skeleton-line mbc-skeleton-line--w65" }),
      /* @__PURE__ */ h("span", { className: "mbc-skeleton-line mbc-skeleton-line--w38 mbc-skeleton-line--mine" }),
      /* @__PURE__ */ h("span", { className: "mbc-skeleton-line mbc-skeleton-line--w52" })
    ] }) : /* @__PURE__ */ h(
      Et,
      {
        messages: e,
        activeUser: s,
        onLoadMore: i,
        isLoadingMore: a,
        hasMore: c
      }
    ),
    /* @__PURE__ */ h(gt, { value: t, onChange: n, onSend: r })
  ] }) : /* @__PURE__ */ h("section", { className: "mbc-chat-window mbc-chat-window--placeholder", children: /* @__PURE__ */ A("div", { children: [
    /* @__PURE__ */ h("h3", { children: "Select a conversation to start chatting." }),
    /* @__PURE__ */ h("p", { children: l })
  ] }) });
}
function At({ users: s, activeUserId: e, onSelect: t, unreadCounts: n }) {
  return /* @__PURE__ */ h("ul", { className: "mbc-user-list", "aria-label": "Contacts", children: s.map((r) => {
    const i = r.id === e, o = n[r.id] ?? 0;
    return /* @__PURE__ */ h("li", { children: /* @__PURE__ */ A(
      "button",
      {
        type: "button",
        className: i ? "mbc-user-row mbc-user-row--active" : "mbc-user-row",
        onClick: () => t(r.id),
        children: [
          /* @__PURE__ */ h(xe, { src: r.avatar, name: r.name, className: "mbc-avatar" }),
          /* @__PURE__ */ h("span", { className: "mbc-user-meta", children: /* @__PURE__ */ h("strong", { children: r.name }) }),
          o > 0 ? /* @__PURE__ */ h("span", { className: "mbc-user-count", "aria-label": `${o} unread`, children: o }) : null
        ]
      }
    ) }, r.id);
  }) });
}
function Tt({
  users: s,
  activeUserId: e,
  onSelectUser: t,
  unreadCounts: n,
  isConnected: r,
  title: i = "Conversations"
}) {
  return /* @__PURE__ */ A("aside", { className: "mbc-sidebar", children: [
    /* @__PURE__ */ h("header", { className: "mbc-sidebar-header", children: /* @__PURE__ */ A("nav", { className: "mbc-sidebar-tabs", "aria-label": "Primary navigation", children: [
      /* @__PURE__ */ h("button", { type: "button", className: "mbc-tab-btn mbc-tab-btn--active", children: "Chat" }),
      /* @__PURE__ */ h("button", { type: "button", className: "mbc-tab-btn", children: "Calendar" }),
      /* @__PURE__ */ h("button", { type: "button", className: "mbc-tab-btn", children: "Archive" })
    ] }) }),
    /* @__PURE__ */ A("div", { className: "mbc-sidebar-status-row", children: [
      /* @__PURE__ */ h("h2", { children: i }),
      /* @__PURE__ */ h("span", { className: r ? "mbc-connection-pill mbc-connection-pill--online" : "mbc-connection-pill mbc-connection-pill--offline", children: r ? "Online" : "Offline" })
    ] }),
    /* @__PURE__ */ h(
      At,
      {
        users: s,
        activeUserId: e,
        onSelect: t,
        unreadCounts: n
      }
    )
  ] });
}
function St() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function E(s) {
  return typeof s == "string" || typeof s == "number" ? String(s) : null;
}
function Fe(s, e) {
  var n;
  const t = [];
  for (let r = 0; r < s.length; r += 1) {
    const i = s[r], o = E(i.senderId) ?? E(i.sender) ?? E((n = i.sender) == null ? void 0 : n.id), a = i.message ?? i.content ?? i.text, c = typeof a == "string" ? a.trim() : "";
    if (!c) continue;
    const l = E(i.createdAt) ?? E(i.timestamp) ?? (/* @__PURE__ */ new Date()).toISOString(), f = E(i.id) ?? E(i.messageId) ?? `api-${e}-${r}-${l}`;
    t.push({
      id: f,
      sender: o === e ? e : "me",
      message: c,
      timestamp: l
    });
  }
  return t.sort(
    (r, i) => new Date(r.timestamp).getTime() - new Date(i.timestamp).getTime()
  );
}
function Ct(s, e) {
  var r, i;
  const t = new Set(e.map((o) => o.id)), n = {};
  for (const o of s) {
    const a = o, c = E(a.conversationId) ?? E(a.id) ?? E(a.uuid);
    if (!c) continue;
    const l = [
      E(a.userId),
      E(a.otherUserId),
      E(a.receiverId),
      E(a.senderId),
      E(a.contactId),
      E((r = a.participant) == null ? void 0 : r.id),
      E((i = a.user) == null ? void 0 : i.id)
    ], f = Array.isArray(a.participants) ? a.participants : [];
    for (const y of f)
      l.push(E(y == null ? void 0 : y.id)), l.push(E(y));
    const m = l.find(
      (y) => !!y && t.has(y)
    );
    m && !n[m] && (n[m] = c);
  }
  return n;
}
const $e = 20;
function Rt({
  apiClient: s,
  socket: e,
  onMessageSent: t,
  onError: n
}) {
  const [r, i] = B([]), [o, a] = B(null), [c, l] = B({}), [f, m] = B({}), [y, C] = B({}), [N, R] = B({}), [Y, I] = B({}), [D, M] = B({}), [W, P] = B({}), [v, Q] = B(null), [u, k] = B(""), [x, O] = B(!1), j = L({}), J = L({}), G = L(null);
  ne(() => {
    G.current = o;
  }, [o]), ne(() => {
    o && P((d) => d[o] ? { ...d, [o]: 0 } : d);
  }, [o]), ne(() => {
    if (!o) return;
    const d = o, g = f[d];
    if (!g) return;
    if ((c[d] ?? []).length > 0) {
      C((T) => ({ ...T, [g]: !0 }));
      return;
    }
    if (y[g] || j.current[g]) return;
    j.current[g] = !0, R((T) => ({ ...T, [g]: !0 }));
    async function H() {
      try {
        const { messages: T, hasMore: q, nextCursor: b } = await s.fetchConversationMessages(g, void 0, $e), _ = Fe(T, d);
        l((S) => ({ ...S, [d]: _ })), C((S) => ({ ...S, [g]: !0 })), I((S) => ({ ...S, [g]: b })), M((S) => ({ ...S, [g]: q }));
      } catch (T) {
        n == null || n(T instanceof Error ? T : new Error(String(T))), C((q) => ({ ...q, [g]: !0 })), I((q) => ({ ...q, [g]: null })), M((q) => ({ ...q, [g]: !1 }));
      } finally {
        delete j.current[g], R((T) => ({ ...T, [g]: !1 }));
      }
    }
    H();
  }, [o, s, f, y, c, n]), ne(() => {
    let d = !1;
    async function g() {
      try {
        const b = await s.fetchChatUsers();
        if (d) return;
        i(b), a((S) => {
          var V;
          return S ?? ((V = b[0]) == null ? void 0 : V.id) ?? null;
        }), l((S) => {
          const V = { ...S };
          for (const Z of b)
            V[Z.id] || (V[Z.id] = []);
          return V;
        });
        const _ = await s.fetchRecentConversations();
        if (d) return;
        m(Ct(_, b)), C({}), R({}), I({}), M({}), P({}), j.current = {}, J.current = {};
      } catch (b) {
        d || (n == null || n(b instanceof Error ? b : new Error(String(b))), i([]), m({}));
      }
    }
    const F = () => {
      O(!0), g();
    }, H = () => O(!1), T = (b) => {
      const _ = String(b.senderId), S = b.message ?? b.content ?? "";
      if (!S.trim()) return;
      const V = {
        id: b.id,
        sender: _,
        message: S,
        timestamp: b.createdAt
      };
      l((Z) => ({
        ...Z,
        [_]: [...Z[_] ?? [], V]
      })), G.current !== _ && P((Z) => ({
        ...Z,
        [_]: (Z[_] ?? 0) + 1
      }));
    }, q = (b) => {
      const _ = new Error(`Socket error (${b.code}): ${b.message}`);
      n == null || n(_);
    };
    return e.on("connect", F), e.on("disconnect", H), e.on("receive_message", T), e.on("error", q), e.connect(), () => {
      d = !0, e.off("connect", F), e.off("disconnect", H), e.off("receive_message", T), e.off("error", q), e.disconnect();
    };
  }, [s, n, e]);
  const ae = se(
    () => r.find((d) => d.id === o) ?? null,
    [o, r]
  ), ye = o ? c[o] ?? [] : [], ce = X(() => {
    if (!o) return;
    const d = u.trim();
    if (!d) return;
    if (d.length > 5e3) {
      console.warn("[MyBharatChat] Message exceeds 5000 characters");
      return;
    }
    const g = {
      id: St(),
      sender: "me",
      message: d,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    l((F) => ({
      ...F,
      [o]: [...F[o] ?? [], g]
    })), e.emit("send_message", { receiverId: o, content: d }), k(""), t == null || t(d);
  }, [o, u, t, e]), be = X(() => {
    if (!o) return;
    const d = f[o];
    if (!d || J.current[d] || !D[d]) return;
    const g = Y[d];
    if (!g) return;
    const F = o;
    J.current[d] = !0, Q(d), s.fetchConversationMessages(d, g, $e).then(({ messages: H, hasMore: T, nextCursor: q }) => {
      const b = Fe(H, F);
      l((_) => ({
        ..._,
        [F]: [
          ...b.filter(
            (S) => !(_[F] ?? []).some((V) => V.id === S.id)
          ),
          ..._[F] ?? []
        ]
      })), I((_) => ({ ..._, [d]: q })), M((_) => ({ ..._, [d]: T }));
    }).catch((H) => {
      n == null || n(H instanceof Error ? H : new Error(String(H)));
    }).finally(() => {
      delete J.current[d], Q(null);
    });
  }, [o, s, f, D, Y, n]), at = X((d) => {
    a(d), P((g) => g[d] ? { ...g, [d]: 0 } : g);
  }, []), te = o ? f[o] : null, ct = te ? v === te : !1, ht = te ? D[te] ?? !1 : !1, lt = te ? N[te] ?? !1 : !1;
  return {
    users: r,
    activeUserId: o,
    conversations: c,
    unreadCounts: W,
    connected: x,
    draft: u,
    activeUser: ae,
    activeMessages: ye,
    isInitialLoading: lt,
    isLoadingMore: ct,
    hasMore: ht,
    handleSelectUser: at,
    setDraft: k,
    sendMessage: ce,
    loadMoreMessages: be
  };
}
function we(s) {
  if (Array.isArray(s)) return s;
  if (s && typeof s == "object") {
    const e = s, t = e.data ?? e.items;
    if (Array.isArray(t)) return t;
    if (t && typeof t == "object") {
      const n = t.messages;
      if (Array.isArray(n)) return n;
    }
  }
  return [];
}
function Nt(s) {
  if (!s || typeof s != "object") return null;
  const e = s, t = e.id ?? e.userId, n = typeof t == "string" || typeof t == "number" ? String(t) : null;
  if (!n) return null;
  const r = e.name ?? e.fullName ?? e.username, i = typeof r == "string" && r.trim() ? r : `User ${n}`, o = e.avatar ?? e.avatarUrl ?? e.profileImage, a = typeof o == "string" && o.trim() ? o : "/avatars/john.svg", c = typeof e.status == "string" ? e.status : void 0;
  return { id: n, name: i, avatar: a, status: c };
}
function xt(s, e, t) {
  if (!s || typeof s != "object") return e.length >= t;
  const n = s;
  if (typeof n.hasMore == "boolean") return n.hasMore;
  if (typeof n.has_more == "boolean") return n.has_more;
  for (const i of ["meta", "pagination", "paginator", "paging"]) {
    const o = n[i];
    if (o && typeof o == "object") {
      const a = o;
      if (typeof a.hasMore == "boolean") return a.hasMore;
      if (typeof a.has_more == "boolean") return a.has_more;
      if (typeof a.nextPage == "number" || typeof a.next_page == "number") return !0;
      if (typeof a.total == "number") {
        const c = Math.ceil(a.total / t);
        if (typeof a.page == "number") return a.page < c;
        if (typeof a.currentPage == "number") return a.currentPage < c;
      }
    }
  }
  const r = n.data;
  if (r && typeof r == "object") {
    const i = r.pagination;
    if (i && typeof i == "object") {
      const o = i;
      if (typeof o.hasMore == "boolean") return o.hasMore;
      if (typeof o.has_more == "boolean") return o.has_more;
      if (typeof o.nextPage == "number" || typeof o.next_page == "number") return !0;
      if (typeof o.total == "number") {
        const a = Math.ceil(o.total / t);
        if (typeof o.page == "number") return o.page < a;
        if (typeof o.currentPage == "number") return o.currentPage < a;
      }
    }
  }
  return e.length >= t;
}
function Ot(s) {
  if (!s || typeof s != "object") return null;
  const e = s;
  if (typeof e.nextCursor == "string" && e.nextCursor.trim()) return e.nextCursor;
  if (typeof e.next_cursor == "string" && e.next_cursor.trim()) return e.next_cursor;
  const t = e.data;
  if (t && typeof t == "object") {
    const n = t;
    if (typeof n.nextCursor == "string" && n.nextCursor.trim()) return n.nextCursor;
    if (typeof n.next_cursor == "string" && n.next_cursor.trim()) return n.next_cursor;
  }
  return null;
}
function Bt(s, e) {
  async function t(o) {
    const a = await fetch(`${s}${o}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${e}`
      }
    });
    if (!a.ok)
      throw new Error(`Request failed: ${a.status} ${a.statusText}`);
    return a.json();
  }
  async function n() {
    const o = await t("/chat/users"), a = we(o).map(Nt).filter((l) => l !== null), c = /* @__PURE__ */ new Map();
    for (const l of a) c.set(l.id, l);
    return [...c.values()];
  }
  async function r() {
    const o = await t("/conversations/recent");
    return we(o);
  }
  async function i(o, a, c = 20) {
    const l = new URLSearchParams({ limit: String(c) });
    a && l.set("cursor", a);
    const f = await t(
      `/conversations/${o}/messages?${l.toString()}`
    ), m = we(f);
    return {
      messages: m,
      hasMore: xt(f, m, c),
      nextCursor: Ot(f)
    };
  }
  return { fetchChatUsers: n, fetchRecentConversations: r, fetchConversationMessages: i };
}
const K = /* @__PURE__ */ Object.create(null);
K.open = "0";
K.close = "1";
K.ping = "2";
K.pong = "3";
K.message = "4";
K.upgrade = "5";
K.noop = "6";
const ue = /* @__PURE__ */ Object.create(null);
Object.keys(K).forEach((s) => {
  ue[K[s]] = s;
});
const Ae = { type: "error", data: "parser error" }, je = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", Je = typeof ArrayBuffer == "function", Xe = (s) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(s) : s && s.buffer instanceof ArrayBuffer, Oe = ({ type: s, data: e }, t, n) => je && e instanceof Blob ? t ? n(e) : He(e, n) : Je && (e instanceof ArrayBuffer || Xe(e)) ? t ? n(e) : He(new Blob([e]), n) : n(K[s] + (e || "")), He = (s, e) => {
  const t = new FileReader();
  return t.onload = function() {
    const n = t.result.split(",")[1];
    e("b" + (n || ""));
  }, t.readAsDataURL(s);
};
function Ve(s) {
  return s instanceof Uint8Array ? s : s instanceof ArrayBuffer ? new Uint8Array(s) : new Uint8Array(s.buffer, s.byteOffset, s.byteLength);
}
let ve;
function Lt(s, e) {
  if (je && s.data instanceof Blob)
    return s.data.arrayBuffer().then(Ve).then(e);
  if (Je && (s.data instanceof ArrayBuffer || Xe(s.data)))
    return e(Ve(s.data));
  Oe(s, !1, (t) => {
    ve || (ve = new TextEncoder()), e(ve.encode(t));
  });
}
const ze = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", oe = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let s = 0; s < ze.length; s++)
  oe[ze.charCodeAt(s)] = s;
const It = (s) => {
  let e = s.length * 0.75, t = s.length, n, r = 0, i, o, a, c;
  s[s.length - 1] === "=" && (e--, s[s.length - 2] === "=" && e--);
  const l = new ArrayBuffer(e), f = new Uint8Array(l);
  for (n = 0; n < t; n += 4)
    i = oe[s.charCodeAt(n)], o = oe[s.charCodeAt(n + 1)], a = oe[s.charCodeAt(n + 2)], c = oe[s.charCodeAt(n + 3)], f[r++] = i << 2 | o >> 4, f[r++] = (o & 15) << 4 | a >> 2, f[r++] = (a & 3) << 6 | c & 63;
  return l;
}, Dt = typeof ArrayBuffer == "function", Be = (s, e) => {
  if (typeof s != "string")
    return {
      type: "message",
      data: Qe(s, e)
    };
  const t = s.charAt(0);
  return t === "b" ? {
    type: "message",
    data: Mt(s.substring(1), e)
  } : ue[t] ? s.length > 1 ? {
    type: ue[t],
    data: s.substring(1)
  } : {
    type: ue[t]
  } : Ae;
}, Mt = (s, e) => {
  if (Dt) {
    const t = It(s);
    return Qe(t, e);
  } else
    return { base64: !0, data: s };
}, Qe = (s, e) => {
  switch (e) {
    case "blob":
      return s instanceof Blob ? s : new Blob([s]);
    case "arraybuffer":
    default:
      return s instanceof ArrayBuffer ? s : s.buffer;
  }
}, Ge = "", Pt = (s, e) => {
  const t = s.length, n = new Array(t);
  let r = 0;
  s.forEach((i, o) => {
    Oe(i, !1, (a) => {
      n[o] = a, ++r === t && e(n.join(Ge));
    });
  });
}, qt = (s, e) => {
  const t = s.split(Ge), n = [];
  for (let r = 0; r < t.length; r++) {
    const i = Be(t[r], e);
    if (n.push(i), i.type === "error")
      break;
  }
  return n;
};
function Ut() {
  return new TransformStream({
    transform(s, e) {
      Lt(s, (t) => {
        const n = t.length;
        let r;
        if (n < 126)
          r = new Uint8Array(1), new DataView(r.buffer).setUint8(0, n);
        else if (n < 65536) {
          r = new Uint8Array(3);
          const i = new DataView(r.buffer);
          i.setUint8(0, 126), i.setUint16(1, n);
        } else {
          r = new Uint8Array(9);
          const i = new DataView(r.buffer);
          i.setUint8(0, 127), i.setBigUint64(1, BigInt(n));
        }
        s.data && typeof s.data != "string" && (r[0] |= 128), e.enqueue(r), e.enqueue(t);
      });
    }
  });
}
let Ee;
function he(s) {
  return s.reduce((e, t) => e + t.length, 0);
}
function le(s, e) {
  if (s[0].length === e)
    return s.shift();
  const t = new Uint8Array(e);
  let n = 0;
  for (let r = 0; r < e; r++)
    t[r] = s[0][n++], n === s[0].length && (s.shift(), n = 0);
  return s.length && n < s[0].length && (s[0] = s[0].slice(n)), t;
}
function Ft(s, e) {
  Ee || (Ee = new TextDecoder());
  const t = [];
  let n = 0, r = -1, i = !1;
  return new TransformStream({
    transform(o, a) {
      for (t.push(o); ; ) {
        if (n === 0) {
          if (he(t) < 1)
            break;
          const c = le(t, 1);
          i = (c[0] & 128) === 128, r = c[0] & 127, r < 126 ? n = 3 : r === 126 ? n = 1 : n = 2;
        } else if (n === 1) {
          if (he(t) < 2)
            break;
          const c = le(t, 2);
          r = new DataView(c.buffer, c.byteOffset, c.length).getUint16(0), n = 3;
        } else if (n === 2) {
          if (he(t) < 8)
            break;
          const c = le(t, 8), l = new DataView(c.buffer, c.byteOffset, c.length), f = l.getUint32(0);
          if (f > Math.pow(2, 21) - 1) {
            a.enqueue(Ae);
            break;
          }
          r = f * Math.pow(2, 32) + l.getUint32(4), n = 3;
        } else {
          if (he(t) < r)
            break;
          const c = le(t, r);
          a.enqueue(Be(i ? c : Ee.decode(c), e)), n = 0;
        }
        if (r === 0 || r > s) {
          a.enqueue(Ae);
          break;
        }
      }
    }
  });
}
const Ze = 4;
function w(s) {
  if (s) return $t(s);
}
function $t(s) {
  for (var e in w.prototype)
    s[e] = w.prototype[e];
  return s;
}
w.prototype.on = w.prototype.addEventListener = function(s, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + s] = this._callbacks["$" + s] || []).push(e), this;
};
w.prototype.once = function(s, e) {
  function t() {
    this.off(s, t), e.apply(this, arguments);
  }
  return t.fn = e, this.on(s, t), this;
};
w.prototype.off = w.prototype.removeListener = w.prototype.removeAllListeners = w.prototype.removeEventListener = function(s, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var t = this._callbacks["$" + s];
  if (!t) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + s], this;
  for (var n, r = 0; r < t.length; r++)
    if (n = t[r], n === e || n.fn === e) {
      t.splice(r, 1);
      break;
    }
  return t.length === 0 && delete this._callbacks["$" + s], this;
};
w.prototype.emit = function(s) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), t = this._callbacks["$" + s], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  if (t) {
    t = t.slice(0);
    for (var n = 0, r = t.length; n < r; ++n)
      t[n].apply(this, e);
  }
  return this;
};
w.prototype.emitReserved = w.prototype.emit;
w.prototype.listeners = function(s) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + s] || [];
};
w.prototype.hasListeners = function(s) {
  return !!this.listeners(s).length;
};
const me = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, t) => t(e, 0), U = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), Ht = "arraybuffer";
function et(s, ...e) {
  return e.reduce((t, n) => (s.hasOwnProperty(n) && (t[n] = s[n]), t), {});
}
const Vt = U.setTimeout, zt = U.clearTimeout;
function ge(s, e) {
  e.useNativeTimers ? (s.setTimeoutFn = Vt.bind(U), s.clearTimeoutFn = zt.bind(U)) : (s.setTimeoutFn = U.setTimeout.bind(U), s.clearTimeoutFn = U.clearTimeout.bind(U));
}
const Kt = 1.33;
function Yt(s) {
  return typeof s == "string" ? Wt(s) : Math.ceil((s.byteLength || s.size) * Kt);
}
function Wt(s) {
  let e = 0, t = 0;
  for (let n = 0, r = s.length; n < r; n++)
    e = s.charCodeAt(n), e < 128 ? t += 1 : e < 2048 ? t += 2 : e < 55296 || e >= 57344 ? t += 3 : (n++, t += 4);
  return t;
}
function tt() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function jt(s) {
  let e = "";
  for (let t in s)
    s.hasOwnProperty(t) && (e.length && (e += "&"), e += encodeURIComponent(t) + "=" + encodeURIComponent(s[t]));
  return e;
}
function Jt(s) {
  let e = {}, t = s.split("&");
  for (let n = 0, r = t.length; n < r; n++) {
    let i = t[n].split("=");
    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
  }
  return e;
}
class Xt extends Error {
  constructor(e, t, n) {
    super(e), this.description = t, this.context = n, this.type = "TransportError";
  }
}
class Le extends w {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, ge(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, t, n) {
    return super.emitReserved("error", new Xt(e, t, n)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" && this.write(e);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const t = Be(e, this.socket.binaryType);
    this.onPacket(t);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, t = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && Number(this.opts.port) !== 443 || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const t = jt(e);
    return t.length ? "?" + t : "";
  }
}
class Qt extends Le {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const t = () => {
      this.readyState = "paused", e();
    };
    if (this._polling || !this.writable) {
      let n = 0;
      this._polling && (n++, this.once("pollComplete", function() {
        --n || t();
      })), this.writable || (n++, this.once("drain", function() {
        --n || t();
      }));
    } else
      t();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    const t = (n) => {
      if (this.readyState === "opening" && n.type === "open" && this.onOpen(), n.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(n);
    };
    qt(e, this.socket.binaryType).forEach(t), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? e() : this.once("open", e);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, Pt(e, (t) => {
      this.doWrite(t, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", t = this.query || {};
    return this.opts.timestampRequests !== !1 && (t[this.opts.timestampParam] = tt()), !this.supportsBinary && !t.sid && (t.b64 = 1), this.createUri(e, t);
  }
}
let nt = !1;
try {
  nt = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Gt = nt;
function Zt() {
}
class en extends Qt {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), typeof location < "u") {
      const t = location.protocol === "https:";
      let n = location.port;
      n || (n = t ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || n !== e.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data - data to send.
   * @param {Function} fn - called upon flush.
   * @private
   */
  doWrite(e, t) {
    const n = this.request({
      method: "POST",
      data: e
    });
    n.on("success", t), n.on("error", (r, i) => {
      this.onError("xhr post error", r, i);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (t, n) => {
      this.onError("xhr poll error", t, n);
    }), this.pollXhr = e;
  }
}
class z extends w {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, t, n) {
    super(), this.createRequest = e, ge(this, n), this._opts = n, this._method = n.method || "GET", this._uri = t, this._data = n.data !== void 0 ? n.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const t = et(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    t.xdomain = !!this._opts.xd;
    const n = this._xhr = this.createRequest(t);
    try {
      n.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          n.setDisableHeaderCheck && n.setDisableHeaderCheck(!0);
          for (let r in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(r) && n.setRequestHeader(r, this._opts.extraHeaders[r]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          n.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        n.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this._opts.cookieJar) === null || e === void 0 || e.addCookies(n), "withCredentials" in n && (n.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (n.timeout = this._opts.requestTimeout), n.onreadystatechange = () => {
        var r;
        n.readyState === 3 && ((r = this._opts.cookieJar) === null || r === void 0 || r.parseCookies(
          // @ts-ignore
          n.getResponseHeader("set-cookie")
        )), n.readyState === 4 && (n.status === 200 || n.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof n.status == "number" ? n.status : 0);
        }, 0));
      }, n.send(this._data);
    } catch (r) {
      this.setTimeoutFn(() => {
        this._onError(r);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = z.requestsCount++, z.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(e) {
    this.emitReserved("error", e, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(e) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = Zt, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete z.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const e = this._xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
}
z.requestsCount = 0;
z.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", Ke);
  else if (typeof addEventListener == "function") {
    const s = "onpagehide" in U ? "pagehide" : "unload";
    addEventListener(s, Ke, !1);
  }
}
function Ke() {
  for (let s in z.requests)
    z.requests.hasOwnProperty(s) && z.requests[s].abort();
}
const tn = function() {
  const s = st({
    xdomain: !1
  });
  return s && s.responseType !== null;
}();
class nn extends en {
  constructor(e) {
    super(e);
    const t = e && e.forceBase64;
    this.supportsBinary = tn && !t;
  }
  request(e = {}) {
    return Object.assign(e, { xd: this.xd }, this.opts), new z(st, this.uri(), e);
  }
}
function st(s) {
  const e = s.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || Gt))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new U[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const rt = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class sn extends Le {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), t = this.opts.protocols, n = rt ? {} : et(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(e, t, n);
    } catch (r) {
      return this.emitReserved("error", r);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const n = e[t], r = t === e.length - 1;
      Oe(n, this.supportsBinary, (i) => {
        try {
          this.doWrite(n, i);
        } catch {
        }
        r && me(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", t = this.query || {};
    return this.opts.timestampRequests && (t[this.opts.timestampParam] = tt()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t);
  }
}
const ke = U.WebSocket || U.MozWebSocket;
class rn extends sn {
  createSocket(e, t, n) {
    return rt ? new ke(e, t, n) : t ? new ke(e, t) : new ke(e);
  }
  doWrite(e, t) {
    this.ws.send(t);
  }
}
class on extends Le {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (e) {
      return this.emitReserved("error", e);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((e) => {
      this.onError("webtransport error", e);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((e) => {
        const t = Ft(Number.MAX_SAFE_INTEGER, this.socket.binaryType), n = e.readable.pipeThrough(t).getReader(), r = Ut();
        r.readable.pipeTo(e.writable), this._writer = r.writable.getWriter();
        const i = () => {
          n.read().then(({ done: a, value: c }) => {
            a || (this.onPacket(c), i());
          }).catch((a) => {
          });
        };
        i();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const n = e[t], r = t === e.length - 1;
      this._writer.write(n).then(() => {
        r && me(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this._transport) === null || e === void 0 || e.close();
  }
}
const an = {
  websocket: rn,
  webtransport: on,
  polling: nn
}, cn = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, hn = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function Te(s) {
  if (s.length > 8e3)
    throw "URI too long";
  const e = s, t = s.indexOf("["), n = s.indexOf("]");
  t != -1 && n != -1 && (s = s.substring(0, t) + s.substring(t, n).replace(/:/g, ";") + s.substring(n, s.length));
  let r = cn.exec(s || ""), i = {}, o = 14;
  for (; o--; )
    i[hn[o]] = r[o] || "";
  return t != -1 && n != -1 && (i.source = e, i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":"), i.authority = i.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), i.ipv6uri = !0), i.pathNames = ln(i, i.path), i.queryKey = un(i, i.query), i;
}
function ln(s, e) {
  const t = /\/{2,9}/g, n = e.replace(t, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && n.splice(0, 1), e.slice(-1) == "/" && n.splice(n.length - 1, 1), n;
}
function un(s, e) {
  const t = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(n, r, i) {
    r && (t[r] = i);
  }), t;
}
const Se = typeof addEventListener == "function" && typeof removeEventListener == "function", fe = [];
Se && addEventListener("offline", () => {
  fe.forEach((s) => s());
}, !1);
class ee extends w {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, t) {
    if (super(), this.binaryType = Ht, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (t = e, e = null), e) {
      const n = Te(e);
      t.hostname = n.host, t.secure = n.protocol === "https" || n.protocol === "wss", t.port = n.port, n.query && (t.query = n.query);
    } else t.host && (t.hostname = Te(t.host).host);
    ge(this, t), this.secure = t.secure != null ? t.secure : typeof location < "u" && location.protocol === "https:", t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = t.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, t.transports.forEach((n) => {
      const r = n.prototype.name;
      this.transports.push(r), this._transportsByName[r] = n;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Jt(this.opts.query)), Se && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, fe.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    const t = Object.assign({}, this.opts.query);
    t.EIO = Ze, t.transport = e, this.id && (t.sid = this.id);
    const n = Object.assign({}, this.opts, {
      query: t,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new this._transportsByName[e](n);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const e = this.opts.rememberUpgrade && ee.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const t = this.createTransport(e);
    t.open(), this.setTransport(t);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (t) => this._onClose("transport close", t));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", ee.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const t = new Error("server error");
          t.code = e.data, this._onError(t);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this._pingInterval = e.pingInterval, this._pingTimeout = e.pingTimeout, this._maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const e = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + e, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, e), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this._getWritablePackets();
      this.transport.send(e), this._prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let t = 1;
    for (let n = 0; n < this.writeBuffer.length; n++) {
      const r = this.writeBuffer[n].data;
      if (r && (t += Yt(r)), n > 0 && t > this._maxPayload)
        return this.writeBuffer.slice(0, n);
      t += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const e = Date.now() > this._pingTimeoutTime;
    return e && (this._pingTimeoutTime = 0, me(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), e;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(e, t, n) {
    return this._sendPacket("message", e, t, n), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(e, t, n) {
    return this._sendPacket("message", e, t, n), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type - packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(e, t, n, r) {
    if (typeof t == "function" && (r = t, t = void 0), typeof n == "function" && (r = n, n = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    n = n || {}, n.compress = n.compress !== !1;
    const i = {
      type: e,
      data: t,
      options: n
    };
    this.emitReserved("packetCreate", i), this.writeBuffer.push(i), r && this.once("flush", r), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this._onClose("forced close"), this.transport.close();
    }, t = () => {
      this.off("upgrade", t), this.off("upgradeError", t), e();
    }, n = () => {
      this.once("upgrade", t), this.once("upgradeError", t);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? n() : e();
    }) : this.upgrading ? n() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(e) {
    if (ee.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", e), this._onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(e, t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), Se && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const n = fe.indexOf(this._offlineEventListener);
        n !== -1 && fe.splice(n, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, t), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
ee.protocol = Ze;
class fn extends ee {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let e = 0; e < this._upgrades.length; e++)
        this._probe(this._upgrades[e]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(e) {
    let t = this.createTransport(e), n = !1;
    ee.priorWebsocketSuccess = !1;
    const r = () => {
      n || (t.send([{ type: "ping", data: "probe" }]), t.once("packet", (m) => {
        if (!n)
          if (m.type === "pong" && m.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", t), !t)
              return;
            ee.priorWebsocketSuccess = t.name === "websocket", this.transport.pause(() => {
              n || this.readyState !== "closed" && (f(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush());
            });
          } else {
            const y = new Error("probe error");
            y.transport = t.name, this.emitReserved("upgradeError", y);
          }
      }));
    };
    function i() {
      n || (n = !0, f(), t.close(), t = null);
    }
    const o = (m) => {
      const y = new Error("probe error: " + m);
      y.transport = t.name, i(), this.emitReserved("upgradeError", y);
    };
    function a() {
      o("transport closed");
    }
    function c() {
      o("socket closed");
    }
    function l(m) {
      t && m.name !== t.name && i();
    }
    const f = () => {
      t.removeListener("open", r), t.removeListener("error", o), t.removeListener("close", a), this.off("close", c), this.off("upgrading", l);
    };
    t.once("open", r), t.once("error", o), t.once("close", a), this.once("close", c), this.once("upgrading", l), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      n || t.open();
    }, 200) : t.open();
  }
  onHandshake(e) {
    this._upgrades = this._filterUpgrades(e.upgrades), super.onHandshake(e);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(e) {
    const t = [];
    for (let n = 0; n < e.length; n++)
      ~this.transports.indexOf(e[n]) && t.push(e[n]);
    return t;
  }
}
let dn = class extends fn {
  constructor(e, t = {}) {
    const n = typeof e == "object" ? e : t;
    (!n.transports || n.transports && typeof n.transports[0] == "string") && (n.transports = (n.transports || ["polling", "websocket", "webtransport"]).map((r) => an[r]).filter((r) => !!r)), super(e, n);
  }
};
function pn(s, e = "", t) {
  let n = s;
  t = t || typeof location < "u" && location, s == null && (s = t.protocol + "//" + t.host), typeof s == "string" && (s.charAt(0) === "/" && (s.charAt(1) === "/" ? s = t.protocol + s : s = t.host + s), /^(https?|wss?):\/\//.test(s) || (typeof t < "u" ? s = t.protocol + "//" + s : s = "https://" + s), n = Te(s)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
  const i = n.host.indexOf(":") !== -1 ? "[" + n.host + "]" : n.host;
  return n.id = n.protocol + "://" + i + ":" + n.port + e, n.href = n.protocol + "://" + i + (t && t.port === n.port ? "" : ":" + n.port), n;
}
const mn = typeof ArrayBuffer == "function", gn = (s) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(s) : s.buffer instanceof ArrayBuffer, it = Object.prototype.toString, yn = typeof Blob == "function" || typeof Blob < "u" && it.call(Blob) === "[object BlobConstructor]", bn = typeof File == "function" || typeof File < "u" && it.call(File) === "[object FileConstructor]";
function Ie(s) {
  return mn && (s instanceof ArrayBuffer || gn(s)) || yn && s instanceof Blob || bn && s instanceof File;
}
function de(s, e) {
  if (!s || typeof s != "object")
    return !1;
  if (Array.isArray(s)) {
    for (let t = 0, n = s.length; t < n; t++)
      if (de(s[t]))
        return !0;
    return !1;
  }
  if (Ie(s))
    return !0;
  if (s.toJSON && typeof s.toJSON == "function" && arguments.length === 1)
    return de(s.toJSON(), !0);
  for (const t in s)
    if (Object.prototype.hasOwnProperty.call(s, t) && de(s[t]))
      return !0;
  return !1;
}
function _n(s) {
  const e = [], t = s.data, n = s;
  return n.data = Ce(t, e), n.attachments = e.length, { packet: n, buffers: e };
}
function Ce(s, e) {
  if (!s)
    return s;
  if (Ie(s)) {
    const t = { _placeholder: !0, num: e.length };
    return e.push(s), t;
  } else if (Array.isArray(s)) {
    const t = new Array(s.length);
    for (let n = 0; n < s.length; n++)
      t[n] = Ce(s[n], e);
    return t;
  } else if (typeof s == "object" && !(s instanceof Date)) {
    const t = {};
    for (const n in s)
      Object.prototype.hasOwnProperty.call(s, n) && (t[n] = Ce(s[n], e));
    return t;
  }
  return s;
}
function wn(s, e) {
  return s.data = Re(s.data, e), delete s.attachments, s;
}
function Re(s, e) {
  if (!s)
    return s;
  if (s && s._placeholder === !0) {
    if (typeof s.num == "number" && s.num >= 0 && s.num < e.length)
      return e[s.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(s))
    for (let t = 0; t < s.length; t++)
      s[t] = Re(s[t], e);
  else if (typeof s == "object")
    for (const t in s)
      Object.prototype.hasOwnProperty.call(s, t) && (s[t] = Re(s[t], e));
  return s;
}
const vn = [
  "connect",
  // used on the client side
  "connect_error",
  // used on the client side
  "disconnect",
  // used on both sides
  "disconnecting",
  // used on the server side
  "newListener",
  // used by the Node.js EventEmitter
  "removeListener"
  // used by the Node.js EventEmitter
];
var p;
(function(s) {
  s[s.CONNECT = 0] = "CONNECT", s[s.DISCONNECT = 1] = "DISCONNECT", s[s.EVENT = 2] = "EVENT", s[s.ACK = 3] = "ACK", s[s.CONNECT_ERROR = 4] = "CONNECT_ERROR", s[s.BINARY_EVENT = 5] = "BINARY_EVENT", s[s.BINARY_ACK = 6] = "BINARY_ACK";
})(p || (p = {}));
class En {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return (e.type === p.EVENT || e.type === p.ACK) && de(e) ? this.encodeAsBinary({
      type: e.type === p.EVENT ? p.BINARY_EVENT : p.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let t = "" + e.type;
    return (e.type === p.BINARY_EVENT || e.type === p.BINARY_ACK) && (t += e.attachments + "-"), e.nsp && e.nsp !== "/" && (t += e.nsp + ","), e.id != null && (t += e.id), e.data != null && (t += JSON.stringify(e.data, this.replacer)), t;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const t = _n(e), n = this.encodeAsString(t.packet), r = t.buffers;
    return r.unshift(n), r;
  }
}
class De extends w {
  /**
   * Decoder constructor
   */
  constructor(e) {
    super(), this.opts = Object.assign({
      reviver: void 0,
      maxAttachments: 10
    }, typeof e == "function" ? { reviver: e } : e);
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let t;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      t = this.decodeString(e);
      const n = t.type === p.BINARY_EVENT;
      n || t.type === p.BINARY_ACK ? (t.type = n ? p.EVENT : p.ACK, this.reconstructor = new kn(t), t.attachments === 0 && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
    } else if (Ie(e) || e.base64)
      if (this.reconstructor)
        t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, super.emitReserved("decoded", t));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let t = 0;
    const n = {
      type: Number(e.charAt(0))
    };
    if (p[n.type] === void 0)
      throw new Error("unknown packet type " + n.type);
    if (n.type === p.BINARY_EVENT || n.type === p.BINARY_ACK) {
      const i = t + 1;
      for (; e.charAt(++t) !== "-" && t != e.length; )
        ;
      const o = e.substring(i, t);
      if (o != Number(o) || e.charAt(t) !== "-")
        throw new Error("Illegal attachments");
      const a = Number(o);
      if (!An(a) || a < 0)
        throw new Error("Illegal attachments");
      if (a > this.opts.maxAttachments)
        throw new Error("too many attachments");
      n.attachments = a;
    }
    if (e.charAt(t + 1) === "/") {
      const i = t + 1;
      for (; ++t && !(e.charAt(t) === "," || t === e.length); )
        ;
      n.nsp = e.substring(i, t);
    } else
      n.nsp = "/";
    const r = e.charAt(t + 1);
    if (r !== "" && Number(r) == r) {
      const i = t + 1;
      for (; ++t; ) {
        const o = e.charAt(t);
        if (o == null || Number(o) != o) {
          --t;
          break;
        }
        if (t === e.length)
          break;
      }
      n.id = Number(e.substring(i, t + 1));
    }
    if (e.charAt(++t)) {
      const i = this.tryParse(e.substr(t));
      if (De.isPayloadValid(n.type, i))
        n.data = i;
      else
        throw new Error("invalid payload");
    }
    return n;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.opts.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, t) {
    switch (e) {
      case p.CONNECT:
        return Ye(t);
      case p.DISCONNECT:
        return t === void 0;
      case p.CONNECT_ERROR:
        return typeof t == "string" || Ye(t);
      case p.EVENT:
      case p.BINARY_EVENT:
        return Array.isArray(t) && (typeof t[0] == "number" || typeof t[0] == "string" && vn.indexOf(t[0]) === -1);
      case p.ACK:
      case p.BINARY_ACK:
        return Array.isArray(t);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class kn {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const t = wn(this.reconPack, this.buffers);
      return this.finishedReconstruction(), t;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const An = Number.isInteger || function(s) {
  return typeof s == "number" && isFinite(s) && Math.floor(s) === s;
};
function Ye(s) {
  return Object.prototype.toString.call(s) === "[object Object]";
}
const Tn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: De,
  Encoder: En,
  get PacketType() {
    return p;
  }
}, Symbol.toStringTag, { value: "Module" }));
function $(s, e, t) {
  return s.on(e, t), function() {
    s.off(e, t);
  };
}
const Sn = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class ot extends w {
  /**
   * `Socket` constructor.
   */
  constructor(e, t, n) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = t, n && n.auth && (this.auth = n.auth), this._opts = Object.assign({}, n), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      $(e, "open", this.onopen.bind(this)),
      $(e, "packet", this.onpacket.bind(this)),
      $(e, "error", this.onerror.bind(this)),
      $(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...t) {
    var n, r, i;
    if (Sn.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(t), this;
    const o = {
      type: p.EVENT,
      data: t
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof t[t.length - 1] == "function") {
      const f = this.ids++, m = t.pop();
      this._registerAckCallback(f, m), o.id = f;
    }
    const a = (r = (n = this.io.engine) === null || n === void 0 ? void 0 : n.transport) === null || r === void 0 ? void 0 : r.writable, c = this.connected && !(!((i = this.io.engine) === null || i === void 0) && i._hasPingExpired());
    return this.flags.volatile && !a || (c ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, t) {
    var n;
    const r = (n = this.flags.timeout) !== null && n !== void 0 ? n : this._opts.ackTimeout;
    if (r === void 0) {
      this.acks[e] = t;
      return;
    }
    const i = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let a = 0; a < this.sendBuffer.length; a++)
        this.sendBuffer[a].id === e && this.sendBuffer.splice(a, 1);
      t.call(this, new Error("operation has timed out"));
    }, r), o = (...a) => {
      this.io.clearTimeoutFn(i), t.apply(this, a);
    };
    o.withError = !0, this.acks[e] = o;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...t) {
    return new Promise((n, r) => {
      const i = (o, a) => o ? r(o) : n(a);
      i.withError = !0, t.push(i), this.emit(e, ...t);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let t;
    typeof e[e.length - 1] == "function" && (t = e.pop());
    const n = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((r, ...i) => (this._queue[0], r !== null ? n.tryCount > this._opts.retries && (this._queue.shift(), t && t(r)) : (this._queue.shift(), t && t(null, ...i)), n.pending = !1, this._drainQueue())), this._queue.push(n), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const t = this._queue[0];
    t.pending && !e || (t.pending = !0, t.tryCount++, this.flags = t.flags, this.emit.apply(this, t.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: p.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, t) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", e, t), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((e) => {
      if (!this.sendBuffer.some((n) => String(n.id) === e)) {
        const n = this.acks[e];
        delete this.acks[e], n.withError && n.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case p.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case p.EVENT:
        case p.BINARY_EVENT:
          this.onevent(e);
          break;
        case p.ACK:
        case p.BINARY_ACK:
          this.onack(e);
          break;
        case p.DISCONNECT:
          this.ondisconnect();
          break;
        case p.CONNECT_ERROR:
          this.destroy();
          const n = new Error(e.data.message);
          n.data = e.data.data, this.emitReserved("connect_error", n);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const t = e.data || [];
    e.id != null && t.push(this.ack(e.id)), this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const t = this._anyListeners.slice();
      for (const n of t)
        n.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const t = this;
    let n = !1;
    return function(...r) {
      n || (n = !0, t.packet({
        type: p.ACK,
        id: e,
        data: r
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const t = this.acks[e.id];
    typeof t == "function" && (delete this.acks[e.id], t.withError && e.data.unshift(null), t.apply(this, e.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, t) {
    this.id = e, this.recovered = t && this._pid === t, this._pid = t, this.connected = !0, this.emitBuffered(), this._drainQueue(!0), this.emitReserved("connect");
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: p.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const t = this._anyListeners;
      for (let n = 0; n < t.length; n++)
        if (e === t[n])
          return t.splice(n, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const t = this._anyOutgoingListeners;
      for (let n = 0; n < t.length; n++)
        if (e === t[n])
          return t.splice(n, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const t = this._anyOutgoingListeners.slice();
      for (const n of t)
        n.apply(this, e.data);
    }
  }
}
function re(s) {
  s = s || {}, this.ms = s.min || 100, this.max = s.max || 1e4, this.factor = s.factor || 2, this.jitter = s.jitter > 0 && s.jitter <= 1 ? s.jitter : 0, this.attempts = 0;
}
re.prototype.duration = function() {
  var s = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), t = Math.floor(e * this.jitter * s);
    s = Math.floor(e * 10) & 1 ? s + t : s - t;
  }
  return Math.min(s, this.max) | 0;
};
re.prototype.reset = function() {
  this.attempts = 0;
};
re.prototype.setMin = function(s) {
  this.ms = s;
};
re.prototype.setMax = function(s) {
  this.max = s;
};
re.prototype.setJitter = function(s) {
  this.jitter = s;
};
class Ne extends w {
  constructor(e, t) {
    var n;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.opts = t, ge(this, t), this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor((n = t.randomizationFactor) !== null && n !== void 0 ? n : 0.5), this.backoff = new re({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(t.timeout == null ? 2e4 : t.timeout), this._readyState = "closed", this.uri = e;
    const r = t.parser || Tn;
    this.encoder = new r.Encoder(), this.decoder = new r.Decoder(), this._autoConnect = t.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, e || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var t;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (t = this.backoff) === null || t === void 0 || t.setMin(e), this);
  }
  randomizationFactor(e) {
    var t;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (t = this.backoff) === null || t === void 0 || t.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var t;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (t = this.backoff) === null || t === void 0 || t.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new dn(this.uri, this.opts);
    const t = this.engine, n = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const r = $(t, "open", function() {
      n.onopen(), e && e();
    }), i = (a) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", a), e ? e(a) : this.maybeReconnectOnOpen();
    }, o = $(t, "error", i);
    if (this._timeout !== !1) {
      const a = this._timeout, c = this.setTimeoutFn(() => {
        r(), i(new Error("timeout")), t.close();
      }, a);
      this.opts.autoUnref && c.unref(), this.subs.push(() => {
        this.clearTimeoutFn(c);
      });
    }
    return this.subs.push(r), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(
      $(e, "ping", this.onping.bind(this)),
      $(e, "data", this.ondata.bind(this)),
      $(e, "error", this.onerror.bind(this)),
      $(e, "close", this.onclose.bind(this)),
      // @ts-ignore
      $(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (t) {
      this.onclose("parse error", t);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    me(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, t) {
    let n = this.nsps[e];
    return n ? this._autoConnect && !n.active && n.connect() : (n = new ot(this, e, t), this.nsps[e] = n), n;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const t = Object.keys(this.nsps);
    for (const n of t)
      if (this.nsps[n].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    const t = this.encoder.encode(e);
    for (let n = 0; n < t.length; n++)
      this.engine.write(t[n], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(e, t) {
    var n;
    this.cleanup(), (n = this.engine) === null || n === void 0 || n.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, t), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const t = this.backoff.duration();
      this._reconnecting = !0;
      const n = this.setTimeoutFn(() => {
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((r) => {
          r ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", r)) : e.onreconnect();
        }));
      }, t);
      this.opts.autoUnref && n.unref(), this.subs.push(() => {
        this.clearTimeoutFn(n);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const ie = {};
function pe(s, e) {
  typeof s == "object" && (e = s, s = void 0), e = e || {};
  const t = pn(s, e.path || "/socket.io"), n = t.source, r = t.id, i = t.path, o = ie[r] && i in ie[r].nsps, a = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let c;
  return a ? c = new Ne(n, e) : (ie[r] || (ie[r] = new Ne(n, e)), c = ie[r]), t.query && !e.query && (e.query = t.queryKey), c.socket(t.path, e);
}
Object.assign(pe, {
  Manager: Ne,
  Socket: ot,
  io: pe,
  connect: pe
});
function Cn(s, e) {
  return pe(s, {
    autoConnect: !1,
    auth: { token: e },
    withCredentials: !0,
    transportOptions: {
      polling: {
        extraHeaders: { Authorization: `Bearer ${e}` }
      }
    },
    extraHeaders: {
      Authorization: `Bearer ${e}`
    }
  });
}
function We({
  apiBaseUrl: s,
  token: e,
  title: t,
  welcomeMessage: n,
  onMessageSent: r,
  onError: i
}) {
  const o = se(
    () => Cn(s, e),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [s, e]
  ), a = se(
    () => Bt(s, e),
    [s, e]
  ), {
    users: c,
    activeUserId: l,
    unreadCounts: f,
    connected: m,
    draft: y,
    activeUser: C,
    activeMessages: N,
    isInitialLoading: R,
    isLoadingMore: Y,
    hasMore: I,
    handleSelectUser: D,
    setDraft: M,
    sendMessage: W,
    loadMoreMessages: P
  } = Rt({ apiClient: a, socket: o, onMessageSent: r, onError: i });
  return /* @__PURE__ */ A(ut, { children: [
    /* @__PURE__ */ h(
      Tt,
      {
        users: c,
        activeUserId: l,
        onSelectUser: D,
        unreadCounts: f,
        isConnected: m,
        title: t
      }
    ),
    /* @__PURE__ */ h(
      kt,
      {
        activeUser: C,
        messages: N,
        draft: y,
        onDraftChange: M,
        onSend: W,
        onLoadMore: P,
        isInitialLoading: R,
        isLoadingMore: Y,
        hasMore: I,
        welcomeMessage: n
      }
    )
  ] });
}
function Rn() {
  return /* @__PURE__ */ h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", width: "26", height: "26", "aria-hidden": "true", children: /* @__PURE__ */ h("path", { d: "M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" }) });
}
function Nn() {
  return /* @__PURE__ */ h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", width: "22", height: "22", "aria-hidden": "true", children: /* @__PURE__ */ h("path", { d: "M18 6 6 18M6 6l12 12", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round" }) });
}
function Ln({
  apiBaseUrl: s,
  token: e = "",
  title: t,
  welcomeMessage: n,
  theme: r = "light",
  primaryColor: i,
  width: o,
  height: a,
  className: c = "",
  position: l,
  panelWidth: f = 380,
  panelHeight: m = 560,
  autoOpen: y = !1,
  onMessageSent: C,
  onChatOpened: N,
  onChatClosed: R,
  onError: Y
}) {
  const [I, D] = B(y), M = se(() => {
    const v = {};
    return i && (v["--mbc-primary"] = i, v["--mbc-teal"] = i), l || (o && (v.width = `${o}px`), a && (v.height = `${a}px`)), v;
  }, [a, l, i, o]), W = se(() => {
    if (!l) return {};
    const v = { position: "fixed", zIndex: "9999" };
    return l.includes("bottom") ? v.bottom = "24px" : v.top = "24px", l.includes("right") ? v.right = "24px" : v.left = "24px", v;
  }, [l]), P = se(
    () => ({ width: `${f}px`, height: `${m}px` }),
    [m, f]
  );
  if (l) {
    const v = () => {
      D(!0), N == null || N();
    }, Q = () => {
      D(!1), R == null || R();
    };
    return /* @__PURE__ */ h(
      "div",
      {
        className: `mbc-root mbc-root--floating ${c}`.trim(),
        "data-theme": r,
        style: { ...W, ...M },
        "data-testid": "mybharat-chat",
        children: I ? /* @__PURE__ */ A("div", { className: "mbc-floating-panel", style: P, children: [
          /* @__PURE__ */ h("div", { className: "mbc-floating-panel-inner", children: /* @__PURE__ */ h(
            We,
            {
              apiBaseUrl: s,
              token: e,
              title: t,
              welcomeMessage: n,
              onMessageSent: C,
              onError: Y
            }
          ) }),
          /* @__PURE__ */ h("button", { type: "button", className: "mbc-floating-close", onClick: Q, "aria-label": "Close chat", children: /* @__PURE__ */ h(Nn, {}) })
        ] }) : /* @__PURE__ */ h("button", { type: "button", className: "mbc-floating-btn", onClick: v, "aria-label": "Open chat", children: /* @__PURE__ */ h(Rn, {}) })
      }
    );
  }
  return /* @__PURE__ */ h(
    "div",
    {
      className: `mbc-root ${c}`.trim(),
      "data-theme": r,
      style: M,
      "data-testid": "mybharat-chat",
      children: /* @__PURE__ */ h(
        We,
        {
          apiBaseUrl: s,
          token: e,
          title: t,
          welcomeMessage: n,
          onMessageSent: C,
          onError: Y
        }
      )
    }
  );
}
export {
  Ln as MyBharatChatApplication
};
//# sourceMappingURL=index.es.js.map
