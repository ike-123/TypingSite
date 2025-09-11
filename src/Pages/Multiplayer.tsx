import React, { useEffect, useState, useRef } from 'react'
import './Style.scss'
import words from '../words.json'
import {io,Socket} from 'socket.io-client'

type PlayerState = { id: string; progressIndex: number; wpm: number; finished: boolean };


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

        console.log(CurrentWord)


       
    }

    function HandleKeyDown(event:React.KeyboardEvent<HTMLInputElement>){

        if(event.code === "Space"){
            event.preventDefault();
            const candidate = TypedWord.trim()
            if(candidate === words[CurrentWord]){
                const nextIndex = CurrentWord + 1;
                SetNewCurrenetWord((previous)=> previous + 1)
                setprogressPercent(nextIndex/words.length * 100)

                console.log(CurrentWord)
                console.log(words.length)

                setTypedWord("")

                // if( nextIndex > words.length -1 ){

                const elapsedMs = Date.now() - (startAt ?? 0);
                const totalChars = words.slice(0, nextIndex).join(" ").length;
            

                 socketRef.current?.emit("wordDone", { nextIndex, elapsedMs, totalChars });
                 console.log("word done")

            






                //}
            }

            
            
        }
    }   


    
  return (

    <>


    <div className='main'>




        <div className='Multiplayer'>

     {countdown !== null && <h2>Game starts in {countdown}</h2>}

            <div className="RaceTrack">

                {/* <img
                src="https://static.vecteezy.com/system/resources/previews/050/832/637/non_2x/a-3d-cartoon-athlete-running-png.png"
                style={{ position: "absolute", left: `${progressPercent}%`, top: 10, height: 40 }}
                /> */}

                <div className="PlayerSection">
                   
                    
                    <img  className="PlayerAvatar"style={{ position: "absolute", left: `${progressPercent}%`}} src="https://static.vecteezy.com/system/resources/previews/050/832/637/non_2x/a-3d-cartoon-athlete-running-png.png" alt="" />
                </div>
                    
                
                
                    {players.filter((player) => player.id !== socketRef.current?.id)
                        .map((player) => {
                            const percent = words.length ? (player.progressIndex / words.length) * 100 : 0;
                            console.log("logging",percent)
                            
                            return (
                            <div className="PlayerSection">
                                <img
                                    className="PlayerAvatar"
                                    key={player.id}
                                    src="https://static.vecteezy.com/system/resources/previews/050/832/637/non_2x/a-3d-cartoon-athlete-running-png.png"
                                    style={{ position: "absolute", left: `${percent}%` }}
                                />
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