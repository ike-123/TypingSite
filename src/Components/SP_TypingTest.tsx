import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from '@/Components/ui/input'
import { useTypingEnigne } from '../Hooks/useTypingEngine'



type SP_TypingTestProps = {
    engine: ReturnType<typeof useTypingEnigne>;
    HighlightIncorrectCurrentWord: boolean;
};


const SP_TypingTest = ({engine,HighlightIncorrectCurrentWord}:SP_TypingTestProps) => {

    return (


        <div className='w-full'>

            {/* <div className='Multiplayer'>

                    {countdown !== null && <h1 className='infotext'>Game starts in {countdown}</h1>}
                    {status === "waiting" ? <h1 className='infotext'>Waiting For more Players</h1> : ""}
                    {<h1 className='infotext'>Players in Server: {PlayersInServer}</h1>}

                </div> */}

            {/* <h1 className='text-2xl font-bold mt-6 text-primary flex justify-center'>{engine.state.displayText}</h1> */}

            <div className="TypeTestContainer">

                <div ref={engine.TextContainerref} className='flex px-[3px] h-[115px] bg-[#1e293b] overflow-hidden relative'>


                    {/* <div id='wordcontainer' className={`relative text-3xl text-[#8a8c8f]`} style={{ marginTop: engine.margin > 0 ? -(engine.margin * 39) : 0, }}> */}
                    {/* <div ref={engine.WordContainerRef}  id='wordcontainer' className={`relative text-3xl text-[#8a8c8f]`} style={{ transform: `translateY(-${engine.lineoffset * engine.LINE_HEIGHT}px)` }}> */}
                    <div ref={engine.WordContainerRef} id='wordcontainer' className={`relative text-3xl text-[#8a8c8f] my-1 `} onClick={engine.MoveCaretToEnd} >


                        <div ref={engine.caretRef} id='Textcontainer' className="absolute w-[2px] h-[33px] bg-white transition-all duration-100" />

                        {/* loop through all the words in the words array */}
                        {engine.state.words.slice(engine.state.IndexToStartFrom).map((word, wordIndex) => (

                            //If CurrentWord is greater than WordIndex then user has alreadly typed the word and class will be "correct"

                            <span data-word-index={engine.state.IndexToStartFrom + wordIndex} className={`word ${(engine.state.IndexToStartFrom + wordIndex) < engine.state.CurrentWordIndex ? (`${engine.state.AllWordMap.get(engine.state.IndexToStartFrom + wordIndex)?.isCorrect ? "correct" : "incorrectword"}`) : ""}`} key={engine.state.IndexToStartFrom + wordIndex}>

                                <span className={`word ${ (HighlightIncorrectCurrentWord && (engine.state.IndexToStartFrom + wordIndex) === (engine.state.CurrentWordIndex) && !engine.state.AllWordMap.get(engine.state.IndexToStartFrom + wordIndex)?.isCorrect && engine.state.TypedWord.length > 0)? " border-3 border-red-400 border-dashed rounded-xs" : "" } ${(engine.state.IndexToStartFrom + wordIndex) < engine.state.CurrentWordIndex ? (`${engine.state.AllWordMap.get(engine.state.IndexToStartFrom + wordIndex)?.isCorrect ? "correct" : "incorrectword"}`) : ""}`}>
                                    {/* split the word array to retrieve each letter and put it in a span */}

                                    {word.split("").map((character, letterindex) => {

                                        // console.log("Character ", character)

                                        const StoredWord = engine.state.AllWordMap.get(engine.state.IndexToStartFrom + wordIndex);
                                        engine.lettersforOverTypedSection = [];
                                        const isCurrent = engine.state.IndexToStartFrom + wordIndex === engine.state.CurrentWordIndex
                                        engine.CurrentWordsSpansRef.current = [];


                                        //we check to see if this is the last letter in the word as we want to check if the user has typed any other letters
                                        //  after which we will append after the word and highlight in red
                                        if (letterindex + 1 === word.length) {

                                            if (StoredWord != undefined && StoredWord != null) {

                                                if (StoredWord.text.length > word.length) {
                                                    //get the letters that have been overtyped
                                                    // console.log(StoredWord.text.length);
                                                    const Overtypedsection = StoredWord.text.slice(word.length, StoredWord.text.length);

                                                    engine.lettersforOverTypedSection = Overtypedsection.split("");
                                                    // console.log(engine.lettersforOverTypedSection);

                                                }
                                                // console.log(true);
                                            }
                                            else {
                                                // console.log(false);
                                            }
                                        }


                                        var typedchar;

                                        if (isCurrent) {
                                            //the value the user has typed at the specific letter index
                                            typedchar = engine.state.TypedWord[letterindex] ?? ""
                                        }
                                        else {

                                            //the value the user has typed at the specific letter index
                                            typedchar = StoredWord?.text[letterindex] ?? ""
                                        }


                                        const charClass = (typedchar === "" ? "" : (typedchar === character ? "correct" : "incorrect"))


                                        //put each letter into a span and inside of the ref attribute add the current span into the currentwordsspanref array
                                        return (
                                            <span ref={engine.state.IndexToStartFrom + wordIndex === engine.state.CurrentWordIndex ? (element) => { if (element) engine.CurrentWordsSpansRef.current.push(element) } : null} className={charClass} key={letterindex}>{character}</span>
                                        )

                                    })}

                                    {/* if lettersforOverTypedSection exists then we have overtyped and we can append the extra values after the word */}
                                    {engine.lettersforOverTypedSection && engine.lettersforOverTypedSection.map((character, index) => (
                                        <span ref={engine.state.IndexToStartFrom + wordIndex === engine.state.CurrentWordIndex ? (element) => { if (element) engine.CurrentWordsSpansRef.current.push(element) } : null} className="incorrectOverType" key={index}>{character}</span>
                                    ))}


                                </span>

                                <span> </span>

                            </span>

                        ))}

                    </div>


                    {/* <div className=''> */}

                    <input className={`w-full h-[115px] m-auto absolute outline-none bg-red-200 pointer-events-none ${engine.focus? "opacity-0" : "opacity-50"} `} ref={engine.inputref} id="input" type="text" autoComplete='off' spellCheck="false" autoCapitalize='false' autoCorrect='false' autoFocus value={engine.state.TypedWord} onFocus={() => { engine.SetFocus(true) }} onBlur={()=>{engine.SetFocus(false)}}  onKeyDown={engine.HandleKeyDown} onChange={engine.ChangeInput} onClick={engine.MoveCaretToEnd} />

                    {/* </div> */}

                </div>






                {/* <div>
                        <h1 className='wordsPerMinute'> {engine.state.TestFinished ? (engine.state.WPM) + " WPM" : ""} </h1>

                        <h1 className='wordsPerMinute'> {"Accuracy: " + (engine.state.Accuracy) + "%"} </h1>

                        <h1 className='wordsPerMinute'> {(engine.state.correctCount) + " Correct"} </h1>

                        <h1 className='wordsPerMinute'> {(engine.state.incorrectCount) + " Incorrect"} </h1>

                    </div> */}


            </div>

        </div>


    )
}

export default SP_TypingTest