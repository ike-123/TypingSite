
import React, { useEffect, useState, useRef, useReducer, useMemo } from 'react'
// import './Style.scss'
import words from '../words.json'
import { io, Socket } from 'socket.io-client'
import { Button } from "@/components/ui/button"


import { Input } from '@/Components/ui/input'

import { Modes, type modeID } from '@/utils/Typingmode'
import { quotes } from '@/utils/Quotes'
import type { TestResultData } from '@/Components/TestResults'
// import { count } from 'node:console'


export interface TypingModeConfig {

    mode: modeID,
    config: string[],
    LengthDurationSetting: string,
    providedText?: string[] | null,
    ProgressOnlyOnCorrect: boolean


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
    wordsSincePunctuation: number
    isStartOfSentence: boolean
    totalTime: number
    currentQuote: string[]
    WpmEverySecond: TestResultData[]
    wordsTyped: number
    TotalTime: number
    wordsAmount: number
    isRedo: boolean
    PreviousWords: string[]
    errors: number[]
    lastkeyPressed: string
}

// export interface InitialState {

//     CurrentWordIndex: number,
//     AllWordMap: Map<number, { text: string, isCorrect: boolean, OutsideTextContainer: boolean }>
//     TypedWord: string,
//     startTime: number,
//     finishTime: number,
//     correctCount: number,
//     incorrectCount: number,
//     TestFinished: boolean,
//     WPM: number,
//     Accuracy: number,
//     displayText: string | null,
//     status: Status,
//     setintervalTimer: NodeJS.Timeout | undefined
//     count: number,
//     HighestIndexTyped: number
//     IndexToStartFrom: number,


// }




export interface Action {
    type: "InputChanged" | "SpacebarPressed" | "BackspacePressed" | "Reset" | "RedoTest" | "StartTest" | "FinishTest" | "Update_EverySecond" | "CurrentWordChange" | "UpdateAllwordMap" | "AddRandomWordToList" | "INIT_WORDS" | "UpdateLastKeyPressed"
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

export function useTypingEnigne({ mode, config, LengthDurationSetting, providedText, ProgressOnlyOnCorrect }: TypingModeConfig) {


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

    const [focus, SetFocus] = useState(true);

    const TextContainerref = useRef<HTMLDivElement | null>(null);

    const WordContainerRef = useRef<HTMLDivElement | null>(null);

    const isFirstRender = useRef(true);

    const prevMode = useRef(mode);
    const PrevConfig = useRef(config);
    const PrevLengthDurationSetting = useRef(LengthDurationSetting);



    //make sure these are reset these when needed.
    // let WordsSincePunctuationref = useRef(0);
    // let StartOfSentence = useRef(true);

    //Put this inside of reducer 

    // console.log(StartOfSentence.current)





    const blocked = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

    const [margin, SetMargin] = useState<number>(0)

    const [lineoffset, setlineoffset] = useState<number>(0)

    const [AmountOfWordsToGenerateOnStart, SetAmountOfWordsToGenerateOnStart] = useState(20);




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

        let timeElapsed = 0;

        let timeElapsedsecs = 0;

        let characterLength = 0;

        let errors = state.errors;

        // let CurrentWordIncorrect = state.CurrentWordIncorrect;








        const { value, inputEventData, keyPressEvent, textForDisplay, indexToChange, word, Init_Words, HighestIndexFoundOutOfBounds, RemainingWords, wordsSincePunctuation, isStartOfSentence } = action.payload


        switch (action.type) {
            case "InputChanged":

                const NewMap0 = new Map(state.AllWordMap);


                if (state.status === "typing") {

                    const CurrentTime = Date.now()

                    timeElapsed = (CurrentTime - startTime) / 1000




                    // Clear the refs array before moving to next word

                    //check if the word we typed is equal to the current word

                    TypedWord = value;

                    let iscorrect = false;

                    if (TypedWord.length > state.words[CurrentWordIndex].length || TypedWord.length === 0) {

                        //overtyped so incorrect


                        
                        iscorrect = false;

                        // console.log("1")

                    }

                    else {

                        // console.log("2")

                        const SliceOfCurrentWordTyped = state.words[CurrentWordIndex].slice(0, TypedWord.length)

                        // console.log(SliceOfCurrentWordTyped)
                        if (TypedWord === SliceOfCurrentWordTyped) {

                            iscorrect = true;
                        }
                        else {
                            iscorrect = false;
                        }
                    }

                    // = TypedWord === state.words[CurrentWordIndex];

                    // setAllWordMap2(prev => {
                    //     const newMap = new Map(prev);
                    //     newMap.set(CurrentWord, { text: value, isCorrect: iscorrect });
                    //     return newMap;
                    // });


                    NewMap0.set(CurrentWordIndex, { text: value, isCorrect: iscorrect, OutsideTextContainer: false });

                    // console.log(NewMap0);

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
                            errors = [...state.errors, timeElapsed]

                        }
                        else {

                            //check the last character in the currently typed word and check if it is the same as the current words last character
                            if (value[value.length - 1] === state.words[CurrentWordIndex][value.length - 1]) {
                                correctCount++;
                            }
                            else {
                                incorrectCount++;
                                errors = [...state.errors, timeElapsed]
                            }
                        }
                    }
                }

