import React, { useEffect, useState, useRef } from 'react'
import './StylesOG.scss'
import words from '../words.json'
import { io, Socket } from 'socket.io-client'
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTypingEnigne2 } from '@/Hooks/useTypingEngine2';
import SP_TypingTest from '@/Components/SP_TypingTest';
import type { configID, modeID } from '@/utils/Typingmode';
import { useTypingEnigne } from '@/Hooks/useTypingEngine';

type PlayerState = { id: string; progressIndex: number; wpm: number; finished: boolean; finishtime: String };

type Status = "waiting" | "countdown" | "running"


// function getRandomWords(amount: number) {
//     const randomArray = [...words].sort(() => 0.5 - Math.random());
//     return randomArray.slice(0, amount)
// }

// function connectSocket() {

//     const socket = io("http://localhost:3001")
//     socket.on('connect', () => {
//         console.log("you connected with ", socket.id)
//     })
// }

const Multiplayer = () => {

    // console.log(1);
    const [TypedWord, setTypedWord] = useState<string>("")

    const [CurrentWord, SetNewCurrenetWord] = useState(0)

    const [progressPercent, setprogressPercent] = useState(0);

    const socketRef = useRef<Socket | null>(null);

    const [countdown, setCountdown] = useState<number | null>(null);

    const [words, setWords] = useState<string[]>([]);

    const [startAt, setStartAt] = useState<number | null>(null);

    const [players, setPlayers] = useState<PlayerState[]>([]);

    const [status, setStatus] = useState<Status>("waiting");

    const [PlayersInServer, SetPlayersInServer] = useState(0);


    // const caretRef = useRef<HTMLDivElement | null>(null);

    // const CurrentWordsSpansRef = useRef<(HTMLSpanElement | null)[]>([]);

    // const inputref = useRef<HTMLInputElement | null>(null);

    // const blocked = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];

    const [modeID, SetMode] = useState<modeID>("quote");

    const [configs, SetConfigs] = useState<configID[]>([]);

    const [LengthDurationSetting, SetLengthDurationSetting] = useState<string>("");





    // useEffect(() => {

    //     if (!CurrentWordsSpansRef.current || !caretRef.current || !inputref.current) return;

    //     const caretElement = caretRef.current;

    //     const letterElement = CurrentWordsSpansRef.current[TypedWord.length - 1];

    //     //const inputelment = document.getElementById("input");

    //     const input = inputref.current;

    //     //  inputref.current.selectionStart = inputref.current.value.length;
    //     //  inputref.current.selectionEnd = inputref.current.value.length


    //     input.addEventListener("keydown", (e) => {

    //         if (blocked.includes(e.key)) {
    //             e.preventDefault();
    //         }
    //     })

    //     input.addEventListener("paste", (e) => {
    //         e.preventDefault();
    //     });

    //     // // Prevent copying
    //     // input.addEventListener("copy", (e) => {
    //     // e.preventDefault();
    //     // });

    //     // // Prevent cutting
    //     // input.addEventListener("cut", (e) => {
    //     // e.preventDefault();
    //     // });


    //     console.log("currentword ", CurrentWordsSpansRef.current.length);
    //     console.log("typedword ", TypedWord.length);
    //     console.log(CurrentWord);



    //     if (!letterElement) {
    //         console.log(CurrentWordsSpansRef.current);
    //         caretElement.style.left = `${(CurrentWordsSpansRef.current[0]?.offsetLeft ?? 0) - 2}px`
    //         caretElement.style.top = `${CurrentWordsSpansRef.current[0]?.offsetTop}px`

    //         return;
    //     }

    //     console.log(letterElement);


    //     caretElement.style.left = `${letterElement.offsetLeft + letterElement.offsetWidth - 2}px`
    //     caretElement.style.top = `${letterElement.offsetTop}px`


    // }, [CurrentWordsSpansRef.current])










    // const [lettersforOverTypedSection,setOverTypeSection] = useState<string[] | null>([]);

    // let lettersforOverTypedSection: string[] = [];

    let engine = useTypingEnigne({
        mode: modeID,
        config: configs,
        LengthDurationSetting: LengthDurationSetting,
        providedText: words,
        ProgressOnlyOnCorrect: true
    })


    useEffect(() => {

        // console.log("hey")

        const socket = io("http://localhost:3001")

        socketRef.current = socket;

        socket.on("countdown", (n) => {
            setCountdown(n);
        })
        socket.on("setWords", ({ words }) => {

            // console.log("words coming")

            setWords(words);
            engine.Reset()

        })
        socket.on("start", ({ words, startAt }) => {

            setWords(words)
            engine.Reset()

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
            // console.log(ps);
        });
        socket.on("NumberOfPlayers", (amount) => {
            SetPlayersInServer(amount)
        })

        return () => { socket.disconnect(); };


    }, [])

    // console.log("Running Again")




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

    useEffect(() => {


        if (status != "waiting" && status != "countdown") {

            setprogressPercent(engine.state.CurrentWordIndex / words.length * 100)

            const elapsedMs = Date.now() - (startAt ?? 0);
            const totalChars = words.slice(0, engine.state.CurrentWordIndex).join(" ").length;

            socketRef.current?.emit("wordDone", { nextIndex:engine.state.CurrentWordIndex , elapsedMs, totalChars });
        }


    }, [engine.state.CurrentWordIndex])



    return (

        <>
        <div>Last Key pressed {engine.state.lastkeyPressed}</div>
        {engine.state.CurrentWordIndex}

            <div className='main bg-background max-w-7xl flex flex-col items-center m-auto'>


                <div className='flex justify-center gap-3'>

                    <NavLink to={"/"} >

                        {({ isActive }) => (

                            <Button variant={isActive ? "default" : "outline"}>Solo</Button>

                        )}

                    </NavLink>

                    <NavLink to={"/Multiplayer"} >

                        {({ isActive }) => (

                            <Button variant={isActive ? "default" : "outline"}>Multiplayer</Button>

                        )}

                    </NavLink>


                    <NavLink to={"/Games"} >

                        {({ isActive }) => (

                            <Button variant={isActive ? "default" : "outline"}>Games</Button>

                        )}

                    </NavLink>

                </div>

                <div className='Multiplayer mb-10'>

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




                <SP_TypingTest engine={engine} HighlightIncorrectCurrentWord={true} ></SP_TypingTest>


            </div>

        </>

    )
}
export default Multiplayer