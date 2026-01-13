import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/Components/ui/card'
import SP_TypingTest from '@/Components/SP_TypingTest'
import { useTypingEnigne, type TypingModeConfig } from '@/Hooks/useTypingEngine'

import { type modeID, Modes, type configID } from '@/utils/Typingmode'



const SinglePageTypingTest = () => {
    //store the mode itself instead of the modeid

    const [modeID, SetMode] = useState<modeID>("word")
    const [configs, SetConfig] = useState<configID[]>([])



    function selectMode(id: modeID) {

        SetMode(id);
        SetConfig((prev) => {

            //Search through the previous configs. Only return the configs that are present in the new mode

            return prev?.filter(config => Modes[id].allowedConfigs.includes(config))

            //    return prev?.map((previousConfig)=>{

            // Modes[id].allowedConfigs.includes(previousConfig) ? "" : prev.filter(config => Modes[id].allowedConfigs.includes(config))

            // })
        })
    }

    function changeConfig(config: configID) {

        //make sure that the config is inside of the allowed configs for the mode

        if(Modes[modeID].allowedConfigs.includes(config) == false){
            return;
        }

        // if config is already inside of the config usestate then remove it if not add it

        SetConfig((prev) => {
            return prev?.includes(config) ? prev?.filter(prevconfig => prevconfig !== config) : [...prev, config]
        });
    }

    const engine = useTypingEnigne({
        mode: modeID,
        config: configs
    })

    return (
        <div className='bg-background'>

            {/* <Card>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non volutpat quam. Nullam vitae eleifend dui, sed dictum neque. Duis posuere arcu sapien, ut efficitur elit tempus eget. Sed sed dolor in enim bibendum rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce condimentum metus lorem, in fringilla urna vulputate in. Fusce ac nibh a urna tempor ullamcorper. Vivamus posuere hendrerit urna, eu aliquet ipsum elementum ac</div>
                <Button onClick={engine.Reset} className='bg-primary w-25 m-auto'>Reset</Button>

            </Card> */}


           

            <div className='flex justify-center gap-5 m-10'>

                {
                    Object.values(Modes).map((mode) => (
                        <Button key={mode.id} onClick={() => selectMode(mode.id)} className='bg-primary w-25' variant={mode.id === modeID ? "default" : "outline"}>{mode.id}</Button>
                    ))
                }

            </div>


            {/* <div className='flex justify-center gap-5 m-10'>
                <Button onClick={} className='bg-primary w-25'>Word</Button>
                <Button onClick={} className='bg-primary w-25'>Time</Button>
                <Button onClick={} className='bg-primary w-25'>Quote</Button>
            </div> */}

            <div className='flex r gap-5 m-10'>

                {
                    Object.values(Modes[modeID].allowedConfigs).map((config) => (

                        <Button key={config} onClick={() => changeConfig(config)} className='bg-primary w-25' variant={configs.includes(config)? "default" : "outline"}>{config}</Button>

                    ))
                }
            </div>

             <div>
                {
                    engine.state.status != "notstarted" ? 
                <h1 className='text-2xl font-bold mt-5 text-primary flex justify-center'>{engine.state.displayText}</h1>

                    :""
                }
            </div>


            <SP_TypingTest engine={engine} ></SP_TypingTest>

        </div>
    )
}

export default SinglePageTypingTest