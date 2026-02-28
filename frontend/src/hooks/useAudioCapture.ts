"use client";

import { useCallback, useRef, useState } from "react";

interface UseAudioCaptureReturn {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  isRecording: boolean;
  error: string | null;
  isSupported: boolean;
}

const MIME_TYPE = "audio/webm;codecs=opus";

export function useAudioCapture(): UseAudioCaptureReturn {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const resolveStop = useRef<((blob: Blob) => void) | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    (typeof MediaRecorder !== "undefined"
      ? MediaRecorder.isTypeSupported(MIME_TYPE)
      : false);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: MIME_TYPE });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: MIME_TYPE });
        // Stop all tracks to release mic
        stream.getTracks().forEach((t) => t.stop());
        resolveStop.current?.(blob);
        resolveStop.current = null;
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone permission denied"
          : "Could not access microphone";
      setError(message);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") {
      setIsRecording(false);
      return null;
    }

    return new Promise<Blob>((resolve) => {
      resolveStop.current = resolve;
      recorder.stop();
      setIsRecording(false);
    });
  }, []);

  return { startRecording, stopRecording, isRecording, error, isSupported };
}
