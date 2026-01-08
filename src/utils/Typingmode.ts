
// export interface TypingModeConfig {



//     mode: string,
//     config: string[],

// }

// export const TypingModes: TypingModeConfig[] =

//     [
//         {
//             mode: "time",
//             config: ["punctuation", "numbers", "error"]
//         },
//         {
//             mode: "words",
//             config: ["punctuation", "numbers", "error"]
//         }
//     ]


export type modeID = "time" | "word" | "quote";

export type configID = "punctuation" | "numbers" | "error";


export interface TypingModeConfig {

    id: modeID;
    label: string;
    allowedConfigs: configID[];
}

// const word:TypingModeConfig = {
//     id:"word",
//     label:"Complete the test before the timer runs out",
//     allowedConfigs:["numbers","punctuation"]
// }



export const Modes: Record<modeID, TypingModeConfig> = {

    time: {
        id: "time",
        label: "Complete the test before the timer runs out",
        allowedConfigs: ["punctuation","numbers","error"]
    },
    word: {
        id: "word",
        label: "Complete the test before the timer runs out",
        allowedConfigs: ["punctuation","numbers","error"]
    },
    quote: {
        id: "quote",
        label: "Complete the test before the timer runs out",
        allowedConfigs: ["error"]
    }

}
