import { settings } from "node:cluster";
import { create } from "zustand";


export interface UserAccountSettings {

    username: string;
    email: string;

}

export interface OtherSettings {

    personalization: {
        theme: "light" | "dark";
    };

    keyboard: {
        keyboardSounds: boolean;
    };
}

type UserStore = {

    //Account Settings

    accountSettings: UserAccountSettings,

    SetAccountSettings: ()=> void;

    settings: OtherSettings,

}

export const useSettingsStore = create<UserStore>((set) => ({

    accountSettings: {

        username:"",
        email:"",
    },

    SetAccountSettings() {
        
    },
    

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
