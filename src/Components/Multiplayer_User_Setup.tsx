import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from './ui/button';


type SetupProps = {
    disableSetupScreen:()=>void;
}

const Multiplayer_User_Setup = (props:SetupProps) => {

    const [displayName, SetDisplayName] = useState("");

    useEffect(()=>{

        const storedDisplayName = localStorage.getItem("MultiplayerMode_Displayname");

        if(storedDisplayName){
            
            SetDisplayName(storedDisplayName);
        }

    },[])

    function OnInputchange(event: React.ChangeEvent<HTMLInputElement>) {

        SetDisplayName(event.target.value)
    }

    function FindGameButton(event: React.MouseEvent<HTMLButtonElement>) {

        event.preventDefault()

        console.log(displayName);

        if (!displayName) {
            //also enforce minimum and maximum characters
            console.log("Display name must be set to a value")
            return;
        }

        localStorage.setItem("MultiplayerMode_Displayname", displayName)
        props.disableSetupScreen();
    }

    return (
        <div className='max-w-7xl m-auto flex flex-col items-center gap-15 '>

            <div className='flex gap-8 items-center'>


                <div className='flex flex-col'>
                    <label htmlFor="Displayname">Display Name</label>
                    <Input name='Displayname' className='w-60' onChange={OnInputchange} value={displayName} />

                </div>


                <div className='w-50 h-50 bg-purple-500'>

                </div>


            </div>
            <Button onClick={FindGameButton}>Find Game</Button>
        </div>


    )
}

export default Multiplayer_User_Setup