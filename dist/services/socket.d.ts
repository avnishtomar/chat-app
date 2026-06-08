/**
 * Parameterised Socket.IO factory.
 *
 * Never reads cookies or env variables — `socketUrl` and `token` are always
 * supplied by the component that calls this function.
 */
import { type Socket } from 'socket.io-client';
/**
 * Creates a Socket.IO instance.  The socket is NOT auto-connected — call
 * `socket.connect()` after attaching event listeners.
 */
export declare function createChatSocket(socketUrl: string, token: string): Socket;
//# sourceMappingURL=socket.d.ts.map