import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from './ui/button';

const Multiplayer_User_Setup = () => {

    const [displayName, SetDisplayName] = useState("");


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
    }

    return (
        <div>
            <Input onChange={OnInputchange} value={displayName} />
            <Button onClick={FindGameButton}>Find Game</Button>
        </div>


    )
}

export default Multiplayer_User_Setup