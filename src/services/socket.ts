/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { io, Socket } from 'socket.io-client';
import { API_URL } from './api';

// Derive the socket server URL from the API URL (strip the /api suffix)
const SOCKET_URL = API_URL.replace('/api', '');

class SocketService {
  private socket: Socket | null = null;
  private listeners: Record<string, ((data: any) => void)[]> = {};

  connect() {
    if (this.socket) return;
    this.socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    this.socket.on('connect', () => {
      console.log('[Mobile Socket] Connected to backend');
    });

    this.socket.on('disconnect', () => {
      console.log('[Mobile Socket] Disconnected from backend');
    });

    // Catch-all for our events
    this.socket.onAny((event, ...args) => {
      console.log(`[Mobile Socket] Received event: ${event}`, args);
      if (this.listeners[event]) {
        this.listeners[event].forEach((cb) => cb(args[0]));
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, ...args: any[]) {
    if (this.socket) {
      this.socket.emit(event, ...args);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }
}

export const socketService = new SocketService();
