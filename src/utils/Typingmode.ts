
// export interface TypingModeConfig {

import { type State } from "@/Hooks/useTypingEngine";
import { type Action } from "@/Hooks/useTypingEngine";



export type modeID = "time" | "word" | "quote";

export type modeSettingsID = "time" | "word" | "quote";


export type configID = "punctuation" | "numbers" | "error";



export interface EngineContext {
    state: State;
    dispatch: React.Dispatch<Action>;
}

export interface LengthDurationSetting {
    name:string
    options:string[]
    defaultValue: string
    customOptions:boolean
    MinAndMaxCustomValues?:{
        min:number
        max:number
    }
}



// export interface ModeLogic {

//     TestStart?: (ctx: EngineContext) => void;
//     OnCurrentWordChange?: (ctx: EngineContext) => void;
//     update_everysecond?: (ctx: EngineContext) => void;
// }

export interface ModeLogic {

    TestStart?: (state:State) => State;
    OnCurrentWordChange?: (state: State) => State;
    update_everysecond?: (state: State) => State;
}

export interface TypingModeConfig {

    id: modeID;
    LengthDurationSetting:LengthDurationSetting;
    label: string;
    allowedConfigs: configID[];
    ModeLogic: ModeLogic;
}




export const Modes: Record<modeID, TypingModeConfig> = {

    time: {
        id: "time",
        LengthDurationSetting:{
            name:"Duration",
            options:["5","15","30","60","120"],
            defaultValue: "30",
            customOptions:true,
            MinAndMaxCustomValues:{
                min:1,
                max:1500
            }
        },
        label: "Complete the test before the timer runs out",
        allowedConfigs: ["punctuation", "numbers", "error"],
        ModeLogic: {
              TestStart: ( state ) => {
                const TextToDisplay = `${10-state.count}`
                // console.log("displaytext = ", TextToDisplay);
                const isFinished = state.count >= 10;

                return{
                    ...state,
                    displayText:TextToDisplay,
                    status: isFinished ? "finished" : state.status
                }
            },

            update_everysecond: ( state ) => {

                const TextToDisplay = `${state.totalTime-state.count}`
                // console.log("displaytext = ", TextToDisplay);
                const isFinished = state.count >= state.totalTime;

                return{
                    ...state,
                    displayText:TextToDisplay,
                    status: isFinished ? "finished" : state.status
                }
            },
        }
    },
    word: {
        id: "word",
         LengthDurationSetting:{
            name:"Word Amount",
            options:["10","25","50","100"],
            defaultValue: "25",
            customOptions:true,
            MinAndMaxCustomValues:{
                min:1,
                max:1000
            }
        },
        label: "Complete the test before the timer runs out",
        allowedConfigs: ["punctuation", "numbers", "error"],
        ModeLogic: {
            OnCurrentWordChange(state) {

                const TextToDisplay = `${state.CurrentWordIndex}/${state.words.length}`
                const isFinished = state.CurrentWordIndex > state.words.length - 1;

                return{
                    ...state,
                    displayText:TextToDisplay,
                    status: isFinished ? "finished" : state.status
                }

            },
        }
    },
    quote: {
        id: "quote",
        LengthDurationSetting:{
            name:"Word Amount",
            options:["short","medium","long"],
            defaultValue: "medium",
            customOptions:false,
        },
        label: "Complete the test before the timer runs out",
        allowedConfigs: ["error"],
        ModeLogic: {
            OnCurrentWordChange(state) {

                const TextToDisplay = `${state.CurrentWordIndex}/${state.words.length}`
                const isFinished = state.CurrentWordIndex > state.words.length - 1;

                return{
                    ...state,
                    displayText:TextToDisplay,
                    status: isFinished ? "finished" : state.status
                }

            },
        }
    }


}


// export const Modes: Record<modeID, TypingModeConfig> = {

//     time: {
//         id: "time",
//         label: "Complete the test before the timer runs out",
//         allowedConfigs: ["punctuation", "numbers", "error"],
//         ModeLogic: {
//             TestStart: ({ state }) => {
                
//             }
//         }
//     },
//     word: {
//         id: "word",
//         label: "Complete the test before the timer runs out",
//         allowedConfigs: ["punctuation", "numbers", "error"],
//         ModeLogic: {
//             TestStart: ({ state }) => {


//             },

//             OnCurrentWordChange({ state, dispatch }) {
//                 const TextToDisplay = `${state.CurrentWordIndex}/${state.words.length}`
//                 dispatch({ type: "Update_Progress_Display", payload: { textForDisplay: TextToDisplay } })

//                 if (state.CurrentWordIndex > state.words.length - 1) {
//                     dispatch({ type: "FinishTest", payload: {} })

//                 }

//             },
//         }
//     },
//     quote: {
//         id: "quote",
//         label: "Complete the test before the timer runs out",
//         allowedConfigs: ["error"],
//         ModeLogic: {
//             TestStart: ({ state }) => {

//             },
//             OnCurrentWordChange({ state }) {

//             },
//         }
//     }


// }

