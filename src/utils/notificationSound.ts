// Use window to store audio instance to survive HMR
const AUDIO_KEY = "__notification_audio__";

const getAudioInstance = (): HTMLAudioElement | null => {
  return (
    (window as unknown as Record<string, HTMLAudioElement | null>)[AUDIO_KEY] ??
    null
  );
};

const setAudioInstance = (audio: HTMLAudioElement | null): void => {
  (window as unknown as Record<string, HTMLAudioElement | null>)[AUDIO_KEY] =
    audio;
};

/**
 * Plays a notification sound on loop from the public folder.
 * @param soundPath - Path to the sound file relative to public folder (e.g., "/ting-ting.mp3")
 */
export const playNotificationSound = (soundPath: string): void => {
  const currentAudio = getAudioInstance();

  // If already playing, don't restart
  if (currentAudio && !currentAudio.paused) {
    return;
  }

  // Stop any existing sound first
  stopNotificationSound();

  // Create new audio instance
  const audio = new Audio(soundPath);
  audio.volume = 0.7;

  setAudioInstance(audio);

  // Play the sound
  audio.play().catch((error) => {
    console.warn("[Notification Sound] Failed to play:", error.message);
  });
};

/**
 * Stops the currently playing notification sound
 */
export const stopNotificationSound = (): void => {
  const audio = getAudioInstance();
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    setAudioInstance(null);
  }
};
