import React, { useEffect, useState, useRef } from 'react'
// import './Style.scss'
import words from '../words.json'
import { io, Socket } from 'socket.io-client'
import { Button } from "@/components/ui/button"



import { Input } from '@/Components/ui/input'

type PlayerState = { id: string; progressIndex: number; wpm: number; finished: boolean; finishtime: String };


function getRandomWords(amount: number) {
    const randomArray = [...words].sort(() => 0.5 - Math.random());
    return randomArray.slice(0, amount)
}

const Home = () => {


    const [words] = useState(() => getRandomWords(5));

    const [TypedWord, setTypedWord] = useState<string>("")

    const [CurrentWord, SetNewCurrenetWord] = useState(0)

    const [countdown, setCountdown] = useState<number | null>(null);

    // const [words, setWords] = useState<string[]>([]);

    const [startTime, SetStartTime] = useState(0);
    const [finishTime, SetFinishtTime] = useState(0);
    const [WPM, setWPM] = useState(0);
    const [TestFinished, setTestFinished] = useState(false);

    const [correctCount, SetCorrectCount] = useState(0);
    const [incorrectCount, SetInCorrectCount] = useState(0);
    const [Accuracy, SetAccuracy] = useState(0);


    const [status, setStatus] = useState("waiting");

    const [PlayersInServer, SetPlayersInServer] = useState(0);


    const caretRef = useRef<HTMLDivElement | null>(null);

    const CurrentWordsSpansRef = useRef<(HTMLSpanElement | null)[]>([]);

    const [AllWordMap, setAllWordMap] = useState<Map<number, string>>(new Map());

    const inputref = useRef<HTMLInputElement | null>(null);

    const blocked = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];


    const [typedWords, setTypedWords] = useState(() => words.map(() => ({ text: '', chars: [] as string[], isCorrect: false, finished: false })));

    //or

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


        input.addEventListener("keydown", (e) => {

            if (blocked.includes(e.key)) {
                e.preventDefault();
            }
        })

        input.addEventListener("paste", (e) => {
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


        // console.log(event);

        if (data && data.length === 1 && !/\s/.test(data)) {
            console.log("Typed character:", data);

            if (value.length > words[CurrentWord].length) {
                //we are over typing 
                SetInCorrectCount((prev) => prev + 1);

            }
            else {

                if (value[value.length - 1] === words[CurrentWord][value.length - 1]) {
                    console.log("Counted:", event.key);
                    SetCorrectCount((prev) => prev + 1);
                }
                else {
                    console.log("Counted:", event.key);

                    SetInCorrectCount((prev) => prev + 1);
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

                    SetCorrectCount((prev) => prev + 1);

                }
                else {

                    setAllWordMap2(prev => {
                        const newMap = new Map(prev);
                        newMap.set(CurrentWord, { text: candidate, isCorrect: false });
                        return newMap;
                    });

                    SetInCorrectCount((prev) => prev + 1);
                }


                const nextIndex = CurrentWord + 1;
                SetNewCurrenetWord((previous) => previous + 1)
                setTypedWord("")

                //If this is the last word
                if (nextIndex > words.length - 1) {

                    const finish = Date.now()
                    SetFinishtTime(finish)

                    const timeElapsed = (finish - startTime) / 60000 //elapsed time in minutes

                    //console.log(finishTime);

                    var CorrectlyTypedWordsArr: string[] = new Array();

                    AllWordMap2.forEach(word => {
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
                SetNewCurrenetWord((previous) => previous - 1)

            }
        }

        console.log(event)
        console.log(console.log(""))
    }
    


    return (

        <>
            <div className='main'>

                {/* <div className='Multiplayer'>

                    {countdown !== null && <h1 className='infotext'>Game starts in {countdown}</h1>}
                    {status === "waiting" ? <h1 className='infotext'>Waiting For more Players</h1> : ""}
                    {<h1 className='infotext'>Players in Server: {PlayersInServer}</h1>}

                </div> */}

                <div className='m-4'>
                    <h1>30 seconds</h1>
                </div>

                <div className='flex justify-center mb-4 gap-2'>
                    <Button variant={'outline'}>Time</Button>
                    <Button variant={'outline'}>Words</Button>

                </div>
                
                <div className='flex mb-5'>
                    <Input className='w-40 m-auto' type='text' placeholder='text'></Input>
                </div>


                <div className="TypeTestContainer">

                    <div className='TextContainer'>
                        <div className="QuoteText">

                            <div ref={caretRef} className="caret" />

                            {/* loop through all the words in the words array */}
                            {words.map((word, wordIndex) => (

                                //If CurrentWord is greater than WordIndex then user has alreadly typed the word and class will be "correct"

                                <span className={wordIndex < CurrentWord ? (`${AllWordMap2.get(wordIndex)?.isCorrect ? "correct" : "incorrectword"}`) : ""} key={wordIndex}>

                                    <span>
                                        {/* split the word array to retrieve each letter and put in in a span */}

                                        {word.split("").map((character, letterindex) => {

                                            const StoredWord = AllWordMap2.get(wordIndex);
                                            lettersforOverTypedSection = [];
                                            const isCurrent = wordIndex === CurrentWord
                                            CurrentWordsSpansRef.current = [];


                                            //we check to see if this is the last letter in the word as we want to check if the user has typed any other letters
                                            //  after which we will append after the word and highlight in red
                                            if (letterindex + 1 === word.length) {

                                                if (StoredWord != undefined && StoredWord != null) {

                                                    if (StoredWord.text.length > word.length) {
                                                        //get the letters that have been overtyped
                                                        console.log(StoredWord.text.length);
                                                        const Overtypedsection = StoredWord.text.slice(word.length, StoredWord.text.length);

                                                        lettersforOverTypedSection = Overtypedsection.split("");
                                                        console.log(lettersforOverTypedSection);

                                                    }
                                                    console.log(true);
                                                }
                                                else {
                                                    console.log(false);
                                                }
                                            }


                                            var typedchar;

                                            if (isCurrent) {
                                                //the value the user has typed at the specific letter index
                                                typedchar = TypedWord[letterindex] ?? ""
                                            }
                                            else {

                                                //the value the user has typed at the specific letter index
                                                typedchar = StoredWord?.text[letterindex] ?? ""
                                            }


                                            const charClass = (typedchar === "" ? "" : (typedchar === character ? "correct" : "incorrect"))


                                            //put each letter into a span and inside of the ref attribute add the current span into the currentwordsspanref array
                                            return (
                                                <span ref={wordIndex === CurrentWord ? (element) => { if (element) CurrentWordsSpansRef.current.push(element) } : null} className={charClass} key={letterindex}>{character}</span>
                                            )

                                        })}

                                        {/* if lettersforOverTypedSection exists then we have overtyped and we can append the extra values after the word */}
                                        {lettersforOverTypedSection && lettersforOverTypedSection.map((character, index) => (
                                            <span ref={wordIndex === CurrentWord ? (element) => { if (element) CurrentWordsSpansRef.current.push(element) } : null} className="incorrectOverType" key={index}>{character}</span>
                                        ))}


                                    </span>

                                    <span> </span>

                                </span>

                            ))}

                        </div>

                    </div>


                    <div className='TextInput'>

                        <input ref={inputref} id="input" type="text" autoComplete='off' autoFocus value={TypedWord} onKeyDown={HandleKeyDown} onChange={ChangeInput} />

                    </div>

                    <div>
                        <h1 className='wordsPerMinute'> {TestFinished ? (WPM) + " WPM" : ""} </h1>

                        <h1 className='wordsPerMinute'> {"Accuracy: " + (Accuracy) + "%"} </h1>

                        <h1 className='wordsPerMinute'> {(correctCount) + " Correct"} </h1>

                        <h1 className='wordsPerMinute'> {(incorrectCount) + " Incorrect"} </h1>



                    </div>


                </div>

            </div>

        </>

    )
}
export default Home