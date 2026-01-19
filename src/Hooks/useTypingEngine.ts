
import React, { useEffect, useState, useRef, useReducer, useMemo } from 'react'
// import './Style.scss'
import words from '../words.json'
import { io, Socket } from 'socket.io-client'
import { Button } from "@/components/ui/button"


import { Input } from '@/Components/ui/input'

import { Modes, type modeID } from '@/utils/Typingmode'
import { quotes } from '@/utils/Quotes'


export interface TypingModeConfig {

    mode: modeID,
    config: string[],
    LengthDurationSetting: string

}

export interface State {
    words: string[],
    CurrentWordIndex: number,
    AllWordMap: Map<number, { text: string, isCorrect: boolean, OutsideTextContainer: boolean }>
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
    HighestIndexTyped: number
    IndexToStartFrom: number
    RemainingWordsToGenerate: number
}

export interface InitialState {

    CurrentWordIndex: number,
    AllWordMap: Map<number, { text: string, isCorrect: boolean, OutsideTextContainer: boolean }>
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
    HighestIndexTyped: number
    IndexToStartFrom: number,


}




export interface Action {
    type: "InputChanged" | "SpacebarPressed" | "BackspacePressed" | "Reset" | "StartTest" | "FinishTest" | "Update_EverySecond" | "CurrentWordChange" | "UpdateAllwordMap" | "AddRandomWordToList" | "INIT_WORDS"
    payload: any
}

export type Status = "notstarted" | "typing" | "finished";


const punctuation2 = [
    { char: ".", weight: 45 },
    { char: ",", weight: 30 },
    { char: "?", weight: 5 },
    { char: "!", weight: 5 },
    { char: ";", weight: 5 },
    { char: ":", weight: 5 },
    // { char: "—", weight: 3 },
    // { char: "(", weight: 1 },
    // { char: ")", weight: 1 },
];

