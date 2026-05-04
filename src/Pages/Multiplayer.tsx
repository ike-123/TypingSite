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
import { useAuthStore } from '@/Stores/AuthStore';
import { v4 as uuidv4 } from 'uuid';
import Multiplayer_User_Setup from '@/Components/Multiplayer_User_Setup';
import { Application } from '@pixi/react';
import { AnimatedSprite } from 'pixi.js';
import AnimatedSpriteAvatar from '@/Components/AnimatedSpriteAvatar';
import MultiplayerRaceTrack from '@/Components/MultiplayerRaceTrack';
import { Play } from 'lucide-react';
// import { date } from 'better-auth';

export type PlayerState = { id: string; progressIndex: number; wpm: number; accuracy: number, finished: boolean; finishtime: string; DisplayName: string; lastWordIndexIncreaseTime: number | null };

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

    const User = useAuthStore((state) => state.user)

    const [Multiplayer_Username, setMultplayerUsername] = useState()

    const [ShowSetupScreen, SetShowSetupScreen] = useState(false)

    const parentRef = useRef<HTMLDivElement>(null);

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


        if (ShowSetupScreen === false) {


            const DisplayName = localStorage.getItem("MultiplayerMode_Displayname");

            if (!DisplayName) {

                //Go back to setup page

                SetShowSetupScreen(true);

                console.log("Just testing this code should run so that we hit the return statement")


                return

            }

            //im not sure if this is necessary
            SetShowSetupScreen(false);

            console.log("ShowSetUpScreen")


            //if checking for playerid isnt synchronous because it waits for loading to finish then the code should be after the display name check 
            //So that we don't wait for playerid only for us to be sent back to the setup page
            let playerID;
            let isGuest = true;

            if (User) {
                console.log("User id is ", User.id)

                playerID = User.id;
                isGuest = false;
            }
            else {

                playerID = localStorage.getItem("playerId")

                if (!playerID) {
                    playerID = uuidv4()
                    localStorage.setItem("playerId", playerID)
                }
            }

            //Check for display name and avatar 





            // const socket = io("http://localhost:3001")
            // console.log(isGuest)
            const socket = io("192.168.1.219:3001", {
                auth: {
                    playerID,
                    DisplayName
                }

            })

            console.log(socket);



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

                //set startAt to value provided from server
                // setStartAt(startAt)

                setStartAt(Date.now());
                SetNewCurrenetWord(0);
                setTypedWord("");
                setCountdown(null);
            })

            socket.on("status", (status) => {
                setStatus(status)
            })

            socket.on("state", (ps: PlayerState[]) => {


                // if (!players) {

                //     setPlayers(ps);

                // }

                // ps.map((player,index) => {


                //     if(player.progressIndex > players[player.id].progressIndex)
                // })

                //If so set lastWordIndexIncreaseTime to now
                // If so increase the timer

                // console.log(ps.length);

                //loop through each player in the array and check if the currentwordIndex has increased.
                //If so 



                setPlayers(previousPlayers => {

                    if (!previousPlayers) return ps;

                    console.log(previousPlayers);

                    const prevMap = new Map(previousPlayers.map((player) => ([player.id, player])))

                    const updatedPlayersMap = ps.map((player) => {

                        const prev = prevMap.get(player.id);

                        return {
                            ...player,
                            lastWordIndexIncreaseTime:
                                prev && player.progressIndex > prev.progressIndex
                                    ? Date.now()
                                    : prev?.lastWordIndexIncreaseTime ?? 0
                        }
                    })

                    return updatedPlayersMap;



                })

            });
            socket.on("NumberOfPlayers", (amount) => {
                SetPlayersInServer(amount)
            })

            return () => { socket.disconnect(); };

        }

    }, [ShowSetupScreen])

    // console.log("Running Again")




    function ChangeInput(event: any) {

        // Clear the refs array before moving to next word
        const value = event.target.value
        setTypedWord(value)

    }

    function EnableShowSetupScreen() {

        SetShowSetupScreen(true);
    }

    function DisableShowSetupScreen() {

        SetShowSetupScreen(false);
    }

    // function HandleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {


    //     if (event.code === "Space") {

    //         event.preventDefault();
    //         const candidate = TypedWord.trim()

    //         if (candidate === words[CurrentWord]) {

    //             console.log(CurrentWord);
    //             const nextIndex = CurrentWord + 1;

    //             SetNewCurrenetWord((previous) => previous + 1)
    //             if (status != "waiting" && status != "countdown") {

    //                 setprogressPercent(nextIndex / words.length * 100)

    //             }

    //             setTypedWord("")

    //             console.log("server ", startAt);
    //             console.log("now ", Date.now());

    //             const elapsedMs = Date.now() - (startAt ?? 0);
    //             const totalChars = words.slice(0, nextIndex).join(" ").length;

    //             socketRef.current?.emit("wordDone", { nextIndex, elapsedMs, totalChars });

    //         }

    //     }
    // }

    useEffect(() => {

        if (status != "waiting" && status != "countdown") {

            setprogressPercent(engine.state.CurrentWordIndex / words.length * 100)

            const elapsedMs = Date.now() - (startAt ?? 0);
            const totalChars = words.slice(0, engine.state.CurrentWordIndex).join(" ").length;

            socketRef.current?.emit("wordDone", { nextIndex: engine.state.CurrentWordIndex, elapsedMs, totalChars });

            console.log("test finished = " + engine.state.TestFinished)
        }


    }, [engine.state.CurrentWordIndex])


    useEffect(() => {

        if (engine.state.TestFinished === true) {

            socketRef.current?.emit("accuracy", { accuracy: engine.state.Accuracy });

        }

    }, [engine.state.TestFinished])


    useEffect(() => {


    }, [players])



    return (

        <>

            {
                ShowSetupScreen ?

                    <div className=' '>
                        <Multiplayer_User_Setup disableSetupScreen={DisableShowSetupScreen}></Multiplayer_User_Setup>



                    </div>

                    :



                    <div>
                        <div>Last Key pressed {engine.state.lastkeyPressed}</div>
                        {engine.state.CurrentWordIndex}

                        <Button onClick={EnableShowSetupScreen}>Change Name/Avatar</Button>


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



                            <div className='mb-10'>

                                {status === "countdown" && countdown !== null && <h1 className='infotext text-2xl'>Game starts in {countdown}</h1>}
                                {status === "waiting" ? <h1 className='infotext text-2xl'>Waiting For more Players</h1> : ""}
                                {<h1 className='infotext'>Players in Server: {PlayersInServer}</h1>}


                                <Application height={(0)} resolution={2} className='max-w-[1000px] w-full m-auto'>
                                    <MultiplayerRaceTrack Players={players} wordsLength={words.length} />
                                </Application>


                                {/* Race Track */}
                                {/* <div className=" bg-[#376783] m-auto h-[350px] w-[1000px] relative"> */}

                                {/* Player Section */}
                                {/* <div className={`h-[70px] border border-solid rounded-[10px] flex items-end justify-center relative ${players.find((player) => player.id === socketRef.current?.id)?.finished ? "bg-green-400" : "bg-[#0E3044]"}`}> */}

                                {/* {players.find((player) => player.id === socketRef.current?.id)?.finished ? <div className='absoulte flex text-[#b5c4c5] text-[25px] self-center font-[Trebuchet_MS,_Lucida_Sans_Unicode,_Lucida_Grande,_Lucida_Sans,_Arial,_sans-serif] '>Finished</div> : ""} */}


                                {/* Player Avatar */}
                                {/* <div ref={parentRef} className='flex bg-amber-200 w-20 h-full ml-2 transition-[left] duration-150 ease-linear' style={{ position: "absolute", left: `${progressPercent}%` }}> */}

                                {/* <img src="https://static.vecteezy.com/system/resources/previews/050/832/637/non_2x/a-3d-cartoon-athlete-running-png.png" alt="" /> */}
                                {/* 
                                          

                                            {/* <img className='h-20 w-40' src="https://i.pinimg.com/originals/d5/96/3c/d5963c6f0bc206e3723f796e3b54fd6b.gif" alt="" /> */}

                                {/* <div className='w-full h-full bg-purple-400'>

                                                <Application backgroundAlpha={0} resizeTo={parentRef} autoStart sharedTicker>

                                                    <AnimatedSpriteAvatar />
                                                </Application>
                                            </div> */}
                                {/* <h1 className='DisplayName'>{players.find((player) => player.id === socketRef.current?.id)?.DisplayName ?? ""}</h1>

                                            {status != "waiting" && status != "countdown" ? <div className='wpm'>{players.find((player) => player.id === socketRef.current?.id)?.wpm ?? 0} wpm</div> : ""}
                                            <div className='wpm'>{players.find((player) => player.id === socketRef.current?.id)?.finishtime ?? ""}</div> */}

                                {/* </div> */}

                                {/* </div> */}



                                {/* {players.filter((player) => player.id !== socketRef.current?.id)
                                            .map((player) => {
                                                const percent = words.length ? (player.progressIndex / words.length) * 100 : 0;
                                                const finished = player.finished;
                                                const DisplayName = player.DisplayName;



                                                return (
                                                    <div className={`h-[70px] border border-solid rounded-[10px] flex items-end justify-center relative ${finished ? "bg-green-400" : "bg-[#0E3044]"}`}>

                                                        <div className='flex bg-amber-200 w-20 h-full ml-2 transition-[left] duration-150 ease-linear' style={{ position: "absolute", left: `${percent}%` }}>
                                                            <img className='image'key={player.id}  src="https://static.vecteezy.com/system/resources/previews/050/832/637/non_2x/a-3d-cartoon-athlete-running-png.png"/>

                                                            <div className='w-full h-full bg-purple-400'>

                                                                <Application backgroundAlpha={0} resizeTo={parentRef} autoStart sharedTicker>

                                                                    <AnimatedSpriteAvatar />
                                                                </Application>
                                                            </div>

                                                            <h1>{DisplayName}</h1>
                                                            {status != "waiting" && status != "countdown" ? <div className='wpm'>{player.wpm} wpm</div> : ""}
                                                            <div className='wpm'>{player.finishtime}</div>

                                                        </div>
                                                    </div>

                                                );
                                            })} */}


                                {/* </div> */}
                            </div>




                            <SP_TypingTest engine={engine} HighlightIncorrectCurrentWord={true} ></SP_TypingTest>


                        </div>



                    </div>

            }



        </>


    )
}
export default Multiplayer