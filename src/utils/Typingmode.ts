
// export interface TypingModeConfig {

import { type State } from "@/Hooks/useTypingEngine";
import { type Action } from "@/Hooks/useTypingEngine";



export type modeID = "time" | "word" | "quote";

export type configID = "punctuation" | "numbers" | "error";



export interface EngineContext {
    state: State;
    dispatch: React.Dispatch<Action>;
}

export interface ModeLogic {

    TestStart?: (ctx: EngineContext) => void;
    OnCurrentWordChange?: (ctx: EngineContext) => void;

}

export interface TypingModeConfig {

    id: modeID;
    label: string;
    allowedConfigs: configID[];
    ModeLogic: ModeLogic;
}




export const Modes: Record<modeID, TypingModeConfig> = {

    time: {
        id: "time",
        label: "Complete the test before the timer runs out",
        allowedConfigs: ["punctuation", "numbers", "error"],
        ModeLogic: {
            TestStart: ({ state, dispatch }) => {
                let count = 0;

                dispatch({ type: "1_Second_Update", payload: { textForDisplay: 10 } })

                const timer = setInterval(() => {
                    count++;

                    const TextToDisplay = 10 - count;
                    dispatch({ type: "1_Second_Update", payload: { textForDisplay: TextToDisplay } })
                    console.log("Timer running");

                    if (count === 10) {
                        clearInterval(timer);
                        console.log("Timer Cleared");
                    }

                }, 1000);
            }
        }
    },
    word: {
        id: "word",
        label: "Complete the test before the timer runs out",
        allowedConfigs: ["punctuation", "numbers", "error"],
        ModeLogic: {
            TestStart: ({ state }) => {


            },
            OnCurrentWordChange({ state, dispatch }) {
                const TextToDisplay = `${state.CurrentWordIndex}/${state.words.length}`
                dispatch({ type: "1_Second_Update", payload: { textForDisplay: TextToDisplay } })

                if (state.CurrentWordIndex > state.words.length - 1) {
                    dispatch({ type: "FinishTest", payload: {} })

                }

            },
        }
    },
    quote: {
        id: "quote",
        label: "Complete the test before the timer runs out",
        allowedConfigs: ["error"],
        ModeLogic: {
            TestStart: ({ state }) => {

            },
            OnCurrentWordChange({ state }) {

            },
        }
    }


}

