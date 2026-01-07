
export interface TypingModeConfig {

    mode: string,
    config: string[],

}

export const TypingModes: TypingModeConfig[] =

    [
        {
            mode: "time",
            config: ["punctuation", "numbers", "error"]
        },
        {
            mode: "words",
            config: ["punctuation", "numbers", "error"]
        }
    ]


