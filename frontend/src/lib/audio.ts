/** Audio playback utility for TTS with WebSocket binary and HTTP fallback. */

import { BACKEND_URL } from "./api";

let currentAudio: HTMLAudioElement | null = null;
let playingCallback: ((playing: boolean) => void) | null = null;
const bufferQueue: ArrayBuffer[] = [];
let isProcessingBufferQueue = false;

/** Register a callback that fires when TTS playback state changes. */
function onTTSPlayingChange(cb: (playing: boolean) => void): () => void {
  playingCallback = cb;
  return () => {
    if (playingCallback === cb) playingCallback = null;
  };
}

/** Whether TTS is currently playing. */
function isTTSPlaying(): boolean {
  return currentAudio !== null && !currentAudio.paused;
}

/** Internal: play a single ArrayBuffer of WAV audio. */
function playAudioBuffer(buffer: ArrayBuffer): Promise<void> {
  const blob = new Blob([buffer], { type: "audio/wav" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;

  return new Promise<void>((resolve) => {
    function cleanup() {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      resolve();
    }
    audio.onended = cleanup;
    audio.onerror = cleanup;
    audio.play().catch(cleanup);
  });
}

/** Process the buffer queue sequentially. */
async function processBufferQueue(): Promise<void> {
  if (isProcessingBufferQueue) return;
  isProcessingBufferQueue = true;
  playingCallback?.(true);

  while (bufferQueue.length > 0) {
    const buffer = bufferQueue.shift()!;
    await playAudioBuffer(buffer);
  }

  isProcessingBufferQueue = false;
  playingCallback?.(false);
}

/** Queue a WebSocket binary audio buffer for sequential playback. */
function queueAudioBuffer(buffer: ArrayBuffer): void {
  bufferQueue.push(buffer);
  processBufferQueue();
}

/** Internal: fetch TTS audio and play a single utterance (HTTP, for IPAModal). */
async function playTTSSingle(text: string, voice?: string): Promise<void> {
  const body: Record<string, string> = { text };
  if (voice) body.voice = voice;

  const res = await fetch(`${BACKEND_URL}/api/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.warn(`[TTS] Fetch failed: ${res.status} ${res.statusText}`);
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  currentAudio = audio;

  return new Promise<void>((resolve) => {
    function cleanup() {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      resolve();
    }
    audio.onended = cleanup;
    audio.onerror = cleanup;
    audio.play().catch(cleanup);
  });
}

/** Fetch TTS audio from backend and play it (single-shot, for IPAModal word playback). */
async function playTTS(text: string, voice?: string): Promise<void> {
  stopTTS();
  playingCallback?.(true);
  await playTTSSingle(text, voice);
  playingCallback?.(false);
}

/** Stop any currently playing TTS audio and clear all queues. */
function stopTTS(): void {
  bufferQueue.length = 0;
  isProcessingBufferQueue = false;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  playingCallback?.(false);
}

export { playTTS, queueAudioBuffer, stopTTS, isTTSPlaying, onTTSPlayingChange };
