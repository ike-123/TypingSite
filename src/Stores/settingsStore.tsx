import { settings } from "node:cluster";
import { create } from "zustand";

export interface UserSettings {
    account: {
        username: string;
        email: string;
    };

    personalization: {
        theme: "light" | "dark";
    };

    keyboard: {
        keyboardSounds: boolean;
    };
}

type UserStore = {
    settings: UserSettings,
}

export const useSettingsStore = create<UserStore>((set) => ({

    settings: {
        account: {
            username: "string",
            email: "string"
        },

        personalization: {
            theme: "dark"
        },

        keyboard: {
            keyboardSounds: true

        },

    }
}))
