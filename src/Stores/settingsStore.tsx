export interface UserSettings {
  account: {
    username: string;
    email: string;
  };

  personalization: {
    theme: "light" | "dark";
    accentColor: string;
  };

  keyboard: {
    keyboardSounds: boolean;
    showVirtualKeyboard: boolean;
  };

  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
  };
}
