import React, { useEffect, useState, useRef } from 'react'
import './Style.scss'
import words from '../words.json'
import { io, Socket } from 'socket.io-client'

type PlayerState = { id: string; progressIndex: number; wpm: number; finished: boolean; finishtime: String };


function getRandomWords(amount: number) {
    const randomArray = [...words].sort(() => 0.5 - Math.random());
    return randomArray.slice(0, amount)
}

function connectSocket() {

    const socket = io("http://localhost:3001")
    socket.on('connect', () => {
        console.log("you connected with ", socket.id)
    })
}
const Multiplayer = () => {


    const [TypedWord, setTypedWord] = useState<string>("")

    const [CurrentWord, SetNewCurrenetWord] = useState(0)

    const [progressPercent, setprogressPercent] = useState(0);

    const socketRef = useRef<Socket | null>(null);

    const [countdown, setCountdown] = useState<number | null>(null);

    const [words, setWords] = useState<string[]>([]);

    const [startAt, setStartAt] = useState<number | null>(null);

    const [players, setPlayers] = useState<PlayerState[]>([]);

    const [status, setStatus] = useState("waiting");

    const [PlayersInServer, SetPlayersInServer] = useState(0);


    const caretRef = useRef<HTMLDivElement | null>(null);

    const CurrentWordsSpansRef = useRef<(HTMLSpanElement | null)[]>([]);

    const inputref = useRef<HTMLInputElement | null>(null);

    const blocked = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];



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
            console.log(CurrentWordsSpansRef.current);
            caretElement.style.left = `${(CurrentWordsSpansRef.current[0]?.offsetLeft ?? 0) - 2}px`
            caretElement.style.top = `${CurrentWordsSpansRef.current[0]?.offsetTop}px`

            return;
        }

        console.log(letterElement);


        caretElement.style.left = `${letterElement.offsetLeft + letterElement.offsetWidth - 2}px`
        caretElement.style.top = `${letterElement.offsetTop}px`


    }, [CurrentWordsSpansRef.current])



    // const [lettersforOverTypedSection,setOverTypeSection] = useState<string[] | null>([]);

    let lettersforOverTypedSection: string[] = [];


    useEffect(() => {

        const socket = io("192.168.1.239:3001")

        socketRef.current = socket;

        socket.on("countdown", (n) => {
            setCountdown(n);
        })
        socket.on("setWords", ({ words }) => {
            setWords(words);
        })
        socket.on("start", ({ words, startAt }) => {

            setWords(words)
            setStartAt(startAt)
            SetNewCurrenetWord(0);
            setTypedWord("");
            setCountdown(null);
        })

        socket.on("status", (status) => {
            setStatus(status)
        })

        socket.on("state", (ps: PlayerState[]) => {
            setPlayers(ps);
            console.log(ps);
        });
        socket.on("NumberOfPlayers", (amount) => {
            SetPlayersInServer(amount)
        })

        return () => { socket.disconnect(); };


    }, [])




    function ChangeInput(event: any) {

        // Clear the refs array before moving to next word
        const value = event.target.value
        setTypedWord(value)

    }

    function HandleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {


        if (event.code === "Space") {

            event.preventDefault();
            const candidate = TypedWord.trim()

            if (candidate === words[CurrentWord]) {

                console.log(CurrentWord);
                const nextIndex = CurrentWord + 1;

                SetNewCurrenetWord((previous) => previous + 1)
                if (status != "waiting" && status != "countdown") {

                    setprogressPercent(nextIndex / words.length * 100)

                }

                setTypedWord("")

                const elapsedMs = Date.now() - (startAt ?? 0);
                const totalChars = words.slice(0, nextIndex).join(" ").length;

                socketRef.current?.emit("wordDone", { nextIndex, elapsedMs, totalChars });

            }



        }
    }



    return (

        <>

            <div className='main'>

                <div className='Multiplayer'>

                    {countdown !== null && <h1 className='infotext'>Game starts in {countdown}</h1>}
                    {status === "waiting" ? <h1 className='infotext'>Waiting For more Players</h1> : ""}
                    {<h1 className='infotext'>Players in Server: {PlayersInServer}</h1>}


                    <div className="RaceTrack">


                        <div className={`PlayerSection ${players.find((player) => player.id === socketRef.current?.id)?.finished ? "finished" : "notfinished"}`}>

                            {players.find((player) => player.id === socketRef.current?.id)?.finished ? <div className='FinshedText'>Finished</div> : ""}


                            <div className='playerAvatar' style={{ position: "absolute", left: `${progressPercent}%` }}>

                                {/* <img src="https://static.vecteezy.com/system/resources/previews/050/832/637/non_2x/a-3d-cartoon-athlete-running-png.png" alt="" /> */}
                                <img src="https://i.pinimg.com/originals/d5/96/3c/d5963c6f0bc206e3723f796e3b54fd6b.gif" alt="" />


                                {status != "waiting" && status != "countdown" ? <div className='wpm'>{players.find((player) => player.id === socketRef.current?.id)?.wpm ?? 0} wpm</div> : ""}
                                <div className='wpm'>{players.find((player) => player.id === socketRef.current?.id)?.finishtime ?? ""}</div>

                            </div>

                        </div>


                        {players.filter((player) => player.id !== socketRef.current?.id)
                            .map((player) => {
                                const percent = words.length ? (player.progressIndex / words.length) * 100 : 0;
                                const finished = player.finished;



                                return (
                                    <div className={`PlayerSection ${finished ? "finished" : "notfinished"}`}>

                                        <div className='playerAvatar' style={{ position: "absolute", left: `${percent}%` }}>
                                            <img className='image'

                                                key={player.id}
                                                src="https://static.vecteezy.com/system/resources/previews/050/832/637/non_2x/a-3d-cartoon-athlete-running-png.png"

                                            />

                                            {status != "waiting" && status != "countdown" ? <div className='wpm'>{player.wpm} wpm</div> : ""}
                                            <div className='wpm'>{player.finishtime}</div>

                                        </div>
                                    </div>

                                );
                            })}


                    </div>
                </div>

                <div className="TypeTestContainer">

                    <div className='TextContainer'>
                        <div className="QuoteText">

                            <div ref={caretRef} className="caret" />


                            {/* loop through all the words in the words array */}
                            {words.map((word, wordIndex) => (

                                //If CurrentWord is greater than WordIndex then user has alreadly typed the word and class will be "correct"

                                <span className={`${CurrentWord > wordIndex ? "correct" : ""} ${wordIndex === CurrentWord ? "CurrentWord" : ""}`} key={wordIndex}>

                                    <span>
                                        {/* split the word array to retrieve each letter and put in in a span */}

                                        {word.split("").map((character, letterindex) => {

                                            lettersforOverTypedSection = [];
                                            const isCurrent = CurrentWord === wordIndex
                                            CurrentWordsSpansRef.current = [];


                                            if (isCurrent) {
                                                //this is the last letter in the word and we want to check if the user has typed any other letters after which we will append after the word and highlight in red
                                                if (isCurrent && letterindex + 1 === word.length) {


                                                    if (TypedWord.length > word.length) {
                                                        //get the letters that have been overtyped

                                                        const Overtypedsection = TypedWord.slice(word.length, TypedWord.length);

                                                        lettersforOverTypedSection = Overtypedsection.split("");
                                                        console.log(lettersforOverTypedSection);

                                                    }

                                                }
                                            }

                                            //the value the user has typed at the specific letter index
                                            const typedchar = TypedWord[letterindex] ?? ""

                                            const charClass = isCurrent ? (typedchar === "" ? "" : (typedchar === character ? "correct" : "incorrect")) : ""


                                            //put each letter into a span and inside of the ref attribute add the current span into the currentwordsspanref array
                                            return (
                                                <span ref={wordIndex === CurrentWord ? (element) => { if (element) CurrentWordsSpansRef.current.push(element) } : null} className={charClass} key={letterindex}>{character}</span>
                                            )

                                        })}

                                        {/* if lettersforOverTypedSection exists then we have overtyped and we can append the extra values after the word */}
                                        {lettersforOverTypedSection && lettersforOverTypedSection.map((character, index) => (

                                            <span ref={wordIndex === CurrentWord ? (element) => { if (element) CurrentWordsSpansRef.current.push(element) } : null} className="incorrect" key={index}>{character}</span>
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



                </div>


            </div>

        </>

    )
}
export default Multiplayer