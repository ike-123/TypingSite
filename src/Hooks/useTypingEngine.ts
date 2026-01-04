
import React, { useEffect, useState, useRef } from 'react'
// import './Style.scss'
import words from '../words.json'
import { io, Socket } from 'socket.io-client'
import { Button } from "@/components/ui/button"


import { Input } from '@/Components/ui/input'




function getRandomWords(amount: number) {
    const randomArray = [...words].sort(() => 0.5 - Math.random());
    return randomArray.slice(0, amount)
}


export function useTypingEnigne() {


    const [words] = useState(() => getRandomWords(5));

    const [TypedWord, setTypedWord] = useState<string>("")

    const [CurrentWord, SetNewCurrenetWord] = useState(0)

    const [countdown, setCountdown] = useState<number | null>(null);

    const [startTime, SetStartTime] = useState(0);
    const [finishTime, SetFinishtTime] = useState(0);
    const [WPM, setWPM] = useState(0);
    const [TestFinished, setTestFinished] = useState(false);

    const [correctCount, SetCorrectCount] = useState<number>(0);
    const [incorrectCount, SetInCorrectCount] = useState<number>(0);
    const [Accuracy, SetAccuracy] = useState(0);


    const [status, setStatus] = useState("waiting");

    const [PlayersInServer, SetPlayersInServer] = useState(0);


    // const [status, setStatus] = useState("waiting");


    const caretRef = useRef<HTMLDivElement | null>(null);

    const CurrentWordsSpansRef = useRef<(HTMLSpanElement | null)[]>([]);

    const inputref = useRef<HTMLInputElement | null>(null);

    const blocked = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

    const [AllWordMap2, setAllWordMap2] = useState<Map<number, { text: string, isCorrect: boolean }>>(new Map());


    // Caret Position
    useEffect(() => {

        if (!CurrentWordsSpansRef.current || !caretRef.current || !inputref.current) return;

        const caretElement = caretRef.current;

        const letterElement = CurrentWordsSpansRef.current[TypedWord.length - 1];

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


        console.log("currentword ", CurrentWordsSpansRef.current.length);

        console.log("typedword ", TypedWord.length);
        console.log(CurrentWord);


        if (!letterElement) {
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


    useEffect(() => {

        //round down
        SetAccuracy(Math.round((correctCount / (correctCount + incorrectCount)) * 100))
    }, [TestFinished])


    useEffect(() => {

        //round down
        SetAccuracy(Math.round((correctCount / (correctCount + incorrectCount)) * 100))
    }, [TestFinished])


    // const [lettersforOverTypedSection,setOverTypeSection] = useState<string[] | null>([]);

    let lettersforOverTypedSection: string[] = [];


    function ChangeInput(event: any) {

        // Clear the refs array before moving to next word
        const value = event.target.value
        setTypedWord(value)

        if (value === words[CurrentWord]) {

            setAllWordMap2(prev => {
                const newMap = new Map(prev);
                newMap.set(CurrentWord, { text: value, isCorrect: true });
                return newMap;
            });

        }
        else {

            setAllWordMap2(prev => {
                const newMap = new Map(prev);
                newMap.set(CurrentWord, { text: value, isCorrect: false });
                return newMap;
            });

        }

        const inputEvent = event.nativeEvent as InputEvent;
        const data = inputEvent.data;

        if (data && data.length === 1 && !/\s/.test(data)) {
            console.log("Typed character:", data);

            if (value.length > words[CurrentWord].length) {
                //we are over typing 
                SetInCorrectCount((prev: number) => prev + 1);

            }
            else {

                if (value[value.length - 1] === words[CurrentWord][value.length - 1]) {
                    console.log("Counted:", event.key);
                    SetCorrectCount((prev: number) => prev + 1);
                }
                else {
                    console.log("Counted:", event.key);

                    SetInCorrectCount((prev: number) => prev + 1);
                }
            }
        }


        console.log(AllWordMap2);

        if (!startTime) {

            SetStartTime(Date.now());
        }

    }

    function HandleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {


        if (event.code === "Space") {
            event.preventDefault();

            if (TypedWord.length > 0) {

                const candidate = TypedWord.trim()

                if (candidate === words[CurrentWord]) {

                    setAllWordMap2(prev => {
                        const newMap = new Map(prev);
                        newMap.set(CurrentWord, { text: candidate, isCorrect: true });
                        return newMap;
                    });

                    SetCorrectCount((prev: number) => prev + 1);

                }
                else {

                    setAllWordMap2(prev => {
                        const newMap = new Map(prev);
                        newMap.set(CurrentWord, { text: candidate, isCorrect: false });
                        return newMap;
                    });

                    SetInCorrectCount((prev: number) => prev + 1);
                }


                const nextIndex = CurrentWord + 1;
                SetNewCurrenetWord((previous: any) => previous + 1)
                setTypedWord("")

                //If this is the last word
                if (nextIndex > words.length - 1) {

                    const finish = Date.now()
                    SetFinishtTime(finish)

                    const timeElapsed = (finish - startTime) / 60000 //elapsed time in minutes

                    //console.log(finishTime);

                    var CorrectlyTypedWordsArr: string[] = new Array();

                    AllWordMap2.forEach((word: any) => {
                        if (word.isCorrect) {
                            CorrectlyTypedWordsArr.push(word.text);
                        }
                    });

                    const characterLength = CorrectlyTypedWordsArr.join(" ").length;

                    console.log("Character count = ", characterLength);

                    const WordsTyped = characterLength / 5;

                    setWPM(Math.round(WordsTyped / timeElapsed))
                    setTestFinished(true);
                    console.log(WPM);

                }

            }

        }

        if (event.code === "Backspace") {

            //if we haven't typed a character in the currentword & the previous word is incorrect
            if (CurrentWord - 1 < 0)
                return;

            if (TypedWord.length == 0 && AllWordMap2.get(CurrentWord - 1)?.isCorrect == false) {
                event.preventDefault();

                setTypedWord(AllWordMap2.get(CurrentWord - 1)!.text);
                SetNewCurrenetWord((previous: any) => previous - 1)

            }
        }

    }


    return {

        words,
        CurrentWord,
        AllWordMap2,
        caretRef,
        lettersforOverTypedSection,
        CurrentWordsSpansRef,
        TypedWord,
        inputref,
        HandleKeyDown,
        ChangeInput,
        TestFinished,
        WPM,
        Accuracy,
        correctCount,
        incorrectCount


    }

}