export function useTypingEnigne({ mode, config, LengthDurationSetting }: TypingModeConfig) {


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

    const TextContainerref = useRef<HTMLDivElement | null>(null);

    const WordContainerRef = useRef<HTMLDivElement | null>(null);

    const isFirstRender = useRef(true);

    const prevMode = useRef(mode);
    const PrevConfig = useRef(config);
    const PrevLengthDurationSetting = useRef(LengthDurationSetting);



    //make sure these are reset these when needed.
    let WordsSincePunctuationref = useRef(0);
    let StartOfSentence = useRef(true);

    // console.log(StartOfSentence.current)





    const blocked = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

    const [margin, SetMargin] = useState<number>(0)

    const [lineoffset, setlineoffset] = useState<number>(0)




    // let margin = 0;

    const [Top, SetTop] = useState(0);


    const punctuation = ["!",]


    const LINE_HEIGHT = 39;
    const TARGET_LINE = 1; // 0 = first line, 1 = second line
    const MAX_CARET_Y = (TARGET_LINE) * LINE_HEIGHT;





    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);


    // const [TypingMode, SetTypingModeLogic] = useState<TypingModeConfig>();
    // const TypingMode = Modes[mode].ModeLogic.






    let lettersforOverTypedSection: string[] = [];



    function reducer(state: State, action: Action): State {

        let Words = state.words;

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

        let HighestIndexTyped = state.HighestIndexTyped;

        let IndexToStartFrom = state.IndexToStartFrom;

        let RemainingWordsToGenerate = state.RemainingWordsToGenerate;





        const { value, inputEventData, keyPressEvent, textForDisplay, indexToChange, newword, Init_Words, HighestIndexFoundOutOfBounds, RemainingWords } = action.payload


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

                AllWordMap.set(CurrentWordIndex, { text: value, isCorrect: iscorrect, OutsideTextContainer: false });

                // console.log(AllWordMap);

                // const inputEvent = event.nativeEvent as InputEvent;
                // const data = inputEvent.data;

                //UPDATE CORRECT AND INCORRECT COUNTS

                //get key input and make sure it's a valid character key
                if (inputEventData && inputEventData.length === 1 && !/\s/.test(inputEventData)) {

                    // console.log("Typed character:", inputEventData);

                    // console.log("typedvalue ", value);
                    // console.log("currentword length ", state.words[CurrentWordIndex]);


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


                    // const PreviousAllWordMapLength = AllWordMap.size;
                    // console.log("prev ",AllWordMap.size);


                    const candidate = TypedWord.trim()

                    if (candidate === state.words[CurrentWordIndex]) {

                        AllWordMap.set(CurrentWordIndex, { text: candidate, isCorrect: true, OutsideTextContainer: false })

                        correctCount++;

                    }
                    else {

                        AllWordMap.set(CurrentWordIndex, { text: candidate, isCorrect: false, OutsideTextContainer: false })

                        incorrectCount++;

                    }

                    CurrentWordIndex++;
                    TypedWord = "";



                    if (AllWordMap.size > HighestIndexTyped) {
                        // console.log("previous = ", HighestIndexTyped, " and current = ", AllWordMap.size);
                        HighestIndexTyped = AllWordMap.size

                        // const newword = GenerateRandomWord();
                        // console.log("newword = ", newword)


                        if (RemainingWordsToGenerate > 0) {
                            RemainingWordsToGenerate--;
                            console.log(RemainingWordsToGenerate);

                            Words = [...state.words, newword];

                        }

                    }

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
                    HighestIndexTyped: HighestIndexTyped,
                    words: Words,
                    RemainingWordsToGenerate: RemainingWordsToGenerate
                }


            case "BackspacePressed":

                if (CurrentWordIndex - 1 < 0)
                    return {
                        ...state,
                    };

                console.log("outsidecontainer ,", AllWordMap.get(CurrentWordIndex - 1)?.OutsideTextContainer)
                //if we haven't typed a character in the currentword & the previous word is incorrect
                if (TypedWord.length == 0 && AllWordMap.get(CurrentWordIndex - 1)?.isCorrect == false && AllWordMap.get(CurrentWordIndex - 1)?.OutsideTextContainer == false) {
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

                // I don't think it is OK to call this function here since we are updating side effects

                return Init(Initialstate)


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

                // console.log("Character count = ", characterLength);

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


            case "UpdateAllwordMap":

                // AllWordMap.set(indexToChange, {text: AllWordMap.get(indexToChange)?.text, isCorrect: AllWordMap.get(indexToChange)?.isCorrect, OutsideTextContainer: true})

                // return CurrentModeLogic.OnCurrentWordChange ? CurrentModeLogic.OnCurrentWordChange(state) : state

                console.log("test0")

                const newMap = new Map(state.AllWordMap);

                console.log(HighestIndexFoundOutOfBounds);

                //check if the HighestIndex we found exists in the newmap
                //Should always return true
                const existing = newMap.get(HighestIndexFoundOutOfBounds);
                if (!existing) return state;

                console.log("test")
                for (let i = 0; i <= HighestIndexFoundOutOfBounds; i++) {

                    console.log("running");
                    newMap.set(i, { ...existing, OutsideTextContainer: true })

                }

                IndexToStartFrom = HighestIndexFoundOutOfBounds + 1;

                console.log(IndexToStartFrom);

                // newMap.set(indexToChange, {
                //     ...existing,
                //     OutsideTextContainer: true,
                // });

                return {
                    ...state,
                    AllWordMap: newMap,
                    IndexToStartFrom: IndexToStartFrom
                };

            case "AddRandomWordToList":

                //   const word  = GenerateRandomWord();


                return {
                    ...state,
                }

            case "INIT_WORDS":

                // const NewRemainingWords = RemainingWordsToGenerate - CountUsed;
                console.log(RemainingWords);


                return {
                    ...state,
                    words: Init_Words,
                    RemainingWordsToGenerate: RemainingWords
                }

            // case "UpdateRemainingWords":

            // const NewRemainingWords = RemainingWordsToGenerate - RemainingWords;
            // console.log(NewRemainingWords);

            // return {
            //     ...state,
            //     RemainingWordsToGenerate: NewRemainingWords
            // }

        }
    }

    const Initialstate: State = {
        words: [],
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
        HighestIndexTyped: 0,
        IndexToStartFrom: 0,
        RemainingWordsToGenerate: 0

    }

    // const InitialState: InitialState = {
    //     CurrentWordIndex: 0,
    //     AllWordMap: new Map(),
    //     TypedWord: "",
    //     startTime: 0,
    //     finishTime: 0,
    //     correctCount: 0,
    //     incorrectCount: 0,
    //     TestFinished: false,
    //     WPM: 0,
    //     Accuracy: 0,
    //     displayText: null,
    //     status: "notstarted",
    //     setintervalTimer: undefined,
    //     count: 0,
    //     HighestIndexTyped: 0,
    //     IndexToStartFrom: 0,
    // }


    // const initialWords = useMemo(() => getRandomWords(30), []);

    function Init(initialState:State) {

        const { words, RemainingWords } = getRandomWords(LengthDurationSetting);

        return {
            ...initialState,
            words: words,
            RemainingWordsToGenerate:RemainingWords

        }
    }



    // const [state, dispatch] = useReducer(reducer, Initialstate)
    
    const [state, dispatch] = useReducer(reducer, Initialstate, Init)




    // useEffect(() => {
    //     console.log("useeffect")

    //     const { words, RemainingWords } = getRandomWords(LengthDurationSetting);
    //     dispatch({ type: "INIT_WORDS", payload: { Init_Words: words, RemainingWords } });
    // }, []);

    function InitialiseRemainingWordsToGenerate(): number {

        return 40;
    }
    // Caret Position
    useEffect(() => {

        if (!CurrentWordsSpansRef.current || CurrentWordsSpansRef.current.length === 0 || !caretRef.current || !inputref.current || !TextContainerref.current) return;
        // console.log("yay")

        const TextContainerRect = TextContainerref.current.getBoundingClientRect();

        const currentWordRect = CurrentWordsSpansRef.current[0]?.getBoundingClientRect();

        const caretElement = caretRef.current;

        const letterElement = CurrentWordsSpansRef.current[state.TypedWord.length - 1];


        let caretTop = currentWordRect!.top - TextContainerRect.top

        // console.log("caret top = ", caretTop);



        //get a refernce to the wordcontainer and search through each span if it is above the text container then delete it 
        //get all the words in the words array and check to see if it is above the textcontainer ref if it is then mark it as offscreen
        //create a new variable for words in the allwordsarray that stores whether it is offscreen. if it is marked with offscreen it cannot be rendered anymore.


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


        if (caretTop > MAX_CARET_Y) {
            // console.log("maxcarety = ", MAX_CARET_Y);P
            // incrementScroll();
            console.log("delete")
            Delete()

        }

        if (!letterElement) {
            //if no letter has been typed then we are at the first letter in the word
            //position caret before the first letter in the word
            // console.log(CurrentWordsSpansRef.current);
            caretElement.style.left = `${(CurrentWordsSpansRef.current[0]?.offsetLeft ?? 0) - 2}px`
            // SetTop(CurrentWordsSpansRef.current[0]?.offsetTop!);
            caretElement.style.top = `${CurrentWordsSpansRef.current[0]?.offsetTop}px`
            // caretTop = caretElement.offsetTop
            SetTop(caretElement.offsetTop)
            // console.log("changed")

        }
        else {
            // console.log(letterElement);
            // console.log(CurrentWordsSpansRef.current);

            //As soon as you type a letter, Caret should be on the right hand side of the letter.
            caretElement.style.left = `${letterElement.offsetLeft + letterElement.offsetWidth - 2}px`
            // SetTop(letterElement.offsetTop);
            caretElement.style.top = `${letterElement.offsetTop}px`
            // caretTop = caretElement.offsetTop
            SetTop(caretElement.offsetTop)

            // console.log("changed")

        }

        // if (caretTop > 60) {
        //     SetMargin(prev => prev + 1)

        //     // margin++;

        // }

        // SetTop(caretElement.offsetTop);

        // console.log("offset Top = ", `${caretElement.offsetTop}px`);


    }, [state.TypedWord.length, state.IndexToStartFrom])

    //change the dependecncy to change on keypress rather than typedword.length. This is because currently it doesn't track space bar presses
    //try and change the margin from code rather than in html

    function incrementScroll() {

        setlineoffset(prev => prev + 1);
    }


    function Delete() {

        // setlineoffset(prev => prev + 1);
        const spans = WordContainerRef.current!.querySelectorAll<HTMLSpanElement>("span.word");

        const TextContainerRect = TextContainerref.current!.getBoundingClientRect();

        // for (const span of spans) {

        //     if (span.getBoundingClientRect().top - TextContainerRect?.top < 0) {

        //         //span is above the Text Container.
        //         span.remove();
        //     }

        //     else {
        //         break;
        //     }
        // }

        const SpanstoRemove: HTMLSpanElement[] = [];

        //if the difference beteween the top of the textcontainer and the top of the span is 0 then it is on the
        //top line and we will remove it
        for (const span of spans) {
            // console.log("spand = ", span, span.getBoundingClientRect().top - TextContainerRect?.top);

            // console.log(span);

            if (span.getBoundingClientRect().top - TextContainerRect?.top <= 1) {

                //span is above the Text Container.
                SpanstoRemove.push(span);
            }

            else {
                // console.log("break = ", span);
                // console.log("break = ", span.getBoundingClientRect().top - TextContainerRect?.top);

                break;
            }
        }

        console.log("start")
        console.log(SpanstoRemove)

        const IndexOfSpansToRemove = SpanstoRemove.map((span) => {
            const Index = parseInt(span.dataset.wordIndex!, 10);
            console.log("spanindex ", Index)
            return Index;
        })

        const HighestIndexFoundOutOfBounds = Math.max(...IndexOfSpansToRemove)

        console.log("highest ", HighestIndexFoundOutOfBounds);

        dispatch({ type: "UpdateAllwordMap", payload: { HighestIndexFoundOutOfBounds } })


        // SpanstoRemove.forEach(span => {
        //     const WordIndex = parseInt(span.id, 10);
        //     dispatch({ type: "UpdateAllwordMap", payload: { indexToChange: WordIndex } })
        //     span?.remove();
        // });





    }

    useEffect(() => {

        // console.log("TOP = ", Top);

        if (Top > 60) {

            SetMargin(prev => prev + 1)
        }
    }, [Top])

    // useEffect(() => {

    //     if (!CurrentWordsSpansRef.current || !caretRef.current || !inputref.current) return;

    //     const caretElement = caretRef.current;

    //     const letterElement = CurrentWordsSpansRef.current[state.TypedWord.length - 1];

    //     if (!letterElement) {
    //         //if no letter has been typed then we are at the first letter in the word
    //         //position caret before the first letter in the word
    //         caretElement.style.left = `${(CurrentWordsSpansRef.current[0]?.offsetLeft ?? 0) - 2}px`
    //         // SetTop(CurrentWordsSpansRef.current[0]?.offsetTop!);
    //         caretElement.style.top = `${CurrentWordsSpansRef.current[0]?.offsetTop}px`

    //         console.log("what")


    //     }
    //     else {
    //         // console.log(letterElement);
    //         // console.log(CurrentWordsSpansRef.current);

    //         //As soon as you type a letter, Caret should be on the right hand side of the letter.
    //         caretElement.style.left = `${letterElement.offsetLeft + letterElement.offsetWidth - 2}px`
    //         // SetTop(letterElement.offsetTop);
    //         caretElement.style.top = `${letterElement.offsetTop}px`
    //         // caretTop = caretElement.offsetTop

    //         console.log("what")


    //     }

    //     console.log("offset Top = ", `${letterElement?.offsetTop}px`);

    // }, [margin])

    //     useLayoutEffect(() => {
    //   if (!caretRef.current || !CurrentWordsSpansRef.current) return;

    //   const idx = state.TypedWord.length - 1;
    //   const letter = CurrentWordsSpansRef.current[idx] ?? CurrentWordsSpansRef.current[0];

    //   if (!letter) return;

    //   const top = letter.offsetTop;
    //   const left = letter.offsetLeft + letter.offsetWidth - 2;

    //   caretRef.current.style.left = `${left}px`;
    //   caretRef.current.style.top = `${Math.min(top, 60)}px`;

    //   if (top > 60) {
    //     setMargin(m => m + 1);
    //   }
    // }, [state.TypedWord.length]);











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

        console.log("chagne")
        //Mode has changed
        if (mode !== prevMode.current || config !== PrevConfig.current || LengthDurationSetting !== PrevLengthDurationSetting.current) {
            Reset();
            console.log("reset")
            prevMode.current = mode;
            PrevConfig.current = config;
            PrevLengthDurationSetting.current = LengthDurationSetting;
        }

    }, [mode, config, LengthDurationSetting])

    useEffect(() => {

        if (state.status === "notstarted") {

            ResetCaret();
        }

        if (state.status === "typing") {


            intervalRef.current = setInterval(() => {

                // dispatch({ type: "Update_EverySecond", payload: {} })

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

        console.log("changeindex")
        dispatch({ type: "CurrentWordChange", payload: {} })

        // Modes[mode].ModeLogic.OnCurrentWordChange?.({ state, dispatch });
    }, [state.CurrentWordIndex])


    useEffect(() => {

        // console.log("Words");
    }, [state.words])

    useEffect(() => {

        if (config.includes("error") && state.incorrectCount > 0) {
            dispatch({ type: "FinishTest", payload: {} })
        }

    }, [state.incorrectCount])

    function ClearTimer() {

        // clearInterval(state.setintervalTimer)
        clearInterval(intervalRef.current)
        intervalRef.current = undefined;
        // clearInterval?.(state.setintervalTimer)
    }

    function ChangeInput(event: any) {

        // console.log("tstate = ", state.status);

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

            const newword = GenerateRandomWord();



            dispatch({ type: "SpacebarPressed", payload: { keyPressEvent: event, newword } })


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

    const PUNCTUATION_WEIGHTS = [
        { value: ",", weight: 0.45 },
        { value: "?", weight: 0.08 },
        { value: "!", weight: 0.07 },
        { value: ";", weight: 0.05 },
        { value: ":", weight: 0.05 },
        { value: "\"", weight: 0.05 },
        // { value: "'", weight: 0.15 },
        // { value: "()", weight: 0.10 }
    ];



    function getRandomWords(LengthDurationSetting: string) {



        console.log("getrandomwords");


        //This should be set on initialisation not here
        // WordsSincePunctuation.current = 0;
        // StartOfSentence.current = true;

        let FinalWordArray: string[] = [];
        let WordsGenerated = 0;

        let RemainingWords = 0;

        let isStartOfSentence = true;
        let WordsSincePunctuation = 0;




        //If mode = quote
        if (mode == "quote") {

            const randindex = Math.floor(Math.random() * quotes.length);

            console.log(quotes[randindex].text.split(""));
            FinalWordArray = quotes[randindex].text.split(" ");

        }
        else {

            //Word Mode

            const WordsAmount = Number(LengthDurationSetting)


            if (WordsAmount <= 20) {
                WordsGenerated = WordsAmount;
                RemainingWords = 0;
                console.log("1");
            }
            else {
                WordsGenerated = 20;
                RemainingWords = WordsAmount - 20;
                console.log("2");
            }

            // dispatch({ type: "UpdateRemainingWords", payload: { RemainingWords: WordsGenerated } })


            // if (config.includes("punctuation")) {

            for (let i = 0; i < WordsGenerated; i++) {



                // const randomArray = [...words].sort(() => 0.5 - Math.random());
                // const RandomSentenceLength = Math.floor(Math.random() * (15 - 3 + 1)) + 3;


                // //Generate a new Sentence array of random words
                // let NewSentence = randomArray.slice(0, RandomSentenceLength);


                // //PIck random index to place first punctuation
                // let currentIndexPosition = Math.floor(Math.random() * (6 - 3 + 1)) + 3;



                // while (currentIndexPosition < NewSentence.length - 1) {


                //     //add puncutation to the word
                //     //make new function called add punctuation to word (where you input the word into to functin) that will allow brackets to be wrapped around a word and be returned back

                //     const punctuation = RandomlyGeneratePunctuation();

                //     const WordToChange = NewSentence[currentIndexPosition];

                //     NewSentence[currentIndexPosition] = WordToChange + punctuation;

                //     //generate a new CurrentIndexPosition to place next punctuation
                //     const RandomGeneratedIndex = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
                //     currentIndexPosition = currentIndexPosition + RandomGeneratedIndex;


                // }

                // //Capitalize first word and add a full-stop to last word.

                // NewSentence[0] = NewSentence[0][0].toUpperCase() + NewSentence[0].slice(1);
                // NewSentence[NewSentence.length - 1] =
                //     NewSentence[NewSentence.length - 1] + "."

                // NewSentence.forEach(element => {
                //     FinalWordArray.push(element)
                // });


                const randomArray = [...words].sort(() => 0.5 - Math.random());
                let word = randomArray[0];

                // console.log(word)

                // console.log(StartOfSentence.current);
                if (isStartOfSentence) {
                    // console.log("heey");
                    word = Capitalize(word);
                    isStartOfSentence = false;
                    WordsSincePunctuation = 0;
                    WordsSincePunctuation++;
                    console.log("true");

                }
                else {

                    if (CanGeneratePunctuation(WordsSincePunctuation,isStartOfSentence)) {


                        const punctuation = RandomlyGeneratePunctuation2();

                        if (".?!;".includes(punctuation)) {
                            isStartOfSentence = true;

                            // console.log("punctuation is ", word + punctuation, " Next word capital")
                        }

                        word = word + punctuation;
                        WordsSincePunctuation = 0;
                    }
                    WordsSincePunctuation++;

                }

                FinalWordArray.push(word);


            }

            // }

            // else {
            //     const randomArray = [...words].sort(() => 0.5 - Math.random());
            //     FinalWordArray = randomArray.slice(0, amount)
            // }



            if (config.includes("numbers")) {
                // console.log("numbers");


                let currentIndexPosition = Math.floor(Math.random() * (6 - 3 + 1)) + 3;

                while (currentIndexPosition < FinalWordArray.length - 1) {

                    const RandomNumber = Math.floor(Math.random() * 1001).toString();

                    FinalWordArray.splice(currentIndexPosition, 0, RandomNumber);

                    const RandomGeneratedIndex = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
                    currentIndexPosition = currentIndexPosition + RandomGeneratedIndex;
                }



            }
        }


        // console.log(FinalWordArray)
        StartOfSentence.current = isStartOfSentence;
        WordsSincePunctuationref.current = WordsSincePunctuation

        return { words: FinalWordArray, RemainingWords };

    }



    function RandomlyGeneratePunctuation() {



        const totalWeight = PUNCTUATION_WEIGHTS.reduce(
            (sum, p) => sum + p.weight,
            0
        );

        let r = Math.random() * totalWeight;

        for (const p of PUNCTUATION_WEIGHTS) {
            if (r < p.weight) {
                return p.value;
            }
            r -= p.weight;
        }

        return ","

    }



    function RandomlyGeneratePunctuation2() {

        const totalWeight = punctuation2.reduce(
            (sum, p) => sum + p.weight,
            0
        );

        let r = Math.random() * totalWeight;

        for (const p of punctuation2) {
            if (r < p.weight) {
                return p.char;
            }
            r -= p.weight;
        }

        return ","

    }

    function ResetCaret() {
        const caretElement = caretRef.current;

        if (caretElement) {
            // console.log("exist");
            caretElement.style.left = `${(CurrentWordsSpansRef.current[0]?.offsetLeft ?? 0) - 2}px`
            // SetTop(CurrentWordsSpansRef.current[0]?.offsetTop!);
            caretElement.style.top = `${CurrentWordsSpansRef.current[0]?.offsetTop}px`
        }

    }



    function GenerateRandomWord(): string {

        // if (config.includes("punctuation")) {

        const randomArray = [...words].sort(() => 0.5 - Math.random());
        let word = randomArray[0];

        if (StartOfSentence.current) {
            // console.log("yes");
            word = Capitalize(word);

            // console.log(word);
            StartOfSentence.current = false;
            WordsSincePunctuationref.current = 0;
            WordsSincePunctuationref.current++;

        }
        else {

            if (CanGeneratePunctuation(WordsSincePunctuationref.current,StartOfSentence.current)) {

                const punctuation = RandomlyGeneratePunctuation2();

                if (".?!;".includes(punctuation)) {
                    // console.log("Next Word capital ", true)
                    StartOfSentence.current = true;
                }

                word = word + punctuation;
                WordsSincePunctuationref.current = 0;
            }
            WordsSincePunctuationref.current++;

        }

        return word
        // }
        // else {
        //     const randomArray = [...words].sort(() => 0.5 - Math.random());
        //     const word = randomArray[0];
        //     return word
        // }

    }

    function Capitalize(word: string) {

        return word[0].toUpperCase() + word.slice(1);
    }

    function CanGeneratePunctuation(WordsSincePunctuation:number, isStartOfSentence: boolean) {

        if (WordsSincePunctuation < 3)
            return false

        if (isStartOfSentence)
            return false;

        return Math.random() < 0.25

    }

    // function ChoosePunctuation(): string {

    //     const randomArray = [...words].sort(() => 0.5 - Math.random());
    //     const word = randomArray[0];
    //     return word
    // }

    function Reset() {

        ClearTimer()
        ResetCaret()

        console.log("reset");

        dispatch({ type: "Reset", payload: {} })

    }


    return {

        state,
        caretRef,
        inputref,
        CurrentWordsSpansRef,
        margin,
        WordContainerRef,
        TextContainerref,
        LINE_HEIGHT,
        lineoffset,
        HandleKeyDown,
        ChangeInput,
        Reset,
        lettersforOverTypedSection,


    }

}