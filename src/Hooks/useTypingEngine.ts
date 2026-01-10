
import React, { useEffect, useState, useRef, useReducer } from 'react'
// import './Style.scss'
import words from '../words.json'
import { io, Socket } from 'socket.io-client'
import { Button } from "@/components/ui/button"


import { Input } from '@/Components/ui/input'

import { Modes, type modeID } from '@/utils/Typingmode'


export interface TypingModeConfig {

    mode: modeID,
    config: string[],

}

export interface State {
    words: string[],
    CurrentWordIndex: number,
    AllWordMap: Map<number, { text: string, isCorrect: boolean }>
    TypedWord: string,
    startTime: number,
    finishTime: number,
    correctCount: number,
    incorrectCount: number,
    TestFinished: boolean,
    WPM: number,
    Accuracy: number,
    displayText: string | null,
    status: Status,
    setintervalTimer: NodeJS.Timeout | undefined
    count: number,
}


export interface Action {
    type: "InputChanged" | "SpacebarPressed" | "BackspacePressed" | "Reset" | "StartTest" | "FinishTest" | "Update_EverySecond" | "CurrentWordChange",
    payload: any
}

export type Status = "notstarted" | "typing" | "finished";

function getRandomWords(amount: number) {
    const randomArray = [...words].sort(() => 0.5 - Math.random());
    return randomArray.slice(0, amount)
}


