import React, { useEffect, useRef, useState } from 'react'
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
    DialogPortal
} from "@/components/ui/dialog"
import TestResults from '@/Components/TestResults'
import { DialogOverlay } from '@radix-ui/react-dialog'



interface SoloTestConfigs {

    ModeID: modeID,
    SelectedConfigs: configID[],
    LengthDurationSetting: {
        word: string | null,
        time: string | null,
        quote: string | null
    }
}

const SinglePageTypingTest = () => {
    //store the mode itself instead of the modeid

    const [modeID, SetMode] = useState<modeID>(() => {

        const item = localStorage.getItem("SoloTestConfigs");

        // console.log("yes mode id = ", JSON.parse(item!).ModeID )
        return item ? JSON.parse(item).ModeID : "word"

    })

    // const SelectedConfigs = useRef<configID[]>([]);
    const [Selectedconfigs, SetConfig] = useState<configID[]>(() => {

        const item = localStorage.getItem("SoloTestConfigs");

        return item ? JSON.parse(item).SelectedConfigs : []

    })


    const [Allowedconfigs, SetAllowedConfigs] = useState<configID[]>([])



    //This is the original value
    const [LengthDurationSetting, SetLengthDurationSetting] = useState<string>(() => {

        const item = localStorage.getItem("SoloTestConfigs");

        // console.log("modeid " , JSON.parse(item!).LengthDurationSetting[modeID]);

        return item ? JSON.parse(item).LengthDurationSetting[modeID] : Modes[modeID].LengthDurationSetting.defaultValue

    }
    )

    const [ShowResults, SetShowResults] = useState(false)


    function selectMode(id: modeID) {

        SetMode(id);




        // SetConfig((prev) => {

        //     //Search through the previous configs. Only return the configs that are present in the new mode

        //     return prev?.filter(config => Modes[id].allowedConfigs.includes(config))

        // })


        // SetAllowedConfigs(() => {
        //     return SelectedConfigs.current?.filter(config => Modes[id].allowedConfigs.includes(config))
        // });

        SetLengthDurationSetting(Modes[id].LengthDurationSetting.defaultValue)

        const stored = localStorage.getItem("SoloTestConfigs")
        const UserConfig: SoloTestConfigs = stored ? JSON.parse(stored) : null

        if(UserConfig){

            console.log("id ", id);

            //const news = UserConfig.LengthDurationSetting[Modes[modeID].id]
            console.log("exists, ", UserConfig.LengthDurationSetting[Modes[id].id]! )
            
            SetLengthDurationSetting(UserConfig.LengthDurationSetting[Modes[id].id]!)

        }

        // Settings.LengthDurationSetting[Modes[modeID].id] = LengthDurationSetting;
    }

    function changeConfig(config: configID) {

        //make sure that the config is inside of the allowed configs for the mode

        if (Modes[modeID].allowedConfigs.includes(config) == false) {
            return;
        }

        // if config is already inside of the config usestate then remove it if not add it

        // SetConfig((prev) => {
        //     return prev?.includes(config) ? prev?.filter(prevconfig => prevconfig !== config) : [...prev, config]
        // });

        //    SetUsableConfigs((prev) => {
        //     return configs?.includes(config) ? prev?.filter(prevconfig => prevconfig !== config) : [...prev, config]
        // });



        // Add the config into the selected config array

        // SelectedConfigs.current = SelectedConfigs.current.includes(config) ? SelectedConfigs.current?.filter(prevconfig => prevconfig !== config) : [...SelectedConfigs.current, config]


        SetConfig((prev) => {
            return prev?.includes(config) ? prev?.filter(prevconfig => prevconfig !== config) : [...prev, config]
        });


        // Call SetAllowedConfigs and check to see if each config inside selectedconfigs is allowed for this specific mode

        // SetAllowedConfigs(() => {
        //     return SelectedConfigs.current?.filter(config => Modes[modeID].allowedConfigs.includes(config))
        // });


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
        config: Allowedconfigs,
        LengthDurationSetting: LengthDurationSetting
    })


    useEffect(() => {

        // Call SetAllowedConfigs and check to see if each config inside selectedconfigs is allowed for this specific mode

        SetAllowedConfigs(() => {
            return Selectedconfigs.filter(config => Modes[modeID].allowedConfigs.includes(config))
        });

        const stored = localStorage.getItem("SoloTestConfigs")
        const UserConfig: SoloTestConfigs = stored ? JSON.parse(stored) : null
        console.log(UserConfig)
        // console.log("Heyeeeee");

        if (UserConfig) {

            console.log("yes")

            // const LengthDurationSettingWord = 

            //This code needs to change depneding on whether we are a changing the config list or the modeid

            const word_LengthDurationSetting = UserConfig.LengthDurationSetting.word
            const time_LengthDurationSetting = UserConfig.LengthDurationSetting.time
            const quote_LengthDurationSetting = UserConfig.LengthDurationSetting.quote

            console.log(time_LengthDurationSetting);

            const Settings: SoloTestConfigs = {
                ModeID: modeID,
                SelectedConfigs: Selectedconfigs,
                LengthDurationSetting: {
                    word: word_LengthDurationSetting,
                    time: time_LengthDurationSetting,
                    quote: quote_LengthDurationSetting
                }
            }

            //If there is solotestconfig inside of localstorage
            console.log("LDS = ", LengthDurationSetting)

            // I think this only makes sense to do in when changing the lengthdurationsetting 
            //When we change the mode this breaks and sets
            Settings.LengthDurationSetting[Modes[modeID].id] = LengthDurationSetting;

            localStorage.setItem("SoloTestConfigs", JSON.stringify(Settings))


        }
        else {

            console.log("none")
            //this is if there is no solotestconfig inside of localstorage 
            const Settings: SoloTestConfigs = {
                ModeID: modeID,
                SelectedConfigs: Selectedconfigs,
                LengthDurationSetting: {
                    word: Modes["word"].LengthDurationSetting.defaultValue,
                    time: Modes["time"].LengthDurationSetting.defaultValue,
                    quote: Modes["quote"].LengthDurationSetting.defaultValue,
                }
            }

            localStorage.setItem("SoloTestConfigs", JSON.stringify(Settings))

        }

    }, [Selectedconfigs, modeID, LengthDurationSetting])

    useEffect(() => {

        if (engine.state.status === "finished") {
            SetShowResults(true);
        }
        if (engine.state.status === "notstarted") {
            SetShowResults(false)
            // console.log('hey')
            // engine.inputref.current?.focus()
        }

        // console.log(engine.state.WpmEverySecond);
    }, [engine.state.status])

    return (
        <div className='bg-background'>



            {engine.state.isRedo ?
                <h1 className='text-red-400'>Redo=true</h1>
                :
                ""


            }

            {/* <Card>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non volutpat quam. Nullam vitae eleifend dui, sed dictum neque. Duis posuere arcu sapien, ut efficitur elit tempus eget. Sed sed dolor in enim bibendum rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce condimentum metus lorem, in fringilla urna vulputate in. Fusce ac nibh a urna tempor ullamcorper. Vivamus posuere hendrerit urna, eu aliquet ipsum elementum ac</div>
                <Button onClick={engine.Reset} className='bg-primary w-25 m-auto'>Reset</Button>
                <Button onClick={engine.Redo} className='bg-primary w-25 m-auto'>Redo</Button>

                

            </Card> */}

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

                        <Button key={config} onClick={() => changeConfig(config)} className='bg-primary w-25' variant={Allowedconfigs.includes(config) ? "default" : "outline"}>{config}</Button>

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

                <DialogPortal>

                    {/* <DialogOverlay className="fixed inset-0 bg-white/50 p-10" /> */}






                    {/* <DialogContent className='w-full max-w-sm sm:max-w-full  bg-orange-300 '> */}
                    <DialogContent onCloseAutoFocus={(e) => {
                        e.preventDefault() // 🚨 stop Radix from deciding focus
                        engine.inputref.current?.focus()
                    }} className=' max-w-7xl md:w-11/12 lg:w-10/12 xl:w-8/12'>

                        <TestResults modeConfig={{ mode: modeID, configs: Allowedconfigs, LengthDurationSetting }} state={engine.state} NextTestFunction={engine.Reset} RedoTestFunction={engine.Redo} />

                    </DialogContent>



                </DialogPortal>

            </Dialog>



        </div>
    )
}

export default SinglePageTypingTest