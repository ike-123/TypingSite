import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from '@/Components/ui/input'
import { useTypingEnigne } from '../Hooks/useTypingEngine'



const SP_TypingTest = () => {

const engine =  useTypingEnigne()

    return (
        <>
        
            <div className='main'>

                {/* <div className='Multiplayer'>

                    {countdown !== null && <h1 className='infotext'>Game starts in {countdown}</h1>}
                    {status === "waiting" ? <h1 className='infotext'>Waiting For more Players</h1> : ""}
                    {<h1 className='infotext'>Players in Server: {PlayersInServer}</h1>}

                </div> */}

                <div className="TypeTestContainer">

                    <div className='TextContainer'>
                        <div className="QuoteText">

                            <div ref={engine.caretRef} className="caret" />

                            {/* loop through all the words in the words array */}
                            {engine.words.map((word, wordIndex) => (

                                //If CurrentWord is greater than WordIndex then user has alreadly typed the word and class will be "correct"

                                <span className={wordIndex < engine.CurrentWord ? (`${engine.AllWordMap2.get(wordIndex)?.isCorrect ? "correct" : "incorrectword"}`) : ""} key={wordIndex}>

                                    <span>
                                        {/* split the word array to retrieve each letter and put in in a span */}

                                        {word.split("").map((character, letterindex) => {

                                            const StoredWord = engine.AllWordMap2.get(wordIndex);
                                            engine.lettersforOverTypedSection = [];
                                            const isCurrent = wordIndex === engine.CurrentWord
                                            engine.CurrentWordsSpansRef.current = [];


                                            //we check to see if this is the last letter in the word as we want to check if the user has typed any other letters
                                            //  after which we will append after the word and highlight in red
                                            if (letterindex + 1 === word.length) {

                                                if (StoredWord != undefined && StoredWord != null) {

                                                    if (StoredWord.text.length > word.length) {
                                                        //get the letters that have been overtyped
                                                        console.log(StoredWord.text.length);
                                                        const Overtypedsection = StoredWord.text.slice(word.length, StoredWord.text.length);

                                                        engine.lettersforOverTypedSection = Overtypedsection.split("");
                                                        console.log(engine.lettersforOverTypedSection);

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
                                                typedchar = engine.TypedWord[letterindex] ?? ""
                                            }
                                            else {

                                                //the value the user has typed at the specific letter index
                                                typedchar = StoredWord?.text[letterindex] ?? ""
                                            }


                                            const charClass = (typedchar === "" ? "" : (typedchar === character ? "correct" : "incorrect"))


                                            //put each letter into a span and inside of the ref attribute add the current span into the currentwordsspanref array
                                            return (
                                                <span ref={wordIndex === engine.CurrentWord ? (element) => { if (element) engine.CurrentWordsSpansRef.current.push(element) } : null} className={charClass} key={letterindex}>{character}</span>
                                            )

                                        })}

                                        {/* if lettersforOverTypedSection exists then we have overtyped and we can append the extra values after the word */}
                                        {engine.lettersforOverTypedSection && engine.lettersforOverTypedSection.map((character, index) => (
                                            <span ref={wordIndex === engine.CurrentWord ? (element) => { if (element) engine.CurrentWordsSpansRef.current.push(element) } : null} className="incorrectOverType" key={index}>{character}</span>
                                        ))}


                                    </span>

                                    <span> </span>

                                </span>

                            ))}

                        </div>

                    </div>


                    <div className='TextInput'>

                        <input ref={engine.inputref} id="input" type="text" autoComplete='off' autoFocus value={engine.TypedWord} onKeyDown={engine.HandleKeyDown} onChange={engine.ChangeInput} />

                    </div>

                    <div>
                        <h1 className='wordsPerMinute'> {engine.TestFinished ? (engine.WPM) + " WPM" : ""} </h1>

                        <h1 className='wordsPerMinute'> {"Accuracy: " + (engine.Accuracy) + "%"} </h1>

                        <h1 className='wordsPerMinute'> {(engine.correctCount) + " Correct"} </h1>

                        <h1 className='wordsPerMinute'> {(engine.incorrectCount) + " Incorrect"} </h1>



                    </div>


                </div>

            </div>

        </>
    )
}

export default SP_TypingTest