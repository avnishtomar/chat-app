# @mybharat/chat-widget

Embeddable, standalone React chat widget for MyBharat chat backends.

This package is self-contained and can be integrated into any React app without importing app-specific stores, routes, layouts, or utilities.

## Requirements

- React 18 or 19
- React DOM 18 or 19
- A backend exposing the chat REST + Socket.IO endpoints listed below

## Install

### Option A: npm package (recommended when published)

```bash
npm install @mybharat/chat-widget
```

### Option B: install directly from GitHub

```bash
npm install github:avnishtomar/chat-app
```

If your app imports `@mybharat/chat-widget`, map the GitHub package to that name in `package.json`:

```json
{
  "dependencies": {
    "@mybharat/chat-widget": "github:avnishtomar/chat-app"
  }
}
```

## Basic Integration

```tsx
import { MyBharatChatApplication } from '@mybharat/chat-widget';
import '@mybharat/chat-widget/styles.css';

export default function App() {
  return (
    <MyBharatChatApplication
      apiBaseUrl="https://api.example.com"
      token="<bearer-token>"
      userId="123"
      tenantId="acme"
    />
  );
}
```

## Floating Widget Integration

```tsx
import { MyBharatChatApplication } from '@mybharat/chat-widget';
import '@mybharat/chat-widget/styles.css';

export default function App() {
  return (
    <MyBharatChatApplication
      apiBaseUrl="https://api.example.com"
      token="<bearer-token>"
      position="bottom-right"
      autoOpen={false}
      panelWidth={380}
      panelHeight={560}
      theme="dark"
      primaryColor="#0ea5e9"
      title="Support Chat"
      welcomeMessage="Select a conversation to start chatting."
      onChatOpened={() => console.log('chat opened')}
      onChatClosed={() => console.log('chat closed')}
      onMessageSent={(msg) => console.log('sent:', msg)}
      onError={(err) => console.error(err)}
    />
  );
}
```

## Props

```ts
interface MyBharatChatApplicationProps {
  apiBaseUrl: string;
  token?: string;
  userId?: string;
  tenantId?: string;
  socketUrl?: string;

  theme?: 'light' | 'dark';
  primaryColor?: string;
  title?: string;
  welcomeMessage?: string;
  width?: number;
  height?: number;
  className?: string;

  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  panelWidth?: number;
  panelHeight?: number;
  autoOpen?: boolean;

  onMessageSent?: (message: string) => void;
  onChatOpened?: () => void;
  onChatClosed?: () => void;
  onError?: (error: Error) => void;
}
```

## Backend Contract

### Required REST endpoints

- `GET /chat/users`
- `GET /conversations/recent`
- `GET /conversations/:conversationId/messages?limit=20&cursor=<optional>`

Requests include:

- `Authorization: Bearer <token>`
- `Accept: application/json`

### Required Socket.IO behavior

Client connects with bearer token in auth + headers.

Events expected by widget:

- Emits: `send_message` with payload:
  - `{ receiverId: string, content: string }`
- Listens: `receive_message` with payload shape:
  - `{ id, senderId, message? | content?, createdAt }`
- Listens: `error` with payload shape:
  - `{ success: false, message: string, code: string }`

## Styling and Theming

- Import stylesheet once:
  - `@mybharat/chat-widget/styles.css`
- Use `theme="light" | "dark"`
- Use `primaryColor` for branding
- CSS is scoped under `.mbc-root` to reduce host app style collisions

## Build (for maintainers)

```bash
npm install
npm run build
npm run typecheck
```

Build output:

- ESM: `dist/index.es.js`
- CJS: `dist/index.cjs.js`
- Types: `dist/index.d.ts`
- CSS: `dist/style.css`

## Integration Checklist

1. Install package dependency.
2. Import component and CSS.
3. Pass `apiBaseUrl` and `token`.
4. Verify REST endpoints return expected shapes.
5. Verify Socket.IO events are wired.
6. Enable floating mode (`position`) if required.
7. Validate in local and production environments.

## Troubleshooting

### 1) Widget mounts but conversation list is empty

- Check `GET /chat/users` response and auth token validity.
- Confirm CORS allows your frontend origin.

### 2) Messages do not appear in real-time

- Check Socket.IO connection and token handshake.
- Verify server emits `receive_message` event with required fields.

### 3) Pagination/load-more not working

- Check `GET /conversations/:id/messages` supports `cursor` and `limit`.
- Return `hasMore` and/or `nextCursor` in response metadata.

### 4) npm install from GitHub works but import fails

- Ensure dependency key is `@mybharat/chat-widget` in your app `package.json`.
- Reinstall after lockfile changes:

```bash
rm -rf node_modules package-lock.json
npm install
```
