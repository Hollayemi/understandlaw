"use client";

import { Volume2, Pause, Play, ChevronDown, Settings } from "lucide-react";
import { useSpeech } from "@/hook/useSpeech";
import { useState, useRef, useEffect } from "react";

interface Props {
  text: string;
  className?: string;
}

export default function ReadAloudButton({ text, className = "" }: Props) {
  const {
    speak,
    pause,
    resume,
    stop,
    toggle,
    isPlaying,
    isPaused,
    isSupported,
    availableVoices,
    selectedVoice,
    setVoiceByName,
    updateSettings,
    settings,
  } = useSpeech();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isPlaying) {
      speak(text);
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    setVoiceByName(voiceName);
  };

  const handleRateChange = (value: number) => {
    setRate(value);
    updateSettings({ rate: value });
  };

  const handlePitchChange = (value: number) => {
    setPitch(value);
    updateSettings({ pitch: value });
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Main Button - Icon Only */}
      <button
        onClick={handleToggle}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors focus:outline-none ring-2 ring-[#E8317A] focus:ring-offset-2"
        aria-label={isPlaying ? (isPaused ? "Resume" : "Pause") : "Read aloud"}
        title={isPlaying ? (isPaused ? "Resume" : "Pause") : "Read aloud"}
      >
        {!isPlaying && <Volume2 size={20} className="text-gray-700" />}
        {isPlaying && !isPaused && <Pause size={20} className="text-[#E8317A]" />}
        {isPlaying && isPaused && <Play size={20} className="text-[#E8317A]" />}
      </button>

      {/* Settings Dropdown Button */}
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="absolute -bottom-1 -right-1 p-0.5 w-5! h-5! flex items-center justify-center md:w-auto md:h-auto rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none"
        aria-label="Voice settings"
      >
        <ChevronDown className="text-gray-500 w-4 h-4 md:w-8 md:h-8" />
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="fixed bottom-full h-80 right-10 !bottom-10 mb-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50 !bg-white shadow">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Voice Settings
            </h4>

            {/* Voice Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Voice
              </label>
              <select
                value={selectedVoice?.name || ""}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#E8317A] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Rate Control */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-gray-600">Speed</label>
                <span className="text-xs text-gray-500">{rate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E8317A]"
              />
            </div>

            {/* Pitch Control */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-gray-600">Pitch</label>
                <span className="text-xs text-gray-500">{pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E8317A]"
              />
            </div>

            {/* Stop Button */}
            {isPlaying && (
              <button
                onClick={stop}
                className="w-full py-1.5 text-sm text-red-500 hover:text-red-600 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Stop Speaking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}