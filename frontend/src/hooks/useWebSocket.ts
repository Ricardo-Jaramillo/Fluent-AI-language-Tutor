"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ReadyState = "connecting" | "connected" | "disconnected" | "error";

interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: WebSocketMessage) => void;
  onBinary?: (data: ArrayBuffer) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (event: Event) => void;
  enabled?: boolean;
}

interface UseWebSocketReturn {
  send: (data: WebSocketMessage) => void;
  sendBinary: (data: ArrayBuffer) => void;
  readyState: ReadyState;
  disconnect: () => void;
}

const MAX_RECONNECT_DELAY = 30_000;
const PING_INTERVAL = 30_000;

export function useWebSocket({
  url,
  onMessage,
  onBinary,
  onOpen,
  onClose,
  onError,
  enabled = true,
}: UseWebSocketOptions): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempt = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const manualClose = useRef(false);
  const [readyState, setReadyState] = useState<ReadyState>("disconnected");

  // Store latest callbacks in refs via effect (React 19 lint compliance)
  const onMessageRef = useRef(onMessage);
  const onBinaryRef = useRef(onBinary);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onBinaryRef.current = onBinary;
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
    onErrorRef.current = onError;
  });

  // Main connection effect — runs when url or enabled changes
  useEffect(() => {
    if (!enabled) return;

    manualClose.current = false;

    function clearTimers() {
      if (pingTimer.current) {
        clearInterval(pingTimer.current);
        pingTimer.current = null;
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    }

    function doConnect() {
      clearTimers();
      setReadyState("connecting");

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempt.current = 0;
        setReadyState("connected");
        onOpenRef.current?.();

        pingTimer.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, PING_INTERVAL);
      };

      ws.binaryType = "arraybuffer";

      ws.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          onBinaryRef.current?.(event.data);
          return;
        }
        try {
          const data = JSON.parse(event.data as string) as WebSocketMessage;
          if (data.type === "pong") return;
          onMessageRef.current?.(data);
        } catch {
          // Non-JSON text
        }
      };

      ws.onclose = () => {
        clearTimers();
        setReadyState("disconnected");
        onCloseRef.current?.();

        if (!manualClose.current) {
          const delay = Math.min(
            1000 * 2 ** reconnectAttempt.current,
            MAX_RECONNECT_DELAY,
          );
          reconnectAttempt.current += 1;
          reconnectTimer.current = setTimeout(doConnect, delay);
        }
      };

      ws.onerror = (event) => {
        setReadyState("error");
        onErrorRef.current?.(event);
      };
    }

    doConnect();

    return () => {
      manualClose.current = true;
      clearTimers();
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [url, enabled]);

  // Pause ping when tab is hidden, resume when visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (pingTimer.current) {
          clearInterval(pingTimer.current);
          pingTimer.current = null;
        }
      } else if (wsRef.current?.readyState === WebSocket.OPEN) {
        pingTimer.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "ping" }));
          }
        }, PING_INTERVAL);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const send = useCallback((data: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const sendBinary = useCallback((data: ArrayBuffer) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  }, []);

  const disconnect = useCallback(() => {
    manualClose.current = true;
    if (pingTimer.current) {
      clearInterval(pingTimer.current);
      pingTimer.current = null;
    }
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    wsRef.current?.close();
  }, []);

  return { send, sendBinary, readyState, disconnect };
}
