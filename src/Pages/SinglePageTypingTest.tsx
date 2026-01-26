import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/Components/ui/card'
import SP_TypingTest from '@/Components/SP_TypingTest'
import { useTypingEnigne, type TypingModeConfig } from '@/Hooks/useTypingEngine'

import { type modeID, Modes, type configID } from '@/utils/Typingmode'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import TestResults from '@/Components/TestResults'



const SinglePageTypingTest = () => {
    //store the mode itself instead of the modeid

    const [modeID, SetMode] = useState<modeID>("word")
    const [configs, SetConfig] = useState<configID[]>([])
    const [LengthDurationSetting, SetLengthDurationSetting] = useState<string>(Modes[modeID].LengthDurationSetting.defaultValue)

    const [ShowResults, SetShowResults] = useState(false)


    function selectMode(id: modeID) {

        SetMode(id);
        SetConfig((prev) => {

            //Search through the previous configs. Only return the configs that are present in the new mode

            return prev?.filter(config => Modes[id].allowedConfigs.includes(config))

            //    return prev?.map((previousConfig)=>{

            // Modes[id].allowedConfigs.includes(previousConfig) ? "" : prev.filter(config => Modes[id].allowedConfigs.includes(config))

            // })
        })
        SetLengthDurationSetting(Modes[id].LengthDurationSetting.defaultValue)
    }

    function changeConfig(config: configID) {

        //make sure that the config is inside of the allowed configs for the mode

        if (Modes[modeID].allowedConfigs.includes(config) == false) {
            return;
        }

        // if config is already inside of the config usestate then remove it if not add it

        SetConfig((prev) => {
            return prev?.includes(config) ? prev?.filter(prevconfig => prevconfig !== config) : [...prev, config]
        });
    }

    function ChangeLengthDurationSetting(LengthDurationSetting: string) {

        //make sure that the config is inside of the allowed configs for the mode

        // if (Modes[modeID].allowedConfigs.includes(config) == false) {
        //     return;
        // }

        SetLengthDurationSetting(LengthDurationSetting)

        // if config is already inside of the config usestate then remove it if not add it

        // SetConfig((prev) => {
        //     return prev?.includes(config) ? prev?.filter(prevconfig => prevconfig !== config) : [...prev, config]
        // });
    }

    const engine = useTypingEnigne({
        mode: modeID,
        config: configs,
        LengthDurationSetting: LengthDurationSetting
    })

    useEffect(() => {

        if (engine.state.status === "finished") {
            SetShowResults(true);
        }

        console.log(engine.state.WpmEverySecond);
    }, [engine.state.status])

    return (
        <div className='bg-background'>



               {engine.state.isRedo ? 
            <h1>Redo=true</h1>
            :
            <h1>Redo=false</h1>

               
            }

            <Card>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non volutpat quam. Nullam vitae eleifend dui, sed dictum neque. Duis posuere arcu sapien, ut efficitur elit tempus eget. Sed sed dolor in enim bibendum rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce condimentum metus lorem, in fringilla urna vulputate in. Fusce ac nibh a urna tempor ullamcorper. Vivamus posuere hendrerit urna, eu aliquet ipsum elementum ac</div>
                <Button onClick={engine.Reset} className='bg-primary w-25 m-auto'>Reset</Button>
                <Button onClick={engine.Redo} className='bg-primary w-25 m-auto'>Redo</Button>

                

            </Card>

            <div>
                <h1>CurrentWordIndex =   {engine.state.CurrentWordIndex}</h1>

                <h1>WordsTyped =   {engine.state.wordsTyped}</h1>


                
               
                
                </div>

            <div className='flex justify-center'>


                <div className='flex justify-center gap-5 m-10'>

                    {
                        Object.values(Modes).map((mode) => (
                            <Button key={mode.id} onClick={() => selectMode(mode.id)} className='bg-primary w-25' variant={mode.id === modeID ? "default" : "outline"}>{mode.id}</Button>
                        ))
                    }

                </div>

                <div className='flex r gap-5 m-10'>

                    {
                        Object.values(Modes[modeID].LengthDurationSetting.options).map((_LengthDurationSetting) => (

                            <Button key={_LengthDurationSetting} onClick={() => ChangeLengthDurationSetting(_LengthDurationSetting)} className='bg-primary w-25' variant={_LengthDurationSetting === LengthDurationSetting ? "default" : "outline"}>{_LengthDurationSetting}</Button>

                        ))
                    }
                </div>


            </div>




            {/* <div className='flex justify-center gap-5 m-10'>
                <Button onClick={} className='bg-primary w-25'>Word</Button>
                <Button onClick={} className='bg-primary w-25'>Time</Button>
                <Button onClick={} className='bg-primary w-25'>Quote</Button>
            </div> */}

            <div className='flex r gap-5 m-10'>

                {
                    Object.values(Modes[modeID].allowedConfigs).map((config) => (

                        <Button key={config} onClick={() => changeConfig(config)} className='bg-primary w-25' variant={configs.includes(config) ? "default" : "outline"}>{config}</Button>

                    ))
                }
            </div>

            <div>
                {
                    engine.state.status != "notstarted" ?
                        <h1 className='text-2xl font-bold mt-5 text-primary flex justify-center'>{engine.state.displayText}</h1>

                        : ""
                }
            </div>


            <SP_TypingTest engine={engine} ></SP_TypingTest>


            <Dialog open={ShowResults} onOpenChange={SetShowResults}>

                {/* <DialogContent className='w-full max-w-sm sm:max-w-full  bg-orange-300 '> */}
                <DialogContent className='w-full  sm:max-w-full  '>
                    {/* 
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>


                        <div className='h-10 w-150 bg-red-200'></div>
                        <img src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg" alt="" />
                    </DialogHeader> */}

                    <TestResults modeConfig={{mode:modeID,configs,LengthDurationSetting}} state={engine.state} />

                </DialogContent>
            </Dialog>

        </div>
    )
}

export default SinglePageTypingTest