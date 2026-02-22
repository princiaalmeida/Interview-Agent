"use client";

import { useState, useCallback, useRef, useEffect } from "react";

declare global {
  interface Window {
    SpeechRecognition?: new () => {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      start: () => void;
      stop: () => void;
      abort: () => void;
      onresult: ((event: {
        resultIndex: number;
        results: {
          length: number;
          [i: number]: {
            isFinal: boolean;
            [0]: { transcript: string };
          };
        };
      }) => void) | null;
      onerror: ((event: { error: string }) => void) | null;
      onend: (() => void) | null;
    };
    webkitSpeechRecognition?: new () => {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      start: () => void;
      stop: () => void;
      abort: () => void;
      onresult: ((event: {
        resultIndex: number;
        results: {
          length: number;
          [i: number]: {
            isFinal: boolean;
            [0]: { transcript: string };
          };
        };
      }) => void) | null;
      onerror: ((event: { error: string }) => void) | null;
      onend: (() => void) | null;
    };
  }
}

const SpeechRecognitionClass =
  typeof window !== "undefined"
    ? window.SpeechRecognition ?? window.webkitSpeechRecognition
    : undefined;

export function useSpeechRecognition(options?: {
  onResult?: (transcript: string, isFinal: boolean) => void;
  continuous?: boolean;
  lang?: string;
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(() => !!SpeechRecognitionClass);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognitionClass>> | null>(null);
  const onResultCb = options?.onResult;

  const start = useCallback(() => {
    if (!SpeechRecognitionClass) {
      setError("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    setError(null);
    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = options?.continuous ?? true;
      recognition.interimResults = true;
      recognition.lang = options?.lang ?? "en-US";
      recognition.onresult = (event: { resultIndex: number; results: { length: number; [i: number]: { isFinal: boolean; [0]: { transcript: string } } } }) => {
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript && onResultCb) onResultCb(finalTranscript, true);
        if (interimTranscript && onResultCb) onResultCb(interimTranscript, false);
      };
      recognition.onerror = (e: { error: string }) => {
        if (e.error === "not-allowed") setError("Microphone access denied.");
        else if (e.error === "no-speech") setError("No speech detected. Try again.");
        else setError(e.error);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start voice input");
    }
  }, [options?.continuous, options?.lang, onResultCb]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return { start, stop, isListening, isSupported, error };
}
