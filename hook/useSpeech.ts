import { useCallback, useEffect, useRef, useState } from "react";

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  lang: string;
  voice?: SpeechSynthesisVoice | null;
}

export interface SpeechState {
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentText: string;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  rate: 1,
  pitch: 1,
  volume: 1,
  lang: "en-US",
  voice: null,
};

export function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const settingsRef = useRef<VoiceSettings>(DEFAULT_SETTINGS);
  const textRef = useRef<string>("");

  const [state, setState] = useState<SpeechState>({
    isPlaying: false,
    isPaused: false,
    isSupported: typeof window !== "undefined" && "speechSynthesis" in window,
    currentText: "",
    availableVoices: [],
    selectedVoice: null,
  });

  // Load available voices
  const loadVoices = useCallback(() => {
    if (!state.isSupported) return [];

    const voices = speechSynthesis.getVoices();
    setState((prev) => ({
      ...prev,
      availableVoices: voices,
      selectedVoice: prev.selectedVoice || voices.find(v => v.lang === "en-US") || voices[0] || null,
    }));
    return voices;
  }, [state.isSupported]);

  // Initialize voices
  useEffect(() => {
    if (!state.isSupported) return;

    const handleVoicesChanged = () => {
      loadVoices();
    };

    // Chrome loads voices asynchronously
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    } else {
      loadVoices();
    }

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, [state.isSupported, loadVoices]);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    settingsRef.current = { ...settingsRef.current, ...newSettings };
    setState((prev) => ({
      ...prev,
      selectedVoice: newSettings.voice !== undefined ? newSettings.voice : prev.selectedVoice,
    }));
  }, []);

  const speak = useCallback((text: string, settings?: Partial<VoiceSettings>) => {
    if (!state.isSupported || !text) return;

    // Merge settings
    const finalSettings = settings 
      ? { ...settingsRef.current, ...settings }
      : settingsRef.current;

    // Stop any speech currently playing
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = finalSettings.lang;
    utterance.rate = finalSettings.rate;
    utterance.pitch = finalSettings.pitch;
    utterance.volume = finalSettings.volume;
    utterance.voice = finalSettings.voice || null;

    utterance.onstart = () => {
      setState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentText: text,
      }));
    };

    utterance.onpause = () => {
      setState((prev) => ({ ...prev, isPaused: true }));
    };

    utterance.onresume = () => {
      setState((prev) => ({ ...prev, isPaused: false }));
    };

    utterance.onend = () => {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentText: "",
      }));
    };

    utterance.onerror = () => {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentText: "",
      }));
    };

    utteranceRef.current = utterance;
    textRef.current = text;
    speechSynthesis.speak(utterance);
  }, [state.isSupported]);

  const pause = useCallback(() => {
    if (!state.isSupported) return;
    speechSynthesis.pause();
    setState((prev) => ({ ...prev, isPaused: true }));
  }, [state.isSupported]);

  const resume = useCallback(() => {
    if (!state.isSupported) return;
    speechSynthesis.resume();
    setState((prev) => ({ ...prev, isPaused: false }));
  }, [state.isSupported]);

  const stop = useCallback(() => {
    if (!state.isSupported) return;
    speechSynthesis.cancel();
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentText: "",
    }));
  }, [state.isSupported]);

  const toggle = useCallback((text: string, settings?: Partial<VoiceSettings>) => {
    if (!state.isSupported) return;

    if (!state.isPlaying) {
      speak(text, settings);
      return;
    }

    if (state.isPaused) {
      resume();
    } else {
      pause();
    }
  }, [state.isPlaying, state.isPaused, speak, pause, resume, state.isSupported]);

  // Utility to check if voice is a specific voice
  const isVoice = useCallback((voiceName: string) => {
    return state.selectedVoice?.name === voiceName;
  }, [state.selectedVoice]);

  // Change voice by name
  const setVoiceByName = useCallback((voiceName: string) => {
    const voice = state.availableVoices.find(v => v.name === voiceName);
    if (voice) {
      updateSettings({ voice });
    }
  }, [state.availableVoices, updateSettings]);

  // Reset all settings to default
  const resetSettings = useCallback(() => {
    settingsRef.current = DEFAULT_SETTINGS;
    setState((prev) => ({
      ...prev,
      selectedVoice: prev.availableVoices.find(v => v.lang === "en-US") || prev.availableVoices[0] || null,
    }));
  }, [state.availableVoices]);

  // Clean up
  useEffect(() => {
    return () => {
      if (state.isSupported) {
        speechSynthesis.cancel();
      }
    };
  }, [state.isSupported]);

  return {
    // Core functions
    speak,
    pause,
    resume,
    stop,
    toggle,
    
    // Voice management
    loadVoices,
    setVoiceByName,
    isVoice,
    updateSettings,
    resetSettings,
    
    // State
    ...state,
    
    // Settings access
    settings: settingsRef.current,
  };
}