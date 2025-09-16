import { useState, useEffect } from "react";

const useSpeechSynthesis = ({ language = "en-US" } = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const updateVoices = () => {
      setVoices(speechSynthesis.getVoices());
    };

    updateVoices();
    speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const speak = (text, options = {}) => {
    if (!isSupported) return;

    speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language || language;
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;

    // Select appropriate voice based on language
    const selectedVoice =
      voices.find((voice) =>
        voice.lang.includes(options.language || language)
      ) || voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    isSupported,
    isSpeaking,
    speak,
    stopSpeaking,
    voices,
  };
};

export default useSpeechSynthesis;
