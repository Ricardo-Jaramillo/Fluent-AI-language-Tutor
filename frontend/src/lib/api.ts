/** Backend API configuration. */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

/** Convert HTTP URL to WebSocket URL. */
function getWsUrl(): string {
  return BACKEND_URL.replace(/^http/, "ws");
}

export { BACKEND_URL, getWsUrl };
