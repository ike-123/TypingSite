import React, { useEffect, useState, useRef } from 'react'
import './Style.scss'
import words from '../words.json'
import {io,Socket} from 'socket.io-client'

type PlayerState = { id: string; progressIndex: number; wpm: number; finished: boolean; finishtime: String };


function getRandomWords(amount: number){
    const randomArray = [...words].sort(() => 0.5-Math.random());
    return randomArray.slice(0,amount)
}

function connectSocket(){

    const socket = io("http://localhost:3001")
    socket.on('connect',()=>{
        console.log("you connected with ", socket.id)
    })
}
const Multiplayer = () => {

    //const [words] = useState(()=> getRandomWords(30));
    const [TypedWord,setTypedWord] = useState<string>("")
    const [CurrentWord,SetNewCurrenetWord] = useState(0)
    const [startTime,SetStartTime] = useState(0);
    const [finishTime,SetFinishtTime] = useState(0);
    const [WPM, setWPM] = useState(0)
    const [TestFinished, setTestFinished] = useState(false);
    const [amountofWordsTyped,SetAmountOfWordsTyped] = useState(0);
    const [progressPercent,setprogressPercent] = useState(0);


    const socketRef = useRef<Socket | null>(null);

    const [countdown, setCountdown] = useState<number | null>(null);

    const [words, setWords] = useState<string[]>([]);

    const [startAt, setStartAt] = useState<number | null>(null);

    const [players, setPlayers] = useState<PlayerState[]>([]);

    const [status,setStatus] = useState("waiting")



    useEffect(()=>{

        const socket = io("http://localhost:3001")

        socketRef.current= socket;
        
        socket.on("countdown",(n)=>{
            setCountdown(n);
        })
         socket.on("start",({words,startAt})=>{
            
            setWords(words)
            setStartAt(startAt)
            SetNewCurrenetWord(0);
            setTypedWord("");
            setCountdown(null);
        })

        socket.on("status",(status)=>{
            setStatus(status)
        })

        socket.on("state", (ps: PlayerState[]) => {
            setPlayers(ps); 
            console.log(ps);
        });

        return () => { socket.disconnect(); };
        

    },[])
    
  
    

    function ChangeInput(event:any){

        const value = event.target.value
        setTypedWord(value)

        if(event.target.value == words[CurrentWord]){
            // SetNewCurrenetWord((previous)=> previous + 1)
            // //event.target.value = ""
            // setTypedWord("");
            // console.log(CurrentWord + 1);
        }

        //console.log(CurrentWord)


       
    }

    function HandleKeyDown(event:React.KeyboardEvent<HTMLInputElement>){

        if(event.code === "Space"){
    
            event.preventDefault();
            const candidate = TypedWord.trim()
            
            if(candidate === words[CurrentWord]){
                const nextIndex = CurrentWord + 1;
                SetNewCurrenetWord((previous)=> previous + 1)
                setprogressPercent(nextIndex/words.length * 100)

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


            <div className="RaceTrack">
        

                <div className={`PlayerSection ${players.find((player)=> player.id === socketRef.current?.id)?.finished ? "finished" : "notfinished"}`}>

                   {players.find((player)=> player.id === socketRef.current?.id)?.finished ? <div className='FinshedText'>Finished</div>:""}


                    <div className='playerAvatar' style={{ position: "absolute", left: `${progressPercent}%`}}>

                        <img src="https://static.vecteezy.com/system/resources/previews/050/832/637/non_2x/a-3d-cartoon-athlete-running-png.png" alt="" />

                        {status != "waiting" && status != "countdown" ? <div className='wpm'>{players.find((player)=> player.id === socketRef.current?.id)?.wpm ?? 0} wpm</div>:"" }
                        <div className='wpm'>{players.find((player)=> player.id === socketRef.current?.id)?.finishtime ?? ""}</div>
                      
                    </div>
                    
                </div>
                    
                
                
                    {players.filter((player) => player.id !== socketRef.current?.id)
                        .map((player) => {
                            const percent = words.length ? (player.progressIndex / words.length) * 100 : 0;
                            const finished = player.finished;

                            
                            
                            return (
                            <div className={`PlayerSection ${finished?"finished":"notfinished"}`}>

                                <div className='playerAvatar' style={{ position: "absolute", left: `${percent}%`}}>
                                    <img className='image'
                                        
                                        key={player.id}
                                        src="https://static.vecteezy.com/system/resources/previews/050/832/637/non_2x/a-3d-cartoon-athlete-running-png.png"
                                        
                                    />

                                {status != "waiting" && status != "countdown" ? <div className='wpm'>{player.wpm} wpm</div>: "" }
                                <div className='wpm'>{player.finishtime}</div>

                                </div>
                            </div>

                            );
                        })}

               
            </div>
        </div>
    
        <div className="wordsPerMinute">
            {TestFinished?(WPM) + " WPM" :""} 
        </div>

        <div className="TypeTestContainer">

            <div className='TextContainer'>
                <div className="QuoteText">
                    {words.map((word,index)=>(
                        
                        
                            <span className={`${CurrentWord > index ? "correct" : ""}${CurrentWord == index ? " Highlighted" : ""}`} key={index}>
                                
                                

                                <span>
                                    {word.split("").map((character,letterindex)=>{

                                        const isCurrent = CurrentWord === index
                                        const typedchar = TypedWord[letterindex] ?? ""

                                        const charClass = isCurrent? (typedchar === "" ? "" : (typedchar === character? "correct":"incorrect")):""  
                                        
                                    
                                        return(
                                            <span className={charClass} key={letterindex}>{character}</span>
                                        )
                                    
                                    })}
                                </span>

                                    <span> </span>
                            </span>

                            
                        
                    
                    ))}
                </div>

            </div>


            <div className='TextInput'>

                
                <input type="text" value={TypedWord} onKeyDown={HandleKeyDown} onChange={ChangeInput} />
                
            </div>



        </div>

  
    </div>

    </>
    
  )
}
export default Multiplayer