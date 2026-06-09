/**
 * Parameterised Socket.IO factory.
 *
 * Never reads cookies or env variables — `socketUrl` and `token` are always
 * supplied by the component that calls this function.
 */
import { io, type Socket } from 'socket.io-client';

/**
 * Creates a Socket.IO instance.  The socket is NOT auto-connected — call
 * `socket.connect()` after attaching event listeners.
 */
export function createChatSocket(socketUrl: string, token: string, domain_id: number): Socket {
  const normalizedDomainId = Number.isInteger(domain_id) ? String(domain_id) : undefined;

  return io(socketUrl, {
    autoConnect: false,
    auth: { token, domain_id: normalizedDomainId },
    withCredentials: true,
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
          ...(normalizedDomainId ? { 'x-domain-id': normalizedDomainId } : {}),
        },
      },
    },
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      ...(normalizedDomainId ? { 'x-domain-id': normalizedDomainId } : {}),
    },
  });
}