                // if (!state.startTime) {

                //     startTime = Date.now();
                // }

                return {
                    ...state,
                    TypedWord: TypedWord,
                    AllWordMap: NewMap0,
                    correctCount: correctCount,
                    incorrectCount: incorrectCount,
                    errors: errors,
                    startTime: startTime

                }



            case "SpacebarPressed":

                const newMap0 = new Map(state.AllWordMap);

                // console.log(state.words);


                if (TypedWord.length > 0) {

                    const CurrentTime = Date.now()

                    timeElapsed = (CurrentTime - startTime) / 1000



                    // const PreviousAllWordMapLength = AllWordMap.size;
                    // console.log("prev ",AllWordMap.size);


                    const candidate = TypedWord.trim()


                    if (candidate === state.words[CurrentWordIndex]) {


                        newMap0.set(CurrentWordIndex, { text: candidate, isCorrect: true, OutsideTextContainer: false })

                        correctCount++;

                        if (ProgressOnlyOnCorrect) {

                            //Move to the next word
                            CurrentWordIndex++;
                            TypedWord = "";
                        }

                    }
                    else {

                        newMap0.set(CurrentWordIndex, { text: candidate, isCorrect: false, OutsideTextContainer: false })

                        incorrectCount++;
                        errors = [...state.errors, timeElapsed]


                    }

                    if (!ProgressOnlyOnCorrect) {

                        //Move to the next word
                        CurrentWordIndex++;
                        TypedWord = "";
                    }

                    if (AllWordMap.size > HighestIndexTyped) {
                        //Only when the allwordmap size is greater than highest index typed can we generate a new word
                        // console.log("previous = ", HighestIndexTyped, " and current = ", AllWordMap.size);
                        HighestIndexTyped = AllWordMap.size

                        // const newword = GenerateRandomWord();
                        // console.log("newword = ", newword)

                        // const NextIndex = state.words.length - state.RemainingWordsToGenerate;

                        // if (state.isRedo && state.RemainingWordsToGenerate > 0) {

                        //     RemainingWordsToGenerate--;

                        // }

                        // console.log("what");
                        if (RemainingWordsToGenerate > 0 || mode === "time") {
                            RemainingWordsToGenerate--;
                            // console.log(RemainingWordsToGenerate);

                            Words = [...state.words, word];

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
                    AllWordMap: newMap0,
                    finishTime: finishTime,
                    HighestIndexTyped: HighestIndexTyped,
                    words: Words,
                    RemainingWordsToGenerate: RemainingWordsToGenerate,
                    wordsSincePunctuation: wordsSincePunctuation,
                    isStartOfSentence: isStartOfSentence,
                    errors: errors

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

                return Init(Initialstate)


            case "RedoTest":
                return RedoTest(state)


            case "StartTest":


                status = "typing";
                startTime = Date.now();

                const updatedState = {
                    ...state,
                    status: status,
                    startTime: startTime
                }

                CurrentModeLogic = Modes[mode].ModeLogic

                return CurrentModeLogic.TestStart ? CurrentModeLogic.TestStart(updatedState) : updatedState

            case "FinishTest":

                status = "finished";

                finishTime = Date.now()

                timeElapsed = (finishTime - startTime) / 60000 //elapsed time in minutes

                timeElapsedsecs = parseFloat(((finishTime - startTime) / 1000).toFixed(1)) //elapsed time in minutes to 1 dp

                // console.log(errors);

                var CorrectlyTypedWordsArr: string[] = new Array();

                // console.log("words :", state.words);
                // console.log("final word array")
                console.log(state.WpmEverySecond)

                AllWordMap.forEach((word: any) => {
                    // console.log(word.text)
                    if (word.isCorrect) {
                        CorrectlyTypedWordsArr.push(word.text);
                    }
                });

                characterLength = CorrectlyTypedWordsArr.join(" ").length;

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
                    TotalTime: timeElapsedsecs

                }


            case "Update_EverySecond":

                CurrentModeLogic = Modes[mode].ModeLogic

                const NewCount = state.count + 1


                const CurrentTime = Date.now()

                timeElapsed = (CurrentTime - startTime) / 60000 //elapsed time in minutes
                const timeElapsedsec = (CurrentTime - startTime) / 1000 //elapsed time in minutes


                var CorrectlyTypedWordsArr: string[] = new Array();

                AllWordMap.forEach((word: any) => {
                    if (word.isCorrect) {
                        CorrectlyTypedWordsArr.push(word.text);
                    }
                });

                characterLength = CorrectlyTypedWordsArr.join(" ").length;

                // console.log("Character count = ", characterLength);

                const WordsTyped2 = characterLength / 5;


                WPM = Math.round(WordsTyped2 / timeElapsed)

                // console.log(`Words Typed = ${WordsTyped2} divided by ${timeElapsedsec}secs = ${WPM} WPM `)


                // const WpmEverySecond = state.WpmEverySecond;



                // WpmEverySecond?.push({ time: NewCount.toString(), wpm: WPM })

                const WpmEverySecond = [
                    ...(state.WpmEverySecond ?? []),
                    { time: NewCount, wpm: WPM }
                ]


                // console.log("add")



                const stateWithIncrementedTimer = {
                    ...state,
                    count: NewCount,
                    WpmEverySecond: WpmEverySecond,
                    wordsTyped: WordsTyped2

                }

                // Accuracy = Math.round((correctCount / (correctCount + incorrectCount)) * 100)


                return CurrentModeLogic.update_everysecond ? CurrentModeLogic.update_everysecond(stateWithIncrementedTimer) : stateWithIncrementedTimer


            case "CurrentWordChange":

                CurrentModeLogic = Modes[mode].ModeLogic

                return CurrentModeLogic.OnCurrentWordChange ? CurrentModeLogic.OnCurrentWordChange(state) : state


            case "UpdateAllwordMap":

                // AllWordMap.set(indexToChange, {text: AllWordMap.get(indexToChange)?.text, isCorrect: AllWordMap.get(indexToChange)?.isCorrect, OutsideTextContainer: true})

                // return CurrentModeLogic.OnCurrentWordChange ? CurrentModeLogic.OnCurrentWordChange(state) : state


                const newMap = new Map(state.AllWordMap);
                // console.log("test0")

                // //All words in new map
                //   newMap.forEach((word: any) => {
                //    console.log(word.text);
                // });


                console.log(HighestIndexFoundOutOfBounds);

                //check if the HighestIndex we found exists in the newmap
                //Should always return true
                const existing = newMap.get(HighestIndexFoundOutOfBounds);
                if (!existing) return state;

                //Get all the words before the highestIndexFoundOutOfbounds and outsideTextContainer to false.

                // console.log("test")
                for (let i = 0; i <= HighestIndexFoundOutOfBounds; i++) {

                    const WordInfo = newMap.get(i);

                    if (!WordInfo) continue;

                    newMap.set(i, { ...WordInfo, OutsideTextContainer: true })

                }

                IndexToStartFrom = HighestIndexFoundOutOfBounds + 1;

                // console.log(IndexToStartFrom);

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
                // console.log(RemainingWords);


                return {
                    ...state,
                    words: Init_Words,
                    RemainingWordsToGenerate: RemainingWords,
                    wordsSincePunctuation: wordsSincePunctuation,
                    isStartOfSentence: isStartOfSentence
                }

            case "UpdateLastKeyPressed":

                const LastKeyPressed = keyPressEvent.code;
                return {
                    ...state,
                    lastkeyPressed: LastKeyPressed


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
        RemainingWordsToGenerate: 0,
        wordsSincePunctuation: 0,
        isStartOfSentence: true,
        totalTime: 0,
        currentQuote: [],
        WpmEverySecond: [],
        wordsTyped: 0,
        wordsAmount: 0,
        TotalTime: 0,
        isRedo: false,
        PreviousWords: [],
        errors: [],
        lastkeyPressed: ""

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

    function Init(initialState: State) {

        // console.log("init")

        const { words, RemainingWords, wordsSincePunctuation, isStartOfSentence, totalTime, currentQuote, WordsAmount } = getRandomWords(LengthDurationSetting);

        // console.log(words);

        return {
            ...initialState,
            words: words,
            RemainingWordsToGenerate: RemainingWords,
            wordsSincePunctuation: wordsSincePunctuation,
            isStartOfSentence: isStartOfSentence,
            totalTime: totalTime,
            currentQuote: currentQuote,
            wordsAmount: WordsAmount
        }
    }

    function RedoTest(state: State) {

        const PrevWords = state.words;
        const PrevQuote = state.currentQuote;

        const State1 = {
            ...Initialstate,
            isRedo: true,
            PreviousWords: PrevWords,
            currentQuote: PrevQuote
        }

        const { words, RemainingWords, wordsSincePunctuation, isStartOfSentence, totalTime, currentQuote, WordsAmount } = getRandomWords(LengthDurationSetting, State1);

        // console.log(words);

        // console.log("remaining words = ", RemainingWords)

        // console.log("words Amount = ", WordsAmount)



        return {
            ...State1,
            words: words,
            RemainingWordsToGenerate: RemainingWords,
            wordsSincePunctuation: wordsSincePunctuation,
            isStartOfSentence: isStartOfSentence,
            totalTime: totalTime,
            currentQuote: currentQuote,
            wordsAmount: WordsAmount
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

    function MoveCaretToEnd(event: any) {


        // if (!inputref.current) return;

        // inputref.current.selectionStart = inputref.current.value.length;
        // inputref.current.selectionEnd = inputref.current.value.length

        // requestAnimationFrame(() => {
        //     if (!inputref.current) return;

        //     inputref.current.selectionStart = inputref.current.value.length;
        //     inputref.current.selectionEnd = inputref.current.value.length
        // });

        console.log("clicked");
        inputref.current?.focus()


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

        inputref.current.selectionStart = inputref.current.value.length;
        inputref.current.selectionEnd = inputref.current.value.length


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
            // console.log("delete")
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


    }, [state.TypedWord.length, state.IndexToStartFrom, state.incorrectCount])

    //change the dependecncy to change on keypress rather than typedword.length. This is because currently it doesn't track space bar presses
    //try and change the margin from code rather than in html

    function incrementScroll() {

        setlineoffset(prev => prev + 1);
    }


    function Delete() {

        // setlineoffset(prev => prev + 1);
        const spans = WordContainerRef.current!.querySelectorAll<HTMLSpanElement>("span.word");

        console.log(spans)

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

        // console.log("start")
        console.log(SpanstoRemove)

        const IndexOfSpansToRemove = SpanstoRemove.map((span) => {
            const Index = parseInt(span.dataset.wordIndex!, 10);
            // console.log("spanindex ", Index)
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

        // console.log("chagne")
        //Mode has changed
        if (mode !== prevMode.current || config !== PrevConfig.current || LengthDurationSetting !== PrevLengthDurationSetting.current) {
            Reset();
            // console.log("reset")
            prevMode.current = mode;
            PrevConfig.current = config;
            PrevLengthDurationSetting.current = LengthDurationSetting;
        }

    }, [mode, config, LengthDurationSetting])

    useEffect(() => {

        if (state.status === "notstarted") {

            inputref.current?.focus()
            ResetCaret();
        }

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

        // console.log("changeindex")
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
        let value = event.target.value.trimEnd();
        const inputEvent = event.nativeEvent as InputEvent;
        const inputEventData = inputEvent.data;
        console.log(inputEvent)

        if (value[value.length - 1] === "." && state.lastkeyPressed != "Period") {
            // console.log("ends in full stop")
            // console.log("last key pressed", state.lastkeyPressed);
            value = value.slice(0, -1);
        }

        //If there is a full stop at the end of the word. Check to see if the last key we pressed was '.' If not remove it.
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

        dispatch({ type: "UpdateLastKeyPressed", payload: { keyPressEvent: event } })

        if (event.code === "Space") {
            event.preventDefault();

            const { word, wordsSincePunctuation, isStartOfSentence } = GenerateRandomWord(state);



            dispatch({ type: "SpacebarPressed", payload: { keyPressEvent: event, word, wordsSincePunctuation, isStartOfSentence } })


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



    function getRandomWords(LengthDurationSetting: string, state?: State) {



        // console.log("getrandomwords");


        //This should be set on initialisation not here
        // WordsSincePunctuation.current = 0;
        // StartOfSentence.current = true;

        let FinalWordArray: string[] = [];
        let WordsGenerated = 0;

        let RemainingWords = 0;

        let isStartOfSentence = true;
        let wordsSincePunctuation = 0;

        const totalTime = Number(LengthDurationSetting)
        const WordsAmount = Number(LengthDurationSetting)
        // console.log("wordsamount = ", WordsAmount)

        let SelectedQuote: string[] = []


        //if redo then we get the stored words array and display only the first (amountofwordstogenerateatstart) length of the array.
        // if there are words remaining we calculate the remaining words left to generate and store it in the usereducer
        // Inside of the getrandomword function check to see if we are in redo and check to see if there are any remaining words to generate
        //If we are in quote mode then we just generate the same text again






        //If mode = quote
        if (mode == "quote") {

            if (providedText != null) {


                const CurrentQuote = providedText
                // console.log(CurrentQuote)
                const WordsAmount = CurrentQuote.length;

                if (WordsAmount <= AmountOfWordsToGenerateOnStart) {

                    FinalWordArray = CurrentQuote;
                    RemainingWords = 0;

                }
                else {

                    FinalWordArray = CurrentQuote.slice(0, AmountOfWordsToGenerateOnStart)

                    RemainingWords = WordsAmount - AmountOfWordsToGenerateOnStart;

                }

                return { words: FinalWordArray, RemainingWords, isStartOfSentence, wordsSincePunctuation, totalTime, currentQuote: CurrentQuote, WordsAmount };
            }


            if (state && state.isRedo) {

                //if redo then we get the stored words array and display only the first (amountofwordstogenerateatstart) length of the array.

                const CurrentQuote = state.currentQuote
                const WordsAmount = CurrentQuote.length;

                if (WordsAmount <= AmountOfWordsToGenerateOnStart) {

                    FinalWordArray = CurrentQuote;
                    RemainingWords = 0;

                }
                else {

                    FinalWordArray = CurrentQuote.slice(0, AmountOfWordsToGenerateOnStart)

                    RemainingWords = WordsAmount - AmountOfWordsToGenerateOnStart;

                }

                return { words: FinalWordArray, RemainingWords, isStartOfSentence, wordsSincePunctuation, totalTime, currentQuote: CurrentQuote, WordsAmount };
            }

            // const randindex = Math.floor(Math.random() * quotes.length);

            if (LengthDurationSetting === "short") {

                const ShortQuotes = quotes.filter(quote => quote.length === "short")

                const randindex = Math.floor(Math.random() * ShortQuotes.length);

                SelectedQuote = ShortQuotes[randindex].text.split(" ");

            }
            if (LengthDurationSetting === "medium") {

                const MediumQuotes = quotes.filter(quote => quote.length === "medium")

                const randindex = Math.floor(Math.random() * MediumQuotes.length);

                SelectedQuote = MediumQuotes[randindex].text.split(" ");

            }
            if (LengthDurationSetting === "long") {

                const LongQuotes = quotes.filter(quote => quote.length === "long")

                const randindex = Math.floor(Math.random() * LongQuotes.length);

                SelectedQuote = LongQuotes[randindex].text.split(" ");

            }

            const WordsAmount = SelectedQuote.length;

            if (WordsAmount <= AmountOfWordsToGenerateOnStart) {

                FinalWordArray = SelectedQuote;
                RemainingWords = 0;

            }
            else {

                FinalWordArray = SelectedQuote.slice(0, AmountOfWordsToGenerateOnStart)

                RemainingWords = WordsAmount - AmountOfWordsToGenerateOnStart;

            }


        }
        else if (mode == "word") {

            //Word Mode


            if (state && state.isRedo) {

                //if redo then we get the stored words array and display only the first (amountofwordstogenerateatstart) length of the array.

                const PreviousWordsAmount = state.PreviousWords.length;

                if (PreviousWordsAmount <= AmountOfWordsToGenerateOnStart) {

                    FinalWordArray = state.PreviousWords;
                    // RemainingWords = 0;

                    RemainingWords = WordsAmount - AmountOfWordsToGenerateOnStart;


                }
                else {

                    FinalWordArray = state.PreviousWords.slice(0, AmountOfWordsToGenerateOnStart);
                    RemainingWords = WordsAmount - AmountOfWordsToGenerateOnStart;

                }

                return { words: FinalWordArray, RemainingWords, isStartOfSentence, wordsSincePunctuation, totalTime, currentQuote: SelectedQuote, WordsAmount };
            }


            if (WordsAmount <= AmountOfWordsToGenerateOnStart) {
                WordsGenerated = WordsAmount;
                RemainingWords = 0;
                // console.log("1");
            }
            else {
                WordsGenerated = AmountOfWordsToGenerateOnStart;
                RemainingWords = WordsAmount - AmountOfWordsToGenerateOnStart;
                // console.log("2");
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

                if (config.includes("punctuation")) {

                    // console.log(word)

                    // console.log(StartOfSentence.current);
                    if (isStartOfSentence) {
                        // console.log("heey");
                        word = Capitalize(word);
                        isStartOfSentence = false;
                        wordsSincePunctuation = 0;
                        wordsSincePunctuation++;
                        console.log("true");

                    }
                    else {

                        if (CanGeneratePunctuation(wordsSincePunctuation, isStartOfSentence)) {


                            const punctuation = RandomlyGeneratePunctuation2();

                            if (".?!;".includes(punctuation)) {
                                isStartOfSentence = true;

                                // console.log("punctuation is ", word + punctuation, " Next word capital")
                            }

                            word = word + punctuation;
                            wordsSincePunctuation = 0;
                        }
                        wordsSincePunctuation++;

                    }
                }

                FinalWordArray.push(word);
            }

            if (config.includes("numbers")) {

                // The first Index in the final Words Array to put the number
                let currentIndexPosition = Math.floor(Math.random() * 11);

                while (currentIndexPosition < FinalWordArray.length - 1) {

                    const RandomNumber = Math.floor(Math.random() * 1001).toString();

                    // console.log("Final = ", FinalWordArray[currentIndexPosition])

                    if (/[.?!;]/.test(FinalWordArray[currentIndexPosition])) {

                        FinalWordArray.splice(currentIndexPosition, 1, RandomNumber + ".");
                    }
                    else {
                        FinalWordArray.splice(currentIndexPosition, 1, RandomNumber);

                    }

                    const RandomGeneratedIndex = Math.floor(Math.random() * 11);
                    currentIndexPosition = currentIndexPosition + RandomGeneratedIndex;
                }


            }


            // }

            // else {
            //     const randomArray = [...words].sort(() => 0.5 - Math.random());
            //     FinalWordArray = randomArray.slice(0, amount)
            // }



            // if (config.includes("numbers")) {
            //     // console.log("numbers");


            //     let currentIndexPosition = Math.floor(Math.random() * (6 - 3 + 1)) + 3;

            //     while (currentIndexPosition < FinalWordArray.length - 1) {

            //         const RandomNumber = Math.floor(Math.random() * 1001).toString();

            //         FinalWordArray.splice(currentIndexPosition, 0, RandomNumber);

            //         const RandomGeneratedIndex = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
            //         currentIndexPosition = currentIndexPosition + RandomGeneratedIndex;
            //     }



            // }
        }
        else if (mode == "time") {


            if (state && state.isRedo) {

                //if redo then we get the stored words array and display only the first (amountofwordstogenerateatstart) length of the array.

                const PreviousWordsAmount = state.PreviousWords.length;

                if (PreviousWordsAmount <= AmountOfWordsToGenerateOnStart) {

                    FinalWordArray = state.PreviousWords;
                    // RemainingWords = 0;

                    RemainingWords = WordsAmount - AmountOfWordsToGenerateOnStart;


                }
                else {

                    FinalWordArray = state.PreviousWords.slice(0, AmountOfWordsToGenerateOnStart);
                    RemainingWords = WordsAmount - AmountOfWordsToGenerateOnStart;

                }

                return { words: FinalWordArray, RemainingWords, isStartOfSentence, wordsSincePunctuation, totalTime, currentQuote: SelectedQuote, WordsAmount };
            }


            for (let i = 0; i < AmountOfWordsToGenerateOnStart; i++) {

                const randomisedArray = [...words].sort(() => 0.5 - Math.random());
                let word = randomisedArray[0];

                if (config.includes("punctuation")) {

                    if (isStartOfSentence) {

                        word = Capitalize(word);
                        isStartOfSentence = false;
                        wordsSincePunctuation = 0;
                        wordsSincePunctuation++;

                    }
                    else {

                        if (CanGeneratePunctuation(wordsSincePunctuation, isStartOfSentence)) {


                            const punctuation = RandomlyGeneratePunctuation2();

                            if (".?!;".includes(punctuation)) {
                                isStartOfSentence = true;

                                // console.log("punctuation is ", word + punctuation, " Next word capital")
                            }

                            word = word + punctuation;
                            wordsSincePunctuation = 0;
                        }
                        wordsSincePunctuation++;

                    }
                }

                FinalWordArray.push(word);
            }

            if (config.includes("numbers")) {

                // The first Index in the final Words Array to put the number
                let currentIndexPosition = Math.floor(Math.random() * 11);

                while (currentIndexPosition < FinalWordArray.length - 1) {

                    const RandomNumber = Math.floor(Math.random() * 1001).toString();

                    // console.log("Final = ", FinalWordArray[currentIndexPosition])

                    if (/[.?!;]/.test(FinalWordArray[currentIndexPosition])) {

                        FinalWordArray.splice(currentIndexPosition, 1, RandomNumber + ".");
                    }
                    else {
                        FinalWordArray.splice(currentIndexPosition, 1, RandomNumber);

                    }

                    const RandomGeneratedIndex = Math.floor(Math.random() * 11);
                    currentIndexPosition = currentIndexPosition + RandomGeneratedIndex;
                }


            }
        }


        // console.log(FinalWordArray)
        // StartOfSentence.current = isStartOfSentence;
        // WordsSincePunctuationref.current = WordsSincePunctuation

        return { words: FinalWordArray, RemainingWords, isStartOfSentence, wordsSincePunctuation, totalTime, currentQuote: SelectedQuote, WordsAmount };

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



    function GenerateRandomWord(state: State) {

        // if (config.includes("punctuation")) {

        let isStartOfSentence = state.isStartOfSentence;
        let wordsSincePunctuation = state.wordsSincePunctuation;

        const randomiseArray = [...words].sort(() => 0.5 - Math.random());
        let word = randomiseArray[0];

        if (mode == "quote") {

            const NextIndexToGenerate = state.currentQuote.length - state.RemainingWordsToGenerate;

            if (NextIndexToGenerate < state.currentQuote.length) {
                word = state.currentQuote[NextIndexToGenerate];
            }

        }
        else if (mode == "word") {

            // console.log("hey");

            if (state.isRedo) {

                const NextIndexToGenerate = state.wordsAmount - state.RemainingWordsToGenerate;

                // console.log("words amount = ", state.wordsAmount)
                // console.log("remainingwordstogenerate = ", state.RemainingWordsToGenerate)

                // console.log("Next = ", NextIndexToGenerate)

                if (NextIndexToGenerate < state.PreviousWords.length) {
                    word = state.PreviousWords[NextIndexToGenerate];

                    console.log(state.PreviousWords)
                    console.log(word)

                    return { word, wordsSincePunctuation, isStartOfSentence }


                }
            }

            if (config.includes("punctuation")) {

                if (isStartOfSentence) {
                    // console.log("yes");
                    word = Capitalize(word);

                    // console.log(word);
                    isStartOfSentence = false;
                    wordsSincePunctuation = 0;
                    wordsSincePunctuation++;

                }
                else {

                    if (CanGeneratePunctuation(wordsSincePunctuation, isStartOfSentence)) {

                        const punctuation = RandomlyGeneratePunctuation2();

                        if (".?!;".includes(punctuation)) {
                            // console.log("Next Word capital ", true)
                            isStartOfSentence = true;
                        }

                        word = word + punctuation;
                        wordsSincePunctuation = 0;
                    }
                    wordsSincePunctuation++;

                }


            }

            if (config.includes("numbers")) {

                // The first Index in the final Words Array to put the number
                let Should_Spawn_Number = Math.floor(Math.random() * 11);

                // console.log(Should_Spawn_Number);

                if (Should_Spawn_Number === 0) {

                    // console.log("equal 0")

                    const RandomNumber = Math.floor(Math.random() * 1001).toString();

                    if (/[.?!;]/.test(word)) {

                        word = RandomNumber + "."
                    }
                    else {
                        word = RandomNumber
                    }
                }
            }




        }

        else if (mode === "time") {

            if (state.isRedo) {

                const NextIndexToGenerate = state.wordsAmount - state.RemainingWordsToGenerate;

                // console.log("words amount = ", state.wordsAmount)
                // console.log("remainingwordstogenerate = ", state.RemainingWordsToGenerate)

                // console.log("Next = ", NextIndexToGenerate)

                if (NextIndexToGenerate < state.PreviousWords.length) {
                    word = state.PreviousWords[NextIndexToGenerate];

                    console.log(state.PreviousWords)
                    console.log(word)

                    return { word, wordsSincePunctuation, isStartOfSentence }


                }
            }


            // console.log("hey")
            if (config.includes("punctuation")) {

                if (isStartOfSentence) {
                    // console.log("yes");
                    word = Capitalize(word);

                    // console.log(word);
                    isStartOfSentence = false;
                    wordsSincePunctuation = 0;
                    wordsSincePunctuation++;

                }
                else {

                    if (CanGeneratePunctuation(wordsSincePunctuation, isStartOfSentence)) {

                        const punctuation = RandomlyGeneratePunctuation2();

                        if (".?!;".includes(punctuation)) {
                            // console.log("Next Word capital ", true)
                            isStartOfSentence = true;
                        }

                        word = word + punctuation;
                        wordsSincePunctuation = 0;
                    }
                    wordsSincePunctuation++;

                }


            }

            if (config.includes("numbers")) {

                // The first Index in the final Words Array to put the number
                let Should_Spawn_Number = Math.floor(Math.random() * 11);

                // console.log(Should_Spawn_Number);

                if (Should_Spawn_Number === 0) {

                    console.log("equal 0")

                    const RandomNumber = Math.floor(Math.random() * 1001).toString();

                    if (/[.?!;]/.test(word)) {

                        word = RandomNumber + "."
                    }
                    else {
                        word = RandomNumber
                    }
                }
            }

        }









        return { word, wordsSincePunctuation, isStartOfSentence }
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

    function CanGeneratePunctuation(WordsSincePunctuation: number, isStartOfSentence: boolean) {

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

        // console.log(inputref.current);



        // console.log("click");
        inputref.current?.focus();


        // inputref.current?.focus

        // console.log("reset");

        dispatch({ type: "Reset", payload: {} })

    }

    function Redo() {
        ClearTimer()
        ResetCaret()

        inputref.current?.focus()



        dispatch({ type: "RedoTest", payload: {} })
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
        focus,
        SetFocus,
        HandleKeyDown,
        ChangeInput,
        Reset,
        Redo,
        lettersforOverTypedSection,
        MoveCaretToEnd


    }

}