export function useTypingEnigne({ mode, config }: TypingModeConfig) {


    // const [words] = useState(() => getRandomWords(5));


    // const [CurrentWord, SetNewCurrenetWord] = useState(0)
    // const [AllWordMap2, setAllWordMap2] = useState<Map<number, { text: string, isCorrect: boolean }>>(new Map());



    // const [TypedWord, setTypedWord] = useState<string>("")


    // const [startTime, SetStartTime] = useState(0);
    // const [finishTime, SetFinishtTime] = useState(0);



    // const [correctCount, SetCorrectCount] = useState<number>(0);
    // const [incorrectCount, SetInCorrectCount] = useState<number>(0);


    // const [TestFinished, setTestFinished] = useState(false);


    // const [WPM, setWPM] = useState(0);
    // const [Accuracy, SetAccuracy] = useState(0);



    // const [state, SetState] = useState("notStarted");





    const caretRef = useRef<HTMLDivElement | null>(null);

    const CurrentWordsSpansRef = useRef<(HTMLSpanElement | null)[]>([]);

    const inputref = useRef<HTMLInputElement | null>(null);

    const blocked = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);


    // const [TypingMode, SetTypingModeLogic] = useState<TypingModeConfig>();
    // const TypingMode = Modes[mode].ModeLogic.






    let lettersforOverTypedSection: string[] = [];



    function reducer(state: State, action: Action): State {

        let CurrentWordIndex = state.CurrentWordIndex;
        // const CurrentWord = state.words[state.CurrentWordIndex]

        let TypedWord = state.TypedWord;
        const AllWordMap = state.AllWordMap;
        let incorrectCount = state.incorrectCount;
        let correctCount = state.correctCount;
        // const nextIndex = state.CurrentWordIndex;
        let startTime = state.startTime;
        let finishTime = state.finishTime;
        let TestFinished = state.TestFinished;

        let WPM = state.WPM;
        let Accuracy = state.Accuracy;

        let displayText = state.displayText;

        let status = state.status;


        // let setintervalTimer = state.setintervalTimer;


        let CurrentModeLogic = Modes[mode].ModeLogic





        const { value, inputEventData, keyPressEvent, textForDisplay } = action.payload


        switch (action.type) {
            case "InputChanged":

                // Clear the refs array before moving to next word

                //check if the word we typed is equal to the current word

                TypedWord = value;
                const iscorrect = value === state.words[CurrentWordIndex];

                // setAllWordMap2(prev => {
                //     const newMap = new Map(prev);
                //     newMap.set(CurrentWord, { text: value, isCorrect: iscorrect });
                //     return newMap;
                // });

                AllWordMap.set(CurrentWordIndex, { text: value, isCorrect: iscorrect });

                console.log(AllWordMap);

                // const inputEvent = event.nativeEvent as InputEvent;
                // const data = inputEvent.data;

                //UPDATE CORRECT AND INCORRECT COUNTS

                //get key input and make sure it's a valid character key
                if (inputEventData && inputEventData.length === 1 && !/\s/.test(inputEventData)) {
                    console.log("Typed character:", inputEventData);

                    console.log("typedvalue ", value);
                    console.log("currentword length ", state.words[CurrentWordIndex]);


                    if (value.length > state.words[CurrentWordIndex].length) {
                        //we are over typing 
                        // SetInCorrectCount((prev: number) => prev + 1);
                        incorrectCount++;

                    }
                    else {

                        //check the last character in the currently typed word and check if it is the same as the current words last character
                        if (value[value.length - 1] === state.words[CurrentWordIndex][value.length - 1]) {
                            correctCount++;
                        }
                        else {
                            incorrectCount++;

                        }
                    }
                }

                // if (!state.startTime) {

                //     startTime = Date.now();
                // }

                return {
                    ...state,
                    TypedWord: TypedWord,
                    AllWordMap: AllWordMap,
                    correctCount: correctCount,
                    incorrectCount: incorrectCount,
                    startTime: startTime
                }



            case "SpacebarPressed":


                if (TypedWord.length > 0) {

                    const candidate = TypedWord.trim()

                    if (candidate === state.words[CurrentWordIndex]) {

                        AllWordMap.set(CurrentWordIndex, { text: candidate, isCorrect: true })

                        correctCount++;

                    }
                    else {

                        AllWordMap.set(CurrentWordIndex, { text: candidate, isCorrect: false })

                        incorrectCount++;

                    }


                    CurrentWordIndex++;
                    // SetNewCurrenetWord((previous: any) => previous + 1)

                    TypedWord = "";

                    //If this is the last word
                    if (CurrentWordIndex > state.words.length - 1) {


                        // finishTime = Date.now()


                        // const timeElapsed = (finishTime - startTime) / 60000 //elapsed time in minutes


                        // var CorrectlyTypedWordsArr: string[] = new Array();

                        // AllWordMap.forEach((word: any) => {
                        //     if (word.isCorrect) {
                        //         CorrectlyTypedWordsArr.push(word.text);
                        //     }
                        // });

                        // const characterLength = CorrectlyTypedWordsArr.join(" ").length;

                        // console.log("Character count = ", characterLength);

                        // const WordsTyped = characterLength / 5;

                        // // setWPM(Math.round(WordsTyped / timeElapsed))
                        // WPM = Math.round(WordsTyped / timeElapsed)

                        // Accuracy = Math.round((correctCount / (correctCount + incorrectCount)) * 100)

                        // // setTestFinished(true);
                        // TestFinished = true;

                        // console.log(WPM);

                    }

                }
                return {
                    ...state,
                    TypedWord: TypedWord,
                    CurrentWordIndex: CurrentWordIndex,
                    correctCount: correctCount,
                    incorrectCount: incorrectCount,
                    AllWordMap: AllWordMap,
                    finishTime: finishTime,
                    WPM: WPM,
                    Accuracy: Accuracy,
                    TestFinished: TestFinished,
                }


            case "BackspacePressed":

                if (CurrentWordIndex - 1 < 0)
                    return {
                        ...state,
                    };

                //if we haven't typed a character in the currentword & the previous word is incorrect
                if (TypedWord.length == 0 && AllWordMap.get(CurrentWordIndex - 1)?.isCorrect == false) {
                    keyPressEvent.preventDefault();

                    // SetNewCurrenetWord((previous: any) => previous - 1)

                    CurrentWordIndex--;

                    // setTypedWord(AllWordMap2.get(CurrentWord - 1)!.text);

                    TypedWord = AllWordMap.get(CurrentWordIndex)!.text



                }

                return {
                    ...state,
                    CurrentWordIndex: CurrentWordIndex,
                    TypedWord: TypedWord,

                }


            case "Reset":

                ClearTimer();

                return {
                    words: getRandomWords(5),
                    CurrentWordIndex: 0,
                    AllWordMap: new Map(),
                    TypedWord: "",
                    startTime: 0,
                    finishTime: 0,
                    correctCount: 0,
                    incorrectCount: 0,
                    TestFinished: false,
                    WPM: 0,
                    Accuracy: 0,
                    displayText: null,
                    status: "notstarted",
                    setintervalTimer: undefined,
                    count: 0
                }


            case "StartTest":

                status = "typing";
                startTime = Date.now();

                CurrentModeLogic = Modes[mode].ModeLogic

                const updatedState = {
                    ...state,
                    status: status,
                    startTime: startTime
                }

                return CurrentModeLogic.update_everysecond ? CurrentModeLogic.update_everysecond(updatedState) : updatedState

            case "FinishTest":

                status = "finished";

                finishTime = Date.now()

                const timeElapsed = (finishTime - startTime) / 60000 //elapsed time in minutes

                var CorrectlyTypedWordsArr: string[] = new Array();

                AllWordMap.forEach((word: any) => {
                    if (word.isCorrect) {
                        CorrectlyTypedWordsArr.push(word.text);
                    }
                });

                const characterLength = CorrectlyTypedWordsArr.join(" ").length;

                console.log("Character count = ", characterLength);

                const WordsTyped = characterLength / 5;

                WPM = Math.round(WordsTyped / timeElapsed)

                Accuracy = Math.round((correctCount / (correctCount + incorrectCount)) * 100)

                TestFinished = true;

                return {
                    ...state,
                    finishTime: finishTime,
                    status: status,
                    AllWordMap: AllWordMap,
                    WPM: WPM,
                    Accuracy: Accuracy,
                    correctCount: correctCount,
                    incorrectCount: incorrectCount,
                    TestFinished: TestFinished,

                }


            case "Update_EverySecond":

                CurrentModeLogic = Modes[mode].ModeLogic


                const stateWithIncrementedTimer = {
                    ...state,
                    count: state.count + 1

                }

                return CurrentModeLogic.update_everysecond ? CurrentModeLogic.update_everysecond(stateWithIncrementedTimer) : stateWithIncrementedTimer


            case "CurrentWordChange":

                CurrentModeLogic = Modes[mode].ModeLogic

                return CurrentModeLogic.OnCurrentWordChange ? CurrentModeLogic.OnCurrentWordChange(state) : state




        }
    }

    // function StartTest() {

    //     switch (mode) {
    //         case "word":


    //             break;

    //         default:
    //             break;
    //     }
    // }

    const [state, dispatch] = useReducer(reducer, {
        words: getRandomWords(5),
        CurrentWordIndex: 0,
        AllWordMap: new Map(),
        TypedWord: "",
        startTime: 0,
        finishTime: 0,
        correctCount: 0,
        incorrectCount: 0,
        TestFinished: false,
        WPM: 0,
        Accuracy: 0,
        displayText: null,
        status: "notstarted",
        setintervalTimer: undefined,
        count: 0,


    })


    // Caret Position
    useEffect(() => {

        if (!CurrentWordsSpansRef.current || !caretRef.current || !inputref.current) return;

        const caretElement = caretRef.current;

        const letterElement = CurrentWordsSpansRef.current[state.TypedWord.length - 1];

        //const inputelment = document.getElementById("input");

        const input = inputref.current;

        //  inputref.current.selectionStart = inputref.current.value.length;
        //  inputref.current.selectionEnd = inputref.current.value.length


        input.addEventListener("keydown", (e: any) => {

            if (blocked.includes(e.key)) {
                e.preventDefault();
            }
        })

        input.addEventListener("paste", (e: any) => {
            e.preventDefault();
        });

        // // Prevent copying
        // input.addEventListener("copy", (e) => {
        // e.preventDefault();
        // });

        // // Prevent cutting
        // input.addEventListener("cut", (e) => {
        // e.preventDefault();
        // });


        // console.log("currentword ", CurrentWordsSpansRef.current.length);

        // console.log("typedword ", TypedWord.length);
        // console.log(CurrentWord);


        if (!letterElement) {
            //position caret before the first letter in the word
            // console.log(CurrentWordsSpansRef.current);
            caretElement.style.left = `${(CurrentWordsSpansRef.current[0]?.offsetLeft ?? 0) - 2}px`
            caretElement.style.top = `${CurrentWordsSpansRef.current[0]?.offsetTop}px`

            return;
        }

        console.log(letterElement);
        console.log(CurrentWordsSpansRef.current);

        caretElement.style.left = `${letterElement.offsetLeft + letterElement.offsetWidth - 2}px`
        caretElement.style.top = `${letterElement.offsetTop}px`


    }, [CurrentWordsSpansRef.current])



    // useEffect(() => {


    // }, [TestFinished])


    // useEffect(() => {

    //     SetState("notStarted")

    // }, [mode])


    // useEffect(() => {

    //    if(state === "notStarted"){

    //     SetStartTime(0);
    //     SetCorrectCount(0);
    //     SetInCorrectCount(0);
    //     SetAccuracy(0);
    //     setTestFinished(false);
    //    }



    // }, [state])


    // const [lettersforOverTypedSection,setOverTypeSection] = useState<string[] | null>([]);


    useEffect(() => {
        Reset();
    }, [mode])

    useEffect(() => {

        if (state.status === "typing") {

            intervalRef.current = setInterval(() => {

                dispatch({ type: "Update_EverySecond", payload: {} })

            }, 1000);
        }

        if (state.status === "finished") {

            dispatch({ type: "FinishTest", payload: {} })

        }

        return () => {
            ClearTimer()
        };

    }, [state.status])

    //CurrentWord index Change
    useEffect(() => {
        dispatch({ type: "CurrentWordChange", payload: {} })

        // Modes[mode].ModeLogic.OnCurrentWordChange?.({ state, dispatch });
    }, [state.CurrentWordIndex])

    function ClearTimer() {

        // clearInterval(state.setintervalTimer)
        clearInterval(intervalRef.current)
        intervalRef.current = undefined;
        // clearInterval?.(state.setintervalTimer)
    }

    function ChangeInput(event: any) {

        console.log("tstate = ", state.status);

        if (state.status === "notstarted") {
            dispatch({ type: "StartTest", payload: {} });

        }
        const value = event.target.value;
        const inputEvent = event.nativeEvent as InputEvent;
        const inputEventData = inputEvent.data;

        dispatch({ type: "InputChanged", payload: { value, inputEventData } })

        // setTypedWord(value)

        // //check if the word we typed is equal to the current word

        // if (value === words[CurrentWord]) {

        //     setAllWordMap2(prev => {
        //         const newMap = new Map(prev);
        //         newMap.set(CurrentWord, { text: value, isCorrect: true });
        //         return newMap;
        //     });

        // }
        // else {

        //     setAllWordMap2(prev => {
        //         const newMap = new Map(prev);
        //         newMap.set(CurrentWord, { text: value, isCorrect: false });
        //         return newMap;
        //     });

        // }

        // // const inputEvent = event.nativeEvent as InputEvent;
        // // const data = inputEvent.data;

        // //get key input and make sure it's a valid character key

        // if (inputEventData && inputEventData.length === 1 && !/\s/.test(inputEventData)) {
        //     console.log("Typed character:", inputEventData);

        //     if (value.length > words[CurrentWord].length) {
        //         //we are over typing 
        //         SetInCorrectCount((prev: number) => prev + 1);

        //     }
        //     else {

        //         //check the last character in the currently typed word and check if it is the same as the current words last character
        //         if (value[value.length - 1] === words[CurrentWord][value.length - 1]) {
        //             console.log("Counted:", event.key);
        //             SetCorrectCount((prev: number) => prev + 1);
        //         }
        //         else {
        //             console.log("Counted:", event.key);
        //             SetInCorrectCount((prev: number) => prev + 1);
        //         }
        //     }
        // }


        // console.log(AllWordMap2);

        // if (!startTime) {

        //     SetStartTime(Date.now());
        // }

    }

    function HandleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {



        if (event.code === "Space") {
            event.preventDefault();


            dispatch({ type: "SpacebarPressed", payload: { keyPressEvent: event } })


            // if (TypedWord.length > 0) {

            //     const candidate = TypedWord.trim()

            //     if (candidate === words[CurrentWord]) {

            //         setAllWordMap2(prev => {
            //             const newMap = new Map(prev);
            //             newMap.set(CurrentWord, { text: candidate, isCorrect: true });
            //             return newMap;
            //         });

            //         SetCorrectCount((prev: number) => prev + 1);

            //     }
            //     else {

            //         setAllWordMap2(prev => {
            //             const newMap = new Map(prev);
            //             newMap.set(CurrentWord, { text: candidate, isCorrect: false });
            //             return newMap;
            //         });

            //         SetInCorrectCount((prev: number) => prev + 1);
            //     }


            //     const nextIndex = CurrentWord + 1;
            //     SetNewCurrenetWord((previous: any) => previous + 1)
            //     setTypedWord("")

            //     //If this is the last word
            //     if (nextIndex > words.length - 1) {

            //         const finish = Date.now()
            //         SetFinishtTime(finish)

            //         const timeElapsed = (finish - startTime) / 60000 //elapsed time in minutes

            //         //console.log(finishTime);

            //         var CorrectlyTypedWordsArr: string[] = new Array();

            //         AllWordMap2.forEach((word: any) => {
            //             if (word.isCorrect) {
            //                 CorrectlyTypedWordsArr.push(word.text);
            //             }
            //         });

            //         const characterLength = CorrectlyTypedWordsArr.join(" ").length;

            //         console.log("Character count = ", characterLength);

            //         const WordsTyped = characterLength / 5;

            //         setWPM(Math.round(WordsTyped / timeElapsed))
            //         setTestFinished(true);
            //         console.log(WPM);

            //     }

            // }

        }

        if (event.code === "Backspace") {

            dispatch({ type: "BackspacePressed", payload: { keyPressEvent: event } })

            // if (CurrentWord - 1 < 0)
            //     return;

            // //if we haven't typed a character in the currentword & the previous word is incorrect
            // if (TypedWord.length == 0 && AllWordMap2.get(CurrentWord - 1)?.isCorrect == false) {
            //     event.preventDefault();

            //     setTypedWord(AllWordMap2.get(CurrentWord - 1)!.text);
            //     SetNewCurrenetWord((previous: any) => previous - 1)

            // }
        }

    }

    function Reset() {

        dispatch({ type: "Reset", payload: {} })
        ClearTimer()


    }


    return {

        state,
        caretRef,
        inputref,
        CurrentWordsSpansRef,
        HandleKeyDown,
        ChangeInput,
        Reset,
        lettersforOverTypedSection,


    }

}